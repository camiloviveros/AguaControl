'use client';

import { useEffect, useRef, useState, ReactNode } from 'react';

interface FadeInSectionProps {
  children: ReactNode;
  delay?: number;
  direction?: 'up' | 'down' | 'left' | 'right' | 'none';
  className?: string;
  preventScroll?: boolean; // Nueva propiedad para controlar si se previene el scroll
}

const FadeInSection = ({ 
  children, 
  delay = 0, 
  direction = 'up', 
  className = '',
  preventScroll = false // Por defecto, no previene el scroll
}: FadeInSectionProps) => {
  const [isVisible, setIsVisible] = useState(false);
  const domRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Guardar la posición de scroll inicial si preventScroll es true
    const initialScrollPos = preventScroll ? window.scrollY : null;
    
    const observer = new IntersectionObserver(entries => {
      // Si el componente está intersectando el viewport
      if (entries[0].isIntersecting) {
        // Si preventScroll es true y ha habido un cambio en la posición de scroll, restauramos
        if (preventScroll && initialScrollPos !== null && window.scrollY !== initialScrollPos) {
          window.scrollTo(0, initialScrollPos);
        }
        
        // Establecemos un timeout opcional para el delay
        setTimeout(() => {
          setIsVisible(true);
          // Una vez que se ha mostrado, dejamos de observar
          if (domRef.current) observer.unobserve(domRef.current);
        }, delay);
      }
    }, { 
      threshold: 0.15, // El elemento es visible cuando al menos 15% está en viewport
      // Agregamos root margin negativo para comenzar la animación antes de entrar completamente al viewport
      rootMargin: '0px 0px -10% 0px'
    });
    
    if (domRef.current) {
      observer.observe(domRef.current);
    }
    
    // Si preventScroll es true, añadimos un evento de scroll para mantener la posición
    let scrollTimeout: NodeJS.Timeout | null = null;
    
    if (preventScroll && initialScrollPos !== null) {
      const handleScroll = () => {
        if (scrollTimeout) clearTimeout(scrollTimeout);
        
        scrollTimeout = setTimeout(() => {
          // Solo restauramos si ha pasado poco tiempo desde la carga
          const timeSinceLoad = Date.now() - (window as any).pageLoadTime || 0;
          if (timeSinceLoad < 2000) { // Solo los primeros 2 segundos
            window.scrollTo(0, initialScrollPos);
          }
        }, 50);
      };
      
      // Almacenamos el tiempo de carga para saber cuándo dejar de prevenir el scroll
      if (!(window as any).pageLoadTime) {
        (window as any).pageLoadTime = Date.now();
      }
      
      window.addEventListener('scroll', handleScroll, { passive: true });
      
      return () => {
        if (domRef.current) observer.unobserve(domRef.current);
        window.removeEventListener('scroll', handleScroll);
        if (scrollTimeout) clearTimeout(scrollTimeout);
      };
    }
    
    return () => {
      if (domRef.current) observer.unobserve(domRef.current);
    };
  }, [delay, preventScroll]);

  // Configuramos las clases de transformación según la dirección
  const getTransformClass = () => {
    if (!isVisible) {
      switch (direction) {
        case 'up': return 'translate-y-16';
        case 'down': return '-translate-y-16';
        case 'left': return 'translate-x-16';
        case 'right': return '-translate-x-16';
        case 'none': return '';
        default: return 'translate-y-16';
      }
    }
    return 'translate-y-0 translate-x-0';
  };

  return (
    <div
      ref={domRef}
      className={`
        transition-all duration-700 ease-out
        ${isVisible ? 'opacity-100' : 'opacity-0'}
        ${getTransformClass()}
        ${className}
      `}
    >
      {children}
    </div>
  );
};

export default FadeInSection;