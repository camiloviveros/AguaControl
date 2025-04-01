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

// Caché renovada con mejor gestión
let responseCache = new Map<string, string>();
let lastCacheCleanup = Date.now();

// Función para limpiar la caché
const cleanupCache = (): void => {
  // Limpiar caché cada hora o si es demasiado grande
  const now = Date.now();
  if (now - lastCacheCleanup > 60 * 60 * 1000 || responseCache.size > 50) {
    console.log(`Limpiando caché. Tamaño antes: ${responseCache.size}`);
    responseCache.clear();
    lastCacheCleanup = now;
    console.log('Caché limpiada completamente');
  }
};

// Implementación de respuesta de fallback para cuando la API falla
const getFallbackResponse = (query: string): string => {
  const lowercaseQuery = query.toLowerCase();
  
  if (lowercaseQuery.includes('ahorro') || lowercaseQuery.includes('ahorrar')) {
    return "💧 Para ahorrar agua, puedes instalar aireadores en tus grifos, reducir el tiempo de ducha a 5 minutos y reparar fugas. Estos cambios simples pueden reducir tu consumo hasta en un 30%.";
  }
  
  if (lowercaseQuery.includes('fuga') || lowercaseQuery.includes('goteo')) {
    return "Una fuga puede desperdiciar hasta 30 litros al día. Para detectarlas, revisa tus grifos y cisternas regularmente, y verifica tu medidor cuando no estés usando agua. Si el medidor sigue corriendo, probablemente tienes una fuga.";
  }
  
  if (lowercaseQuery.includes('agua') || lowercaseQuery.includes('consumo')) {
    return "El agua es un recurso esencial que debemos conservar. Una persona promedio consume entre 100-150 litros diarios. Puedes reducir este consumo con dispositivos eficientes y buenos hábitos como cerrar el grifo mientras te cepillas los dientes.";
  }
  
  return "Como asistente especializado en gestión de agua, puedo ayudarte con consejos para reducir tu consumo, detectar fugas, interpretar tu factura o resolver dudas sobre uso eficiente del agua. ¿Sobre qué tema específico necesitas información?";
};

