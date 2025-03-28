'use client';

import { useState, useEffect, ReactNode, MouseEvent } from 'react';
import Link from 'next/link';
import Image from 'next/image';

// Definición de tipos para nuestros componentes de navegación
interface NavLinkProps {
  href: string;
  children: ReactNode;
  isActive: boolean;
  onClick: (e: MouseEvent<HTMLAnchorElement>) => void;
}

// Definición del componente principal
const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState<boolean>(false);
  const [activeSection, setActiveSection] = useState<string>('home');
  const [scrolled, setScrolled] = useState<boolean>(false);

  // Detectar scroll para cambiar el estilo del header
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 10) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Detectar qué sección está activa basado en el scroll
  useEffect(() => {
    const handleSectionDetection = () => {
      const sections = ['calculator', 'tips', 'products', 'simulator', 'importance', 'water-intake'];
      const scrollPosition = window.scrollY + 100;
      
      for (const section of sections) {
        const element = document.getElementById(section);
        if (element) {
          const offsetTop = element.offsetTop;
          const offsetHeight = element.offsetHeight;
          
          if (scrollPosition >= offsetTop && scrollPosition < offsetTop + offsetHeight) {
            setActiveSection(section);
            return;
          }
        }
      }
      
      // Si no está en ninguna sección específica, está en home
      setActiveSection('home');
    };
    
    window.addEventListener('scroll', handleSectionDetection);
    return () => window.removeEventListener('scroll', handleSectionDetection);
  }, []);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  // Función para manejar el clic y desplazamiento suave
  const handleNavClick = (e: MouseEvent<HTMLAnchorElement>, sectionId: string) => {
    e.preventDefault();
    setActiveSection(sectionId);
    
    if (isMenuOpen) {
      setIsMenuOpen(false);
    }
    
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    } else if (sectionId === 'home') {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  return (
    <header className={`fixed top-0 w-full z-50 transition-all duration-300 ${
      scrolled ? 'bg-white shadow-md py-2' : 'bg-white/90 backdrop-blur-sm py-4'
    }`}>
      <div className="container mx-auto px-4 md:px-6">
        <div className="flex items-center justify-between md:justify-center md:relative">
          {/* Logo - En desktop queda a la izquierda */}
          <div className="md:absolute md:left-4">
            <Link href="/" className="flex items-center space-x-3 group" onClick={(e) => handleNavClick(e, 'home')}>
              <div className="relative w-10 h-10 md:w-12 md:h-12 transition-transform duration-300 group-hover:scale-110">
                <Image
                  src="/images/logo.png"
                  alt="Logo"
                  fill
                  className="object-contain"
                  sizes="(max-width: 768px) 2.5rem, 3rem"
                />
              </div>
              <span className="text-xl md:text-2xl font-bold bg-gradient-to-r from-blue-600 to-teal-500 bg-clip-text text-transparent">
                AguaControl
              </span>
            </Link>
          </div>

          {/* Desktop Navigation - Centrado */}
          <nav className="hidden md:flex items-center justify-center space-x-3">
            <NavLink 
              href="#home" 
              isActive={activeSection === 'home'} 
              onClick={(e) => handleNavClick(e, 'home')}
            >
              Inicio
            </NavLink>
            <NavLink 
              href="#calculator" 
              isActive={activeSection === 'calculator'} 
              onClick={(e) => handleNavClick(e, 'calculator')}
            >
              Calculadora
            </NavLink>
            <NavLink 
              href="#tips" 
              isActive={activeSection === 'tips'} 
              onClick={(e) => handleNavClick(e, 'tips')}
            >
              Consejos
            </NavLink>
            <NavLink 
              href="#products" 
              isActive={activeSection === 'products'} 
              onClick={(e) => handleNavClick(e, 'products')}
            >
              Productos
            </NavLink>
            <NavLink 
              href="#simulator" 
              isActive={activeSection === 'simulator'} 
              onClick={(e) => handleNavClick(e, 'simulator')}
            >
              Simulador
            </NavLink>
            <NavLink 
              href="#importance" 
              isActive={activeSection === 'importance'} 
              onClick={(e) => handleNavClick(e, 'importance')}
            >
              Importancia
            </NavLink>
          </nav>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden p-2 rounded-full bg-gray-50 hover:bg-gray-100 text-gray-700 transition-colors"
            onClick={toggleMenu}
            aria-label="Toggle Menu"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              className="w-6 h-6"
            >
              {isMenuOpen ? (
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              ) : (
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 6h16M4 12h16M4 18h16"
                />
              )}
            </svg>
          </button>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="md:hidden mt-3 overflow-hidden transition-all duration-300">
            <nav className="bg-white rounded-xl shadow-lg border border-gray-100 p-4 space-y-3">
              <MobileNavLink 
                href="#home" 
                onClick={(e) => handleNavClick(e, 'home')}
                isActive={activeSection === 'home'}
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                </svg>
                Inicio
              </MobileNavLink>
              <MobileNavLink 
                href="#calculator" 
                onClick={(e) => handleNavClick(e, 'calculator')}
                isActive={activeSection === 'calculator'}
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
                </svg>
                Calculadora
              </MobileNavLink>
              <MobileNavLink 
                href="#tips" 
                onClick={(e) => handleNavClick(e, 'tips')}
                isActive={activeSection === 'tips'}
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                Consejos
              </MobileNavLink>
              <MobileNavLink 
                href="#products" 
                onClick={(e) => handleNavClick(e, 'products')}
                isActive={activeSection === 'products'}
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                </svg>
                Productos
              </MobileNavLink>
              <MobileNavLink 
                href="#simulator" 
                onClick={(e) => handleNavClick(e, 'simulator')}
                isActive={activeSection === 'simulator'}
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
                Simulador
              </MobileNavLink>
              <MobileNavLink 
                href="#importance" 
                onClick={(e) => handleNavClick(e, 'importance')}
                isActive={activeSection === 'importance'}
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.618 5.984A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016zM12 9v2m0 4h.01" />
                </svg>
                Importancia
              </MobileNavLink>
            </nav>
          </div>
        )}
      </div>
    </header>
  );
};

// Componente para los enlaces del menú desktop
const NavLink = ({ href, children, isActive, onClick }: NavLinkProps) => {
  return (
    <Link 
      href={href}
      onClick={onClick}
      className={`relative px-4 py-2 rounded-full font-medium transition-all duration-200 ${
        isActive
          ? 'text-blue-600 bg-blue-50'
          : 'text-gray-700 hover:text-blue-600 hover:bg-gray-50'
      }`}
    >
      {children}
      {isActive && (
        <span className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-1.5 h-1.5 bg-blue-600 rounded-full"></span>
      )}
    </Link>
  );
};

// Componente para los enlaces del menú móvil
const MobileNavLink = ({ href, children, isActive, onClick }: NavLinkProps) => {
  return (
    <Link 
      href={href}
      onClick={onClick}
      className={`flex items-center px-4 py-3 rounded-lg font-medium transition-all duration-200 ${
        isActive
          ? 'bg-gradient-to-r from-blue-50 to-teal-50 text-blue-600'
          : 'text-gray-700 hover:bg-gray-50'
      }`}
    >
      {children}
    </Link>
  );
};

export default Header;