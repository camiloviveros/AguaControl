'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import Link from 'next/link';

const Hero = () => {
  const [currentText, setCurrentText] = useState('');
  const [showCursor, setShowCursor] = useState(true);
  const [videoLoaded, setVideoLoaded] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [scrollY, setScrollY] = useState(0);
  const [deviceWidth, setDeviceWidth] = useState(0);
  const parallaxRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  
  const fullText = 'Gestiona tu consumo de agua de manera inteligente';
  const typingSpeed = 120; // Más lento (valor más alto = más lento)
  const erasingSpeed = 60; // Más lento (valor más alto = más lento)
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

  // Manejo del video
  useEffect(() => {
    // Si el video está cargado y existe la referencia
    if (videoRef.current) {
      // Evento para cuando el video esté listo
      const handleVideoLoaded = () => {
        setVideoLoaded(true);
      };
      
      videoRef.current.addEventListener('loadeddata', handleVideoLoaded);
      
      // Si el video está en caché y ya está cargado
      if (videoRef.current.readyState >= 2) {
        setVideoLoaded(true);
      }
      
      return () => {
        if (videoRef.current) {
          videoRef.current.removeEventListener('loadeddata', handleVideoLoaded);
        }
      };
    }
    
    // Timeout de seguridad para mostrar el contenido incluso si hay problemas con el video
    const timer = setTimeout(() => {
      setVideoLoaded(true);
    }, 1000);
    
    return () => clearTimeout(timer);
  }, []);

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
          .desktop-video-filter::before {
            content: '';
            position: absolute;
            inset: 0;
            background-color: rgba(0, 0, 0, 0.3);
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
      
      {/* Contenedor de parallax con video de fondo */}
      <div 
        ref={parallaxRef}
        className="absolute inset-0 transition-opacity duration-500 overflow-hidden"
        style={{
          willChange: 'transform',
          zIndex: 1,
          opacity: videoLoaded ? 1 : 0
        }}
      >
        {/* Video de fondo */}
        <div className="absolute inset-0 w-full h-full overflow-hidden desktop-video-filter">
          <video 
            ref={videoRef}
            className="absolute w-full h-full object-cover"
            autoPlay
            loop
            muted
            playsInline
            style={{
              objectPosition: isMobile 
                ? (deviceWidth <= 375 ? "center 40%" : "center 35%") 
                : "center center",
              filter: !isMobile ? 'brightness(0.85) contrast(1.1)' : 'brightness(0.9)',
              // No aplicamos transform aquí para evitar bugs de parallax
              willChange: 'auto'
            }}
          >
            <source src="/videos/publicidad.mp4" type="video/mp4" />
            {/* Fallback en caso de que el navegador no soporte el video */}
            Tu navegador no soporta videos HTML5.
          </video>
        </div>
        
        {/* Efectos de nubes sobre el video (solo desktop) */}
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
          
          {/* Descripción con mejor visibilidad sin fondos */}
          <p className={`text-sm sm:text-base md:text-lg lg:text-xl mb-6 sm:mb-8 md:mb-10 leading-relaxed max-w-3xl mx-auto font-medium ${
            !isMobile 
              ? 'text-white px-4' 
              : 'text-white px-3'
          }`} style={{
            textShadow: !isMobile 
              ? '0 2px 4px rgba(0,0,0,0.9), 0 4px 12px rgba(0,0,0,0.8), 0 -2px 6px rgba(59,130,246,0.3)'
              : '0 2px 4px rgba(0,0,0,0.8), 0 4px 8px rgba(0,0,0,0.7)',
            letterSpacing: '0.02em',
            lineHeight: '1.8',
          }}>
            <span className="font-bold text-blue-100" style={{
              textShadow: '0 0 10px rgba(147,197,253,0.8), 0 2px 4px rgba(0,0,0,0.8)'
            }}>Ahorra dinero</span> y <span className="font-bold text-blue-100" style={{
              textShadow: '0 0 10px rgba(147,197,253,0.8), 0 2px 4px rgba(0,0,0,0.8)'
            }}>contribuye al cuidado del planeta</span> con nuestra solución 
            integral para el control y optimización del agua en tu hogar.
          </p>
          
          {/* Botones con mejor responsividad y efectos visuales para desktop */}
          <div className={`flex flex-col items-center justify-center gap-3 sm:gap-4 max-w-xs sm:max-w-md mx-auto ${!isMobile ? 'sm:flex-row' : ''}`}>
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