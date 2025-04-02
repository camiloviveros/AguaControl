'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import Link from 'next/link';

const Hero = () => {
  const [currentText, setCurrentText] = useState('');
  const [showCursor, setShowCursor] = useState(true);
  const [imageLoaded, setImageLoaded] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [scrollY, setScrollY] = useState(0);
  const [deviceWidth, setDeviceWidth] = useState(0);
  const parallaxRef = useRef<HTMLDivElement>(null);
  const imageRef = useRef<HTMLDivElement>(null);
  
  const fullText = 'Gestiona tu consumo de agua de manera inteligente';
  const typingSpeed = 60;
  const erasingSpeed = 30;
  const pauseAfterTyping = 2000;
  const pauseAfterErasing = 600;
  
  const currentIndex = useRef(0);
  const isTyping = useRef(true);
  const componentActive = useRef(true);

  // Detecta si es dispositivo móvil y su tamaño exacto
  useEffect(() => {
    const checkDeviceSize = () => {
      const width = window.innerWidth;
      setDeviceWidth(width);
      setIsMobile(width < 768);
    };
    
    // Comprueba inmediatamente
    checkDeviceSize();
    
    // Actualiza al cambiar el tamaño de la ventana
    window.addEventListener('resize', checkDeviceSize);
    return () => window.removeEventListener('resize', checkDeviceSize);
  }, []);

  // Precarga de imagen optimizada
  useEffect(() => {
    // Función para cargar imagen
    const loadImage = () => {
      const img = new Image();
      img.src = isMobile ? '/images/water-hero-mobile.webp' : '/images/water-hero-des.webp';
      
      img.onload = () => {
        // Marcar como cargada solo cuando realmente se ha cargado
        setImageLoaded(true);
      };
      
      // Si la imagen ya está en caché, se cargará instantáneamente
      if (img.complete) {
        setImageLoaded(true);
      }
      
      return () => {
        img.onload = null;
      };
    };
    
    // Cargar imagen inmediatamente
    loadImage();
    
    // Si después de 500ms no se ha cargado, mostrar de todos modos para evitar pantalla en blanco
    const timer = setTimeout(() => {
      setImageLoaded(true);
    }, 500);
    
    return () => clearTimeout(timer);
  }, [isMobile]);

  // Efecto de máquina de escribir
  const typeEffect = useCallback(() => {
    if (!componentActive.current) return;
    
    if (isTyping.current) {
      if (currentIndex.current < fullText.length) {
        setCurrentText(fullText.substring(0, currentIndex.current + 1));
        currentIndex.current++;
        setTimeout(typeEffect, typingSpeed);
      } else {
        setTimeout(() => {
          isTyping.current = false;
          typeEffect();
        }, pauseAfterTyping);
      }
    } else {
      if (currentIndex.current > 0) {
        currentIndex.current--;
        setCurrentText(fullText.substring(0, currentIndex.current));
        setTimeout(typeEffect, erasingSpeed);
      } else {
        setTimeout(() => {
          isTyping.current = true;
          typeEffect();
        }, pauseAfterErasing);
      }
    }
  }, [fullText]);

  // Iniciar efecto de escritura solo una vez
  useEffect(() => {
    currentIndex.current = 0;
    isTyping.current = true;
    componentActive.current = true;
    
    typeEffect();
    
    return () => {
      componentActive.current = false;
    };
  }, [typeEffect]);

  // Efecto para cursor parpadeante
  useEffect(() => {
    const cursorInterval = setInterval(() => {
      setShowCursor(prev => !prev);
    }, 500);
    
    return () => {
      clearInterval(cursorInterval);
    };
  }, []);

  // Efecto parallax OPTIMIZADO para evitar bugs
  const handleScroll = useCallback(() => {
    // Usamos requestAnimationFrame para optimizar rendimiento
    requestAnimationFrame(() => {
      const offset = window.pageYOffset;
      setScrollY(offset);
      
      // Verificamos que los refs existan antes de manipularlos
      if (parallaxRef.current) {
        // Uso de transformación 3D para aprovechar aceleración GPU
        const yOffset = offset * (isMobile ? 0.15 : 0.3);
        parallaxRef.current.style.transform = `translate3d(0, ${yOffset}px, 0)`;
      }
    });
  }, [isMobile]);

  // Efecto para scroll - Versión optimizada
  useEffect(() => {
    // Agregamos evento con passive: true para mejor rendimiento
    window.addEventListener('scroll', handleScroll, { passive: true });
    
    // También manejar el resize para actualizar parallax
    window.addEventListener('resize', handleScroll, { passive: true });
    
    return () => {
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('resize', handleScroll);
    };
  }, [handleScroll]);

  // Inyección de CSS solo para desktop
  useEffect(() => {
    if (typeof document !== 'undefined') {
      const style = document.createElement('style');
      style.innerHTML = `
        @media (min-width: 768px) {
          .desktop-image-filter::before {
            content: '';
            position: absolute;
            inset: 0;
            background-color: rgba(0, 0, 0, 0.2);
            z-index: 2;
            pointer-events: none;
          }
          
          /* Mejoras visuales para Desktop */
          .hero-title-enhanced {
            text-shadow: 0 3px 8px rgba(0, 0, 0, 0.8), 0 6px 12px rgba(0, 0, 0, 0.5);
            letter-spacing: 0.5px;
            animation: subtle-shimmer 8s infinite;
          }
          
          @keyframes subtle-shimmer {
            0%, 100% { text-shadow: 0 3px 8px rgba(0, 0, 0, 0.8), 0 6px 12px rgba(0, 0, 0, 0.5), 0 0 5px rgba(59, 130, 246, 0); }
            50% { text-shadow: 0 3px 8px rgba(0, 0, 0, 0.8), 0 6px 12px rgba(0, 0, 0, 0.5), 0 0 15px rgba(59, 130, 246, 0.6); }
          }
          
          .shine-effect {
            position: relative;
            overflow: hidden;
          }
          
          .shine-effect::after {
            content: '';
            position: absolute;
            top: -100%;
            left: -100%;
            height: 300%;
            width: 100%;
            background: linear-gradient(
              to bottom right,
              rgba(255, 255, 255, 0) 0%,
              rgba(255, 255, 255, 0.1) 50%,
              rgba(255, 255, 255, 0) 100%
            );
            transform: rotate(25deg);
            animation: shine 6s infinite linear;
          }
          
          @keyframes shine {
            0% {
              transform: translateX(-100%) rotate(25deg);
            }
            100% {
              transform: translateX(100%) rotate(25deg);
            }
          }
          
          .glow-button {
            animation: glow 3s infinite alternate;
            transition: all 0.35s ease;
            position: relative;
            overflow: hidden;
          }
          
          .glow-button:hover {
            box-shadow: 0 0 20px rgba(59, 130, 246, 0.7);
            transform: translateY(-3px);
          }
          
          .glow-button::before {
            content: '';
            position: absolute;
            top: -50%;
            left: -50%;
            width: 200%;
            height: 200%;
            background: linear-gradient(
              to bottom right,
              rgba(255, 255, 255, 0) 0%,
              rgba(255, 255, 255, 0.2) 50%,
              rgba(255, 255, 255, 0) 100%
            );
            transform: rotate(30deg);
            animation: button-shine 6s infinite linear;
            pointer-events: none;
          }
          
          @keyframes button-shine {
            0% {
              transform: translateX(-300%) rotate(30deg);
            }
            100% {
              transform: translateX(300%) rotate(30deg);
            }
          }
          
          @keyframes glow {
            0% {
              box-shadow: 0 0 5px rgba(59, 130, 246, 0.5);
            }
            100% {
              box-shadow: 0 0 15px rgba(59, 130, 246, 0.8);
            }
          }
          
          .floating {
            animation: float 6s ease-in-out infinite;
          }
          
          @keyframes float {
            0% {
              transform: translateY(0px);
            }
            50% {
              transform: translateY(-15px);
            }
            100% {
              transform: translateY(0px);
            }
          }
          
          .particle {
            position: absolute;
            width: 6px;
            height: 6px;
            background: rgba(255, 255, 255, 0.5);
            border-radius: 50%;
            animation: drift 10s infinite linear;
            box-shadow: 0 0 3px rgba(255, 255, 255, 0.8);
          }
          
          .blue-particle {
            background: rgba(96, 165, 250, 0.6);
            box-shadow: 0 0 5px rgba(59, 130, 246, 0.9);
          }
          
          .light-effect {
            position: absolute;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: radial-gradient(circle at 70% 20%, rgba(56, 189, 248, 0.15) 0%, rgba(59, 130, 246, 0) 60%);
            z-index: 1;
            pointer-events: none;
            animation: pulse-light 10s infinite alternate;
          }
          
          @keyframes pulse-light {
            0% { opacity: 0.5; }
            100% { opacity: 1; }
          }
          
          .water-drops {
            position: absolute;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            overflow: hidden;
            pointer-events: none;
            z-index: 1;
          }
          
          .water-drop {
            position: absolute;
            width: 25px;
            height: 25px;
            background: radial-gradient(circle at 30% 30%, rgba(255, 255, 255, 0.8), rgba(147, 197, 253, 0.3));
            border-radius: 50%;
            filter: blur(1px);
            opacity: 0;
            transform: scale(0);
            animation: drop-fall 10s infinite linear;
          }
          
          .water-drop:nth-child(1) {
            top: -30px;
            left: 20%;
            animation-delay: 0s;
          }
          
          .water-drop:nth-child(2) {
            top: -30px;
            left: 65%;
            animation-delay: 3s;
          }
          
          .water-drop:nth-child(3) {
            top: -30px;
            left: 40%;
            animation-delay: 7s;
          }
          
          .cloud-effect {
            position: absolute;
            width: 40%;
            height: 40%;
            background: radial-gradient(ellipse at center, rgba(59, 130, 246, 0.35) 0%, rgba(37, 99, 235, 0.25) 40%, rgba(37, 99, 235, 0) 70%);
            border-radius: 50%;
            filter: blur(45px);
            opacity: 0.75;
            z-index: 1;
            pointer-events: none;
            animation: cloud-float 20s infinite alternate ease-in-out;
          }
          
          .top-left {
            top: 0;
            left: 0;
            transform: translate(-20%, -20%) scale(1.5);
          }
          
          .bottom-right {
            bottom: 0;
            right: 0;
            transform: translate(20%, 20%) scale(2);
            animation-delay: 5s;
          }
          
          .top-right {
            top: 0;
            right: 0;
            transform: translate(20%, -20%) scale(1.8);
            animation-delay: 8s;
            opacity: 0.6;
          }
          
          @keyframes cloud-float {
            0% {
              filter: blur(45px);
              opacity: 0.65;
            }
            50% {
              filter: blur(55px);
              opacity: 0.8;
            }
            100% {
              filter: blur(45px);
              opacity: 0.65;
            }
          }
          
          .particle:nth-child(1) {
            top: 15%;
            left: 10%;
            animation-duration: 15s;
          }
          
          .particle:nth-child(2) {
            top: 25%;
            right: 15%;
            animation-duration: 18s;
            animation-delay: 1s;
          }
          
          .particle:nth-child(3) {
            bottom: 20%;
            left: 20%;
            animation-duration: 12s;
            animation-delay: 2s;
          }
          
          .particle:nth-child(4) {
            top: 40%;
            right: 25%;
            animation-duration: 20s;
            animation-delay: 0.5s;
          }
          
          .particle:nth-child(5) {
            bottom: 35%;
            left: 40%;
            animation-duration: 16s;
            animation-delay: 2.5s;
          }
          
          @keyframes drift {
            0% {
              transform: translateY(0) translateX(0);
              opacity: 0;
            }
            20% {
              opacity: 0.8;
            }
            80% {
              opacity: 0.8;
            }
            100% {
              transform: translateY(-200px) translateX(100px);
              opacity: 0;
            }
          }
          
          /* Mejora de nitidez para la imagen en desktop */
          .desktop-sharp-image {
            image-rendering: -webkit-optimize-contrast;
            transform: translateZ(0);
            backface-visibility: hidden;
            box-shadow: inset 0 0 100px rgba(30, 58, 138, 0.2); /* Viñeteado azulado más sutil */
          }
        }
      `;
      document.head.appendChild(style);

      return () => {
        document.head.removeChild(style);
      };
    }
  }, []);

  return (
    <section className="relative w-full min-h-screen flex items-center overflow-hidden">
      {/* Color de fondo para precarga - visible instantáneamente */}
      <div className="absolute inset-0 bg-gradient-to-b from-blue-900 to-blue-950 z-0"></div>
      
      {/* Partículas flotantes (solo desktop) */}
      {!isMobile && (
        <>
          <div className="particle blue-particle"></div>
          <div className="particle blue-particle"></div>
          <div className="particle blue-particle"></div>
          <div className="particle small-particle"></div>
          <div className="particle small-particle"></div>
          <div className="water-drops">
            <div className="water-drop"></div>
            <div className="water-drop"></div>
            <div className="water-drop"></div>
          </div>
          <div className="light-effect"></div>
        </>
      )}
      
      {/* Contenedor de parallax con imagen real */}
      <div 
        ref={parallaxRef}
        className={`absolute inset-0 transition-opacity duration-500 overflow-hidden ${imageLoaded ? 'opacity-100' : 'opacity-0'}`}
        style={{
          willChange: 'transform',
          zIndex: 1
        }}
      >
        {/* Imagen de fondo - desktop o mobile según dispositivo */}
        <div 
          ref={imageRef}
          className={`absolute inset-0 w-full h-full bg-cover bg-center desktop-image-filter ${!isMobile ? 'desktop-sharp-image' : ''}`}
          style={{
            backgroundImage: isMobile 
              ? "url('/images/water-hero-mobile.webp')" 
              : "url('/images/water-hero-des.webp')",
            backgroundSize: "cover",
            backgroundPosition: isMobile 
              ? (deviceWidth <= 375 ? "center 40%" : "center 35%") 
              : "center center",
            // Filtro diferenciado para desktop y mobile
            filter: isMobile
              ? 'brightness(1.0) contrast(1.05) saturate(1.05)'
              : 'brightness(0.8) contrast(1.3) saturate(0.95) hue-rotate(-15deg) sepia(0.25)', // Azul desvanecido más nítido pero más claro para desktop
            // No aplicamos transform aquí para evitar bugs de parallax
            willChange: 'auto'
          }}
        />
        
        {/* Efectos de nubes sobre la imagen (solo desktop) */}
        {!isMobile && (
          <>
            <div className="cloud-effect top-left"></div>
            <div className="cloud-effect bottom-right"></div>
            <div className="cloud-effect top-right"></div>
          </>
        )}
      </div>
      
      {/* Overlay con gradiente azul mejorado para desktop */}
      {!isMobile ? (
        <>
          <div className="absolute inset-0 bg-gradient-to-b from-blue-950/45 via-blue-900/20 to-blue-950/50 z-2" />
          <div className="absolute inset-0 bg-gradient-to-r from-blue-950/30 via-transparent to-blue-950/30 z-2" />
        </>
      ) : (
        <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-blue-900/20 to-black/40 z-2" /> 
      )}
      
      {/* Contenido principal (no se mueve con parallax) */}
      <div className="relative z-10 container mx-auto px-4 sm:px-6 lg:px-8 py-20 sm:py-24 md:py-32 text-center w-full">
        <div className="max-w-4xl mx-auto">
          {/* Título con efecto de máquina de escribir */}
          <div className="mb-4 sm:mb-8 md:mb-10 px-2 sm:px-0">
            <h1 className={`font-serif text-white tracking-tight leading-snug sm:leading-normal md:leading-relaxed text-2xl sm:text-4xl md:text-5xl lg:text-6xl ${!isMobile ? 'hero-title-enhanced bg-clip-text' : 'title-shadow'}`}>
              {currentText}
              <span 
                className={`inline-block w-1.5 h-[0.8em] sm:h-[1em] bg-blue-300 ml-1 align-middle ${showCursor ? 'opacity-100' : 'opacity-0'}`}
                style={{ 
                  transition: 'opacity 0.2s ease',
                  boxShadow: !isMobile ? '0 0 15px rgba(147, 197, 253, 0.9)' : '0 0 10px rgba(147, 197, 253, 0.9)',
                  verticalAlign: 'middle'
                }}
              />
            </h1>
          </div>
          
          {/* Línea decorativa mejorada para desktop */}
          <div className={`h-1 bg-gradient-to-r from-blue-300 via-blue-500 to-blue-300 mx-auto mb-4 sm:mb-6 md:mb-8 rounded-full ${!isMobile ? 'w-40 sm:w-48 shine-effect animate-pulse' : 'w-24 sm:w-32'}`} />
          
          {/* Descripción con estilo mejorado - SOLO CAMBIO AQUÍ */}
          <p className={`text-sm sm:text-base md:text-lg mb-6 sm:mb-8 md:mb-10 leading-relaxed max-w-3xl mx-auto px-2 sm:px-0 ${
            !isMobile 
              ? 'text-white font-medium bg-blue-900/30 p-4 rounded-lg backdrop-blur-sm border border-white/20 shadow-lg'
              : 'text-white font-normal bg-blue-900/40 p-3 rounded-lg backdrop-blur-sm'
          }`}>
            Ahorra dinero y contribuye al cuidado del planeta con nuestra solución 
            integral para el control y optimización del agua en tu hogar.
          </p>
          
          {/* Botones con mejor responsividad y efectos visuales para desktop */}
          <div className={`flex flex-col items-center justify-center gap-3 sm:gap-4 max-w-xs sm:max-w-md mx-auto mb-6 sm:mb-8 md:mb-10 ${!isMobile ? 'sm:flex-row' : ''}`}>
            <Link 
              href="#calculator" 
              className={`w-full sm:w-auto px-4 sm:px-6 py-2 sm:py-3 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-lg font-medium transition-all duration-300 shadow-lg hover:shadow-xl text-sm sm:text-base transform scale-90 sm:scale-100 hover:scale-95 sm:hover:scale-105 text-center ${!isMobile ? 'glow-button hover:from-blue-500 hover:to-blue-800' : 'hover:from-blue-700 hover:to-blue-800'}`}
            >
              Calcular mi consumo
            </Link>
            
            <Link 
              href="#tips" 
              className={`w-full sm:w-auto px-4 sm:px-6 py-2 sm:py-3 text-white rounded-lg backdrop-blur-sm font-medium transition-all duration-300 shadow-md hover:shadow-lg text-sm sm:text-base transform scale-90 sm:scale-100 hover:scale-95 sm:hover:scale-105 text-center ${!isMobile ? 'bg-white/25 hover:bg-white/35 border border-white/40' : 'bg-white/20 hover:bg-white/30 border border-white/30'}`}
            >
              Ver consejos
            </Link>
          </div>
          
          {/* Contador de usuarios con animación flotante para desktop */}
          <div className={`flex flex-col sm:flex-row items-center justify-center gap-2 sm:gap-3 ${!isMobile ? 'floating' : ''}`}>
            <div className="flex -space-x-2 sm:-space-x-3">
              {[1, 2, 3].map(num => (
                <div 
                  key={num}
                  className={`w-6 h-6 sm:w-8 sm:h-8 md:w-10 md:h-10 rounded-full bg-gradient-to-br from-blue-400 to-blue-600 border-2 border-white flex items-center justify-center text-xs font-bold text-white shadow-lg ${!isMobile ? 'animate-pulse' : ''}`}
                >
                  {num}
                </div>
              ))}
            </div>
            <p className="text-white text-xs sm:text-sm mt-2 sm:mt-0">
              Más de 1,000 hogares optimizando su consumo
            </p>
          </div>
        </div>
      </div>
      
      {/* Flecha indicadora de scroll para desktop */}
      {!isMobile && (
        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce hidden md:block">
          <svg className="w-10 h-10 text-white/70" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 14l-7 7m0 0l-7-7m7 7V3"></path>
          </svg>
        </div>
      )}
      
      <style jsx>{`
        .title-shadow {
          text-shadow: 0 2px 4px rgba(0, 0, 0, 0.7), 0 4px 8px rgba(0, 0, 0, 0.4);
          font-family: 'Playfair Display', 'Georgia', serif;
        }
        
        /* Mejoras de rendimiento para el parallax */
        @media (prefers-reduced-motion: reduce) {
          .parallax-bg {
            transform: none !important;
          }
        }
        
        @media (max-width: 640px) {
          .title-shadow {
            font-size: 1.75rem;
            line-height: 2rem;
          }
        }
        
        /* Efecto de destello en botones para desktop */
        @keyframes button-highlight {
          0%, 100% { box-shadow: 0 0 0 rgba(59, 130, 246, 0); }
          50% { box-shadow: 0 0 20px rgba(59, 130, 246, 0.6); }
        }
      `}</style>
    </section>
  );
};

export default Hero;