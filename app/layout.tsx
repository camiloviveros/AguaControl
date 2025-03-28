import './globals.css';
import type { Metadata, Viewport } from 'next';
import { Nunito } from 'next/font/google';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';

// Cargamos la fuente Nunito para toda la aplicación
const nunito = Nunito({
  subsets: ['latin'],
  display: 'swap',
  weight: ['400', '500', '600', '700', '800']
});

export const metadata: Metadata = {
  title: 'Gestión de Consumo de Agua | AguaControl',
  description: 'Aplicación para gestionar y optimizar el consumo de agua en el hogar. Ahorra dinero mientras cuidas el planeta.',
  keywords: 'agua, consumo, ahorro, calculadora, ecología, sostenibilidad',
  authors: [{ name: 'AguaControl' }],
};

// Separamos el viewport en su propia exportación como recomienda Next.js 15.2+
export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="es" className="scroll-smooth">
      <body className={`${nunito.className} flex flex-col min-h-screen antialiased`}>
        <Header />
        <main className="flex-grow">{children}</main>
        <Footer />
      </body>
    </html>
  );
}