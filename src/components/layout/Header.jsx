import { useNavigate, useLocation } from 'react-router-dom';
import { Menu, X } from 'lucide-react';
import { useState, useEffect } from 'react';

export default function Header() {
  const navigate = useNavigate();
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navLinks = [
    { label: 'Medical Aid', href: '#medical' },
    { label: 'Pregnancy', href: '#pregnancy' },
    { label: 'Postpartum', href: '#postpartum' },
    { label: 'Marketplace', href: '#marketplace' },
    { label: 'Recipes', href: '#recipes' },
    { label: 'AI Assistant', href: '#ai' },
  ];

  const handleNavClick = (e, href) => {
    e.preventDefault();
    setMobileMenuOpen(false);
    
    // If not on landing page, navigate there first
    if (location.pathname !== '/') {
      navigate('/');
      // Wait for navigation then scroll
      setTimeout(() => {
        const element = document.querySelector(href);
        if (element) {
          element.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
      }, 100);
    } else {
      // Already on landing page, just scroll
      const element = document.querySelector(href);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    }
  };

  return (
    <header className="sticky top-0 z-50 bg-white border-b border-gray-200 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <div 
            onClick={() => navigate('/')}
            className="flex items-center space-x-2 cursor-pointer hover:opacity-80 transition"
          >
            <div className="h-10 w-10 rounded-full bg-primary-500 flex items-center justify-center">
              <img src="/icon.jpg" alt="MC-Aid Clinic Logo" className="h-full w-full object-cover" />
            </div>
            <div>
              <h1 className="text-lg font-bold text-gray-900">MC-Aid Clinic</h1>
              <p className="text-xs text-gray-500">Comprehensive family healthcare</p>
            </div>
          </div>

          {/* Desktop Navigation Links */}
          <nav className="hidden lg:flex items-center space-x-1">
            {navLinks.map((link) => (
              <a
                key={link.label}
                href={link.href}
                onClick={(e) => handleNavClick(e, link.href)}
                className="px-3 py-2 text-sm text-gray-600 hover:text-primary-500 hover:bg-gray-50 rounded-md transition cursor-pointer"
              >
                {link.label}
              </a>
            ))}
          </nav>

          {/* Auth Buttons */}
          <div className="flex items-center space-x-3">
            <button
              onClick={() => navigate('/login')}
              className="hidden sm:flex items-center space-x-2 px-4 py-2 text-sm text-primary-500 border border-primary-500 rounded-lg hover:bg-sky-300 transition font-medium"
            >
              <span>Login</span>
            </button>
            <button
              onClick={() => navigate('/register')}
              className="flex items-center space-x-2 px-4 py-2 text-sm bg-sky-500 text-white rounded-lg hover:bg-sky-900 transition font-medium shadow-md"
            >
              <span className="hidden sm:inline">Register</span>
              <span className="sm:hidden">Sign Up</span>
            </button>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden p-2 hover:bg-gray-100 rounded-lg"
            >
              {mobileMenuOpen ? (
                <X className="h-6 w-6 text-gray-600" />
              ) : (
                <Menu className="h-6 w-6 text-gray-600" />
              )}
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {mobileMenuOpen && (
          <div className="lg:hidden pb-4 border-t border-gray-200">
            <nav className="flex flex-col space-y-1 pt-4">
              {navLinks.map((link) => (
                <a
                  key={link.label}
                  href={link.href}
                  onClick={(e) => handleNavClick(e, link.href)}
                  className="px-3 py-2 text-sm text-gray-600 hover:text-primary-500 hover:bg-gray-50 rounded-md transition cursor-pointer"
                >
                  {link.label}
                </a>
              ))}
            </nav>
          </div>
        )}
      </div>
    </header>
  );
}
