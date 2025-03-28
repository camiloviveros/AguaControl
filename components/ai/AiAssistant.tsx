'use client';

import React, { useState, useRef, useEffect } from 'react';
import Image from 'next/image';

// Types
interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  isTemporary?: boolean;
}

// Estilos corregidos
const styles = {
  container: "w-full max-w-md mx-auto my-8 bg-white rounded-xl shadow-xl overflow-hidden",
  chatWrapper: "flex flex-col h-[600px] relative",
  header: "bg-blue-600 text-white p-4 flex items-center justify-between header-animation",
  headerLeft: "flex items-center space-x-3",
  avatarContainer: "flex-shrink-0 w-10 h-10 bg-white rounded-full flex items-center justify-center avatar-animation",
  avatarIcon: "h-6 w-6 text-blue-600",
  onlineIndicator: "absolute bottom-0 right-0 w-3 h-3 bg-green-400 rounded-full border-2 border-white",
  headerText: "ml-1 text-animation",
  headerTitle: "font-bold text-lg",
  headerSubtitle: "text-xs text-blue-100 flex items-center",
  onlineDot: "w-2 h-2 bg-green-400 rounded-full mr-1",
  messagesArea: "flex-1 p-4 overflow-y-auto bg-gray-50 messages-area-animation",
  assistantContainer: "flex mb-4 items-start",
  userContainer: "flex mb-4 items-start justify-end",
  assistantAvatar: "w-8 h-8 rounded-full bg-blue-500 flex items-center justify-center mr-2 flex-shrink-0",
  assistantAvatarIcon: "h-4 w-4 text-white",
  userAvatar: "w-8 h-8 rounded-full bg-blue-600 flex items-center justify-center ml-2 flex-shrink-0",
  userAvatarIcon: "h-4 w-4 text-white",
  assistantMessage: "bg-white p-3 rounded-lg max-w-[80%] shadow-sm border border-gray-200 rounded-tl-none",
  temporaryMessage: "bg-white p-3 rounded-lg max-w-[80%] shadow-sm border border-gray-200 rounded-tl-none bg-blue-50",
  userMessage: "bg-blue-600 p-3 rounded-lg max-w-[80%] text-white shadow-sm rounded-tr-none",
  messageText: "whitespace-pre-wrap",
  typingIndicator: "flex mb-4 items-start",
  typingBubble: "bg-white p-3 rounded-lg shadow-sm border border-gray-200 rounded-tl-none",
  typingDots: "flex space-x-1",
  typingDot: "h-2 w-2 bg-blue-400 rounded-full",
  inputArea: "p-4 border-t border-gray-200 bg-white input-area-animation",
  inputForm: "flex gap-2",
  textInput: "flex-grow py-2 px-4 rounded-full border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500",
  sendButton: "p-2 rounded-full bg-blue-600 hover:bg-blue-700 text-white button-animation",
  sendButtonDisabled: "p-2 rounded-full bg-gray-300 cursor-not-allowed text-white",
  sendButtonIcon: "h-5 w-5",
  footer: "py-2 px-4 text-xs text-center text-blue-500 bg-gray-50 border-t border-gray-200 footer-animation",
  actionButton: "p-2 rounded-full bg-blue-700 hover:bg-blue-800 text-white button-animation",
  actionButtonIcon: "h-4 w-4",
  // Botón para scroll manual
  scrollButton: "absolute bottom-[70px] right-4 p-2 rounded-full bg-blue-600 hover:bg-blue-700 text-white shadow-lg z-10",
  scrollButtonIcon: "h-4 w-4 text-white"
};

// Sub-components
const AssistantAvatar: React.FC = () => (
  <div className={styles.assistantAvatar}>
    <svg xmlns="http://www.w3.org/2000/svg" className={styles.assistantAvatarIcon} fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
  </div>
);

const UserAvatar: React.FC = () => (
  <div className={styles.userAvatar}>
    <svg xmlns="http://www.w3.org/2000/svg" className={styles.userAvatarIcon} fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
    </svg>
  </div>
);

const TypingIndicator: React.FC = () => (
  <div className={`${styles.typingIndicator} typing-animation`}>
    <AssistantAvatar />
    <div className={styles.typingBubble}>
      <div className={styles.typingDots}>
        <div className="typing-dot"></div>
        <div className="typing-dot" style={{ animationDelay: '0.2s' }}></div>
        <div className="typing-dot" style={{ animationDelay: '0.4s' }}></div>
      </div>
    </div>
  </div>
);

