'use client';

import { useEffect, useState } from 'react';

interface Feature {
  icon: JSX.Element;
  title: string;
  description: string;
}

const Features = () => {
  const [animatedItems, setAnimatedItems] = useState<number[]>([]);

  useEffect(() => {
    // Animación escalonada de los elementos
    const timer = setTimeout(() => {
      const interval = setInterval(() => {
        setAnimatedItems(prev => {
          if (prev.length >= features.length) {
            clearInterval(interval);
            return prev;
          }
          return [...prev, prev.length];
        });
      }, 150);
      
      return () => clearInterval(interval);
    }, 500);
    
    return () => clearTimeout(timer);
  }, []);

  const features: Feature[] = [
    {
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
        </svg>
      ),
      title: 'Calculadora Inteligente',
      description: 'Calcula tu consumo de agua de forma precisa basándose en los datos reales de tu hogar.'
    },
    {
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
        </svg>
      ),
      title: 'Consejos Personalizados',
      description: 'Recibe recomendaciones específicas para tu situación que te ayudarán a reducir tu consumo.'
    },
    {
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
        </svg>
      ),
      title: 'Comparativa de Consumo',
      description: 'Compara tu consumo con la media de hogares similares y visualiza tus progresos mes a mes.'
    },
    {
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      ),
      title: 'Alertas Inteligentes',
      description: 'Recibe alertas tempranas cuando se detectan consumos anormales o posibles fugas en tu sistema.'
    },
    {
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4" />
        </svg>
      ),
      title: 'Simulador de Ahorro',
      description: 'Visualiza cuánto podrías ahorrar aplicando diferentes estrategias y medidas de eficiencia.'
    },
    {
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
        </svg>
      ),
      title: 'Asistente IA',
      description: 'Consulta a nuestro asistente basado en inteligencia artificial para resolver todas tus dudas sobre consumo de agua.'
    }
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
      {features.map((feature, index) => (
        <div 
          key={index} 
          className={`
            card bg-white text-center p-6 transform transition-all duration-500 ease-out
            ${animatedItems.includes(index) ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'}
          `}
        >
          <div className="rounded-full bg-blue-50 p-3 inline-flex items-center justify-center mb-4">
            {feature.icon}
          </div>
          <h3 className="text-xl font-semibold mb-3">{feature.title}</h3>
          <p className="text-text-secondary">{feature.description}</p>
        </div>
      ))}
    </div>
  );
};

export default Features;