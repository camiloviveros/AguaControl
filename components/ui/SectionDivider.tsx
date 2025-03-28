'use client';

import { useEffect, useRef, useState, ReactNode } from 'react';

interface FadeInSectionProps {
  children: ReactNode;
  delay?: number;
  direction?: 'up' | 'down' | 'left' | 'right' | 'none';
  className?: string;
}

const FadeInSection = ({ 
  children, 
  delay = 0, 
  direction = 'up', 
  className = '' 
}: FadeInSectionProps) => {
  const [isVisible, setIsVisible] = useState(false);
  const domRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(entries => {
      // Si el componente está intersectando el viewport
      if (entries[0].isIntersecting) {
        // Establecemos un timeout opcional para el delay
        setTimeout(() => {
          setIsVisible(true);
          // Una vez que se ha mostrado, dejamos de observar
          if (domRef.current) observer.unobserve(domRef.current);
        }, delay);
      }
    }, { threshold: 0.15 }); // El elemento es visible cuando al menos 15% está en viewport
    
    if (domRef.current) {
      observer.observe(domRef.current);
    }
    
    return () => {
      if (domRef.current) observer.unobserve(domRef.current);
    };
  }, [delay]);

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