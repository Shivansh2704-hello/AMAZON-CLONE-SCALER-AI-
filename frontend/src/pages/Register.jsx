import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { registerUser } from '../api/axiosConfig';

const Register = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: ''
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (formData.password !== formData.confirmPassword) {
      return setError('Passwords do not match');
    }

    setLoading(true);
    try {
      const res = await registerUser({
        name: formData.name,
        email: formData.email,
        phone: formData.phone,
        password: formData.password
      });

      if (res.data.success) {
        login(res.data.token, res.data.user);
        navigate('/');
      } else {
        setError(res.data.message || 'Registration failed');
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed. Try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-center bg-white min-h-screen py-6 px-4">
      <Link to="/" className="mb-6">
        <img 
          src="https://upload.wikimedia.org/wikipedia/commons/a/a9/Amazon_logo.svg" 
          alt="Amazon.in" 
          className="h-8 object-contain"
        />
        <span className="text-sm font-bold ml-1">.in</span>
      </Link>

      <div className="w-full max-w-[350px] border border-gray-300 p-6 rounded-md shadow-sm mb-6">
        <h1 className="text-3xl font-normal mb-4">Create Account</h1>
        
        {error && (
          <div className="bg-red-50 border border-red-400 text-red-700 px-3 py-2 rounded text-sm mb-4 flex items-center">
            <span className="mr-2">⚠️</span> {error}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="mb-3">
            <label className="block text-sm font-bold mb-1">Your name</label>
            <input
              type="text"
              name="name"
              placeholder="First and last name"
              className="w-full border border-gray-400 rounded p-1 mb-2 focus:outline-none focus:ring-1 focus:ring-[#e77600] focus:border-[#e77600] shadow-sm h-8"
              value={formData.name}
              onChange={handleChange}
              required
            />
          </div>

          <div className="mb-3">
            <label className="block text-sm font-bold mb-1">Mobile number (optional)</label>
            <input
              type="text"
              name="phone"
              className="w-full border border-gray-400 rounded p-1 mb-2 focus:outline-none focus:ring-1 focus:ring-[#e77600] focus:border-[#e77600] shadow-sm h-8"
              value={formData.phone}
              onChange={handleChange}
            />
          </div>

          <div className="mb-3">
            <label className="block text-sm font-bold mb-1">Email</label>
            <input
              type="email"
              name="email"
              className="w-full border border-gray-400 rounded p-1 mb-2 focus:outline-none focus:ring-1 focus:ring-[#e77600] focus:border-[#e77600] shadow-sm h-8"
              value={formData.email}
              onChange={handleChange}
              required
            />
          </div>

          <div className="mb-3">
            <label className="block text-sm font-bold mb-1">Password</label>
            <input
              type="password"
              name="password"
              placeholder="At least 6 characters"
              className="w-full border border-gray-400 rounded p-1 focus:outline-none focus:ring-1 focus:ring-[#e77600] focus:border-[#e77600] shadow-sm h-8"
              value={formData.password}
              onChange={handleChange}
              required
              minLength={6}
            />
            <p className="text-[11px] text-gray-600 mt-1">i Passwords must be at least 6 characters.</p>
          </div>

          <div className="mb-4">
            <label className="block text-sm font-bold mb-1">Confirm password</label>
            <input
              type="password"
              name="confirmPassword"
              className="w-full border border-gray-400 rounded p-1 mb-2 focus:outline-none focus:ring-1 focus:ring-[#e77600] focus:border-[#e77600] shadow-sm h-8"
              value={formData.confirmPassword}
              onChange={handleChange}
              required
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-1 text-sm bg-gradient-to-b from-[#f7dfa5] to-[#f0c14b] border border-[#a88734] hover:bg-gradient-to-b hover:from-[#f5d78e] hover:to-[#eeb933] rounded-sm shadow-sm transition-all h-8 mb-4"
          >
            {loading ? 'Creating account...' : 'Create your Amazon account'}
          </button>
        </form>

        <p className="text-xs text-gray-700 leading-relaxed border-t border-gray-100 pt-4">
          By creating an account, you agree to Amazon's <Link to="#" className="text-[#0066c0] hover:underline">Conditions of Use</Link> and <Link to="#" className="text-[#0066c0] hover:underline">Privacy Notice</Link>.
        </p>

        <p className="text-xs text-black font-semibold mt-4">
          Already have an account? <Link to="/login" className="text-[#0066c0] hover:underline ml-1">Sign in</Link>
        </p>
      </div>

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

export default Register;
