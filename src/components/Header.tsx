'use client';

import Link from 'next/link';
import { useState } from 'react';

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const navigationItems = [
    { name: 'Home', href: '/' },
    { name: 'Plan My Route', href: '/route-builder' },
    { name: 'Popular Trips', href: '/popular-trips' },
    { name: 'Local Getaways', href: '/local-getaways' },
    { name: 'How It Works', href: '/how-it-works' },
    { name: 'About', href: '/about' },
    { name: 'FAQs', href: '/faqs' },
    { name: "Let's Chat", href: '/contact' },
  ];

  return (
    <header className="bg-white/95 backdrop-blur-md shadow-sm border-b border-slate-200/60 font-inter sticky top-0 z-50 transition-all duration-300">
      <div className="max-w-7xl mx-auto px-6 md:px-8">
        <div className="flex justify-between items-center h-20">
          {/* Logo */}
          <div className="flex-shrink-0">
            <Link href="./" className="flex items-center space-x-3 text-xl font-bold text-slate-900 hover:text-teal-600 transition-colors duration-300">
              <img 
                src="images/logo.png" 
                alt="Southbound Logo" 
                className="h-10 w-10 object-contain"
              />
              <span>Southbound</span>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-8">
            {navigationItems.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className="text-slate-600 hover:text-teal-600 text-sm font-medium transition-colors duration-300 relative group"
              >
                {item.name}
                <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-gradient-to-r from-teal-500 to-orange-500 group-hover:w-full transition-all duration-300"></span>
              </Link>
            ))}
          </nav>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="inline-flex items-center justify-center p-2 rounded-lg text-slate-600 hover:text-teal-600 hover:bg-slate-50 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-teal-500 transition-colors duration-300"
              aria-expanded="false"
            >
              <span className="sr-only">Open main menu</span>
              {!isMenuOpen ? (
                <svg className="block h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              ) : (
                <svg className="block h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              )}
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="md:hidden border-t border-slate-200/60 bg-white/95 backdrop-blur-md">
            <div className="px-4 pt-2 pb-4 space-y-1">
              {navigationItems.map((item) => (
                <Link
                  key={item.name}
                  href={item.href}
                  className="text-slate-600 hover:text-teal-600 hover:bg-slate-50 block px-4 py-3 rounded-lg text-base font-medium transition-colors duration-300"
                  onClick={() => setIsMenuOpen(false)}
                >
                  {item.name}
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header; 
