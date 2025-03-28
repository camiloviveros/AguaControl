'use client';

import { useRef, useEffect, useState } from 'react';
import Image from 'next/image';

const WaterIntakeTable = () => {
  // Referencias para animar elementos
  const sectionRef = useRef<HTMLDivElement>(null);
  const imageRef = useRef<HTMLDivElement>(null);
  const textRef = useRef<HTMLDivElement>(null);
  
  // Estado para controlar la ampliación de la imagen
  const [isImageEnlarged, setIsImageEnlarged] = useState(false);

  useEffect(() => {
    // Configuración del observador de intersección
    const observerOptions = {
      root: null,
      rootMargin: '-50px',
      threshold: [0.1, 0.2, 0.3],
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
            }, 150 * index);
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
    
    // Observar la sección de referencia si existe
    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => {
      observer.disconnect();
    };
  }, []);

  // Función para cerrar el modal
  const closeModal = () => {
    setIsImageEnlarged(false);
  };
  
  // Evento para cerrar el modal cuando se presiona la tecla Escape
  useEffect(() => {
    const handleEscKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        closeModal();
      }
    };
    
    if (isImageEnlarged) {
      document.addEventListener('keydown', handleEscKey);
      // Prevenir el scroll del body cuando el modal está abierto
      document.body.style.overflow = 'hidden';
    }
    
    return () => {
      document.removeEventListener('keydown', handleEscKey);
      document.body.style.overflow = 'auto';
    };
  }, [isImageEnlarged]);

  return (
    <section className="bg-gradient-to-br from-blue-50 to-blue-100 py-24 relative overflow-hidden" ref={sectionRef} id="water-intake">
      {/* Elementos decorativos de fondo */}
      <div className="absolute top-0 right-0 w-64 h-64 rounded-full bg-blue-200 opacity-20 transform translate-x-1/3 -translate-y-1/3"></div>
      <div className="absolute bottom-0 left-0 w-80 h-80 rounded-full bg-blue-300 opacity-10 transform -translate-x-1/3 translate-y-1/3"></div>
      
      {/* Modal para imagen ampliada */}
      {isImageEnlarged && (
        <div 
          className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4 md:p-8"
          onClick={closeModal}
        >
          <div 
            className="relative max-w-5xl w-full max-h-screen overflow-auto bg-white rounded-lg shadow-2xl" 
            onClick={(e) => e.stopPropagation()}
          >
            <button 
              className="absolute top-4 right-4 z-10 bg-gray-800 text-white rounded-full p-2 hover:bg-red-600 transition-colors"
              onClick={closeModal}
            >
              <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
              </svg>
            </button>
            <div className="overflow-auto p-2">
              <Image 
                src="/images/recomendaciones-ingesta-agua.jpg" 
                alt="Tabla de recomendaciones de ingesta de agua diaria" 
                width={1400} 
                height={1000}
                className="w-full h-auto"
              />
            </div>
            <div className="bg-white p-4 border-t">
              <h3 className="text-lg font-semibold text-gray-800 mb-1">Recomendaciones de ingesta de agua diaria (ml/día)</h3>
              <p className="text-sm text-gray-600">Valores de referencia según EFSA e IOM en ml/día para diferentes grupos de edad y sexo</p>
            </div>
          </div>
        </div>
      )}
      
      <div className="container-custom relative z-10">
        <div className="flex flex-col-reverse md:flex-row items-center justify-between gap-12">
          {/* Columna de texto */}
          <div className="md:w-1/2" ref={textRef}>
            <div className="inline-flex items-center mb-4 animate-element opacity-0 translate-y-8 transition-all duration-700 ease-out">
              <div className="h-px w-8 bg-blue-500 mr-3"></div>
              <span className="text-blue-600 font-semibold tracking-wider text-sm uppercase">Hidratación</span>
            </div>
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6 tracking-tight animate-element opacity-0 translate-y-8 transition-all duration-700 ease-out delay-100">
              Recomendaciones de ingesta diaria de agua
            </h2>
            <p className="text-gray-700 mb-6 text-lg leading-relaxed animate-element opacity-0 translate-y-8 transition-all duration-700 ease-out delay-150">
              El agua es esencial para la vida y mantener una hidratación adecuada es fundamental para nuestra salud. Las necesidades de agua varían según la edad, el sexo, el peso corporal y la actividad física.
            </p>
            <p className="text-gray-700 mb-6 text-lg leading-relaxed animate-element opacity-0 translate-y-8 transition-all duration-700 ease-out delay-200">
              La Autoridad Europea de Seguridad Alimentaria (EFSA) y el Instituto de Medicina (IOM) proporcionan recomendaciones sobre la cantidad de agua que debemos consumir diariamente para mantener una hidratación óptima.
            </p>
            <ul className="space-y-4 mb-8">
              <li className="flex items-start gap-3 text-gray-700 animate-element opacity-0 translate-y-8 transition-all duration-700 ease-out delay-250">
                <div className="mt-1 flex-shrink-0">
                  <svg className="h-5 w-5 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                  </svg>
                </div>
                <span className="text-base">Las mujeres adultas necesitan aproximadamente 2000-2300 ml al día</span>
              </li>
              <li className="flex items-start gap-3 text-gray-700 animate-element opacity-0 translate-y-8 transition-all duration-700 ease-out delay-300">
                <div className="mt-1 flex-shrink-0">
                  <svg className="h-5 w-5 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                  </svg>
                </div>
                <span className="text-base">Los hombres adultos necesitan aproximadamente 2500-3300 ml al día</span>
              </li>
              <li className="flex items-start gap-3 text-gray-700 animate-element opacity-0 translate-y-8 transition-all duration-700 ease-out delay-350">
                <div className="mt-1 flex-shrink-0">
                  <svg className="h-5 w-5 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                  </svg>
                </div>
                <span className="text-base">Mujeres embarazadas y en lactancia tienen requerimientos mayores</span>
              </li>
            </ul>
            <div className="animate-element opacity-0 translate-y-8 transition-all duration-700 ease-out delay-400">
              <a 
                href="#calculator" 
                className="inline-flex items-center px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-md transition-colors shadow-md"
              >
                Calcula tu consumo
                <svg className="ml-2 h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 8l4 4m0 0l-4 4m4-4H3"></path>
                </svg>
              </a>
            </div>
          </div>
          
          {/* Columna de imagen */}
          <div className="md:w-1/2" ref={imageRef}>
            <div className="rounded-lg overflow-hidden shadow-xl animate-element opacity-0 translate-x-8 transition-all duration-700 ease-out">
              {/* VERSIÓN MOBILE */}
              <div 
                className="relative cursor-pointer block md:hidden" 
                onClick={() => setIsImageEnlarged(true)}
              >
                <Image 
                  src="/images/recomendaciones-ingesta-agua.jpg" 
                  alt="Tabla de recomendaciones de ingesta de agua diaria" 
                  width={700} 
                  height={500}
                  className="w-full h-auto"
                />
                <div className="absolute inset-0 bg-black/20"></div>
                
                {/* Indicador de zoom */}
                <div className="absolute bottom-4 right-4 bg-blue-600 text-white p-2 rounded-full shadow-lg opacity-70 hover:opacity-100 transition-opacity">
                  <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM10 7v3m0 0v3m0-3h3m-3 0H7"></path>
                  </svg>
                </div>
              </div>
              
              {/* VERSIÓN DESKTOP - Modificada para quitar el fondo negro */}
              <div 
                className="relative cursor-pointer hidden md:block" 
                onClick={() => setIsImageEnlarged(true)}
              >
                <div className="w-full" style={{ position: 'relative', aspectRatio: '700/500' }}>
                  <Image 
                    src="/images/recomendaciones-ingesta-agua.jpg" 
                    alt="Tabla de recomendaciones de ingesta de agua diaria" 
                    fill
                    sizes="(min-width: 768px) 100vw, 50vw"
                    className="object-cover"
                  />
                </div>
                
                {/* Indicador de zoom */}
                <div className="absolute bottom-4 right-4 bg-blue-600 text-white p-2 rounded-full shadow-lg opacity-70 hover:opacity-100 transition-opacity">
                  <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM10 7v3m0 0v3m0-3h3m-3 0H7"></path>
                  </svg>
                </div>
              </div>
              
              <div className="bg-white p-4">
                <h3 className="text-lg font-semibold text-gray-800 mb-1">Recomendaciones por edad y sexo</h3>
                <p className="text-sm text-gray-600">Valores de referencia según EFSA e IOM en ml/día</p>
                <p className="text-xs text-blue-600 mt-2 italic">Toca la imagen para ampliarla</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default WaterIntakeTable;