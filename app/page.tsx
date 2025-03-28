'use client';

import { useEffect, useRef, useState } from 'react';
import Hero from '@/components/home/Hero';
import Features from '@/components/home/Features';
import WaterCalculator from '@/components/calculator/WaterCalculator';
import EcoProducts from '@/components/products/EcoProducts';
import ConsumptionComparison from '@/components/comparison/ConsumptionComparison';
import SavingsSimulator from '@/components/simulator/SavingsSimulator';
import AiAssistant from '@/components/ai/AiAssistant';
import WaterTips from '@/components/tips/WaterTips';
import WaterIntakeTable from '@/components/nutrition/WaterIntakeTable';
import WaterImportance from '@/components/awareness/WaterImportance';

export default function Home() {
  // Referencias para las secciones que queremos animar
  const assistantSectionRef = useRef<HTMLDivElement>(null);
  const comparisonSectionRef = useRef<HTMLDivElement>(null);
  
  // Controlar cuando permitir animaciones y scroll
  const [allowAnimations, setAllowAnimations] = useState(false);

  useEffect(() => {
    // Forzar el scroll al inicio cuando el componente se monta
    window.scrollTo(0, 0);
    document.documentElement.scrollTop = 0;
    document.body.scrollTop = 0; // Para Safari
    
    // Prevenir scroll automático durante los primeros segundos
    const initialPosition = window.scrollY;
    
    // Función para restaurar la posición si cambia
    const preventScroll = () => {
      window.scrollTo(0, initialPosition);
    };
    
    // Añadimos el listener para prevenir scroll automático
    window.addEventListener('scroll', preventScroll);
    
    // Después de un tiempo, permitimos animaciones y scroll normal
    const timeout = setTimeout(() => {
      window.removeEventListener('scroll', preventScroll);
      setAllowAnimations(true);
    }, 800); // Esperar 800ms antes de permitir animaciones
    
    return () => {
      window.removeEventListener('scroll', preventScroll);
      clearTimeout(timeout);
    };
  }, []);

  useEffect(() => {
    // Solo configurar IntersectionObserver después de que se permitan animaciones
    if (!allowAnimations) return;

    // Configuración del observador de intersección
    const observerOptions = {
      root: null,
      rootMargin: '-100px', // Detecta un poco antes de que entre completamente en la vista
      threshold: [0, 0.1, 0.2, 0.3], // Múltiples umbrales para mayor sensibilidad
    };

    // Callback para cuando los elementos entran o salen del viewport
    const handleIntersection = (entries: IntersectionObserverEntry[], observer: IntersectionObserver): void => {
      entries.forEach((entry: IntersectionObserverEntry) => {
        const elementsToAnimate = entry.target.querySelectorAll('.animate-element');
        
        if (entry.isIntersecting) {
          // Cuando entra en el viewport, activamos la animación
          elementsToAnimate.forEach((element: Element, index: number) => {
            setTimeout(() => {
              (element as HTMLElement).classList.add('animate-in');
            }, 100 * index);
          });
        } else {
          // Cuando sale completamente del viewport, removemos la clase para que se anime nuevamente al volver
          elementsToAnimate.forEach((element: Element) => {
            (element as HTMLElement).classList.remove('animate-in');
          });
        }
      });
    };

    // Crear el observador
    const observer = new IntersectionObserver(handleIntersection, observerOptions);
    
    // Observar las secciones de referencia si existen
    if (assistantSectionRef.current) {
      observer.observe(assistantSectionRef.current);
    }
    
    if (comparisonSectionRef.current) {
      observer.observe(comparisonSectionRef.current);
    }

    // Función para manejar el scroll y forzar la activación/desactivación
    const handleScroll = () => {
      const sections = [assistantSectionRef.current, comparisonSectionRef.current];
      
      sections.forEach(section => {
        if (!section) return;
        
        const rect = section.getBoundingClientRect();
        const isVisible = 
          rect.top < window.innerHeight && 
          rect.bottom > 0;
        
        // Si está fuera de la vista, asegurarse de quitar todas las animaciones
        if (!isVisible) {
          const elementsToReset = section.querySelectorAll('.animate-element');
          elementsToReset.forEach(element => {
            (element as HTMLElement).classList.remove('animate-in');
          });
        }
      });
    };

    // Añadir evento de scroll para asegurar que las animaciones se reseteen correctamente
    window.addEventListener('scroll', handleScroll);

    // Limpieza al desmontar
    return () => {
      observer.disconnect();
      window.removeEventListener('scroll', handleScroll);
    };
  }, [allowAnimations]); // Dependencia en allowAnimations

  return (
    <div className="bg-gray-50 overflow-x-hidden font-sans" id="home">
      {/* Hero Section */}
      <Hero />
      
      {/* Features Section */}
      <section className="bg-white py-24 relative">
        <div className="container-custom relative z-10">
          <div className="text-center mb-16">
            <div className="inline-flex items-center justify-center mb-4">
              <div className="h-px w-8 bg-blue-500 mr-3"></div>
              <span className="text-blue-600 font-semibold tracking-wider text-sm uppercase">Funcionalidades</span>
              <div className="h-px w-8 bg-blue-500 ml-3"></div>
            </div>
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4 tracking-tight">¿Cómo podemos ayudarte?</h2>
            <p className="text-gray-600 max-w-2xl mx-auto text-lg leading-relaxed">
              Descubre todas nuestras herramientas para ayudarte a gestionar y optimizar tu consumo de agua.
            </p>
          </div>
          <Features />
        </div>
      </section>
      
      {/* AI Assistant Section */}
      <section className="bg-blue-50 py-24" ref={assistantSectionRef} id="assistant">
        <div className="container-custom">
          <div className="flex flex-col md:flex-row items-center justify-between gap-16">
            <div className="md:w-1/2">
              <div className="inline-flex items-center mb-4 animate-element opacity-0 translate-x-[-50px] transition-all duration-500 ease-out">
                <div className="h-px w-8 bg-blue-500 mr-3"></div>
                <span className="text-blue-600 font-semibold tracking-wider text-sm uppercase">Asistente Virtual</span>
              </div>
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6 tracking-tight animate-element opacity-0 translate-x-[-50px] transition-all duration-500 ease-out delay-100">Resuelve tus dudas al instante</h2>
              <p className="text-gray-600 mb-8 text-lg leading-relaxed animate-element opacity-0 translate-x-[-50px] transition-all duration-500 ease-out delay-150">
                ¿Tienes dudas específicas sobre el ahorro de agua? Nuestro asistente virtual especializado está aquí para ayudarte con información precisa y consejos personalizados.
              </p>
              <ul className="space-y-4 mb-8">
                <li className="flex items-start gap-3 text-gray-700 animate-element opacity-0 translate-x-[-50px] transition-all duration-500 ease-out delay-200">
                  <div className="mt-1 flex-shrink-0">
                    <svg className="h-5 w-5 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                    </svg>
                  </div>
                  <span className="text-base">Respuestas precisas sobre ahorro de agua</span>
                </li>
                <li className="flex items-start gap-3 text-gray-700 animate-element opacity-0 translate-x-[-50px] transition-all duration-500 ease-out delay-250">
                  <div className="mt-1 flex-shrink-0">
                    <svg className="h-5 w-5 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                    </svg>
                  </div>
                  <span className="text-base">Consejos personalizados para tu hogar</span>
                </li>
                <li className="flex items-start gap-3 text-gray-700 animate-element opacity-0 translate-x-[-50px] transition-all duration-500 ease-out delay-300">
                  <div className="mt-1 flex-shrink-0">
                    <svg className="h-5 w-5 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                    </svg>
                  </div>
                  <span className="text-base">Resolución de dudas sobre facturas y consumos</span>
                </li>
              </ul>
            </div>
            <div className="md:w-1/2 animate-element opacity-0 translate-x-[50px] transition-all duration-500 ease-out delay-200">
              <div className="shadow-xl rounded-xl overflow-hidden">
                <AiAssistant />
              </div>
            </div>
          </div>
        </div>
      </section>
      
      {/* Calculator Section */}
      <section className="bg-white py-24" id="calculator">
        <div className="container-custom">
          <div className="text-center mb-16">
            <div className="inline-flex items-center justify-center mb-4">
              <div className="h-px w-8 bg-blue-500 mr-3"></div>
              <span className="text-blue-600 font-semibold tracking-wider text-sm uppercase">Calculadora</span>
              <div className="h-px w-8 bg-blue-500 ml-3"></div>
            </div>
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4 tracking-tight">Calcula y optimiza tu consumo</h2>
            <p className="text-gray-600 max-w-2xl mx-auto mb-8 text-lg leading-relaxed">
              Introduce tus datos para obtener una estimación precisa de tu consumo actual y descubre cómo puedes reducirlo de manera efectiva.
            </p>
            <div className="flex flex-col md:flex-row justify-center gap-12 mb-12">
              <div className="flex items-start gap-3 text-gray-700">
                <div className="mt-1 flex-shrink-0">
                  <svg className="h-5 w-5 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z"></path>
                  </svg>
                </div>
                <span className="text-base">Estimación precisa basada en datos reales</span>
              </div>
              <div className="flex items-start gap-3 text-gray-700">
                <div className="mt-1 flex-shrink-0">
                  <svg className="h-5 w-5 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z"></path>
                  </svg>
                </div>
                <span className="text-base">Consejos personalizados según tus resultados</span>
              </div>
            </div>
          </div>
          <div className="max-w-5xl mx-auto shadow-lg rounded-lg overflow-hidden">
            <WaterCalculator />
          </div>
        </div>
      </section>
      
      {/* Sección de Video - El Valor del Agua */}
      <section className="relative w-full overflow-hidden my-0">
        <div className="relative w-full h-screen max-h-[800px]">
          <video
            autoPlay
            loop
            muted
            playsInline
            className="object-cover w-full h-full"
          >
            <source src="/videos/publicidad.mp4" type="video/mp4" />
            Tu navegador no soporta la reproducción de video.
          </video>
          
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="text-center p-8 max-w-3xl">
              <h2 className="text-4xl md:text-6xl font-semibold text-white mb-6">El Valor del Agua</h2>
              <p className="text-white/90 text-lg max-w-xl mx-auto mb-8">
                Cada gota cuenta. Cada acción marca la diferencia en la preservación del recurso más valioso de nuestro planeta.
              </p>
              <div className="w-24 h-1 bg-blue-400 mx-auto mb-8"></div>
              <div className="flex flex-wrap justify-center gap-4">
                <a 
                  href="#tips" 
                  className="px-8 py-3 bg-blue-500 hover:bg-blue-600 text-white rounded-md transition-colors shadow-lg"
                >
                  Descubre cómo ahorrar
                </a>
                <a 
                  href="#calculator" 
                  className="px-8 py-3 bg-white/20 hover:bg-white/30 text-white rounded-md transition-colors border border-white/30"
                >
                  Calcula tu consumo
                </a>
              </div>
            </div>
          </div>
          
          {/* Indicador de desplazamiento */}
          <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce">
            <svg className="w-10 h-10 text-white opacity-70" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 14l-7 7m0 0l-7-7m7 7V3"></path>
            </svg>
          </div>
          
          {/* Elementos decorativos de agua */}
          <div className="absolute top-0 left-0 w-full h-16 bg-gradient-to-b from-blue-500/30 to-transparent"></div>
          <div className="absolute bottom-0 left-0 w-full h-16 bg-gradient-to-t from-blue-900/50 to-transparent"></div>
        </div>
      </section>
      
      {/* Resto de secciones igual... */}
      <section className="bg-blue-50 py-24" id="tips">
        <div className="container-custom">
          <div className="text-center mb-16">
            <div className="inline-flex items-center justify-center mb-4">
              <div className="h-px w-8 bg-blue-500 mr-3"></div>
              <span className="text-blue-600 font-semibold tracking-wider text-sm uppercase">Consejos</span>
              <div className="h-px w-8 bg-blue-500 ml-3"></div>
            </div>
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4 tracking-tight">Consejos y Alertas Personalizadas</h2>
            <p className="max-w-2xl mx-auto text-gray-600 text-lg leading-relaxed">
              Descubre consejos prácticos y personalizados para reducir tu consumo de agua en diferentes áreas de tu hogar.
            </p>
          </div>
          <div className="bg-white p-8 rounded-lg shadow-lg">
            <WaterTips />
          </div>
        </div>
      </section>
      
      {/* Comparison Section */}
      <section className="bg-white py-24" ref={comparisonSectionRef} id="comparison">
        <div className="container-custom">
          <div className="flex flex-col md:flex-row items-center justify-between gap-16 mb-12">
            <div className="md:w-1/2">
              <div className="inline-flex items-center mb-4 animate-element opacity-0 translate-x-[-50px] transition-all duration-500 ease-out">
                <div className="h-px w-8 bg-blue-500 mr-3"></div>
                <span className="text-blue-600 font-semibold tracking-wider text-sm uppercase">Comparativa</span>
              </div>
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6 tracking-tight animate-element opacity-0 translate-x-[-50px] transition-all duration-500 ease-out delay-100">Compara tu Consumo</h2>
              <p className="text-gray-600 mb-8 text-lg leading-relaxed animate-element opacity-0 translate-x-[-50px] transition-all duration-500 ease-out delay-150">
                Compara tu consumo con otros hogares similares y descubre dónde te encuentras en la escala de eficiencia.
              </p>
              <ul className="space-y-4">
                <li className="flex items-start gap-3 text-gray-700 animate-element opacity-0 translate-x-[-50px] transition-all duration-500 ease-out delay-200">
                  <div className="mt-1 flex-shrink-0">
                    <svg className="h-5 w-5 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"></path>
                    </svg>
                  </div>
                  <span className="text-base">Comparativa con hogares similares</span>
                </li>
                <li className="flex items-start gap-3 text-gray-700 animate-element opacity-0 translate-x-[-50px] transition-all duration-500 ease-out delay-250">
                  <div className="mt-1 flex-shrink-0">
                    <svg className="h-5 w-5 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"></path>
                    </svg>
                  </div>
                  <span className="text-base">Visualiza tu posición en la escala de eficiencia</span>
                </li>
              </ul>
            </div>
            <div className="md:w-1/2 animate-element opacity-0 translate-x-[50px] transition-all duration-500 ease-out delay-200">
              <div className="shadow-lg rounded-lg overflow-hidden">
                <ConsumptionComparison />
              </div>
            </div>
          </div>
        </div>
      </section>
      
      {/* Products Section */}
      <section className="bg-blue-50 py-24">
        <div className="container-custom">
          <div className="text-center mb-16">
            <div className="inline-flex items-center justify-center mb-4">
              <div className="h-px w-8 bg-blue-500 mr-3"></div>
              <span className="text-blue-600 font-semibold tracking-wider text-sm uppercase">Productos</span>
              <div className="h-px w-8 bg-blue-500 ml-3"></div>
            </div>
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4 tracking-tight">Productos Ecológicos Recomendados</h2>
            <p className="max-w-2xl mx-auto text-gray-600 text-lg leading-relaxed">
              Dispositivos y accesorios diseñados para ayudarte a ahorrar agua sin sacrificar confort.
            </p>
          </div>
          <div className="bg-white p-8 rounded-lg shadow-lg">
            <EcoProducts />
          </div>
        </div>
      </section>
      
      {/* Sección de Transición Parallax - Protección del Agua */}
      <section className="w-full relative overflow-hidden my-0 h-[600px]">
        <div 
          className="absolute inset-0 bg-cover bg-center transform scale-110"
          style={{
            backgroundImage: 'url("/images/water-pipe-4096x4096.jpg")', 
            backgroundAttachment: 'fixed',
            willChange: 'transform'
          }}
        ></div>
        <div className="absolute inset-0 bg-gradient-to-t from-blue-900/80 via-blue-800/50 to-transparent"></div>
        <div className="relative h-full flex items-center justify-center">
          <div className="container-custom text-center px-6">
            <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6 tracking-tight drop-shadow-lg">
              El Agua es Vida
            </h2>
            <div className="max-w-3xl mx-auto">
              <p className="text-white/95 text-lg md:text-xl lg:text-2xl leading-relaxed mb-8 drop-shadow-md">
                Cada gota cuenta en la preservación de nuestro recurso más valioso. Juntos podemos hacer la diferencia en la protección de las fuentes hídricas para las generaciones futuras.
              </p>
              <div className="flex flex-wrap justify-center gap-4">
                <a 
                  href="#simulator" 
                  className="px-8 py-3 bg-blue-500 hover:bg-blue-600 text-white rounded-md transition-colors shadow-lg"
                >
                  Simulador de ahorro
                </a>
                <a 
                  href="#calculator" 
                  className="px-8 py-3 bg-white/20 hover:bg-white/30 text-white rounded-md transition-colors border border-white/30"
                >
                  Calcula tu impacto
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>
      
      {/* Simulator Section */}
      <section className="bg-white py-24" id="simulator">
        <div className="container-custom">
          <div className="text-center mb-16">
            <div className="inline-flex items-center justify-center mb-4">
              <div className="h-px w-8 bg-blue-500 mr-3"></div>
              <span className="text-blue-600 font-semibold tracking-wider text-sm uppercase">Simulador</span>
              <div className="h-px w-8 bg-blue-500 ml-3"></div>
            </div>
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4 tracking-tight">Simulador de Ahorro</h2>
            <p className="text-gray-600 max-w-2xl mx-auto text-lg leading-relaxed">
              Calcula el potencial ahorro económico y ecológico que puedes conseguir implementando diferentes medidas.
            </p>
          </div>
          <div className="max-w-5xl mx-auto shadow-lg rounded-lg overflow-hidden">
            <SavingsSimulator />
          </div>
        </div>
      </section>

      {/* Sección de Recomendaciones de Ingesta de Agua */}
      <WaterIntakeTable />
      <WaterImportance /> 

      {/* Añade el CSS para las animaciones */}
      <style jsx global>{`
        .animate-element {
          will-change: opacity, transform;
          transition-property: opacity, transform;
        }
        
        .animate-element.animate-in {
          opacity: 1 !important;
          transform: translate(0, 0) !important;
        }
        
        @keyframes pulse {
          0% {
            transform: scale(1);
          }
          50% {
            transform: scale(1.05);
          }
          100% {
            transform: scale(1);
          }
        }
      `}</style>
    </div>
  );
}