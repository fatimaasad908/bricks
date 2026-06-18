import { Link, useNavigate } from 'react-router-dom';
import { Landmark, Lock, Mail, ShieldAlert } from 'lucide-react';
import { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';

export default function AdminLogin() {
  const navigate = useNavigate();
  const { login, user } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  // If already logged in as admin, redirect immediately
  useEffect(() => {
    if (user && user.role === 'admin') {
      navigate('/admin/dashboard');
    }
  }, [user, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    const result = await login(email, password, true);
    
    setLoading(false);
    if (result.success) {
      navigate('/admin/dashboard');
    } else {
      setError(result.message);
    }
  };

  return (
    <div className="min-h-screen bg-brown-900 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <Link to="/" className="flex justify-center items-center gap-2 group mb-8">
          <Landmark className="h-8 w-8 text-terracotta-500" />
          <span className="text-3xl font-bold tracking-tight text-white">
            BRICKS <span className="text-terracotta-500 font-normal">ADMIN</span>
          </span>
        </Link>
        <h2 className="text-center text-3xl font-bold tracking-tight text-white">
          Administrator Portal
        </h2>
        <p className="mt-2 text-center text-sm text-gray-400">
          Secure access for authorized system managers only
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-12 px-8 shadow-xl border border-gray-100 sm:rounded-2xl">
          
          {error && (
            <div className="mb-4 text-sm text-red-600 bg-red-50 p-3 rounded-md border border-red-100 flex gap-2 items-center">
              <ShieldAlert className="w-5 h-5 shrink-0 text-red-500" />
              <span>{error}</span>
            </div>
          )}

          <form className="space-y-6" onSubmit={handleSubmit}>
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                Admin Email Address
              </label>
              <div className="mt-2 relative rounded-md shadow-sm">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Mail className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="block w-full pl-10 px-4 py-3 rounded-md border border-gray-200 focus:ring-1 focus:ring-terracotta-500 focus:border-terracotta-500 outline-none transition-all sm:text-sm text-brown-900"
                  placeholder="asadfatima93@gmail.com"
                />
              </div>
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                Password
              </label>
              <div className="mt-2 relative rounded-md shadow-sm">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Lock className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  id="password"
                  name="password"
                  type="password"
                  autoComplete="current-password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="block w-full pl-10 px-4 py-3 rounded-md border border-gray-200 focus:ring-1 focus:ring-terracotta-500 focus:border-terracotta-500 outline-none transition-all sm:text-sm text-brown-900"
                  placeholder="••••••••"
                />
              </div>
            </div>

            <div>
              <button
                type="submit"
                disabled={loading}
                className={`w-full flex justify-center py-3 px-4 border border-transparent rounded-sm shadow-sm text-sm font-bold text-white bg-terracotta-600 hover:bg-terracotta-700 transition-colors ${loading ? 'opacity-75 cursor-not-allowed' : ''}`}
              >
                {loading ? 'Authenticating...' : 'Sign In as Admin'}
              </button>
            </div>
          </form>

          <div className="mt-8 pt-6 border-t border-gray-100 text-center">
            <Link to="/login" className="text-xs font-semibold text-terracotta-600 hover:text-terracotta-700">
              Return to Customer Login
            </Link>
          </div>

          <div className="mt-6 bg-gray-50 p-4 rounded-xl border border-gray-100 text-center">
            <span className="block text-[10px] font-bold text-gray-400 tracking-wider uppercase mb-1">Admin Credentials</span>
            <code className="text-xs font-mono text-brown-700 bg-gray-100 px-2 py-0.5 rounded">asadfatima93@gmail.com</code>
            <span className="mx-2 text-gray-300">/</span>
            <code className="text-xs font-mono text-brown-700 bg-gray-100 px-2 py-0.5 rounded">admin123</code>
          </div>

        </div>
      </div>
    </div>
  );
}