const MessageBubble: React.FC<{ message: Message, index: number }> = ({ message, index }) => {
  const isUser = message.role === 'user';
  const isTemporary = message.isTemporary;
  
  return (
    <div 
      className={`${isUser ? styles.userContainer : styles.assistantContainer} message-animation`}
      style={{ animationDelay: `${index * 0.15}s` }}
    >
      {!isUser && <AssistantAvatar />}
      
      <div className={`${isUser ? styles.userMessage : (isTemporary ? styles.temporaryMessage : styles.assistantMessage)} bubble-animation`} 
           style={{ animationDelay: `${index * 0.15 + 0.1}s` }}>
        <p className={styles.messageText}>{message.content}</p>
      </div>
      
      {isUser && <UserAvatar />}
    </div>
  );
};

// Base de conocimientos para respuestas rápidas sobre agua
const getQuickResponse = (query: string): string | null => {
  const normalizedQuery = query.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");
  
  // Respuestas rápidas para preguntas comunes sobre agua
  const waterResponses: Record<string, string> = {
    "hola": "Hola, soy tu asistente especializado en agua. Procesando tu consulta...",
    "fugas": "Analizando soluciones para detectar y reparar fugas de agua...",
    "ahorrar agua": "Preparando consejos para reducir el consumo de agua...",
    "consumo": "Calculando datos de consumo promedio y cómo reducirlo...",
    "factura": "Analizando información sobre la facturación de agua...",
    "ducha": "Buscando consejos de ahorro para el uso de la ducha...",
    "grifo": "Recopilando información sobre grifos eficientes...",
    "tuberia": "Procesando información sobre mantenimiento de tuberías...",
    "riego": "Preparando consejos sobre riego eficiente...",
    "sanitario": "Analizando opciones para reducir el consumo en el sanitario...",
    "wc": "Calculando el consumo de agua en el inodoro y cómo reducirlo...",
    "recoleccion": "Buscando información sobre recolección de agua de lluvia...",
    "lavadora": "Preparando consejos para uso eficiente de la lavadora...",
    "lavar": "Analizando métodos eficientes de lavado...",
    "cisternas": "Procesando información sobre mantenimiento de cisternas...",
    "potable": "Buscando información sobre el agua potable y su conservación..."
  };

  for (const [key, response] of Object.entries(waterResponses)) {
    if (normalizedQuery.includes(key)) {
      return response;
    }
  }

  return "Procesando tu consulta sobre gestión de agua...";
};

