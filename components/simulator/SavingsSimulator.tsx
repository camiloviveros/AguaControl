'use client';

import { useState } from 'react';

interface SavingOption {
  id: string;
  name: string;
  description: string;
  savings: number; // Savings in liters per month
  cost: number; // Cost in COP (Colombian Pesos)
  paybackMonths: number;
}

interface EstratoRate {
  estrato: number;
  rate: number;
}

const SavingsSimulator = () => {
  const [selectedOptions, setSelectedOptions] = useState<string[]>([]);
  const [selectedEstrato, setSelectedEstrato] = useState<number>(1); // Default to estrato 1
  
  // Definir tarifas por estrato
  const estratoRates: EstratoRate[] = [
    { estrato: 1, rate: 4593 },
    { estrato: 2, rate: 8038 },
    { estrato: 3, rate: 11130 },
    { estrato: 4, rate: 11483 },
    { estrato: 5, rate: 17224 },
    { estrato: 6, rate: 18372 }
  ];
  
  // Obtener la tarifa actual según el estrato seleccionado
  const getCurrentRate = (): number => {
    const foundRate = estratoRates.find(item => item.estrato === selectedEstrato);
    return foundRate ? foundRate.rate : 4593; // Default to estrato 1 if not found
  };
  
  const savingOptions: SavingOption[] = [
    {
      id: 'eco-shower',
      name: 'Ducha ecológica',
      description: 'Instalar una ducha de bajo consumo',
      savings: 1500, // 1.5 cubic meters per month
      cost: 140000,
      paybackMonths: 12
    },
    {
      id: 'faucet-aerators',
      name: 'Aireadores para grifos',
      description: 'Instalar aireadores en todos los grifos',
      savings: 1000, // 1 cubic meter per month
      cost: 80000,
      paybackMonths: 10
    },
    {
      id: 'dual-flush',
      name: 'Cisterna de doble descarga',
      description: 'Instalar o adaptar la cisterna existente',
      savings: 1800, // 1.8 cubic meters per month
      cost: 300000,
      paybackMonths: 21
    },
    {
      id: 'drip-irrigation',
      name: 'Riego por goteo',
      description: 'Sustituir el riego tradicional por sistema de goteo',
      savings: 2500, // 2.5 cubic meters per month
      cost: 360000,
      paybackMonths: 18
    },
    {
      id: 'rain-collector',
      name: 'Recolector de agua de lluvia',
      description: 'Sistema básico de recolección para el jardín',
      savings: 1200, // 1.2 cubic meters per month
      cost: 480000,
      paybackMonths: 50
    },
    {
      id: 'leak-detector',
      name: 'Detector de fugas',
      description: 'Sistema para detección temprana de fugas',
      savings: 600, // 0.6 cubic meters per month (depends on if there are leaks)
      cost: 600000,
      paybackMonths: 125
    }
  ];
  
  const toggleOption = (optionId: string) => {
    setSelectedOptions(prev => 
      prev.includes(optionId)
        ? prev.filter(id => id !== optionId)
        : [...prev, optionId]
    );
  };
  
  // Calcular la tarifa de agua actual
  const waterCost = getCurrentRate();
  
  // Calculate total savings and costs
  const selectedItems = savingOptions.filter(option => selectedOptions.includes(option.id));
  
  const totalWaterSavings = selectedItems.reduce((sum, option) => sum + option.savings, 0);
  const totalWaterSavingsM3 = totalWaterSavings / 1000;
  const totalMoneySavingsMonthly = totalWaterSavingsM3 * waterCost;
  const totalMoneySavingsYearly = totalMoneySavingsMonthly * 12;
  const totalInvestment = selectedItems.reduce((sum, option) => sum + option.cost, 0);
  
  // Calculate payback period
  const paybackMonths = totalMoneySavingsMonthly > 0 
    ? Math.ceil(totalInvestment / totalMoneySavingsMonthly) 
    : 0;

  // Format currency for Colombian Pesos
  const formatCOP = (value: number) => {
    return new Intl.NumberFormat('es-CO', {
      style: 'currency',
      currency: 'COP',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(value);
  };

  return (
    <div className="max-w-4xl mx-auto font-sans bg-gray-100 p-6 rounded-2xl" id="simulator">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          <div className="bg-white rounded-xl shadow-lg p-6 mb-6 hover:shadow-xl transition-shadow duration-300">
            <h3 className="text-2xl font-bold mb-6 text-black">Selecciona medidas de ahorro</h3>
            
            <div className="mb-6">
              <label htmlFor="estrato" className="block text-sm font-semibold text-gray-700 mb-2">
                Selecciona tu estrato:
              </label>
              <select
                id="estrato"
                value={selectedEstrato}
                onChange={(e) => setSelectedEstrato(Number(e.target.value))}
                className="w-full max-w-xs p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
              >
                {estratoRates.map((rate) => (
                  <option key={rate.estrato} value={rate.estrato}>
                    Estrato {rate.estrato}
                  </option>
                ))}
              </select>
              <p className="mt-2 text-sm text-gray-500">
                Precio actual: {formatCOP(waterCost)} por m³
              </p>
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              {savingOptions.map((option) => (
                <div 
                  key={option.id}
                  className={`
                    border rounded-xl p-5 cursor-pointer transition-all duration-200 hover:transform hover:scale-102
                    ${selectedOptions.includes(option.id)
                      ? 'border-gray-400 bg-gray-50 shadow-md'
                      : 'border-gray-200 hover:border-gray-300 hover:shadow-sm'
                    }
                  `}
                  onClick={() => toggleOption(option.id)}
                >
                  <div className="flex items-start">
                    <input
                      type="checkbox"
                      checked={selectedOptions.includes(option.id)}
                      onChange={() => {}} // Handled by the div click
                      className="h-5 w-5 text-blue-600 mt-0.5 mr-3 rounded focus:ring-blue-500"
                    />
                    <div>
                      <h4 className="font-semibold text-gray-800">{option.name}</h4>
                      <p className="text-sm text-gray-600 my-1">{option.description}</p>
                      <div className="mt-3 flex justify-between text-sm">
                        <span className="font-medium text-blue-700">Ahorro: {option.savings} L/mes</span>
                        <span className="font-medium text-gray-700">Coste: {formatCOP(option.cost)}</span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
        
        <div className="lg:col-span-1">
          <div className="bg-gradient-to-br from-gray-50 via-white to-gray-100 rounded-xl shadow-lg p-6 sticky top-24 border border-gray-200">
            <h3 className="text-2xl font-bold mb-6 text-black pb-2 border-b border-blue-100">Resumen de ahorro mensual</h3>
            
            {selectedOptions.length === 0 ? (
              <div className="text-center py-8">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 mx-auto text-gray-400 opacity-50" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 12H4" />
                </svg>
                <p className="mt-4 text-gray-500 font-medium">
                  Selecciona al menos una medida para ver el ahorro estimado
                </p>
              </div>
            ) : (
              <div className="space-y-7">
                <div>
                  <h4 className="text-sm font-semibold text-gray-600 mb-2">Ahorro de agua mensual</h4>
                  <p className="text-3xl font-bold text-black">
                    {(totalWaterSavings / 1000).toFixed(1)} m³
                  </p>
                  <p className="text-sm text-gray-500 mt-1">
                    {totalWaterSavings.toLocaleString()} litros
                  </p>
                </div>
                
                <div className="bg-gray-50 bg-opacity-70 rounded-lg p-4 border border-gray-200">
                  <h4 className="text-sm font-semibold text-gray-600 mb-2">Ahorro económico mensual</h4>
                  <div className="flex items-end gap-4">
                    <p className="text-3xl font-bold text-green-600">
                      {formatCOP(totalMoneySavingsMonthly)}<span className="text-sm font-normal ml-1">/mes</span>
                    </p>
                    <p className="text-lg font-semibold text-green-600">
                      {formatCOP(totalMoneySavingsYearly)}<span className="text-xs font-normal ml-1">/año</span>
                    </p>
                  </div>
                </div>
                
                <div>
                  <h4 className="text-sm font-semibold text-gray-600 mb-2">Inversión inicial</h4>
                  <p className="text-2xl font-bold text-gray-800">{formatCOP(totalInvestment)}</p>
                </div>
                
                <div>
                  <h4 className="text-sm font-semibold text-gray-600 mb-2">Período de amortización</h4>
                  <p className="text-2xl font-bold text-black">
                    {paybackMonths} meses
                    {paybackMonths > 0 && (
                      <span className="text-sm font-normal ml-1 text-gray-600">
                        ({Math.ceil(paybackMonths / 12)} años)
                      </span>
                    )}
                  </p>
                </div>
                
                <div className="pt-4 border-t border-gray-200">
                  <p className="text-sm text-gray-700 font-medium">
                    Medidas <strong>seleccionadas para este mes</strong>: {selectedItems.length} de {savingOptions.length}
                  </p>
                  <ul className="mt-3 space-y-2">
                    {selectedItems.map((item) => (
                      <li key={item.id} className="flex justify-between items-center text-sm bg-white p-2 rounded border border-gray-100 shadow-sm">
                        <span className="font-medium">{item.name}</span>
                        <span className="text-green-600 font-semibold">+{(item.savings / 1000).toFixed(1)} m³</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default SavingsSimulator;