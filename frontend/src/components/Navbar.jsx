import { useState, useEffect, useRef } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { Search, ShoppingCart, MapPin, ChevronDown } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import API from '../api/axiosConfig';
import './Navbar.css';

/**
 * Navbar component for amazon.in upgrade.
 * Includes logo, location, search, account, orders, and cart.
 */
const Navbar = () => {
  const { user, logout } = useAuth();
  const { cartCount } = useCart();
  const [searchQuery, setSearchQuery] = useState('');
  const [suggestions, setSuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const dropdownRef = useRef(null);
  const navigate = useNavigate();

  // Debounced search autocomplete logic
  useEffect(() => {
    const timer = setTimeout(async () => {
      if (searchQuery.length > 1) {
        try {
          const res = await API.get(`/api/products?search=${searchQuery}&limit=5`);
          setSuggestions(res.data?.data || []);
          setShowSuggestions(true);
        } catch (err) {
          console.error('Search error', err);
        }
      } else {
        setSuggestions([]);
        setShowSuggestions(false);
      }
    }, 300);
    return () => clearTimeout(timer);
  }, [searchQuery]);

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/?search=${encodeURIComponent(searchQuery)}`);
      setShowSuggestions(false);
    }
  };

  return (
    <header className="navbar-container">
      <nav className="navbar">
        
        {/* Logo */}
        <Link to="/" className="navbar__logo">
          <img 
            src="https://pngimg.com/uploads/amazon/amazon_PNG11.png" 
            alt="Amazon" 
            className="navbar__logo-img"
          />
          <span className="navbar__logo-dot-in">.in</span>
        </Link>

        {/* Location */}
        <div className="navbar__location">
          <span className="navbar__location-top">Deliver to</span>
          <div className="navbar__location-bot">
            <MapPin size={15} />
            <span className="navbar__location-text">India</span>
          </div>
        </div>

        {/* Search Bar */}
        <form onSubmit={handleSearch} className="navbar__search-form">
          <div className="navbar__search-category">
            All <ChevronDown size={14} />
          </div>
          <input
            type="text"
            className="navbar__search-input"
            placeholder="Search Amazon.in"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onFocus={() => searchQuery.length > 1 && setShowSuggestions(true)}
          />
          <button type="submit" className="navbar__search-btn">
            <Search size={22} color="black" />
          </button>

          {/* Autocomplete Dropdown */}
          {showSuggestions && suggestions.length > 0 && (
            <div ref={dropdownRef} className="navbar__suggestions">
              {suggestions.map((item) => (
                <div 
                  key={item.id}
                  className="navbar__suggestion-item"
                  onClick={() => {
                    navigate(`/product/${item.id}`);
                    setShowSuggestions(false);
                    setSearchQuery('');
                  }}
                >
                  <div className="navbar__suggestion-main">
                    <Search size={14} color="#999" />
                    <span>{item.name}</span>
                  </div>
                  <span className="navbar__suggestion-category">
                    {item.category_name}
                  </span>
                </div>
              ))}
            </div>
          )}
        </form>

        {/* Account & Lists */}
        <div className="navbar__option navbar__account">
          <span className="navbar__option-top">Hello, {user?.name ? user.name.split(' ')[0] : 'Sign In'}</span>
          <div className="navbar__option-bot">
            <span>Account & Lists</span>
            <ChevronDown size={12} />
          </div>
          
          {/* Dropdown Menu */}
          <div className="navbar__dropdown">
            <h3 className="navbar__dropdown-title">Your Account</h3>
            <ul className="navbar__dropdown-list">
              <li className="navbar__dropdown-item">
                <Link to="/orders" className="navbar__dropdown-link">Your Orders</Link>
              </li>
              <li className="navbar__dropdown-item">Your Wish List</li>
              <li className="navbar__dropdown-item" onClick={logout}>Sign Out</li>
            </ul>
          </div>
        </div>

        {/* Returns & Orders */}
        <Link to="/orders" className="navbar__option">
          <span className="navbar__option-top">Returns</span>
          <span className="navbar__option-bot">& Orders</span>
        </Link>

        {/* Cart */}
        <Link to="/cart" className="navbar__cart">
          <div className="navbar__cart-icon-container">
            <span className="navbar__cart-count">{cartCount}</span>
            <ShoppingCart size={32} />
          </div>
          <span className="navbar__option-bot">Cart</span>
        </Link>
      </nav>
    </header>
  );
};

export default Navbar;
