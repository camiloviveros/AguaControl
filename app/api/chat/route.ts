import { NextResponse } from 'next/server';

// Definir interfaces para tipos
interface ChatMessage {
  role: string;
  content: string;
}

interface ChatRequest {
  message: string;
  history: ChatMessage[];
}

// Caché mejorada con mejor gestión
let responseCache = new Map<string, string>();
let lastCacheCleanup = Date.now();

// Función para limpiar la caché
const cleanupCache = (): void => {
  const now = Date.now();
  if (now - lastCacheCleanup > 60 * 60 * 1000 || responseCache.size > 50) {
    console.log(`Limpiando caché. Tamaño antes: ${responseCache.size}`);
    responseCache.clear();
    lastCacheCleanup = now;
    console.log('Caché limpiada completamente');
  }
};

export async function POST(request: Request): Promise<NextResponse> {
  // Limpiar caché si es necesario
  cleanupCache();
  
  try {
    console.log('Inicio de solicitud a la API de chat');
    
    // Verificar la API key antes de intentar usarla
    const apiKey = process.env.DEEPSEEK_API_KEY;
    if (!apiKey || apiKey.length < 5) {
      console.error('ERROR: La API key de DeepSeek no está configurada correctamente');
      return NextResponse.json(
        { 
          error: 'Error de configuración de la API. Por favor, contacta al administrador.' 
        },
        { status: 500 }
      );
    }
    
    console.log('API key verificada, longitud:', apiKey.length);

    // Obtener y validar los datos de la solicitud
    let requestData: ChatRequest;
    try {
      requestData = await request.json() as ChatRequest;
      if (!requestData.message) {
        console.error('Mensaje vacío en la solicitud');
        return NextResponse.json({ 
          error: 'El mensaje no puede estar vacío'
        }, { status: 400 });
      }
    } catch (jsonError) {
      console.error('Error al parsear JSON:', jsonError);
      return NextResponse.json({ 
        error: 'Formato de solicitud inválido'
      }, { status: 400 });
    }
    
    const { message, history = [] } = requestData;
    
    // Verificar caché primero - para respuestas ultrarrápidas
    const cacheKey = message.trim().toLowerCase().substring(0, 100);
    if (responseCache.has(cacheKey)) {
      console.log('Respuesta encontrada en caché');
      return NextResponse.json({ 
        message: responseCache.get(cacheKey),
        cached: true 
      });
    }
    
    console.log(`Mensaje para procesar: "${message.substring(0, 50)}..."`);
    
   
    const limitedHistory = history.slice(-2);
    const formattedMessages = limitedHistory.map((msg: ChatMessage) => ({
      role: msg.role === 'assistant' ? 'assistant' : 'user',
      content: msg.content,
    }));

    const systemMessage = {
      role: 'system',
      content: `Eres un asistente conciso especializado en gestión y ahorro de consumo de agua. 
      Ayudas a reducir el consumo, interpretar facturas, detectar fugas y optimizar el uso del agua.
      
      RESPONDE SOLO sobre agua, consumo, ahorro, facturación y temas relacionados.
      Si preguntan sobre otros temas, recuerda amablemente que eres especialista en agua.
      
      IMPORTANTE: Sé breve. Limita tus respuestas a 3-4 frases máximo.
      Usa frases cortas y directas. No uses largas introducciones.`
    };

    const apiEndpoint = 'https://api.deepseek.com/v1/chat/completions';
    

    const timeoutMs = 9500;
    
    const controller = new AbortController();
    const timeoutId = setTimeout(() => {
      console.log('TIMEOUT: La solicitud a DeepSeek tomó demasiado tiempo (9s)');
      controller.abort();
    }, timeoutMs);
    
    console.log(`Enviando solicitud a DeepSeek API con timeout de ${timeoutMs/1000} segundos...`);
    
    
    const payload = {
      model: process.env.DEEPSEEK_MODEL || 'deepseek-chat',
      messages: [
        systemMessage,
        ...formattedMessages,
        { role: 'user', content: message }
      ],
      max_tokens: 200,        // Suficiente para respuestas útiles pero no excesivas
      temperature: 0.7,       // Balanceado para creatividad y precisión
      top_p: 0.95,            // Ligeramente reducido para respuestas más directas
      presence_penalty: 0.1,  
      frequency_penalty: 0.1  
    };
    
    try {
      const response = await fetch(apiEndpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${apiKey}`
        },
        body: JSON.stringify(payload),
        signal: controller.signal
      });
      
      clearTimeout(timeoutId);
      
      // Verificar la respuesta HTTP
      if (!response.ok) {
        const statusCode = response.status;
        let errorText = '';
        
        try {
          errorText = await response.text();
        } catch (e) {
          errorText = 'No se pudo leer el cuerpo de la respuesta';
        }
        
        console.error(`ERROR: DeepSeek API respondió con ${statusCode}`, errorText);
        
        // Mensajes de error más detallados según el código de estado
        if (statusCode === 401) {
          return NextResponse.json({ 
            error: 'Error de autenticación. La API key puede ser inválida o haber expirado.' 
          }, { status: 500 });
        } else if (statusCode === 429) {
          return NextResponse.json({ 
            error: 'Límite de velocidad excedido en la API de DeepSeek.' 
          }, { status: 500 });
        } else {
          return NextResponse.json({ 
            error: `Error del servidor: ${statusCode}. Por favor, intenta de nuevo más tarde.` 
          }, { status: 500 });
        }
      }
      
      // Procesar la respuesta exitosa
      const data = await response.json();
      console.log('Respuesta recibida correctamente de DeepSeek API');
      
      if (!data.choices || !data.choices[0] || !data.choices[0].message) {
        console.error('Formato de respuesta inválido de DeepSeek:', JSON.stringify(data).substring(0, 200));
        return NextResponse.json({ 
          error: 'La respuesta de la API no tiene el formato esperado.' 
        }, { status: 500 });
      }
      
      let generatedMessage = data.choices[0].message.content;
      
      // OPTIMIZACIÓN 4: Proceso de limpieza rápido solo para HTML
      generatedMessage = generatedMessage
        .replace(/<[^>]*>/g, '');
      
      // Almacenar en caché para futuras consultas
      try {
        if (generatedMessage.length < 1000) {
          responseCache.set(cacheKey, generatedMessage);
          console.log('Respuesta guardada en caché');
        }
      } catch (cacheError) {
        console.error('ERROR al guardar en caché:', cacheError);
      }
      
      return NextResponse.json({ message: generatedMessage });
      
    } catch (fetchError) {
      clearTimeout(timeoutId);
      
      const error = fetchError as Error;
      console.error('ERROR durante la solicitud a DeepSeek:', error.name, error.message);
      
      if (error.name === 'AbortError') {
        return NextResponse.json({ 
          error: 'La solicitud tomó demasiado tiempo y fue cancelada. Por favor, intenta con una pregunta más simple.' 
        }, { status: 504 });
      }
      
      return NextResponse.json({ 
        error: 'Error al conectar con el servicio de IA. Por favor, intenta de nuevo más tarde.' 
      }, { status: 500 });
    }
    
  } catch (error) {
    const err = error as Error;
    console.error('ERROR general en el procesamiento:', err.name, err.message, err.stack);
    
    return NextResponse.json({ 
      error: 'Ha ocurrido un error inesperado. Por favor, intenta de nuevo.' 
    }, { status: 500 });
  }
}