import { Link } from 'react-router-dom';
import { ShoppingCart, Minus, Plus, Trash2 } from 'lucide-react';
import { useCart } from '../context/CartContext';
import './ProductCard.css';

/**
 * ProductCard — Reusable product grid card.
 * Props: product { id, name, price, rating, num_reviews, image_url, stock }
 * onAddToCart: callback function
 * isAdding: boolean — disables button during API call
 */
const ProductCard = ({ product, onAddToCart, onBuyNow, isAdding }) => {
  const { cartItems, updateQuantity } = useCart();
  const { id, name, price, rating, num_reviews, image_url, stock } = product;
  
  // Find if this product is in cart
  const cartItem = cartItems.find(item => item.product_id === id);
  const quantity = cartItem ? cartItem.quantity : 0;
  const numPrice = Number(price);
  const numRating = Number(rating);
  const stars = '★'.repeat(Math.round(numRating)) + '☆'.repeat(5 - Math.round(numRating));

  return (
    <div className="product-card">
      {/* Product Image */}
      <Link to={`/product/${id}`} className="product-card__img-wrap">
        <img
          src={image_url || 'https://placehold.co/280x200?text=No+Image'}
          alt={name}
          className="product-card__img"
          loading="lazy"
        />
      </Link>

      {/* Product Info */}
      <div className="product-card__body">
        <Link to={`/product/${id}`} className="product-card__title">{name}</Link>

        {/* Star Rating */}
        <div className="product-card__rating">
          <span className="stars">{stars}</span>
          <span className="product-card__rating-count">({num_reviews?.toLocaleString()})</span>
        </div>

        <p className="product-card__price">
          <span className="product-card__price-symbol">₹</span>
          <span className="product-card__price-value">{numPrice.toLocaleString('en-IN')}</span>
        </p>

        {/* Stock Status */}
        {stock < 10 && stock > 0 && (
          <p className="product-card__low-stock">Only {stock} left!</p>
        )}
        {stock === 0 && <p className="product-card__out-of-stock">Out of Stock</p>}

        {/* Add to Cart or Quantity Selector */}
        <div className="product-card__actions">
          {quantity === 0 ? (
            <>
              <button
                className="btn-primary"
                onClick={() => onAddToCart(id)}
                disabled={isAdding === id || stock === 0}
              >
                <ShoppingCart size={15} />
                {isAdding === id ? 'Adding...' : 'Add to Cart'}
              </button>
              <button
                className="btn-buy-now"
                onClick={() => onBuyNow(id)}
                disabled={isAdding === id || stock === 0}
              >
                Buy Now
              </button>
            </>
          ) : (
            <div className="product-card__qty-selector">
              <button 
                className="qty-btn" 
                onClick={() => updateQuantity(id, quantity - 1)}
                aria-label="Decrease quantity"
              >
                {quantity === 1 ? <Trash2 size={16} /> : <Minus size={16} />}
              </button>
              <span className="qty-val">{quantity}</span>
              <button 
                className="qty-btn" 
                onClick={() => updateQuantity(id, quantity + 1)}
                disabled={quantity >= stock}
                aria-label="Increase quantity"
              >
                <Plus size={16} />
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
