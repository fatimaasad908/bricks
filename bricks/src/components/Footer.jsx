import { Link } from 'react-router-dom';
import { Landmark, ArrowRight } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-white pt-24 pb-8 border-t border-gray-100">
      <div className="container mx-auto px-6 max-w-7xl">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 lg:gap-8 mb-20">
          
          {/* Brand & Intro */}
          <div className="lg:pr-8">
            <Link to="/" className="flex items-center gap-2 mb-6 cursor-pointer">
              <Landmark className="h-6 w-6 text-terracotta-600" />
              <span className="text-xl font-bold tracking-tight text-brown-900">
                BRICKS
              </span>
            </Link>
            <p className="text-gray-500 text-sm leading-relaxed max-w-xs">
              Leading the industry in sustainable and high-durability brick manufacturing since 2004.
            </p>
          </div>

          {/* Company Links */}
          <div>
            <h3 className="font-bold text-brown-900 mb-6 text-sm tracking-wide">Company</h3>
            <ul className="space-y-4">
              {['Our Story', 'Sustainability', 'Careers', 'News'].map(item => (
                <li key={item}>
                  <Link to="/about" className="text-gray-500 text-sm hover:text-terracotta-600 transition-colors">
                    {item}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Support Links */}
          <div>
            <h3 className="font-bold text-brown-900 mb-6 text-sm tracking-wide">Support</h3>
            <ul className="space-y-4">
              {['Technical Docs', 'Shipping Policy', 'FAQ', 'Contact Support'].map((item, idx) => (
                <li key={item}>
                  <Link to={idx === 3 ? '/contact' : '#'} className="text-gray-500 text-sm hover:text-terracotta-600 transition-colors">
                    {item}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Newsletter */}
          <div>
            <h3 className="font-bold text-brown-900 mb-6 text-sm tracking-wide">Newsletter</h3>
            <p className="text-gray-500 text-sm mb-4 leading-relaxed">
              Get industry updates and special offers.
            </p>
            <form className="flex" onSubmit={e => e.preventDefault()}>
              <input 
                type="email" 
                placeholder="Email" 
                className="bg-gray-50 w-full px-4 py-2.5 rounded-l-md border border-gray-100 focus:outline-none focus:ring-1 focus:ring-terracotta-500 text-sm" 
              />
              <button 
                type="submit" 
                className="bg-terracotta-600 hover:bg-terracotta-700 text-white px-4 py-2.5 rounded-r-md transition-colors flex items-center justify-center shrink-0"
              >
                <ArrowRight className="w-4 h-4" />
              </button>
            </form>
          </div>

        </div>

        {/* Bottom Bar */}
        <div className="pt-8 flex flex-col md:flex-row items-center justify-between gap-4 text-xs text-gray-400 border-t border-gray-100">
          <p>© {new Date().getFullYear()} BRICKS Manufacturing. All rights reserved.</p>
          <div className="flex gap-8">
            <a href="#" className="hover:text-gray-600 transition-colors">Privacy Policy</a>
            <a href="#" className="hover:text-gray-600 transition-colors">Terms of Service</a>
          </div>
        </div>
      </div>
    </footer>
  );
}
