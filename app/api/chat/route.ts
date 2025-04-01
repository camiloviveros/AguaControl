import { NextResponse } from 'next/server';

// Caché renovada con límite automático y tiempo de expiración
let responseCache = new Map();
let lastCacheCleanup = Date.now();

// Función para limpiar la caché
const cleanupCache = () => {
  // Limpiar caché cada 60 minutos o si es demasiado grande
  const now = Date.now();
  if (now - lastCacheCleanup > 60 * 60 * 1000 || responseCache.size > 80) {
    console.log(`Limpiando caché. Tamaño antes: ${responseCache.size}`);
    
    // Si es muy grande, conserva solo las 30 entradas más recientes
    if (responseCache.size > 80) {
      const entries = Array.from(responseCache.entries());
      const recentEntries = entries.slice(-30);
      responseCache.clear();
      for (const [key, value] of recentEntries) {
        responseCache.set(key, value);
      }
    } else {
      responseCache.clear();
    }
    
    lastCacheCleanup = now;
    console.log(`Caché limpiada. Nuevo tamaño: ${responseCache.size}`);
  }
};

export async function POST(request: Request) {
  // Limpiar caché si es necesario
  cleanupCache();
  
  // Para debuggear posibles errores
  let requestBody = null;
  
  try {
    console.log('Inicio de solicitud a la API de chat');
    
    // Verificar si la API key está configurada
    if (!process.env.DEEPSEEK_API_KEY) {
      console.error('Error: La API key de DeepSeek no está configurada');
      return NextResponse.json(
        { error: 'La API key de DeepSeek no está configurada. Contacta al administrador.' },
        { status: 500 }
      );
    }

    // Obtener los datos de la solicitud
    requestBody = await request.json();
    const { message, history } = requestBody;
    
    if (!message) {
      console.error('Error: Mensaje vacío en la solicitud');
      return NextResponse.json(
        { error: 'El mensaje no puede estar vacío.' },
        { status: 400 }
      );
    }
    
    console.log(`Procesando mensaje: "${message.substring(0, 50)}${message.length > 50 ? '...' : ''}"`);
    
    // Crear una clave única para la caché con limitación de longitud
    const cacheKey = message.trim().toLowerCase().substring(0, 100);
    
    try {
      // Verificar si ya tenemos una respuesta en caché
      if (responseCache.has(cacheKey)) {
        console.log('Usando respuesta en caché');
        return NextResponse.json({ 
          message: responseCache.get(cacheKey),
          cached: true 
        });
      }
    } catch (cacheError) {
      console.error('Error al acceder a la caché:', cacheError);
      // Si hay error en la caché, la limpiamos completamente
      responseCache.clear();
      console.log('Caché reiniciada por error');
    }

    // Limitar el historial a los últimos 3 mensajes para mejorar velocidad
    const limitedHistory = history?.slice?.(-3) || [];
    
    // Convertir el historial al formato requerido por DeepSeek
    const formattedMessages = limitedHistory.map((msg: { role: string; content: string }) => ({
      role: msg.role === 'assistant' ? 'assistant' : 'user',
      content: msg.content,
    }));

    // Sistema de mensajes con instrucciones completas pero optimizado
    const systemMessage = {
      role: 'system',
      content: `Eres un asistente especializado en gestión y ahorro de consumo de agua. 
      Tu objetivo es ayudar a los usuarios a reducir su consumo de agua, interpretar sus facturas, 
      proporcionar consejos sobre fugas, tuberías y responder preguntas sobre el uso eficiente del agua.
      
      Límites:
      - Solo responde preguntas relacionadas con el agua, su consumo, ahorro, facturación y temas afines.
      - Si te preguntan sobre otros temas, recuerda amablemente que eres un asistente especializado en agua.
      - NO uses etiquetas HTML en tus respuestas como <br> o <strong>. Usa formato de texto plano.
      - Usa ** para negritas y espacios en blanco para separar párrafos.
      
      IMPORTANTE: Tus respuestas deben ser concisas y directas, no más de 3-4 frases para preguntas simples.
      Usa viñetas con - para listas y destaca con 💧 los consejos más importantes.`
    };

    // Configurar la solicitud a la API de DeepSeek con parámetros optimizados para velocidad
    const deepseekApiEndpoint = 'https://api.deepseek.com/v1/chat/completions';
    
    // Aumentar el timeout para dar más tiempo a la API
    const timeoutMs = process.env.DEEPSEEK_TIMEOUT ? 
      parseInt(process.env.DEEPSEEK_TIMEOUT) : 20000; // Aumentado a 20 segundos
    
    console.log(`Timeout configurado a ${timeoutMs}ms`);
    
    const controller = new AbortController();
    const timeoutId = setTimeout(() => {
      console.log('Timeout alcanzado, abortando solicitud');
      controller.abort();
    }, timeoutMs);
    
    // Preparar el cuerpo de la solicitud
    const requestPayload = {
      model: process.env.DEEPSEEK_MODEL || 'deepseek-chat',
      messages: [
        systemMessage,
        ...formattedMessages,
        { role: 'user', content: message }
      ],
      max_tokens: 300,       // Reducido para respuestas más rápidas
      temperature: 0.7,      // Balanceado entre creatividad y coherencia
      top_p: 0.9,            // Mantiene coherencia
      presence_penalty: 0,   // Eliminado para mayor velocidad
      frequency_penalty: 0   // Eliminado para mayor velocidad
    };
    
    console.log('Enviando solicitud a DeepSeek API');
    
    // Implementar reintentos para mayor robustez
    let response = null;
    let retries = 0;
    const maxRetries = 2;
    
    while (retries <= maxRetries) {
      try {
        response = await fetch(deepseekApiEndpoint, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${process.env.DEEPSEEK_API_KEY}`
          },
          body: JSON.stringify(requestPayload),
          signal: controller.signal
        });
        
        break; // Si la solicitud fue exitosa, salimos del bucle
      } catch (fetchError) {
        retries++;
        if (retries > maxRetries) throw fetchError;
        
        console.log(`Reintento ${retries}/${maxRetries} después de error de fetch`);
        // Esperar brevemente antes de reintentar
        await new Promise(r => setTimeout(r, 500));
      }
    }
    
    // Limpiar el timeout ya que la respuesta fue recibida
    clearTimeout(timeoutId);
    
    if (!response) {
      throw new Error('No se recibió respuesta de la API después de reintentos');
    }

    if (!response.ok) {
      const errorText = await response.text();
      let errorDetail = 'Detalles no disponibles';
      
      try {
        const errorData = JSON.parse(errorText);
        errorDetail = JSON.stringify(errorData);
      } catch (e) {
        errorDetail = errorText.substring(0, 200);
      }
      
      throw new Error(`Error de la API de DeepSeek: ${response.status} - ${errorDetail}`);
    }

    const data = await response.json();
    console.log('Respuesta recibida de DeepSeek API');

    // Obtener la respuesta generada
    let generatedMessage = data.choices?.[0]?.message?.content || 
      'Lo siento, no he podido generar una respuesta. Por favor, intenta de nuevo.';
      
    // Procesar la respuesta para aplicar formato Markdown a texto plano
    generatedMessage = generatedMessage
      .replace(/\*\*(.*?)\*\*/g, '$1')     // Quitar asteriscos de negritas
      .replace(/<br>/g, ' ')               // Reemplazar <br> con espacios
      .replace(/<br><br>/g, ' ')           // Reemplazar <br><br> con espacios
      .replace(/<strong>(.*?)<\/strong>/g, '$1') // Quitar etiquetas strong
      .replace(/<[^>]*>/g, '');            // Limpiar cualquier otra etiqueta HTML

    // Guardar en caché solo si no es un mensaje de error y no es muy largo
    if (!generatedMessage.includes('Lo siento') && generatedMessage.length < 2000) {
      try {
        responseCache.set(cacheKey, generatedMessage);
        console.log(`Respuesta guardada en caché. Tamaño actual: ${responseCache.size}`);
      } catch (cacheError) {
        console.error('Error al guardar en caché:', cacheError);
        // Si hay error al guardar en caché, la limpiamos
        responseCache.clear();
      }
    }

    // Devolver la respuesta
    return NextResponse.json({ message: generatedMessage });
  } catch (error: any) {
    console.error('Error al procesar la solicitud:', {
      message: error?.message,
      stack: error?.stack,
      requestBody: requestBody ? JSON.stringify(requestBody).substring(0, 200) : 'No disponible'
    });
    
    // Respuesta de error con más información pero simple para el usuario
    return NextResponse.json(
      { 
        error: 'Ocurrió un error al procesar tu solicitud. Por favor, intenta de nuevo.',
        detail: process.env.NODE_ENV === 'development' ? error?.message : undefined
      },
      { status: 500 }
    );
  }
}