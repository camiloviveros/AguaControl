'use client';

import { useState } from 'react';

const ConsumptionComparison = () => {
  const [monthlyConsumption, setMonthlyConsumption] = useState<number | ''>('');
  const [householdSize, setHouseholdSize] = useState<number>(1);
  const [comparison, setComparison] = useState<{
    averageConsumption: number;
    efficientConsumption: number;
    percentageDifference: number;
    status: 'efficient' | 'average' | 'high';
    message: string;
  } | null>(null);

  // Updated consumption data (in cubic meters per month)
  // Adjusted to reflect 3-5 m³ per person per month
  const consumptionData = {
    1: { average: 5, efficient: 3 },
    2: { average: 10, efficient: 6 },
    3: { average: 15, efficient: 9 },
    4: { average: 20, efficient: 12 },
    5: { average: 25, efficient: 15 },
    6: { average: 30, efficient: 18 }
  };

  const handleCompare = () => {
    if (monthlyConsumption === '') return;
    
    const consumption = Number(monthlyConsumption);
    
    // Get the reference data for the household size (default to the largest if size is greater than our data)
    const sizeKey = Math.min(householdSize, 6) as 1 | 2 | 3 | 4 | 5 | 6;
    const referenceData = consumptionData[sizeKey];
    
    // Calculate percentage difference from average
    const percentageDifference = ((consumption - referenceData.average) / referenceData.average) * 100;
    
    // Determine status
    let status: 'efficient' | 'average' | 'high';
    let message: string;
    
    if (consumption <= referenceData.efficient) {
      status = 'efficient';
      message = '¡Excelente! Tu consumo es muy eficiente comparado con hogares similares.';
    } else if (consumption <= referenceData.average) {
      status = 'average';
      message = 'Tu consumo está dentro del promedio para hogares similares, pero puedes mejorarlo.';
    } else {
      status = 'high';
      message = 'Tu consumo es superior al promedio. Revisa nuestros consejos para reducirlo.';
    }
    
    setComparison({
      averageConsumption: referenceData.average,
      efficientConsumption: referenceData.efficient,
      percentageDifference: parseFloat(percentageDifference.toFixed(1)),
      status,
      message
    });
  };

  // New function to clear/reset the form
  const handleClear = () => {
    setMonthlyConsumption('');
    setHouseholdSize(1);
    setComparison(null);
  };

  return (
    <div className="max-w-2xl mx-auto bg-blue-50 shadow-sm rounded-lg p-6"> {/* Changed background to pastel blue */}
      <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
        <h3 className="text-xl font-semibold mb-6">Compara tu consumo</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          <div>
            <label htmlFor="monthlyConsumption" className="block text-sm font-medium text-gray-700 mb-1">
              Tu consumo mensual (m³)
            </label>
            <input
              type="number"
              id="monthlyConsumption"
              value={monthlyConsumption}
              onChange={(e) => setMonthlyConsumption(e.target.value === '' ? '' : Number(e.target.value))}
              min="0"
              step="0.1"
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary"
              placeholder="Ingresa tu consumo"
            />
          </div>
          <div>
            <label htmlFor="householdSize" className="block text-sm font-medium text-gray-700 mb-1">
              Personas en el hogar
            </label>
            <select 
              id="householdSize" 
              value={householdSize}
              onChange={(e) => setHouseholdSize(Number(e.target.value))}
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary"
            >
              {[1, 2, 3, 4, 5, 6].map(size => (
                <option key={size} value={size}>{size}</option>
              ))}
              <option value={6}>Más de 6</option>
            </select>
          </div>
        </div>
        <div className="flex gap-2">
          <button
            onClick={handleCompare}
            className="flex-1 py-2 px-4 border border-transparent rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            disabled={monthlyConsumption === ''}
          >
            Comparar mi consumo
          </button>
          <button
            onClick={handleClear}
            className="py-2 px-4 border border-gray-300 rounded-md shadow-sm text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500"
          >
            Limpiar
          </button>
        </div>
      </div>
      
      {comparison && (
        <div 
          className={`bg-white rounded-lg shadow-sm p-6 border-l-4 ${
            comparison.status === 'efficient' 
              ? 'border-l-green-500' 
              : comparison.status === 'average' 
                ? 'border-l-yellow-500' 
                : 'border-l-red-500'
          }`}
        >
          <h3 className="text-xl font-semibold mb-4">Resultado de la comparación</h3>
          
          <p className="mb-4">{comparison.message}</p>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <div className="text-center p-3 bg-gray-50 rounded-lg">
              <div className="text-sm text-gray-600 mb-1">Tu consumo</div>
              <div className="text-2xl font-bold text-blue-600">{monthlyConsumption} m³</div>
            </div>
            <div className="text-center p-3 bg-gray-50 rounded-lg">
              <div className="text-sm text-gray-600 mb-1">Consumo promedio</div>
              <div className="text-2xl font-bold text-yellow-600">{comparison.averageConsumption} m³</div>
            </div>
            <div className="text-center p-3 bg-gray-50 rounded-lg">
              <div className="text-sm text-gray-600 mb-1">Consumo eficiente</div>
              <div className="text-2xl font-bold text-green-600">{comparison.efficientConsumption} m³</div>
            </div>
          </div>
          
          <div className="bg-gray-50 p-4 rounded-lg flex items-center">
            <div className="mr-4">
              <div 
                className={`
                  inline-flex items-center justify-center h-12 w-12 rounded-full 
                  ${comparison.status === 'efficient' 
                    ? 'bg-green-500 text-white' 
                    : comparison.status === 'average' 
                      ? 'bg-yellow-500 text-white' 
                      : 'bg-red-500 text-white'
                  }
                `}
              >
                {comparison.status === 'efficient' ? (
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                ) : comparison.status === 'average' ? (
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7h8" />
                  </svg>
                ) : (
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 17h8m0 0V9m0 8l-8-8-4 4-6-6" />
                  </svg>
                )}
              </div>
            </div>
            <div>
              {comparison.status === 'efficient' ? (
                <p className="text-sm">
                  Tu consumo está <span className="font-semibold text-green-600">{Math.abs(comparison.percentageDifference)}% por debajo</span> del promedio para un hogar similar al tuyo.
                </p>
              ) : (
                <p className="text-sm">
                  Tu consumo está <span className={`font-semibold ${comparison.status === 'average' ? 'text-yellow-600' : 'text-red-600'}`}>{Math.abs(comparison.percentageDifference)}% {comparison.percentageDifference >= 0 ? 'por encima' : 'por debajo'}</span> del promedio para un hogar similar al tuyo.
                </p>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ConsumptionComparison;