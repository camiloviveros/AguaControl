'use client';

import { useState, useEffect } from 'react';

interface Tip {
  category: string;
  title: string;
  description: string;
  savings: string;
  difficulty: 'Fácil' | 'Medio' | 'Difícil';
}

const WaterTips = () => {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [rotations, setRotations] = useState<number[]>([]);
  
  const tipsList: Tip[] = [
    {
      category: 'baño',
      title: 'Ducha rápida',
      description: 'Reducir el tiempo de ducha a 5 minutos puede ahorrar cantidades significativas de agua.',
      savings: 'Hasta 45 litros por ducha',
      difficulty: 'Fácil'
    },
    {
      category: 'baño',
      title: 'Grifos con aireadores',
      description: 'Instalar aireadores en los grifos reduce el flujo de agua manteniendo la presión.',
      savings: 'Hasta un 50% por grifo',
      difficulty: 'Fácil'
    },
    {
      category: 'cocina',
      title: 'Lavavajillas eficiente',
      description: 'Usar el lavavajillas sólo cuando esté lleno y en modo eco.',
      savings: 'Hasta 15 litros por lavado',
      difficulty: 'Fácil'
    },
    {
      category: 'cocina',
      title: 'Reutilizar agua',
      description: 'Guarda el agua que usas para lavar frutas y verduras para regar las plantas.',
      savings: 'Hasta 5 litros al día',
      difficulty: 'Fácil'
    },
    {
      category: 'jardín',
      title: 'Riego inteligente',
      description: 'Instala un sistema de riego por goteo y programa el riego temprano en la mañana o al anochecer.',
      savings: 'Hasta un 70% en riego',
      difficulty: 'Medio'
    },
    {
      category: 'jardín',
      title: 'Plantas nativas',
      description: 'Utiliza plantas adaptadas al clima local para reducir las necesidades de agua.',
      savings: 'Hasta un 60% en agua de jardín',
      difficulty: 'Medio'
    },
    {
      category: 'baño',
      title: 'Inodoro de doble descarga',
      description: 'Instala cisternas de doble pulsador para seleccionar la cantidad de agua adecuada en cada uso.',
      savings: 'Hasta 6 litros por descarga',
      difficulty: 'Difícil'
    },
    {
      category: 'general',
      title: 'Detección de fugas',
      description: 'Revisa regularmente las tuberías y grifos para detectar fugas pequeñas que pueden desperdiciar mucha agua.',
      savings: 'Hasta 90 litros al día',
      difficulty: 'Medio'
    },
    {
      category: 'general',
      title: 'Recoger agua de lluvia',
      description: 'Utiliza barriles o sistemas de recolección para aprovechar el agua de lluvia.',
      savings: 'Variable según climatología',
      difficulty: 'Medio'
    }
  ];

  const categories = ['all', 'baño', 'cocina', 'jardín', 'general'];
  
  const filteredTips = selectedCategory === 'all' 
    ? tipsList 
    : tipsList.filter(tip => tip.category === selectedCategory);

  // Generar rotaciones aleatorias solo en el cliente después del montaje del componente
  useEffect(() => {
    // Generar valores aleatorios para todas las tarjetas posibles
    const newRotations = tipsList.map(() => Math.random() * 1 - 0.5);
    setRotations(newRotations);
  }, []);

  // Regenerar rotaciones cuando cambie la categoría seleccionada
  useEffect(() => {
    const newRotations = filteredTips.map(() => Math.random() * 1 - 0.5);
    setRotations(newRotations);
  }, [selectedCategory]);

  return (
    <div id="tips" className="p-8 rounded-2xl" style={{
      background: 'linear-gradient(135deg, #2d3035 0%, #1e2124 100%)',
      boxShadow: '0 15px 35px rgba(0, 0, 0, 0.25), inset 0 1px 2px rgba(255, 255, 255, 0.1)'
    }}>
      <div className="flex justify-center mb-8 flex-wrap">
        <div className="bg-gray-200 rounded-full p-1.5 shadow-lg flex flex-wrap justify-center border border-gray-300" 
             style={{ boxShadow: '0 8px 20px rgba(0, 0, 0, 0.1), 0 2px 5px rgba(0, 0, 0, 0.15)' }}>
          {categories.map((category) => (
            <button
              key={category}
              onClick={() => setSelectedCategory(category)}
              className={`
                px-5 py-2 rounded-full text-sm font-medium transition-all duration-300 ease-in-out
                ${selectedCategory === category
                  ? 'bg-gradient-to-r from-gray-700 to-gray-800 text-white shadow-md'
                  : 'text-gray-800 hover:bg-gray-300 hover:shadow-sm'
                }
                m-1
              `}
              style={{
                boxShadow: selectedCategory === category 
                  ? '0 3px 10px rgba(0, 0, 0, 0.2)' 
                  : 'none',
                transition: 'all 0.3s ease'
              }}
              onMouseEnter={(e) => {
                if (selectedCategory !== category) {
                  e.currentTarget.style.transform = 'translateY(-2px)';
                }
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'translateY(0)';
              }}
            >
              {category === 'all' ? 'Todos' : category.charAt(0).toUpperCase() + category.slice(1)}
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredTips.map((tip, index) => (
          <div 
            key={index} 
            className="rounded-xl p-6 backdrop-filter backdrop-blur-sm transition-all duration-500 hover:scale-105"
            style={{
              background: 'rgba(245, 245, 245, 0.9)',
              boxShadow: '0 10px 25px rgba(0, 0, 0, 0.2), 0 5px 12px rgba(0, 0, 0, 0.15), inset 0 -1px 4px rgba(0, 0, 0, 0.05)',
              borderTop: '1px solid rgba(255, 255, 255, 0.9)',
              borderLeft: '1px solid rgba(255, 255, 255, 0.9)',
              borderRadius: '16px',
              transform: rotations[index] ? `rotate(${rotations[index]}deg)` : 'rotate(0deg)',
              transition: 'all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275)'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = 'translateY(-10px) rotate(0deg)';
              e.currentTarget.style.boxShadow = '0 20px 30px rgba(0, 0, 0, 0.2), 0 10px 15px rgba(0, 0, 0, 0.1)';
            }}
            onMouseLeave={(e) => {
              const rotation = rotations[index] || 0;
              e.currentTarget.style.transform = `rotate(${rotation}deg)`;
              e.currentTarget.style.boxShadow = '0 10px 25px rgba(0, 0, 0, 0.2), 0 5px 12px rgba(0, 0, 0, 0.15), inset 0 -1px 4px rgba(0, 0, 0, 0.05)';
            }}
          >
            <div className="flex justify-between items-start mb-4">
              <h3 className="text-lg font-bold text-gray-900" style={{ textShadow: '0 1px 1px rgba(255,255,255,0.8)' }}>{tip.title}</h3>
              <span className={`
                text-xs px-3 py-1 rounded-full font-medium ${
                  tip.difficulty === 'Fácil' 
                    ? 'bg-gradient-to-r from-green-100 to-green-200 text-green-800 border border-green-200 shadow-sm shadow-green-200/50' 
                    : tip.difficulty === 'Medio'
                      ? 'bg-gradient-to-r from-yellow-100 to-yellow-200 text-yellow-800 border border-yellow-200 shadow-sm shadow-yellow-200/50'
                      : 'bg-gradient-to-r from-red-100 to-red-200 text-red-800 border border-red-200 shadow-sm shadow-red-200/50'
                }`
              }>
                {tip.difficulty}
              </span>
            </div>
            <p className="text-sm mb-5 text-gray-800 leading-relaxed">{tip.description}</p>
            <div className="mt-auto pt-3 border-t border-gray-300/50" style={{ boxShadow: '0 -1px 0 rgba(255,255,255,0.5)' }}>
              <div className="text-sm font-medium text-gray-900 flex items-center">
                <svg className="w-4 h-4 mr-1 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
                <span>Ahorro potencial: <span className="font-bold text-gray-900" style={{ textShadow: '0 1px 0 rgba(255,255,255,0.8)' }}>{tip.savings}</span></span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default WaterTips;