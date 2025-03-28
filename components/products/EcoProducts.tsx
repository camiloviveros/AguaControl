"use client";

import { useState, useEffect } from 'react';
import { ArrowUpRight } from 'lucide-react';

interface EcoProduct {
  id: number;
  name: string;
  category: string;
  description: string;
  savings: string;
  priceRange: string;
  imageUrl: string;
}

const EcoProducts = () => {
  const [products, setProducts] = useState<EcoProduct[]>([
    {
      id: 1,
      name: 'Grifo Reductor de Caudal',
      category: 'Baño y Cocina',
      description: 'Reduce el consumo de agua hasta un 60% sin perder presión ni confort.',
      savings: 'Hasta 12.000 litros al año',
      priceRange: '$40.000 - $120.000',
      imageUrl: 'https://live.staticflickr.com/65535/54414318428_2cfd2f1db2_n.jpg'
    },
    {
      id: 2,
      name: 'Cabezal de Ducha Ecológico',
      category: 'Baño',
      description: 'Tecnología de microburbujas que reduce el consumo manteniendo la sensación de presión.',
      savings: 'Hasta 15.000 litros al año',
      priceRange: '$80.000 - $160.000',
      imageUrl: 'https://live.staticflickr.com/65535/54413203017_903310ce7a_n.jpg'
    },
    {
      id: 3,
      name: 'Cisterna de Doble Descarga',
      category: 'Baño',
      description: 'Sistema de doble pulsador que permite elegir entre descarga completa o parcial.',
      savings: 'Hasta 18.000 litros al año',
      priceRange: '$240.000 - $480.000',
      imageUrl: 'https://live.staticflickr.com/65535/54414455380_2cfd2f1db2_n.jpg'
    },
    {
      id: 4,
      name: 'Sistema de Riego por Goteo',
      category: 'Jardín',
      description: 'Kit completo para instalar riego eficiente que dirige el agua directamente a las raíces.',
      savings: 'Hasta un 70% respecto al riego tradicional',
      priceRange: '$160.000 - $400.000',
      imageUrl: 'https://live.staticflickr.com/65535/54414071416_9aa0471b99_n.jpg'
    },
    {
      id: 5,
      name: 'Temporizador de Ducha',
      category: 'Baño',
      description: 'Dispositivo que te ayuda a controlar el tiempo en la ducha con alertas visuales.',
      savings: 'Hasta 9.000 litros al año',
      priceRange: '$60.000 - $100.000',
      imageUrl: 'https://live.staticflickr.com/65535/54413203072_4b84157656_n.jpg'
    },
    {
      id: 6,
      name: 'Detector de Fugas',
      category: 'General',
      description: 'Sistema inteligente que detecta caídas de presión y anomalías en el consumo.',
      savings: 'Variable según las fugas detectadas',
      priceRange: '$360.000 - $720.000',
      imageUrl: 'https://live.staticflickr.com/65535/54414265839_1734ff21e5_n.jpg'
    }
  ]);

  const [activeCategory, setActiveCategory] = useState<string>('Todos');
  const [filteredProducts, setFilteredProducts] = useState<EcoProduct[]>(products);
  const [hoveredProduct, setHoveredProduct] = useState<number | null>(null);

  // Extraer categorías únicas
  const categories = ['Todos', ...Array.from(new Set(products.map(p => p.category)))];

  // Filtrar productos por categoría
  useEffect(() => {
    if (activeCategory === 'Todos') {
      setFilteredProducts(products);
    } else {
      setFilteredProducts(products.filter(product => product.category === activeCategory));
    }
  }, [activeCategory, products]);

  // Función para actualizar la URL de la imagen de un producto
  const updateProductImage = (productId: number, newImageUrl: string) => {
    setProducts(products.map(product => 
      product.id === productId 
        ? { ...product, imageUrl: newImageUrl } 
        : product
    ));
  };

  // Manejo de errores de carga de imágenes
  const handleImageError = (productId: number) => {
    // Si la imagen falla, usamos una imagen de respaldo
    updateProductImage(productId, '/globe.svg');
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-12" id="products">
      <div className="mb-10 text-center">
        <h2 className="text-3xl font-bold mb-6">Productos para el Ahorro de Agua</h2>
        <p className="text-gray-600 max-w-2xl mx-auto">
          Descubre nuestra selección de productos eco-eficientes que te ayudarán a reducir tu consumo de agua y contribuir al cuidado del medio ambiente.
        </p>
      </div>
      
      {/* Filtro de categorías */}
      <div className="flex flex-wrap justify-center gap-2 mb-12">
        {categories.map((category) => (
          <button
            key={category}
            onClick={() => setActiveCategory(category)}
            className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 ${
              activeCategory === category 
                ? 'bg-teal-600 text-white shadow-md' 
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            {category}
          </button>
        ))}
      </div>

      {/* Cuadrícula de productos */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
        {filteredProducts.map((product) => (
          <div 
            key={product.id} 
            className="bg-white rounded-xl overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1"
            onMouseEnter={() => setHoveredProduct(product.id)}
            onMouseLeave={() => setHoveredProduct(null)}
          >
            <div className="relative h-64 bg-gradient-to-b from-gray-50 to-gray-100 overflow-hidden">
              <div className="absolute inset-0 flex items-center justify-center p-6">
                <img
                  src={product.imageUrl}
                  alt={product.name}
                  className={`max-h-full max-w-full object-contain transition-transform duration-500 ${
                    hoveredProduct === product.id ? 'scale-110' : 'scale-100'
                  }`}
                  onError={() => handleImageError(product.id)}
                />
              </div>
              <span className="absolute top-4 right-4 px-3 py-1 rounded-full bg-teal-100 text-teal-800 text-xs font-medium">
                {product.category}
              </span>
            </div>
            
            <div className="p-6">
              <h3 className="text-xl font-bold mb-2 text-gray-800">{product.name}</h3>
              <p className="text-gray-600 mb-6 line-clamp-2 h-12">{product.description}</p>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-teal-50 rounded-lg p-3">
                  <p className="text-xs text-teal-700 mb-1">Ahorro potencial</p>
                  <p className="font-semibold text-teal-900">{product.savings}</p>
                </div>
                <div className="bg-gray-50 rounded-lg p-3">
                  <p className="text-xs text-gray-500 mb-1">Rango de precio</p>
                  <p className="font-semibold text-gray-900">{product.priceRange}</p>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
      
      {filteredProducts.length === 0 && (
        <div className="text-center py-20">
          <p className="text-gray-500 text-lg">No se encontraron productos en esta categoría.</p>
        </div>
      )}
    </div>
  );
};

export default EcoProducts;