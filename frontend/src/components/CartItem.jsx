import { Link } from 'react-router-dom';
import { Trash2, Plus, Minus } from 'lucide-react';
import './CartItem.css';

/**
 * CartItem — Amazon shopping cart item layout.
 */
const CartItem = ({ item, onUpdate, onRemove, isUpdating }) => {
  const { id, product_id, name, price, image_url, quantity, stock } = item;

  return (
    <div className="cart-item">
      {/* Product Image */}
      <Link to={`/product/${product_id}`} className="cart-item__img-link">
        <img
          src={image_url || 'https://placehold.co/180?text=No+Image'}
          alt={name}
          className="cart-item__img"
        />
      </Link>

      {/* Product Details */}
      <div className="cart-item__content">
        <div className="cart-item__header">
          <Link to={`/product/${product_id}`} className="cart-item__title">
            {name}
          </Link>
          <div className="cart-item__price-box">
            <span className="price-symbol">₹</span>
            <span className="price-val">{Number(price).toLocaleString('en-IN')}</span>
          </div>
        </div>

        <p className="cart-item__stock-tag">In stock</p>
        <p className="cart-item__shipping-tag">Eligible for FREE Shipping</p>

        {/* Actions Row */}
        <div className="cart-item__actions">
          <div className="cart-item__qty-selector">
            <button
              className="qty-btn"
              onClick={() => onUpdate(id, quantity - 1)}
              disabled={quantity <= 1 || isUpdating === id}
              aria-label="Decrease quantity"
            >
              <Minus size={14} />
            </button>
            <span className="qty-val">{quantity}</span>
            <button
              className="qty-btn"
              onClick={() => onUpdate(id, quantity + 1)}
              disabled={quantity >= stock || isUpdating === id}
              aria-label="Increase quantity"
            >
              <Plus size={14} />
            </button>
          </div>

          <span className="action-sep">|</span>

          <button
            className="action-btn text-danger"
            onClick={() => onRemove(id)}
            disabled={isUpdating === id}
          >
            Delete
          </button>

          <span className="action-sep">|</span>

          <button className="action-btn">Save for later</button>
          
          <span className="action-sep">|</span>

          <button className="action-btn hidden-mobile">Share</button>
        </div>
      </div>
    </div>
  );
};

export default CartItem;
