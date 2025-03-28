# Gestión de Consumo de Agua

Aplicación web para la gestión y optimización del consumo de agua en hogares, desarrollada con Next.js y Tailwind CSS. Incluye un asistente virtual basado en ChatGPT especializado en temas de ahorro de agua.

## Características

- **Calculadora de Consumo**: Permite a los usuarios calcular su consumo de agua basado en datos personalizados.
- **Consejos Personalizados**: Ofrece recomendaciones específicas basadas en los hábitos de consumo.
- **Comparador de Consumo**: Compara el consumo del usuario con promedios de hogares similares.
- **Productos Ecológicos**: Recomendaciones de dispositivos para ahorrar agua.
- **Simulador de Ahorro**: Visualiza el potencial de ahorro con diferentes medidas.
- **Asistente Virtual con IA**: Integración con ChatGPT para responder preguntas específicas sobre consumo de agua.

## Tecnologías utilizadas

- **Next.js**: Framework de React para renderizado del lado del servidor.
- **Tailwind CSS**: Framework de utilidades CSS para un diseño rápido y responsive.
- **TypeScript**: Superset de JavaScript con tipado estático.
- **React Hooks**: Gestión de estado y efectos en componentes funcionales.
- **OpenAI API**: Integración con ChatGPT para proporcionar respuestas inteligentes.

## Estructura del proyecto

```
/
├── app/                # Directorio principal de la aplicación Next.js
│   ├── api/            # API routes de Next.js
│   │   └── chat/       # Endpoint para comunicación con ChatGPT
│   ├── globals.css     # Estilos globales y variables CSS
│   ├── layout.tsx      # Componente de layout principal
│   └── page.tsx        # Página principal
├── components/         # Componentes reutilizables
│   ├── ai/             # Componentes relacionados con el asistente IA
│   ├── calculator/     # Componentes para la calculadora de consumo
│   ├── comparison/     # Componentes para la comparación de consumo
│   ├── home/           # Componentes para la página principal
│   ├── layout/         # Componentes de layout (header, footer)
│   ├── products/       # Componentes para productos ecológicos
│   ├── simulator/      # Componentes para el simulador de ahorro
│   └── tips/           # Componentes para consejos de ahorro
├── public/             # Archivos estáticos (imágenes, SVG)
└── node_modules/       # Dependencias del proyecto
```

## Configuración del asistente virtual con ChatGPT

Para utilizar el asistente virtual, necesitas configurar una clave API de OpenAI:

1. Crea una cuenta en [OpenAI](https://openai.com/) si aún no tienes una
2. Genera una clave API en el panel de control de OpenAI
3. Crea un archivo `.env.local` en la raíz del proyecto con el siguiente contenido:
   ```
   OPENAI_API_KEY=tu_clave_api_aquí
   OPENAI_MODEL=gpt-3.5-turbo
   ```

El asistente virtual está configurado para:
- Responder exclusivamente a preguntas relacionadas con el consumo y ahorro de agua
- Proporcionar consejos prácticos y aplicables
- Mantener un tono conversacional y amigable
- Ofrecer datos precisos sobre consumo y técnicas de ahorro

## Cómo ejecutar el proyecto

1. Clona el repositorio
2. Instala las dependencias: `npm install`
3. Configura el archivo `.env.local` con tu clave API de OpenAI
4. Ejecuta el servidor de desarrollo: `npm run dev`
5. Abre [http://localhost:3000](http://localhost:3000) en tu navegador

## Despliegue

Esta aplicación puede desplegarse en plataformas como Vercel o Netlify. Asegúrate de configurar las variables de entorno en la plataforma de despliegue.

## Patrones de diseño utilizados

- **Componentización**: División del código en componentes reutilizables.
- **Composición**: Uso de componentes para construir interfaces más complejas.
- **Custom Hooks**: Extracción de lógica en hooks personalizados.
- **Controlador-Presentador**: Separación de lógica de negocio y presentación.
- **Responsive Design**: Diseño adaptable a diferentes tamaños de pantalla.
- **Módulos CSS**: Estilos encapsulados usando Tailwind con variables CSS.
- **API Routes**: Uso de rutas API de Next.js para comunicación con servicios externos.

## Responsive Design

La aplicación está diseñada para funcionar en todos los tamaños de pantalla:
- Diseño móvil primero con breakpoints para tablets y escritorio
- Menú hamburguesa para navegación en dispositivos móviles
- Grid y flexbox adaptables
- Tamaños de texto y espaciado responsivos