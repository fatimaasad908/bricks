import { Link, useNavigate } from 'react-router-dom';
import { Landmark, Lock, Mail } from 'lucide-react';
import { useState } from 'react';
import { useAuth } from '../context/AuthContext';

export default function Login() {
  const navigate = useNavigate();
  const { login, updateUserInfo } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    const result = await login(email, password, false);
    
    setLoading(false);
    if (result.success) {
      navigate('/profile');
    } else {
      setError(result.message);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <Link to="/" className="flex justify-center items-center gap-2 group mb-8">
          <Landmark className="h-8 w-8 text-terracotta-600" />
          <span className="text-3xl font-bold tracking-tight text-brown-900">
            BRICKS
          </span>
        </Link>
        <h2 className="text-center text-3xl font-bold tracking-tight text-brown-900">
          Sign in to your account
        </h2>
        <p className="mt-2 text-center text-sm text-gray-500">
          Or{' '}
          <Link to="/signup" className="font-medium text-terracotta-600 hover:text-terracotta-700">
            create a new account
          </Link>
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-12 px-8 shadow-xl border border-gray-100 sm:rounded-2xl">
          {error && <div className="mb-4 text-sm text-red-600 bg-red-50 p-3 rounded-md border border-red-100">{error}</div>}
          <form className="space-y-6" onSubmit={handleSubmit}>
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                Email address
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
                  className="block w-full pl-10 px-4 py-3 rounded-md border border-gray-200 focus:ring-1 focus:ring-terracotta-500 focus:border-terracotta-500 outline-none transition-all sm:text-sm"
                  placeholder="admin@bricks.com"
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
                  className="block w-full pl-10 px-4 py-3 rounded-md border border-gray-200 focus:ring-1 focus:ring-terracotta-500 focus:border-terracotta-500 outline-none transition-all sm:text-sm"
                  placeholder="••••••••"
                />
              </div>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <input
                  id="remember-me"
                  name="remember-me"
                  type="checkbox"
                  className="h-4 w-4 text-terracotta-600 focus:ring-terracotta-500 border-gray-300 rounded"
                />
                <label htmlFor="remember-me" className="ml-2 block text-sm text-gray-500">
                  Remember me
                </label>
              </div>

              <div className="text-sm">
                <a href="#" className="font-semibold text-terracotta-600 hover:text-terracotta-700">
                  Forgot your password?
                </a>
              </div>
            </div>

            <div>
              <button
                type="submit"
                disabled={loading}
                className={`w-full flex justify-center py-3 px-4 border border-transparent rounded-sm shadow-sm text-sm font-bold text-white bg-terracotta-600 hover:bg-terracotta-700 transition-colors ${loading ? 'opacity-75 cursor-not-allowed' : ''}`}
              >
                {loading ? 'Signing in...' : 'Sign in'}
              </button>
            </div>
          </form>

          <div className="mt-10">
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-200" />
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-3 bg-white text-gray-400 font-medium tracking-wide uppercase text-[10px]">Demo Access</span>
              </div>
            </div>

            <div className="mt-6 grid grid-cols-2 gap-4">
              <button 
                onClick={() => navigate('/admin/login')}
                className="text-center p-4 border border-terracotta-200 rounded-xl bg-terracotta-50 hover:bg-terracotta-100 transition-colors cursor-pointer group"
              >
                <span className="font-bold text-terracotta-700 block mb-1 group-hover:scale-105 transition-transform">Admin Portal</span>
                <span className="text-[10px] text-terracotta-600/80">Go to Admin Login</span>
              </button>
              <button 
                onClick={() => navigate('/')}
                className="text-center p-4 border border-gray-200 rounded-xl bg-gray-50 hover:bg-gray-100 transition-colors cursor-pointer group"
              >
                <span className="font-bold text-gray-700 block mb-1 group-hover:scale-105 transition-transform">Customer</span>
                <span className="text-[10px] text-gray-500">Return home</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