export async function POST(request: Request): Promise<NextResponse> {
  // Limpiar caché si es necesario
  cleanupCache();
  
  try {
    console.log('Inicio de solicitud a la API de chat');
    
    // Verificar si la API key está configurada
    if (!process.env.DEEPSEEK_API_KEY) {
      console.error('ERROR: La API key de DeepSeek no está configurada');
      // Usar respuesta de fallback en lugar de error
      return NextResponse.json({ 
        message: "Soy tu asistente para gestión de agua. Actualmente estoy en modo de mantenimiento, pero puedo ofrecerte información básica. ¿En qué puedo ayudarte?",
        status: "fallback"
      });
    }

    // Obtener los datos de la solicitud
    const requestData = await request.json().catch((e: Error) => {
      console.error('ERROR: JSON inválido en la solicitud', e);
      return null;
    }) as ChatRequest | null;
    
    if (!requestData || !requestData.message) {
      console.error('ERROR: Datos de solicitud inválidos');
      return NextResponse.json(
        { message: "Por favor, envía una pregunta válida sobre gestión de agua." },
        { status: 400 }
      );
    }
    
    const { message, history = [] } = requestData;
    console.log(`Mensaje recibido: "${message.substring(0, 30)}..."`);
    
    // Usar respuesta en caché si existe (con manejo de errores)
    try {
      const cacheKey = message.trim().toLowerCase().substring(0, 100);
      if (responseCache.has(cacheKey)) {
        console.log('Usando respuesta en caché');
        return NextResponse.json({ 
          message: responseCache.get(cacheKey),
          cached: true 
        });
      }
    } catch (cacheError) {
      console.error('ERROR al verificar caché:', cacheError);
      responseCache.clear();
    }

    // Historia limitada para rendimiento
    const limitedHistory = history.slice(-2);
    const formattedMessages = limitedHistory.map((msg: ChatMessage) => ({
      role: msg.role === 'assistant' ? 'assistant' : 'user',
      content: msg.content,
    }));

    const systemMessage = {
      role: 'system',
      content: `Eres un asistente especializado en gestión y ahorro de consumo de agua. 
      Ayudas a reducir el consumo, interpretar facturas, detectar fugas y optimizar el uso del agua.
      
      RESPONDE SOLO sobre agua, consumo, ahorro, facturación y temas relacionados.
      Si preguntan sobre otros temas, recuerda amablemente que eres especialista en agua.
      
      Usa formato de texto simple, con ** para énfasis, NO uses HTML.
      Respuestas concisas de 3-4 frases para preguntas simples.
      Usa - para listas y 💧 para consejos importantes.`
    };

    // Información de configuración
    const apiEndpoint = 'https://api.deepseek.com/v1/chat/completions';
    const timeoutMs = process.env.DEEPSEEK_TIMEOUT ? 
      parseInt(process.env.DEEPSEEK_TIMEOUT) : 12000;
    
    // Configuración para la solicitud con timeout
    const controller = new AbortController();
    const timeoutId = setTimeout(() => {
      console.log('TIMEOUT: Abortando solicitud a DeepSeek');
      controller.abort();
    }, timeoutMs);
    
    // Payload para la API
    const apiPayload = {
      model: process.env.DEEPSEEK_MODEL || 'deepseek-chat',
      messages: [
        systemMessage,
        ...formattedMessages,
        { role: 'user', content: message }
      ],
      max_tokens: 300,
      temperature: 0.7,
      top_p: 0.9
    };
    
    console.log('Enviando solicitud a DeepSeek API');
    
    try {
      const response = await fetch(apiEndpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${process.env.DEEPSEEK_API_KEY}`
        },
        body: JSON.stringify(apiPayload),
        signal: controller.signal
      });
      
      clearTimeout(timeoutId);
      
      if (!response.ok) {
        const errorData = await response.text();
        console.error(`ERROR: DeepSeek API respondió con ${response.status}`, errorData);
        
        // Usar respuesta de fallback
        const fallbackResponse = getFallbackResponse(message);
        return NextResponse.json({ message: fallbackResponse, status: "fallback" });
      }
      
      const data = await response.json();
      console.log('Respuesta recibida correctamente de DeepSeek');
      
      // Procesar respuesta
      let generatedMessage = data.choices?.[0]?.message?.content || 
        'No he podido generar una respuesta. ¿Podrías reformular tu pregunta sobre ahorro de agua?';
      
      // Limpiar formato HTML que pudiera colarse
      generatedMessage = generatedMessage
        .replace(/\*\*(.*?)\*\*/g, '$1')
        .replace(/<br>/g, ' ')
        .replace(/<br><br>/g, ' ')
        .replace(/<strong>(.*?)<\/strong>/g, '$1')
        .replace(/<[^>]*>/g, '');
      
      // Guardar en caché (solo respuestas no fallback)
      if (!generatedMessage.includes('No he podido generar') && generatedMessage.length < 1500) {
        try {
          const cacheKey = message.trim().toLowerCase().substring(0, 100);
          responseCache.set(cacheKey, generatedMessage);
          console.log('Respuesta guardada en caché');
        } catch (cacheError) {
          console.error('ERROR al guardar en caché:', cacheError);
        }
      }
      
      return NextResponse.json({ message: generatedMessage });
      
    } catch (fetchError) {
      clearTimeout(timeoutId);
      console.error('ERROR durante la solicitud a DeepSeek:', fetchError);
      
      // Verificar si es un error de timeout
      const error = fetchError as Error;
      if (error.name === 'AbortError') {
        console.log('La solicitud fue abortada por timeout');
      }
      
      // Usar respuesta de fallback
      const fallbackResponse = getFallbackResponse(message);
      return NextResponse.json({ message: fallbackResponse, status: "fallback" });
    }
    
  } catch (error) {
    console.error('ERROR general en el procesamiento:', error);
    
    // Respuesta genérica de error
    return NextResponse.json({ 
      message: "Disculpa, estoy teniendo problemas para procesar tu solicitud. Puedo ayudarte con consejos básicos de ahorro de agua como: cerrar el grifo mientras te cepillas los dientes, duchas más cortas o revisar fugas. ¿Te interesa alguno de estos temas?",
      status: "error"
    });
  }
}