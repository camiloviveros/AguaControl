'use client';

import { useState } from 'react';

// Definimos la interfaz para el resultado
interface ResultType {
  estimatedConsumption: number;
  baseConsumption: number;
  extraConsumption: number;
  referenceConsumption: number;
  potentialSavings: number;
  isHighConsumption: boolean;
  isVeryLowConsumption: boolean;
  statusMessage: string;
  statusLevel: string;
  tips: string[];
  currentCost: number;
  potentialSavingsCost: number;
  pricePerM3: number;
}

const WaterCalculator = () => {
  // Definimos la única moneda que usaremos: Pesos colombianos
  const currencySymbol = '$';
  const currencyName = 'Pesos colombianos';
  const currencyCode = 'COP';

  // Precios por m³ según estrato
  const pricesByStrata: Record<string, number> = {
    '1': 4593,
    '2': 8038,
    '3': 11130,
    '4': 11438, 
    '5': 17224,
    '6': 18372
  };

  interface FormDataType {
    residents: number;
    bathrooms: number;
    stratum: number;
    showers: number;
    hasGarden: boolean;
    hasDishwasher: boolean;
    hasWashingMachine: boolean;
    hasPool: boolean;
    hasCar: boolean;
    hasPets: boolean;
    hasHotTub: boolean;
    usesSprinklers: boolean;
    publicCharges: string;
    currentBill: string;
  }

  const [formData, setFormData] = useState<FormDataType>({
    residents: 1,
    bathrooms: 1,
    stratum: 1,
    showers: 1,
    hasGarden: false,
    hasDishwasher: false,
    hasWashingMachine: false,
    hasPool: false,
    hasCar: false,
    hasPets: false,
    hasHotTub: false,
    usesSprinklers: false,
    publicCharges: '',
    currentBill: ''
  });

  const [result, setResult] = useState<ResultType | null>(null);

  // Función para formatear valores monetarios en pesos colombianos
  const formatCurrency = (value: string | number): string => {
    if (!value && value !== 0) return '';
    
    const numValue = typeof value === 'string' ? parseFloat(value) : value;
    
    // Pesos colombianos sin decimales
    return Math.round(numValue).toLocaleString('es-CO');
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? (e.target as HTMLInputElement).checked : value
    });
  };

  const calculateWaterUsage = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validar que los campos requeridos estén completos
    if (formData.publicCharges === '' || formData.currentBill === '') {
      alert('Por favor, completa todos los campos obligatorios');
      return;
    }
    
    // Base values (in liters per day)
    const personBaseUsage = 120; // litros por día por persona para necesidades básicas
    const bathroomBaseUsage = 20; // litros por día por baño
    const showerUsage = 60; // litros por ducha por día
    const gardenUsage = formData.hasGarden ? 70 : 0; // litros por día
    const dishwasherUsage = formData.hasDishwasher ? 25 : 0; // litros por día
    const washingMachineUsage = formData.hasWashingMachine ? 50 : 0; // litros por día
    const poolUsage = formData.hasPool ? 150 : 0; // litros por día
    const carWashUsage = formData.hasCar ? 40 : 0; // litros por día para lavado ocasional
    const petUsage = formData.hasPets ? 30 : 0; // litros por día para mascotas
    const hotTubUsage = formData.hasHotTub ? 80 : 0; // litros por día para jacuzzi
    const sprinklersUsage = formData.usesSprinklers ? 100 : 0; // litros por día para riego automático
    
    // Calculate monthly usage
    const baseMonthlyUsage = (
      formData.residents * personBaseUsage + 
      formData.bathrooms * bathroomBaseUsage +
      formData.showers * showerUsage * formData.residents // Asumimos una ducha diaria por persona
    ) * 30; // 30 días en un mes
    
    const extraMonthlyUsage = (
      gardenUsage + 
      dishwasherUsage + 
      washingMachineUsage + 
      poolUsage + 
      carWashUsage +
      petUsage +
      hotTubUsage +
      sprinklersUsage
    ) * 30;
    
    const totalMonthlyUsageInLiters = baseMonthlyUsage + extraMonthlyUsage;
    const totalMonthlyUsageInM3 = totalMonthlyUsageInLiters / 1000; // Convertir a metros cúbicos
    
    // Estimar ahorros potenciales (20% de uso extra y 10% de uso básico)
    const potentialSavings = (extraMonthlyUsage * 0.2 + baseMonthlyUsage * 0.1) / 1000;
    
    // Consumo de referencia en m³ por persona al mes
    const referenceConsumptionPerPerson = 3.5; // 3.5 m³ por persona al mes se considera normal
    const totalReferenceConsumption = referenceConsumptionPerPerson * formData.residents;
    
    // Calcular el consumo real basado en la factura y el estrato
    const currentBillValue = parseFloat(formData.currentBill);
    const publicChargesValue = parseFloat(formData.publicCharges);
    
    // Costo real del consumo en la factura (sin cargos públicos)
    const realConsumptionCost = currentBillValue - publicChargesValue;
    
    // Precio por m³ según el estrato seleccionado
    const pricePerM3 = pricesByStrata[formData.stratum.toString()];
    
    // Calcular el consumo real en m³
    const realConsumptionInM3 = realConsumptionCost / pricePerM3;
    
    // Determinar si el consumo real es elevado (más de 25% por encima de la referencia)
    const isHighConsumption = realConsumptionInM3 > (totalReferenceConsumption * 1.25);
    
    // Determinar si el consumo es muy bajo (puede indicar problemas de medición)
    const isVeryLowConsumption = realConsumptionInM3 < (totalReferenceConsumption * 0.5);
    
    // Mensaje de estado según el consumo real
    let statusMessage = '';
    let statusLevel = '';
    
    if (isHighConsumption) {
      statusMessage = 'Tu consumo de agua está por encima del promedio recomendado. Considera programar una revisión de posibles fugas y revisa tus hábitos de consumo.';
      statusLevel = 'high';
    } else if (isVeryLowConsumption) {
      statusMessage = 'Tu consumo de agua es inusualmente bajo. Verifica que tu medidor esté funcionando correctamente.';
      statusLevel = 'warning';
    } else {
      statusMessage = 'Tu consumo de agua está dentro de los rangos normales. Sigue estas recomendaciones para mantenerlo así o reducirlo aún más.';
      statusLevel = 'normal';
    }
    
    // Generar consejos personalizados
    const tips = [];
    
    if (formData.residents > 3) {
      tips.push('Con ' + formData.residents + ' personas en el hogar, considera instalar aireadores en todos los grifos para reducir el consumo sin afectar la presión.');
    }
    
    if (formData.hasGarden) {
      tips.push('Considera instalar un sistema de riego por goteo para tu jardín, esto puede ahorrar hasta un 50% de agua en comparación con el riego tradicional.');
      tips.push('Recolecta agua de lluvia para regar tus plantas y jardín.');
    }
    
    if (formData.hasDishwasher) {
      tips.push('Usa tu lavavajillas sólo cuando esté completamente lleno y selecciona el programa ECO para maximizar la eficiencia del agua.');
    }
    
    if (formData.hasWashingMachine) {
      tips.push('Opta por programas de lavado ecológicos o cortos en tu lavadora y siempre úsala con carga completa.');
    }
    
    if (formData.hasPool) {
      tips.push('Mantén la piscina cubierta cuando no esté en uso para reducir la evaporación y considera un sistema de filtración eficiente.');
    }
    
    if (formData.hasCar) {
      tips.push('Lava tu carro con cubeta en lugar de manguera. Puedes ahorrar hasta 300 litros de agua por lavado.');
    }
    
    if (formData.showers > 1) {
      tips.push('Instala cabezales de ducha de bajo flujo. Pueden reducir el consumo hasta en un 40% sin disminuir la comodidad.');
    }
    
    if (isHighConsumption) {
      tips.push('Revisa urgentemente tus tuberías, inodoros y grifos para detectar fugas. Un inodoro con fuga puede desperdiciar hasta 400 litros diarios.');
      tips.push('Considera instalar un sistema de monitoreo de consumo de agua para identificar patrones y anomalías.');
    }
    
    if (tips.length < 3) {
      tips.push('Cierra el grifo mientras te cepillas los dientes o te enjabonas las manos. Puedes ahorrar hasta 12 litros por minuto.');
      tips.push('Revisa regularmente tus tuberías para detectar fugas que podrían estar aumentando tu consumo.');
    }
    
    // Calcular el costo actual y el potencial ahorro en pesos
    const currentCost = realConsumptionInM3 * pricePerM3;
    const potentialSavingsCost = potentialSavings * pricePerM3;
    
    // Usar el valor de consumo real calculado
    setResult({
      estimatedConsumption: parseFloat(realConsumptionInM3.toFixed(2)),
      baseConsumption: parseFloat((baseMonthlyUsage / 1000).toFixed(2)),
      extraConsumption: parseFloat((extraMonthlyUsage / 1000).toFixed(2)),
      referenceConsumption: parseFloat(totalReferenceConsumption.toFixed(2)),
      potentialSavings: parseFloat(potentialSavings.toFixed(2)),
      isHighConsumption,
      isVeryLowConsumption,
      statusMessage,
      statusLevel,
      tips,
      currentCost,
      potentialSavingsCost,
      pricePerM3
    });
  };

  // Función para resetear el formulario
  const resetForm = () => {
    setFormData({
      residents: 1,
      bathrooms: 1,
      stratum: 1,
      showers: 1,
      hasGarden: false,
      hasDishwasher: false,
      hasWashingMachine: false,
      hasPool: false,
      hasCar: false,
      hasPets: false,
      hasHotTub: false,
      usesSprinklers: false,
      publicCharges: '',
      currentBill: ''
    });
    setResult(null);
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 bg-gradient-to-r from-blue-800 to-indigo-900 p-6 rounded-lg font-['Montserrat', sans-serif]" id="calculator">
      <div className="card bg-white p-6 shadow-lg rounded-lg border border-blue-200">
        <h3 className="text-xl font-semibold mb-6 text-blue-700">Calculadora de Consumo de Agua</h3>
        <form onSubmit={calculateWaterUsage}>
          <div className="space-y-4">
            <div>
              <label htmlFor="stratum" className="block text-sm font-medium text-gray-600 mb-1">
                Estrato socioeconómico
              </label>
              <select 
                id="stratum" 
                name="stratum" 
                className="input-field w-full p-2 border rounded-md focus:ring focus:ring-blue-200 focus:border-blue-500"
                value={formData.stratum}
                onChange={handleInputChange}
              >
                {[1, 2, 3, 4, 5, 6].map(num => (
                  <option key={num} value={num}>Estrato {num}</option>
                ))}
              </select>
            </div>
            
            <div>
              <label htmlFor="residents" className="block text-sm font-medium text-gray-600 mb-1">
                Personas en el hogar
              </label>
              <select 
                id="residents" 
                name="residents" 
                className="input-field w-full p-2 border rounded-md focus:ring focus:ring-blue-200 focus:border-blue-500"
                value={formData.residents}
                onChange={handleInputChange}
              >
                {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map(num => (
                  <option key={num} value={num}>{num}</option>
                ))}
              </select>
            </div>
            
            <div>
              <label htmlFor="bathrooms" className="block text-sm font-medium text-gray-600 mb-1">
                Número de baños
              </label>
              <select 
                id="bathrooms" 
                name="bathrooms" 
                className="input-field w-full p-2 border rounded-md focus:ring focus:ring-blue-200 focus:border-blue-500"
                value={formData.bathrooms}
                onChange={handleInputChange}
              >
                {[1, 2, 3, 4, 5, 6].map(num => (
                  <option key={num} value={num}>{num}</option>
                ))}
              </select>
            </div>
            
            <div>
              <label htmlFor="showers" className="block text-sm font-medium text-gray-600 mb-1">
                Número de duchas que toman diariamente en el hogar
              </label>
              <select 
                id="showers" 
                name="showers" 
                className="input-field w-full p-2 border rounded-md focus:ring focus:ring-blue-200 focus:border-blue-500"
                value={formData.showers}
                onChange={handleInputChange}
              >
                {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 15, 20].map(num => (
                  <option key={num} value={num}>{num}</option>
                ))}
              </select>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="hasGarden"
                  name="hasGarden"
                  checked={formData.hasGarden}
                  onChange={handleInputChange}
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                />
                <label htmlFor="hasGarden" className="ml-2 block text-sm text-gray-600">
                  Tengo jardín
                </label>
              </div>
              
              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="hasDishwasher"
                  name="hasDishwasher"
                  checked={formData.hasDishwasher}
                  onChange={handleInputChange}
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                />
                <label htmlFor="hasDishwasher" className="ml-2 block text-sm text-gray-600">
                  Tengo lavavajillas
                </label>
              </div>
              
              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="hasWashingMachine"
                  name="hasWashingMachine"
                  checked={formData.hasWashingMachine}
                  onChange={handleInputChange}
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                />
                <label htmlFor="hasWashingMachine" className="ml-2 block text-sm text-gray-600">
                  Tengo lavadora
                </label>
              </div>
              
              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="hasPool"
                  name="hasPool"
                  checked={formData.hasPool}
                  onChange={handleInputChange}
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                />
                <label htmlFor="hasPool" className="ml-2 block text-sm text-gray-600">
                  Tengo piscina
                </label>
              </div>
              
              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="hasCar"
                  name="hasCar"
                  checked={formData.hasCar}
                  onChange={handleInputChange}
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                />
                <label htmlFor="hasCar" className="ml-2 block text-sm text-gray-600">
                  Tengo carro
                </label>
              </div>
              
              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="hasPets"
                  name="hasPets"
                  checked={formData.hasPets}
                  onChange={handleInputChange}
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                />
                <label htmlFor="hasPets" className="ml-2 block text-sm text-gray-600">
                  Tengo mascotas
                </label>
              </div>
              
              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="hasHotTub"
                  name="hasHotTub"
                  checked={formData.hasHotTub}
                  onChange={handleInputChange}
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                />
                <label htmlFor="hasHotTub" className="ml-2 block text-sm text-gray-600">
                  Tengo jacuzzi
                </label>
              </div>
              
              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="usesSprinklers"
                  name="usesSprinklers"
                  checked={formData.usesSprinklers}
                  onChange={handleInputChange}
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                />
                <label htmlFor="usesSprinklers" className="ml-2 block text-sm text-gray-600">
                  Uso aspersores/riego
                </label>
              </div>
            </div>
            
            <div>
              <label htmlFor="publicCharges" className="block text-sm font-medium text-gray-600 mb-1">
                Cargos públicos en tu factura
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <span className="text-gray-500 sm:text-sm">{currencySymbol}</span>
                </div>
                <input
                  type="text"
                  id="publicCharges"
                  name="publicCharges"
                  value={formData.publicCharges}
                  onChange={handleInputChange}
                  className="input-field pl-7 w-full p-2 border rounded-md focus:ring focus:ring-blue-200 focus:border-blue-500"
                  placeholder="Ingresa el valor manualmente"
                />
              </div>
              <p className="text-xs text-gray-500 mt-1">Son los cargos fijos que aparecen en tu factura (no relacionados con el consumo)</p>
            </div>
            
            <div>
              <label htmlFor="currentBill" className="block text-sm font-medium text-gray-600 mb-1">
                Valor total de última factura
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <span className="text-gray-500 sm:text-sm">{currencySymbol}</span>
                </div>
                <input
                  type="text"
                  id="currentBill"
                  name="currentBill"
                  value={formData.currentBill}
                  onChange={handleInputChange}
                  className="input-field pl-7 w-full p-2 border rounded-md focus:ring focus:ring-blue-200 focus:border-blue-500"
                  placeholder="Ingresa el valor manualmente"
                />
              </div>
            </div>
            
            <div className="flex space-x-2">
              <button
                type="submit"
                className="btn-primary flex-1 mt-4 bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-md transition duration-200"
              >
                Calcular consumo
              </button>
              
              <button
                type="button"
                onClick={resetForm}
                className="btn-secondary flex-1 mt-4 border border-blue-300 text-blue-600 bg-white hover:bg-blue-50 py-2 px-4 rounded-md transition duration-200"
              >
                Limpiar
              </button>
            </div>
          </div>
        </form>
      </div>
      
      <div className="card bg-white p-6 shadow-lg rounded-lg border border-blue-200">
        {result ? (
          <div>
            <h3 className="text-xl font-semibold mb-6 text-blue-700">Resultados</h3>
            
            <div className="space-y-6">
              <div>
                <h4 className="font-medium text-gray-600">Consumo mensual actual</h4>
                <p className={`text-3xl font-bold ${
                  result.statusLevel === 'high' 
                    ? 'text-red-600' 
                    : result.statusLevel === 'warning' 
                      ? 'text-amber-600' 
                      : 'text-green-600'
                }`}>
                  {result.estimatedConsumption} m³
                  {result.statusLevel === 'high' && (
                    <span className="ml-2 text-sm bg-red-100 text-red-600 px-2 py-1 rounded-full">
                      Elevado
                    </span>
                  )}
                  {result.statusLevel === 'warning' && (
                    <span className="ml-2 text-sm bg-amber-100 text-amber-600 px-2 py-1 rounded-full">
                      Inusual
                    </span>
                  )}
                </p>
                <div className="mt-2 text-sm text-gray-600">
                  <p>Consumo de referencia: {result.referenceConsumption} m³</p>
                  <p>Consumo básico: {result.baseConsumption} m³</p>
                  <p>Consumo adicional: {result.extraConsumption} m³</p>
                </div>
              </div>
              
              <div>
                <h4 className="font-medium text-gray-600">Potencial de ahorro mensual</h4>
                <p className="text-2xl font-bold text-green-600">Hasta {result.potentialSavings} m³</p>
                <p className="text-xl font-semibold text-green-600">
                  {currencySymbol} {formatCurrency(result.potentialSavingsCost)}
                </p>
              </div>
              
              <div>
                <h4 className="font-medium text-gray-600 mb-2">Estado de tu consumo</h4>
                {result.statusLevel === 'high' ? (
                  <div className="mb-3 p-3 bg-red-50 border border-red-200 rounded-md">
                    <p className="text-red-600 font-medium">{result.statusMessage}</p>
                  </div>
                ) : result.statusLevel === 'warning' ? (
                  <div className="mb-3 p-3 bg-amber-50 border border-amber-200 rounded-md">
                    <p className="text-amber-600 font-medium">{result.statusMessage}</p>
                  </div>
                ) : (
                  <div className="mb-3 p-3 bg-green-50 border border-green-200 rounded-md">
                    <p className="text-green-600 font-medium">{result.statusMessage}</p>
                  </div>
                )}
                
                <h4 className="font-medium text-gray-600 mt-4 mb-2">Recomendaciones personalizadas</h4>
                <ul className="list-disc pl-5 space-y-2 text-sm text-gray-700">
                  {result.tips.map((tip, index) => (
                    <li key={index}>{tip}</li>
                  ))}
                </ul>
              </div>

              {/* Costos estimados en pesos colombianos */}
              <div>
                <h4 className="font-medium text-gray-600">
                  Costos en {currencyName}
                </h4>
                
                <div className="mt-2 p-3 bg-blue-50 border border-blue-100 rounded-md">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-sm">Precio por m³ (Estrato {formData.stratum}):</span>
                    <span className="font-semibold">{currencySymbol} {formatCurrency(result.pricePerM3)}</span>
                  </div>
                  
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-sm">Costo consumo actual:</span>
                    <span className="font-semibold">{currencySymbol} {formatCurrency(result.currentCost)}</span>
                  </div>
                  
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-sm">Potencial ahorro mensual:</span>
                    <span className="font-semibold text-green-600">{currencySymbol} {formatCurrency(result.potentialSavingsCost)}</span>
                  </div>
                  
                  <div className="flex justify-between items-center border-t border-blue-200 pt-2 mt-2">
                    <span className="text-sm">Costo proyectado con ahorro:</span>
                    <span className="font-bold text-green-600">{currencySymbol} {formatCurrency(result.currentCost - result.potentialSavingsCost)}</span>
                  </div>
                </div>
                
                <div className="mt-3 text-xs text-gray-500 italic">
                  Nota: Los cálculos son estimaciones basadas en promedios de consumo y pueden variar según tus hábitos específicos y la eficiencia de tus electrodomésticos.
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center h-full text-center p-6">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 text-blue-500 opacity-30" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" />
            </svg>
            <h3 className="mt-4 text-xl font-medium text-gray-600">Calcula tu consumo de agua</h3>
            <p className="mt-2 text-gray-500">
              Completa el formulario para obtener información personalizada sobre tu consumo de agua y recomendaciones para ahorrar.
            </p>
            <p className="mt-4 text-sm text-blue-600 bg-blue-50 p-2 rounded-md">
              Una persona promedio consume entre 3 y 5 m³ de agua al mes para sus necesidades básicas.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default WaterCalculator;