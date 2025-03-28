'use client';

import { useRef, useEffect } from 'react';
import Image from 'next/image';

const WaterImportance = () => {
  // Referencias para animar elementos
  const sectionRef = useRef<HTMLDivElement>(null);
  
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

  return (
    <section className="py-24 relative overflow-hidden bg-gradient-to-r from-blue-50 to-teal-50" ref={sectionRef} id="importance">
      {/* Elementos decorativos de fondo */}
      <div className="absolute top-0 left-0 w-full h-64 bg-[url('/images/wave-pattern.svg')] bg-repeat opacity-10"></div>
      <div className="absolute bottom-0 right-0 w-72 h-72 rounded-full bg-blue-200 opacity-20 transform translate-x-1/4 translate-y-1/4"></div>
      <div className="absolute top-1/3 left-0 w-40 h-40 rounded-full bg-teal-100 opacity-30 transform -translate-x-1/2"></div>
      
      <div className="container mx-auto px-4 relative z-10">
        <div className="text-center mb-16">
          <div className="inline-flex items-center justify-center mb-4 animate-element opacity-0 translate-y-8 transition-all duration-700 ease-out">
            <div className="h-px w-8 bg-blue-400 mr-3"></div>
            <span className="text-gray-700 font-semibold tracking-wider text-sm uppercase">Conciencia Ambiental</span>
            <div className="h-px w-8 bg-blue-400 ml-3"></div>
          </div>
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 mb-6 tracking-tight animate-element opacity-0 translate-y-8 transition-all duration-700 ease-out delay-100">
            La importancia de cuidar cada gota
          </h2>
          <p className="text-gray-800 max-w-3xl mx-auto text-lg leading-relaxed animate-element opacity-0 translate-y-8 transition-all duration-700 ease-out delay-150">
            El agua es el recurso más valioso de nuestro planeta. Ahorrarla no es solo una responsabilidad, es una necesidad para garantizar un futuro sostenible.
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
          {/* Impacto Ambiental */}
          <div className="bg-white/80 backdrop-blur-sm rounded-xl p-6 shadow-lg border border-blue-100 animate-element opacity-0 translate-y-8 transition-all duration-700 ease-out delay-200">
            <div className="bg-blue-100 rounded-full w-14 h-14 flex items-center justify-center mb-6">
              <svg className="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
              </svg>
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-3">Impacto Ambiental</h3>
            <p className="text-gray-800 leading-relaxed mb-4">
              La escasez de agua afecta a los ecosistemas, reduce la biodiversidad y degrada los hábitats naturales. El 97.5% del agua del planeta es salada y solo el 2.5% es dulce, de la cual apenas un 0.3% está disponible para consumo humano.
            </p>
            <ul className="space-y-2 text-gray-800">
              <li className="flex items-start gap-2">
                <svg className="w-5 h-5 text-blue-500 mt-1 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                </svg>
                <span>La sobreexplotación de acuíferos está causando su agotamiento</span>
              </li>
              <li className="flex items-start gap-2">
                <svg className="w-5 h-5 text-blue-500 mt-1 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                </svg>
                <span>La contaminación del agua reduce su disponibilidad y daña los ecosistemas acuáticos</span>
              </li>
            </ul>
          </div>
          
          {/* Impacto Social */}
          <div className="bg-white/80 backdrop-blur-sm rounded-xl p-6 shadow-lg border border-blue-100 animate-element opacity-0 translate-y-8 transition-all duration-700 ease-out delay-250">
            <div className="bg-blue-100 rounded-full w-14 h-14 flex items-center justify-center mb-6">
              <svg className="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"></path>
              </svg>
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-3">Impacto Social</h3>
            <p className="text-gray-800 leading-relaxed mb-4">
              Aproximadamente 2.200 millones de personas en el mundo no tienen acceso seguro al agua potable. La escasez de agua provoca conflictos, migraciones forzadas y profundiza la desigualdad social y económica.
            </p>
            <ul className="space-y-2 text-gray-800">
              <li className="flex items-start gap-2">
                <svg className="w-5 h-5 text-blue-500 mt-1 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                </svg>
                <span>El 80% de las enfermedades en países en desarrollo están relacionadas con agua contaminada</span>
              </li>
              <li className="flex items-start gap-2">
                <svg className="w-5 h-5 text-blue-500 mt-1 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                </svg>
                <span>Las mujeres y niñas de muchos países dedican hasta 6 horas diarias a recolectar agua</span>
              </li>
            </ul>
          </div>
          
          {/* Impacto Económico */}
          <div className="bg-white/80 backdrop-blur-sm rounded-xl p-6 shadow-lg border border-blue-100 animate-element opacity-0 translate-y-8 transition-all duration-700 ease-out delay-300">
            <div className="bg-blue-100 rounded-full w-14 h-14 flex items-center justify-center mb-6">
              <svg className="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
              </svg>
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-3">Impacto Económico</h3>
            <p className="text-gray-800 leading-relaxed mb-4">
              La crisis del agua podría reducir el PIB mundial hasta en un 6% para 2050 en algunas regiones. El ahorro de agua no solo beneficia al medio ambiente, también genera importantes ahorros económicos en facturas y mantenimiento.
            </p>
            <ul className="space-y-2 text-gray-800">
              <li className="flex items-start gap-2">
                <svg className="w-5 h-5 text-blue-500 mt-1 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                </svg>
                <span>Las pérdidas agrícolas por escasez de agua superan los 60.000 millones de dólares anuales</span>
              </li>
              <li className="flex items-start gap-2">
                <svg className="w-5 h-5 text-blue-500 mt-1 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                </svg>
                <span>Una familia puede ahorrar hasta 30% en facturas con medidas simples de ahorro de agua</span>
              </li>
            </ul>
          </div>
        </div>
        
        {/* Call to Action */}
        <div className="max-w-4xl mx-auto bg-gradient-to-r from-blue-400 to-teal-400 rounded-xl p-8 shadow-xl animate-element opacity-0 translate-y-8 transition-all duration-700 ease-out delay-350">
          <div className="flex flex-col md:flex-row items-center gap-8">
            <div className="md:w-2/3">
              <h3 className="text-2xl font-bold text-white mb-3">Tu acción marca la diferencia</h3>
              <p className="text-white/90 leading-relaxed mb-4">
                Cada gota cuenta. Implementando pequeños cambios en tu hogar y rutina diaria, puedes contribuir significativamente a la conservación del agua y a un futuro sostenible para todos.
              </p>
              <div className="flex flex-wrap gap-4">
                <a 
                  href="#calculator" 
                  className="px-6 py-3 bg-white text-blue-600 font-medium rounded-lg hover:bg-blue-50 transition-colors shadow-md"
                >
                  Calcula tu consumo
                </a>
                <a 
                  href="#tips" 
                  className="px-6 py-3 bg-transparent text-white border border-white/50 font-medium rounded-lg hover:bg-blue-400/50 transition-colors"
                >
                  Descubre cómo ahorrar
                </a>
              </div>
            </div>
            <div className="md:w-1/3 flex justify-center">
              <div className="relative w-40 h-40">
                <div className="absolute inset-0 flex items-center justify-center">
                  <svg className="w-full h-full text-white/90" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22Z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                    <path d="M12 6V12L16 14" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                    <path d="M2.45 14.9998C3.5103 18.8372 7.48651 21.5022 12 21.5022C16.5135 21.5022 20.4897 18.8372 21.55 14.9998" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </div>
                <div className="absolute inset-0 flex items-center justify-center text-center">
                  <p className="text-sm font-medium text-gray-900 bg-white/80 px-2 py-1 rounded-lg">El momento<br/>de actuar<br/>es ahora</p>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        <div className="mt-16 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Estadística 1 */}
          <div className="bg-white/50 border border-blue-100 rounded-lg p-5 animate-element opacity-0 translate-y-8 transition-all duration-700 ease-out delay-400">
            <h4 className="text-gray-900 text-lg font-semibold mb-1">3.900 millones</h4>
            <p className="text-gray-800">de personas experimentarán escasez de agua para 2030 si no cambiamos nuestros hábitos.</p>
          </div>
          
          {/* Estadística 2 */}
          <div className="bg-white/50 border border-blue-100 rounded-lg p-5 animate-element opacity-0 translate-y-8 transition-all duration-700 ease-out delay-450">
            <h4 className="text-gray-900 text-lg font-semibold mb-1">110 litros</h4>
            <p className="text-gray-800">es el consumo medio diario de agua por persona, pero podría reducirse hasta un 30%.</p>
          </div>
          
          {/* Estadística 3 */}
          <div className="bg-white/50 border border-blue-100 rounded-lg p-5 animate-element opacity-0 translate-y-8 transition-all duration-700 ease-out delay-500">
            <h4 className="text-gray-900 text-lg font-semibold mb-1">70%</h4>
            <p className="text-gray-800">del agua dulce se destina a la agricultura. Promover técnicas eficientes de riego es fundamental.</p>
          </div>
          
          {/* Estadística 4 */}
          <div className="bg-white/50 border border-blue-100 rounded-lg p-5 animate-element opacity-0 translate-y-8 transition-all duration-700 ease-out delay-550">
            <h4 className="text-gray-900 text-lg font-semibold mb-1">10.000 litros</h4>
            <p className="text-gray-800">de agua se pierden anualmente por un grifo que gotea. Las pequeñas fugas importan.</p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default WaterImportance;