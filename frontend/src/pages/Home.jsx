import { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { fetchProducts, fetchCategories, addToCart } from '../api/axiosConfig';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import ProductCard from '../components/ProductCard';
import HeroBanner from '../components/HeroBanner';
import LoadingSpinner from '../components/LoadingSpinner';
import './Home.css';

const DEAL_CARDS = [
  { title: 'Pick up where you left off', img: '/images/banners/electronics.png', cat: '1', sub: 'Electronics' },
  { title: 'Continue shopping deals', img: '/images/banners/kitchen.png', cat: '4', sub: 'Home & Kitchen' },
  { title: 'Revamp your wardrobe', img: '/images/banners/fashion.png', cat: '3', sub: 'Clothing' },
  { title: 'Best-selling books', img: '/images/banners/books.png', cat: '5', sub: 'Books' },
];

const Home = () => {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [isAdding, setIsAdding] = useState(null);
  
  const { user } = useAuth();
  const { refreshCartCount } = useCart();
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  
  const searchQuery = searchParams.get('search') || '';
  const selectedCategory = searchParams.get('category') || '';

  const setSelectedCategory = (val) => {
    setSearchParams(val ? { category: val } : {});
  };

  useEffect(() => {
    fetchCategories().then(res => setCategories(res.data?.data || []));
  }, []);

  useEffect(() => {
    setLoading(true);
    setError('');
    fetchProducts({ search: searchQuery, category: selectedCategory })
      .then(res => {
        setProducts(res.data?.data || []);
      })
      .catch(() => setError('Failed to load products.'))
      .finally(() => setLoading(false));
  }, [searchQuery, selectedCategory]);

  const handleAddToCart = async (productId) => {
    if (!user) {
      navigate('/login', { state: { from: { pathname: '/' } } });
      return;
    }
    
    setIsAdding(productId);
    try {
      await addToCart(productId, 1);
      refreshCartCount(); // Instant navbar update
      return true; // Inform ProductCard of success
    } catch (err) {
      alert(err.response?.data?.message || 'Could not add to cart');
      return false;
    } finally {
      setIsAdding(null);
    }
  };

  const handleBuyNow = async (productId) => {
    const success = await handleAddToCart(productId);
    if (success) {
      navigate('/checkout');
    }
  };

  const isFiltered = !!(searchQuery || selectedCategory);

  return (
    <div>
      {!isFiltered && <HeroBanner />}

      <div className="page-wrapper">
        {!isFiltered && (
          <div className="home__deals">
            {DEAL_CARDS.map((card) => (
              <button
                key={card.cat}
                className="home__deal-card"
                onClick={() => setSelectedCategory(card.cat)}
              >
                <img src={card.img} alt={card.title} className="home__deal-img" />
                <p className="home__deal-title">{card.title}</p>
                <span className="home__deal-link">See more in {card.sub}</span>
              </button>
            ))}
          </div>
        )}

        <div className="home__filters">
          <button
            className={`home__filter-btn ${!selectedCategory ? 'home__filter-btn--active' : ''}`}
            onClick={() => setSelectedCategory('')}
          >All</button>
          {categories.map(cat => (
            <button
              key={cat.id}
              className={`home__filter-btn ${selectedCategory == cat.id ? 'home__filter-btn--active' : ''}`}
              onClick={() => setSelectedCategory(cat.id)}
            >{cat.name}</button>
          ))}
        </div>

        <div className="home__section-header">
          <h2 className="home__section-title">
            {searchQuery
              ? <>Results for <em>"{searchQuery}"</em></>
              : selectedCategory
                ? categories.find(c => c.id == selectedCategory)?.name || 'Products'
                : 'Featured Products'}
          </h2>
          {products.length > 0 && (
            <span className="home__result-count">{products.length} results</span>
          )}
        </div>

        {loading && <LoadingSpinner />}
        {error && <p className="error-message">{error}</p>}

        {!loading && !error && products.length === 0 && (
          <div className="empty-state">
            <h2>No products found</h2>
            <p>Try a different search or category.</p>
          </div>
        )}

        {!loading && !error && (
          <div className="home__grid">
            {products.map(product => (
              <ProductCard
                key={product.id}
                product={product}
                onAddToCart={handleAddToCart}
                onBuyNow={handleBuyNow}
                isAdding={isAdding}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Home;
