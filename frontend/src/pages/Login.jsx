import { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { loginUser } from '../api/axiosConfig';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const from = location.state?.from?.pathname || "/";

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const res = await loginUser({ email, password });
      if (res.data.success) {
        login(res.data.token, res.data.user);
        navigate(from, { replace: true });
      } else {
        setError(res.data.message || 'Login failed');
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Invalid email or password');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-center bg-white min-h-screen py-6 px-4">
      {/* Amazon.in Logo */}
      <Link to="/" className="mb-6">
        <img 
          src="https://upload.wikimedia.org/wikipedia/commons/a/a9/Amazon_logo.svg" 
          alt="Amazon.in" 
          className="h-8 object-contain"
        />
        <span className="text-sm font-bold ml-1">.in</span>
      </Link>

      <div className="w-full max-w-[350px] border border-gray-300 p-6 rounded-md shadow-sm mb-6">
        <h1 className="text-3xl font-normal mb-4">Sign in</h1>
        
        {error && (
          <div className="bg-red-50 border border-red-400 text-red-700 px-3 py-2 rounded text-sm mb-4 flex items-center">
            <span className="mr-2">⚠️</span> {error}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="mb-3">
            <label className="block text-sm font-bold mb-1">Email or mobile phone number</label>
            <input
              type="email"
              className="w-full border border-gray-400 rounded p-1 mb-2 focus:outline-none focus:ring-1 focus:ring-[#e77600] focus:border-[#e77600] shadow-sm h-8"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div className="mb-4">
            <div className="flex justify-between items-center mb-1">
              <label className="text-sm font-bold">Password</label>
              <Link to="#" className="text-xs text-[#0066c0] hover:text-[#c45500] hover:underline">Forgot Password?</Link>
            </div>
            <input
              type="password"
              className="w-full border border-gray-400 rounded p-1 mb-2 focus:outline-none focus:ring-1 focus:ring-[#e77600] focus:border-[#e77600] shadow-sm h-8"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-1 text-sm bg-gradient-to-b from-[#f7dfa5] to-[#f0c14b] border border-[#a88734] hover:bg-gradient-to-b hover:from-[#f5d78e] hover:to-[#eeb933] active:from-[#f0c14b] active:to-[#f7dfa5] rounded-sm shadow-sm transition-all h-8"
          >
            {loading ? 'Please wait...' : 'Sign in'}
          </button>
        </form>

        <p className="text-xs text-gray-700 mt-4 leading-relaxed">
          By continuing, you agree to Amazon's <Link to="#" className="text-[#0066c0] hover:underline">Conditions of Use</Link> and <Link to="#" className="text-[#0066c0] hover:underline">Privacy Notice</Link>.
        </p>

        <details className="mt-4 text-xs cursor-pointer">
          <summary className="text-[#0066c0] hover:text-[#c45500] hover:underline">Need help?</summary>
        </details>
      </div>

      <div className="w-full max-w-[350px] flex items-center mb-4">
        <div className="flex-1 border-t border-gray-300"></div>
        <span className="px-2 text-xs text-gray-500">New to Amazon?</span>
        <div className="flex-1 border-t border-gray-300"></div>
      </div>

      <Link 
        to="/register"
        className="w-full max-w-[350px] py-1 text-sm text-center bg-gradient-to-b from-[#fcfcfc] to-[#e7e9ec] border border-[#adb1b8] hover:bg-gradient-to-b hover:from-[#f7f8fa] hover:to-[#e7e9ec] rounded-sm shadow-sm transition-all h-8"
      >
        Create your Amazon account
      </Link>

      <footer className="mt-8 pt-6 border-t border-gray-100 w-full max-w-[500px] flex flex-col items-center">
        <div className="flex space-x-6 text-xs text-[#0066c0] mb-2">
          <Link to="#" className="hover:underline">Conditions of Use</Link>
          <Link to="#" className="hover:underline">Privacy Notice</Link>
          <Link to="#" className="hover:underline">Help</Link>
        </div>
        <p className="text-[10px] text-gray-500">© 1996-2024, Amazon.com, Inc. or its affiliates</p>
      </footer>
    </div>
  );
};

export default Login;
