'use client';

import Link from 'next/link';
import { useState, useRef, useEffect } from 'react';
import { useCart } from '@/context/CartContext';
import AuthModal from './AuthModal';

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const { cart, user, isAuthenticated, logout } = useCart();
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  const cartItemsCount = cart.reduce((sum: number, item: any) => sum + item.quantity, 0);

  const handleMouseEnter = (menuName: string) => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
    setActiveDropdown(menuName);
  };

  const handleMouseLeave = () => {
    timeoutRef.current = setTimeout(() => {
      setActiveDropdown(null);
    }, 300); // 300ms delay before closing
  };

  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  const menuItems = [
    {
      name: 'Plants',
      items: [
        { name: 'All Plants', href: '/shop' },
        { name: 'Indoor Plants', href: '/shop?category=indoor' },
        { name: 'Outdoor Plants', href: '/shop?category=outdoor' },
        { name: 'Low Maintenance', href: '/shop?category=low-maintenance' },
        { name: 'Pet Friendly', href: '/shop?category=pet-friendly' },
        { name: 'Cacti & Succulents', href: '/shop?category=cacti' },
      ]
    },
    {
      name: 'Care Tools',
      items: [
        { name: 'Watering Cans', href: '/shop?category=watering-tools' },
        { name: 'Plant Food & Fertilizer', href: '/shop?category=fertilizer' },
        { name: 'Pots & Planters', href: '/shop?category=pots' },
        { name: 'Soil & Potting Mix', href: '/shop?category=soil' },
        { name: 'Pruning Tools', href: '/shop?category=pruning' },
        { name: 'Plant Care Kits', href: '/shop?category=care-kits' },
      ]
    },
    {
      name: 'Gifts',
      items: [
        { name: 'Gift Shop', href: '/shop?category=gifts' },
        { name: 'Plant Bundles', href: '/shop?category=bundles' },
        { name: 'Gift Cards', href: '/gift-cards' },
        { name: 'Subscription Boxes', href: '/subscriptions' },
        { name: 'Corporate Gifting', href: '/corporate-gifts' },
      ]
    },
    {
      name: 'Learn',
      items: [
        { name: 'Plant Care Guide', href: '/care-guide' },
        { name: 'Plant Care Blog', href: '/blog' },
        { name: 'FAQ', href: '/faq' },
        { name: 'Troubleshooting', href: '/troubleshooting' },
        { name: 'Plant of the Month', href: '/plant-of-month' },
      ]
    },
  ];

  return (
    <header className="bg-white shadow-sm sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link href="/" className="text-2xl font-bold text-green-600">
            BuyPlants
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex space-x-6">
            {menuItems.map((menu) => (
              <div
                key={menu.name}
                className="relative group"
                onMouseEnter={() => handleMouseEnter(menu.name)}
                onMouseLeave={handleMouseLeave}
              >
                <button className="text-gray-700 hover:text-green-600 font-medium py-2 flex items-center">
                  {menu.name}
                  <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </button>
                
                {/* Dropdown Menu */}
                {activeDropdown === menu.name && (
                  <div 
                    className="absolute left-0 mt-0 w-56 bg-white rounded-lg shadow-xl py-2 z-50 border border-gray-100"
                    onMouseEnter={() => handleMouseEnter(menu.name)}
                    onMouseLeave={handleMouseLeave}
                  >
                    {menu.items.map((item) => (
                      <Link
                        key={item.name}
                        href={item.href}
                        className="block px-4 py-3 text-gray-700 hover:bg-green-50 hover:text-green-600 transition-colors"
                        onClick={() => setActiveDropdown(null)}
                      >
                        {item.name}
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            ))}
            
            <Link href="/corporate-gifts" className="text-gray-700 hover:text-green-600 font-medium py-2">
              Corporate Gifts
            </Link>
          </nav>

          {/* Cart & Mobile Menu Button */}
          <div className="flex items-center space-x-4">
            {/* User Auth Button */}
            {isAuthenticated && user ? (
              <div className="hidden md:flex items-center space-x-3">
                <span className="text-sm text-gray-700">
                  Hi, {user.firstName || user.email}
                </span>
                <button
                  onClick={logout}
                  className="text-sm text-gray-600 hover:text-red-600 font-medium"
                >
                  Logout
                </button>
              </div>
            ) : (
              <button
                onClick={() => setShowAuthModal(true)}
                className="hidden md:block text-gray-700 hover:text-green-600 font-medium"
              >
                Login
              </button>
            )}

            <Link href="/cart" className="relative">
              <svg className="w-6 h-6 text-gray-700 hover:text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
              {cartItemsCount > 0 && (
                <span className="absolute -top-2 -right-2 bg-green-600 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                  {cartItemsCount}
                </span>
              )}
            </Link>

            {/* Mobile menu button */}
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="md:hidden text-gray-700"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                {isMenuOpen ? (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                ) : (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                )}
              </svg>
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <nav className="lg:hidden py-4 space-y-2 border-t">
            {menuItems.map((menu) => (
              <div key={menu.name} className="border-b pb-2">
                <button
                  onClick={() => setActiveDropdown(activeDropdown === menu.name ? null : menu.name)}
                  className="w-full text-left py-2 text-gray-900 font-semibold flex justify-between items-center"
                >
                  {menu.name}
                  <svg
                    className={`w-4 h-4 transition-transform ${activeDropdown === menu.name ? 'rotate-180' : ''}`}
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </button>
                {activeDropdown === menu.name && (
                  <div className="pl-4 space-y-1 mt-2">
                    {menu.items.map((item) => (
                      <Link
                        key={item.name}
                        href={item.href}
                        className="block py-2 text-gray-600 hover:text-green-600"
                        onClick={() => setIsMenuOpen(false)}
                      >
                        {item.name}
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            ))}
            <Link
              href="/corporate-gifts"
              className="block py-2 text-gray-700 hover:text-green-600 font-semibold"
              onClick={() => setIsMenuOpen(false)}
            >
              Corporate Gifts
            </Link>

            {/* Mobile Auth Button */}
            {isAuthenticated && user ? (
              <div className="py-2 border-t mt-2 pt-2">
                <p className="text-sm text-gray-700 mb-2">Hi, {user.firstName || user.email}</p>
                <button
                  onClick={() => {
                    logout();
                    setIsMenuOpen(false);
                  }}
                  className="text-red-600 hover:text-red-700 font-medium"
                >
                  Logout
                </button>
              </div>
            ) : (
              <button
                onClick={() => {
                  setShowAuthModal(true);
                  setIsMenuOpen(false);
                }}
                className="block py-2 text-green-600 hover:text-green-700 font-semibold border-t mt-2 pt-2"
              >
                Login / Sign Up
              </button>
            )}
          </nav>
        )}
      </div>

      {/* Auth Modal */}
      <AuthModal
        isOpen={showAuthModal}
        onClose={() => setShowAuthModal(false)}
        onLogin={(email, firstName, lastName) => {
          const { login } = useCart();
          login(email, firstName, lastName);
        }}
      />
    </header>
  );
}