// Main component
const AiAssistant: React.FC = () => {
  const initialMessage = {
    id: '1',
    role: 'assistant' as const,
    content: 'Hola, soy tu asistente virtual para la gestión del consumo de agua en tu hogar. ¿En qué puedo ayudarte hoy?'
  };

  // State management
  const [messages, setMessages] = useState<Message[]>([initialMessage]);
  const [input, setInput] = useState<string>('');
  const [isProcessing, setIsProcessing] = useState<boolean>(false);
  const [isTyping, setIsTyping] = useState<boolean>(false);
  const [showChat, setShowChat] = useState<boolean>(false);
  const [showScrollButton, setShowScrollButton] = useState<boolean>(false);
  
  // Refs
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const messagesAreaRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Efectos de animación iniciales - modificado para evitar el scroll automático
  useEffect(() => {
    // Utilizamos requestAnimationFrame para asegurarnos de que esto ocurra después del render inicial
    const timer = setTimeout(() => {
      setShowChat(true);
      setTimeout(() => {
        inputRef.current?.focus();
      }, 1200);
    }, 300);
    
    return () => clearTimeout(timer);
  }, []);

  // Evitar scroll automático al cargar el componente
  useEffect(() => {
    if (typeof window !== 'undefined') {
      // Guardamos la posición actual
      const scrollPos = window.scrollY;
      
      // Después de cualquier cambio que pueda causar scroll, restauramos la posición
      const restoreScroll = () => window.scrollTo(0, scrollPos);
      
      window.addEventListener('scroll', function preventAutoScroll(e) {
        window.scrollTo(0, scrollPos);
        // Lo removemos después de un tiempo para permitir el scroll manual del usuario
        setTimeout(() => {
          window.removeEventListener('scroll', preventAutoScroll);
        }, 500);
      });
    }
  }, []);

  // Monitor scroll position to show/hide scroll button
  useEffect(() => {
    const handleScroll = () => {
      if (!messagesAreaRef.current) return;
      
      const { scrollTop, scrollHeight, clientHeight } = messagesAreaRef.current;
      const isNearBottom = scrollHeight - scrollTop - clientHeight < 100;
      
      setShowScrollButton(!isNearBottom);
    };
    
    const messagesArea = messagesAreaRef.current;
    if (messagesArea) {
      messagesArea.addEventListener('scroll', handleScroll);
    }
    
    return () => {
      if (messagesArea) {
        messagesArea.removeEventListener('scroll', handleScroll);
      }
    };
  }, []);

  // Scroll to bottom manually when button is clicked
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  // Función para limpiar el chat con animación
  const handleClearChat = () => {
    const messagesArea = document.querySelector(`.${styles.messagesArea.split(' ')[0]}`);
    if (messagesArea) {
      messagesArea.classList.add('messages-exit');
      
      setTimeout(() => {
        setMessages([initialMessage]);
        setInput('');
        messagesArea.classList.remove('messages-exit');
        setTimeout(() => {
          inputRef.current?.focus();
        }, 100);
      }, 300);
    } else {
      setMessages([initialMessage]);
      setInput('');
      setTimeout(() => {
        inputRef.current?.focus();
      }, 100);
    }
  };

  // API handler optimizado con timeout y mejor manejo de errores
  const callDeepSeekApi = async (userMessage: string): Promise<string> => {
    try {
      // Reducir historia a solo 3 mensajes recientes
      const recentMessages = messages
        .filter(msg => !msg.isTemporary) // No enviar mensajes temporales
        .slice(-3)
        .map(msg => ({
          role: msg.role,
          content: msg.content
        }));

      // Usar AbortController para timeout - usar valor mayor (15 segundos)
      const timeoutMs = 15000; // 15 segundos máximo
      const controller = new AbortController();
      let timeoutId: NodeJS.Timeout | null = null;
      
      // Crear una promesa que se resuelva cuando se complete la solicitud o ocurra un timeout
      const fetchPromise = fetch('/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          message: userMessage,
          history: recentMessages
        }),
        signal: controller.signal
      });
      
      // Crear una promesa de timeout que rechace después de timeoutMs
      const timeoutPromise = new Promise<Response>((_, reject) => {
        timeoutId = setTimeout(() => {
          // En lugar de abortar directamente, enviamos un mensaje personalizado
          reject(new Error('Tiempo de espera agotado'));
          controller.abort();
        }, timeoutMs);
      });
      
      // Usar Promise.race para que la primera promesa que se resuelva gane
      const response = await Promise.race([fetchPromise, timeoutPromise]);
      
      // Limpiar el timeout si se resolvió la promesa fetch
      if (timeoutId) clearTimeout(timeoutId);

      if (!response.ok) {
        throw new Error('Error al conectar con el asistente');
      }

      const data = await response.json();
      
      // Si la respuesta viene de caché, podemos aplicar un pequeño retraso
      // para que parezca que el asistente está "pensando" brevemente
      if (data.cached) {
        await new Promise(resolve => setTimeout(resolve, 300));
      }
      
      return data.message;
    } catch (error: any) {
      // Mejorar el manejo de errores para evitar mensajes en la consola
      // AbortError es esperado y no debe ser considerado un error grave
      if (error.name === 'AbortError') {
        console.log('La solicitud fue cancelada debido al timeout');
        return 'Lo siento, estoy tardando más de lo normal en procesar tu consulta. Por favor, intenta con una pregunta más simple.';
      }
      
      if (error.message === 'Tiempo de espera agotado') {
        return 'Lo siento, no he podido obtener una respuesta a tiempo. Por favor, intenta con una pregunta más simple.';
      }
      
      console.error('Error al llamar a la API:', error);
      return 'Lo siento, ha ocurrido un error al procesar tu pregunta. Por favor, inténtalo de nuevo.';
    }
  };

  // Form handler con respuestas rápidas temporales
  const handleSubmit = async (e: React.FormEvent): Promise<void> => {
    e.preventDefault();
    
    if (!input.trim() || isProcessing) return;
    
    // Mensaje del usuario
    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: input
    };
    
    const userInput = input;
    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsProcessing(true);
    
    try {
      // 1. Mostrar una respuesta temporal inmediata
      const quickResponse = getQuickResponse(userInput);
      const tempMessageId = `temp-${Date.now()}`;
      
      if (quickResponse) {
        const tempMessage: Message = {
          id: tempMessageId,
          role: 'assistant',
          content: quickResponse,
          isTemporary: true
        };
        
        setMessages(prev => [...prev, tempMessage]);
      } else {
        // Si no hay respuesta rápida, mostrar indicador de escritura
        setIsTyping(true);
      }
      
      // 2. Obtener la respuesta real de la API (en paralelo)
      const aiResponseContent = await callDeepSeekApi(userInput);
      
      // 3. Reemplazar mensaje temporal o añadir nuevo mensaje
      setIsTyping(false);
      setMessages(prev => {
        // Buscar si existe un mensaje temporal para reemplazar
        const tempIndex = prev.findIndex(msg => msg.id === tempMessageId);
        
        if (tempIndex !== -1) {
          // Reemplazar mensaje temporal con la respuesta real
          const newMessages = [...prev];
          newMessages[tempIndex] = {
            id: Date.now().toString(),
            role: 'assistant',
            content: aiResponseContent
          };
          return newMessages;
        } else {
          // Añadir como mensaje nuevo
          return [...prev, {
            id: Date.now().toString(),
            role: 'assistant',
            content: aiResponseContent
          }];
        }
      });
      
      // Mostrar el botón de scroll si se necesita
      setShowScrollButton(true);
      
    } catch (error) {
      // Manejar error
      setIsTyping(false);
      const errorResponse: Message = {
        id: Date.now().toString(),
        role: 'assistant',
        content: 'Lo siento, ha ocurrido un error al procesar tu pregunta. Por favor, inténtalo de nuevo más tarde.'
      };
      
      setMessages(prev => {
        // Eliminar mensajes temporales y añadir mensaje de error
        return [...prev.filter(msg => !msg.isTemporary), errorResponse];
      });
    } finally {
      setIsProcessing(false);
      // Enfocar el campo de entrada después de procesar
      setTimeout(() => {
        inputRef.current?.focus();
      }, 100);
    }
  };

  // Render con contenedor modificado (eliminando fondo negro)
  return (
    <div className={styles.container}>
      <div className={`${styles.chatWrapper} ${showChat ? 'show-chat' : ''}`}>
        {/* Chat header with clear button */}
        <div className={styles.header}>
          <div className={styles.headerLeft}>
            <div className="avatar-container relative">
              <Image 
                src="/images/logo.png" 
                alt="AguaControl Logo" 
                width={24} 
                height={24} 
                className="avatar-icon"
              />
              <span className="absolute bottom-0 right-0 w-3 h-3 bg-green-400 rounded-full border-2 border-white"></span>
            </div>
            <div className={styles.headerText}>
              <h3 className={styles.headerTitle}>Asistente virtual</h3>
              <p className={styles.headerSubtitle}>
                <span className={styles.onlineDot}></span>
                Experto en gestión de recursos hídricos
              </p>
            </div>
          </div>
          
          {/* Botón para limpiar el chat */}
          <button 
            onClick={handleClearChat}
            className={styles.actionButton}
            title="Limpiar conversación"
            aria-label="Limpiar conversación"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className={styles.actionButtonIcon} fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
            </svg>
          </button>
        </div>
        
        {/* Messages area - usando ref para controlar el scroll */}
        <div 
          className={styles.messagesArea} 
          ref={messagesAreaRef}
        >
          {messages.map((message: Message, index) => (
            <MessageBubble key={message.id} message={message} index={index} />
          ))}
          
          {isTyping && <TypingIndicator />}
          
          {/* Marcador de final de mensajes - no hace scroll automático */}
          <div ref={messagesEndRef} />
        </div>
        
        {/* Botón de scroll opcional que aparece cuando hay nuevos mensajes */}
        {showScrollButton && (
          <button 
            onClick={scrollToBottom}
            className={styles.scrollButton}
            title="Ir al final de la conversación"
            aria-label="Ir al final de la conversación"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className={styles.scrollButtonIcon} fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
            </svg>
          </button>
        )}
        
        {/* Input form */}
        <div className={styles.inputArea}>
          <form onSubmit={handleSubmit} className={styles.inputForm}>
            <input
              type="text"
              value={input}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => setInput(e.target.value)}
              className={styles.textInput}
              placeholder="Escribe tu pregunta sobre consumo de agua..."
              disabled={isProcessing}
              ref={inputRef}
            />
            <button
              type="submit"
              className={!input.trim() || isProcessing ? styles.sendButtonDisabled : styles.sendButton}
              disabled={!input.trim() || isProcessing}
            >
              <svg xmlns="http://www.w3.org/2000/svg" className={styles.sendButtonIcon} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
              </svg>
            </button>
          </form>
        </div>
        
        {/* Footer */}
        <div className={styles.footer}>
          <p>
            Este asistente está especializado en ahorro y gestión de agua. Usa inteligencia artificial para responder a tus consultas.
          </p>
        </div>
      </div>
      
      {/* CSS animations */}
      <style jsx>{`
        /* Animación para el contenedor principal */
        .main-container {
          opacity: 0;
          transform: translateY(20px) scale(0.95);
          transition: none;
        }
        
        .show-chat {
          opacity: 1;
          transform: translateY(0) scale(1);
          transition: opacity 0.8s ease, transform 0.8s cubic-bezier(0.175, 0.885, 0.32, 1.275);
        }
        
        /* Animaciones para elementos del encabezado */
        .header-animation {
          transform: translateY(-100%);
          animation: slideDown 0.7s forwards;
          animation-delay: 0.3s;
        }
        
        .avatar-animation {
          opacity: 0;
          transform: scale(0.5);
          animation: popIn 0.5s forwards;
          animation-delay: 0.6s;
        }
        
        .text-animation {
          opacity: 0;
          animation: fadeIn 0.5s forwards;
          animation-delay: 0.7s;
        }
        
        /* Animaciones para el área de mensajes */
        .messages-area-animation {
          opacity: 0;
          animation: fadeIn 0.5s forwards;
          animation-delay: 0.5s;
        }
        
        .message-animation {
          opacity: 0;
          transform: translateY(15px);
          animation: slideUp 0.5s forwards;
        }
        
        .bubble-animation {
          opacity: 0;
          transform: scale(0.8);
          animation: popIn 0.5s forwards;
        }
        
        /* Animación para el área de entrada */
        .input-area-animation {
          transform: translateY(100%);
          animation: slideUp 0.7s forwards;
          animation-delay: 0.6s;
        }
        
        /* Animación para el pie de página */
        .footer-animation {
          opacity: 0;
          animation: fadeIn 0.5s forwards;
          animation-delay: 0.8s;
        }
        
        /* Animación para botones */
        .button-animation {
          transform: scale(0);
          animation: popInRotate 0.5s forwards;
          animation-delay: 0.9s;
        }
        
        /* Animación para efecto de salida al limpiar mensajes */
        .messages-exit {
          opacity: 0;
          transform: scale(0.95);
          transition: opacity 0.3s ease, transform 0.3s ease;
        }
        
        /* Animación para los puntos del indicador de escritura */
        .typing-animation {
          animation: fadeIn 0.3s forwards;
        }
        
        .typing-dot {
          height: 8px;
          width: 8px;
          border-radius: 50%;
          background-color: #3b82f6;
          display: inline-block;
          animation: bounce 1.4s infinite ease-in-out both;
        }
        
        /* Definiciones de animaciones */
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        
        @keyframes slideDown {
          from { transform: translateY(-100%); }
          to { transform: translateY(0); }
        }
        
        @keyframes slideUp {
          from { 
            opacity: 0;
            transform: translateY(15px); 
          }
          to { 
            opacity: 1;
            transform: translateY(0); 
          }
        }
        
        @keyframes popIn {
          0% {
            opacity: 0;
            transform: scale(0.5);
          }
          70% {
            transform: scale(1.1);
          }
          100% {
            opacity: 1;
            transform: scale(1);
          }
        }
        
        @keyframes popInRotate {
          0% {
            opacity: 0;
            transform: scale(0) rotate(-45deg);
          }
          70% {
            transform: scale(1.1) rotate(5deg);
          }
          100% {
            opacity: 1;
            transform: scale(1) rotate(0);
          }
        }
        
        @keyframes bounce {
          0%, 80%, 100% { 
            transform: translateY(0);
          }
          40% { 
            transform: translateY(-8px);
          }
        }
      `}</style>
    </div>
  );
};

export default AiAssistant;