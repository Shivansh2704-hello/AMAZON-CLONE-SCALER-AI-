import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { fetchCart, updateCartItem, removeCartItem } from '../api/axiosConfig';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import CartItem from '../components/CartItem';
import LoadingSpinner from '../components/LoadingSpinner';
import { ShoppingCart, ChevronDown, CheckCircle } from 'lucide-react';
import './Cart.css';

/**
 * Cart — Amazon shopping cart page.
 */
const Cart = () => {
  const [cartData, setCartData] = useState({ items: [], subtotal: 0 });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [isUpdating, setIsUpdating] = useState(null);
  const { user } = useAuth();
  const { refreshCartCount } = useCart();

  const loadCart = async () => {
    try {
      const res = await fetchCart();
      if (res.data?.success) {
        setCartData(res.data.data);
        refreshCartCount(); // Keep navbar in sync
      } else {
        setError(res.data?.message || 'Failed to load cart');
      }
    } catch (err) {
      console.error('Cart error:', err);
      setError('Failed to connect to the server.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { 
    // In "No Login Required" mode, we almost always have a user
    if (user) {
      loadCart(); 
    } else {
      setLoading(false);
    }
  }, [user]);

  const handleUpdate = async (itemId, qty) => {
    setIsUpdating(itemId);
    try {
      await updateCartItem(itemId, qty);
      await loadCart();
    } catch (err) {
      alert(err.response?.data?.message || 'Update failed');
    } finally {
      setIsUpdating(null);
    }
  };

  const handleRemove = async (itemId) => {
    setIsUpdating(itemId);
    try {
      await removeCartItem(itemId);
      await loadCart();
    } catch {
      alert('Could not remove item');
    } finally {
      setIsUpdating(null);
    }
  };

  if (loading) return <LoadingSpinner />;

  const { items, subtotal } = cartData;

  if (!items.length) return (
    <div className="page-wrapper bg-white py-12 px-4 shadow-sm mt-4 rounded-sm">
      <div className="cart-empty-state">
        <div className="cart-empty-icon">
          <ShoppingCart size={100} strokeWidth={0.5} color="#DDD" />
        </div>
        <div className="cart-empty-text">
          <h2 className="text-2xl font-bold mb-2">Your Amazon Cart is empty</h2>
          <p className="text-[#007185] mb-6">Shop today's deals</p>
          <div className="flex gap-4">
            <Link to="/" className="btn-primary px-6">Continue Shopping</Link>
          </div>
        </div>
      </div>
    </div>
  );

  const itemCount = items.reduce((a, i) => a + i.quantity, 0);

  return (
    <div className="page-wrapper py-6 px-4">
      <div className="cart-container">
        {/* Main Content */}
        <div className="cart-main">
          <h1 className="cart-header-title">Shopping Cart</h1>
          <div className="cart-header-controls">
            <button className="link-btn">Deselect all items</button>
            <span className="price-label">Price</span>
          </div>
          
          <div className="cart-items-list">
            {items.map(item => (
              <CartItem
                key={item.id}
                item={item}
                onUpdate={handleUpdate}
                onRemove={handleRemove}
                isUpdating={isUpdating}
              />
            ))}
          </div>
          
          <div className="cart-footer">
            <p className="subtotal-text">
              Subtotal ({itemCount} {itemCount === 1 ? 'item' : 'items'}): 
              <span className="subtotal-val">₹{Number(subtotal).toLocaleString('en-IN')}</span>
            </p>
          </div>
        </div>

        {/* Sidebar Summary */}
        <div className="cart-sidebar">
          <div className="free-delivery-badge">
            <CheckCircle size={16} color="#067D62" />
            <div className="badge-text">
              Part of your order qualifies for <strong>FREE Delivery</strong>. 
              Select this option at checkout. <Link to="#" className="link-btn">Details</Link>
            </div>
          </div>
          
          <div className="sidebar-subtotal">
            Subtotal ({itemCount} items): <strong className="sidebar-price">₹{Number(subtotal).toLocaleString('en-IN')}</strong>
          </div>
          
          <div className="gift-row">
            <input type="checkbox" id="gift-check" />
            <label htmlFor="gift-check">This order contains a gift</label>
          </div>

          <Link to="/checkout" className="btn-checkout">
            Proceed to Buy
          </Link>
          
          <div className="emi-expandable">
            <span>EMI Available</span>
            <ChevronDown size={14} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Cart;
