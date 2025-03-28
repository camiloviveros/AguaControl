import { NextResponse } from 'next/server';

// Caché simple en memoria (en producción considera Redis u otra solución persistente)
let responseCache = new Map();

export async function POST(request: Request) {
  try {
    // Verificar si la API key está configurada
    if (!process.env.DEEPSEEK_API_KEY) {
      return NextResponse.json(
        { error: 'La API key de DeepSeek no está configurada' },
        { status: 500 }
      );
    }

    // Obtener los datos de la solicitud
    const requestData = await request.json();
    const { message, history } = requestData;
    
    // Crear una clave única para la caché basada solo en el mensaje actual
    const cacheKey = message.trim().toLowerCase();
    
    // Verificar si ya tenemos una respuesta en caché
    if (responseCache.has(cacheKey)) {
      console.log('Usando respuesta en caché');
      return NextResponse.json({ 
        message: responseCache.get(cacheKey),
        cached: true 
      });
    }

    // Limitar el historial a los últimos 3 mensajes para mejorar velocidad
    const limitedHistory = history.slice(-3);
    
    // Convertir el historial al formato requerido por DeepSeek
    const formattedMessages = limitedHistory.map((msg: { role: string; content: string }) => ({
      role: msg.role === 'assistant' ? 'assistant' : 'user',
      content: msg.content,
    }));

    // Sistema de mensajes con instrucciones completas pero optimizado
    // Modificado para evitar que el modelo use etiquetas HTML directamente
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
    
    // Usar el timeout desde la variable de entorno o valor predeterminado
    const timeoutMs = process.env.DEEPSEEK_TIMEOUT ? 
      parseInt(process.env.DEEPSEEK_TIMEOUT) : 10000;
    
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), timeoutMs);
    
    const response = await fetch(deepseekApiEndpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${process.env.DEEPSEEK_API_KEY}`
      },
      body: JSON.stringify({
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
      }),
      signal: controller.signal
    });
    
    clearTimeout(timeoutId);

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(`Error de la API de DeepSeek: ${response.status} - ${JSON.stringify(errorData)}`);
    }

    const data = await response.json();

    // Obtener la respuesta generada
    let generatedMessage = data.choices[0]?.message?.content || 
      'Lo siento, no he podido generar una respuesta. Por favor, intenta de nuevo.';
      
    // Procesar la respuesta para aplicar formato Markdown a texto plano
    // Esto corrige el problema de las etiquetas HTML crudas
    generatedMessage = generatedMessage
      .replace(/\*\*(.*?)\*\*/g, '$1')     // Quitar asteriscos de negritas
      .replace(/<br>/g, ' ')               // Reemplazar <br> con espacios
      .replace(/<br><br>/g, ' ')           // Reemplazar <br><br> con espacios
      .replace(/<strong>(.*?)<\/strong>/g, '$1'); // Quitar etiquetas strong
    
    // Limpiar cualquier otra etiqueta HTML que pueda aparecer
    generatedMessage = generatedMessage
      .replace(/<[^>]*>/g, '');

    // Guardar en caché solo si no es un mensaje de error
    if (!generatedMessage.includes('Lo siento')) {
      responseCache.set(cacheKey, generatedMessage);
      
      // Limitar el tamaño de la caché (máximo 100 entradas)
      if (responseCache.size > 100) {
        const oldestKey = responseCache.keys().next().value;
        responseCache.delete(oldestKey);
      }
    }

    // Devolver la respuesta
    return NextResponse.json({ message: generatedMessage });
  } catch (error: any) {
    console.error('Error al llamar a la API de DeepSeek:', error);
    
    // Respuesta de error más rápida y simple
    return NextResponse.json(
      { error: 'Ocurrió un error al procesar tu solicitud. Por favor, intenta de nuevo.' },
      { status: 500 }
    );
  }
}