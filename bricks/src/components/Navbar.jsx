import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X, Landmark } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();
  const { user, logout } = useAuth();

  const navLinks = [
    { name: 'Home', path: '/' },
    { name: 'About', path: '/about' },
    { name: 'Products', path: '/products' },
    { name: 'Contact', path: '/contact' },
  ];

  return (
    <header className="bg-white border-b border-gray-100 sticky top-0 z-50">
      <div className="container mx-auto px-6">
        <div className="flex items-center justify-between h-[84px]">
          
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2">
            <Landmark className="h-6 w-6 text-terracotta-500" />
            <span className="text-xl font-bold tracking-tight text-brown-900">
              BRICKS
            </span>
          </Link>

          {/* Center Links */}
          <nav className="hidden md:flex items-center gap-8">
            {navLinks.map((link) => (
              <Link 
                key={link.name} 
                to={link.path}
                className={`text-[13px] font-semibold tracking-wide transition-colors ${
                  location.pathname === link.path ? 'text-terracotta-600' : 'text-gray-500 hover:text-brown-900'
                }`}
              >
                {link.name}
              </Link>
            ))}
          </nav>

          {/* Right Action */}
          <div className="hidden md:flex items-center gap-4 text-[13px] font-bold">
            {user ? (
              <>
                {user.role === 'admin' && (
                  <Link 
                    to="/admin/dashboard"
                    className="text-terracotta-600 hover:text-terracotta-700 transition-colors"
                  >
                    Admin Dashboard
                  </Link>
                )}
                <Link 
                  to="/profile"
                  className="text-gray-500 hover:text-brown-900 transition-colors"
                >
                  My Profile
                </Link>
                <button 
                  onClick={logout}
                  className="bg-gray-100 hover:bg-gray-200 text-brown-900 px-5 py-2.5 transition-colors rounded-sm"
                >
                  Logout
                </button>
              </>
            ) : (
              <Link 
                to="/login"
                className="bg-terracotta-600 hover:bg-terracotta-700 text-white px-5 py-2.5 transition-colors rounded-sm"
              >
                Customer Login
              </Link>
            )}
          </div>


          <button 
            className="md:hidden text-brown-900"
            onClick={() => setIsOpen(!isOpen)}
          >
            {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>
      </div>

      {isOpen && (
        <div className="md:hidden bg-white border-t border-gray-100 shadow-sm absolute w-full left-0 z-50">
          <div className="px-6 py-4 flex flex-col gap-4">
            {navLinks.map((link) => (
              <Link 
                key={link.name} 
                to={link.path}
                onClick={() => setIsOpen(false)}
                className="text-sm font-semibold text-brown-900 py-2"
              >
                {link.name}
              </Link>
            ))}
            {user ? (
              <>
                {user.role === 'admin' && (
                  <Link 
                    to="/admin/dashboard"
                    onClick={() => setIsOpen(false)}
                    className="text-sm font-semibold text-terracotta-600 py-2"
                  >
                    Admin Dashboard
                  </Link>
                )}
                <Link 
                  to="/profile"
                  onClick={() => setIsOpen(false)}
                  className="text-sm font-semibold text-brown-900 py-2"
                >
                  My Profile
                </Link>
                <button 
                  onClick={() => { logout(); setIsOpen(false); }}
                  className="bg-gray-100 text-brown-900 border border-gray-200 text-center py-3 rounded-sm text-sm font-bold mt-2"
                >
                  Logout
                </button>
              </>
            ) : (
              <Link 
                to="/login"
                onClick={() => setIsOpen(false)}
                className="bg-terracotta-600 text-white text-center py-3 rounded-sm text-sm font-bold mt-2"
              >
                Customer Login
              </Link>
            )}

          </div>
        </div>
      )}
    </header>
  );
}
