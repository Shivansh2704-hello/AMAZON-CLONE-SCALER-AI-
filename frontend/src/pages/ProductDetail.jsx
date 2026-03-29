import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { fetchProductById, addToCart } from '../api/axiosConfig';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import LoadingSpinner from '../components/LoadingSpinner';
import { ShoppingCart, Zap, ChevronLeft, ChevronRight, Check } from 'lucide-react';
import './ProductDetail.css';

/**
 * ProductDetail — Amazon detail page layout.
 * Displays images, info, price, stock, and specifications.
 */
const ProductDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { refreshCartCount } = useCart();
  
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [imgIdx, setImgIdx] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [isAddingCart, setIsAddingCart] = useState(false);
  const [justAdded, setJustAdded] = useState(false);

  useEffect(() => {
    window.scrollTo(0, 0);
    setLoading(true);
    fetchProductById(id)
      .then(res => {
        if (res.data?.success) {
          setProduct(res.data.data);
        } else {
          setError(res.data?.message || 'Product not found');
        }
      })
      .catch(err => {
        console.error('Fetch error:', err);
        setError('Failed to load product details. Please try again later.');
      })
      .finally(() => setLoading(false));
  }, [id]);

  const handleAddToCart = async () => {
    if (!user) {
      navigate('/login', { state: { from: { pathname: `/product/${id}` } } });
      return;
    }

    setIsAddingCart(true);
    try {
      await addToCart(product.id, quantity);
      refreshCartCount(); // Update navbar count
      setJustAdded(true);
      setTimeout(() => setJustAdded(false), 3000);
    } catch (err) {
      alert(err.response?.data?.message || 'Could not add to cart');
    } finally {
      setIsAddingCart(false);
    }
  };

  const handleBuyNow = () => {
    if (!user) {
      navigate('/login', { state: { from: { pathname: `/product/${id}` } } });
      return;
    }

    navigate('/checkout', {
      state: {
        buyNow: { 
          product_id: product.id, 
          quantity, 
          price: product.price, 
          name: product.name,
          image_url: product.images?.[0]?.image_url || product.image_url 
        }
      }
    });
  };

  if (loading) return <LoadingSpinner />;
  
  if (error) return (
    <div className="page-wrapper py-10">
      <div className="error-message max-w-2xl mx-auto">
        <h2 className="text-xl font-bold mb-2">Error</h2>
        <p>{error}</p>
        <button 
          onClick={() => navigate('/')} 
          className="mt-4 text-[#007185] hover:text-[#c45500] hover:underline"
        >
          Return to home page
        </button>
      </div>
    </div>
  );

  if (!product) return null;

  const images = product.images?.length 
    ? product.images 
    : (product.image_url ? [{ image_url: product.image_url }] : [{ image_url: 'https://placehold.co/600x600?text=No+Image' }]);

  const specs = typeof product.specifications === 'string' 
    ? JSON.parse(product.specifications || '{}') 
    : (product.specifications || {});

  const stars = '★'.repeat(Math.round(product.rating)) + '☆'.repeat(5 - Math.round(product.rating));

  return (
    <div className="page-wrapper bg-white py-4 md:py-6">
      <div className="product-detail-container">
        {/* Gallery Section */}
        <div className="detail__gallery">
          <div className="detail__thumbnails">
            {images.map((img, i) => (
              <div 
                key={i}
                className={`detail__thumb-container ${i === imgIdx ? 'detail__thumb-container--active' : ''}`}
                onMouseEnter={() => setImgIdx(i)}
              >
                <img src={img.image_url} alt="" className="detail__thumb-img" />
              </div>
            ))}
          </div>
          <div className="detail__main-img-box">
            <img
              src={images[imgIdx]?.image_url}
              alt={product.name}
              className="detail__main-img"
            />
          </div>
        </div>

        {/* Info Section */}
        <div className="detail__info">
          <h1 className="detail__title">{product.name}</h1>
          <div className="detail__brand">
            Visit the {product.brand || 'Amazon'} Store
          </div>
          
          <div className="detail__rating-row">
            <span className="stars-val">{stars}</span>
            <span className="dot-sep">•</span>
            <span className="review-count">{product.num_reviews?.toLocaleString()} ratings</span>
          </div>

          <hr className="detail__divider" />

          <div className="detail__price-section">
            <div className="detail__price-main">
              <span className="price-symbol">₹</span>
              <span className="price-whole">{Math.floor(product.price).toLocaleString('en-IN')}</span>
              <span className="price-fraction">{(product.price % 1).toFixed(2).substring(2)}</span>
            </div>
            {product.original_price && (
              <div className="detail__price-original">
                M.R.P.: <span className="strike">₹{Number(product.original_price).toLocaleString('en-IN')}</span>
              </div>
            )}
            <p className="text-sm text-gray-600">Inclusive of all taxes</p>
          </div>

          <hr className="detail__divider" />
          
          <div className="detail__offers">
            <h4 className="font-bold flex items-center gap-1 text-[16px] mb-2">
              <Zap size={16} fill="#e47911" color="#e47911" /> Offers
            </h4>
            <div className="detail__offer-grid">
              <div className="offer-card">
                <p className="font-bold">Bank Offer</p>
                <p>10% Instant Discount on select cards</p>
              </div>
              <div className="offer-card">
                <p className="font-bold">No Cost EMI</p>
                <p>Avail No Cost EMI on select cards</p>
              </div>
            </div>
          </div>

          <hr className="detail__divider" />

          <div className="detail__spec-preview mb-6">
            <h3 className="font-bold mb-3">Product Details</h3>
            <table className="detail__spec-table">
              <tbody>
                {Object.entries(specs).slice(0, 6).map(([key, val]) => (
                  <tr key={key}>
                    <td className="spec-label">{key}</td>
                    <td className="spec-value">{val}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <h3 className="font-bold mb-2">About this item</h3>
          <ul className="detail__about-list">
            {product.description?.split('. ').map((point, i) => (
              point.trim() && <li key={i}>{point.trim()}.</li>
            ))}
          </ul>
        </div>

        {/* Buy Section */}
        <div className="detail__buybox">
          <div className="price-row">
            <span className="price-symbol">₹</span>
            <span className="price-val">{Number(product.price).toLocaleString('en-IN')}</span>
          </div>
          
          <div className="delivery-row">
            FREE delivery <strong>Tomorrow</strong>. Order within 10 hrs.
          </div>

          <div className={`stock-status ${product.stock > 0 ? 'in-stock' : 'out-of-stock'}`}>
            {product.stock > 0 ? 'In Stock' : 'Currently Unavailable'}
          </div>

          {product.stock > 0 && (
            <div className="qty-row">
              <label>Quantity:</label>
              <select value={quantity} onChange={e => setQuantity(Number(e.target.value))}>
                {[...Array(Math.min(product.stock, 30))].map((_, i) => (
                  <option key={i + 1} value={i + 1}>{i + 1}</option>
                ))}
              </select>
            </div>
          )}

          <div className="buy-buttons">
            <button 
              className={`btn-add-cart ${justAdded ? 'btn-success-green' : ''}`}
              onClick={handleAddToCart}
              disabled={isAddingCart || product.stock === 0 || justAdded}
            >
              {isAddingCart ? 'Adding...' : justAdded ? <><Check size={18} /> +{quantity} Item{quantity > 1 ? 's' : ''} Added</> : 'Add to Cart'}
            </button>
            <button 
              className="btn-buy-now"
              onClick={handleBuyNow}
              disabled={product.stock === 0}
            >
              Buy Now
            </button>
          </div>

          <div className="secure-row">
            <span className="text-gray-500">Secure transaction</span>
          </div>
          
          <div className="merchant-row">
            Ships from <strong>Amazon</strong><br/>
            Sold by <strong>Appario Retail Private Ltd</strong>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetail;
