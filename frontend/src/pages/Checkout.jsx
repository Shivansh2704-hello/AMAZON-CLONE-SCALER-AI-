import { useState, useEffect } from 'react';
import { useLocation, useNavigate, Link } from 'react-router-dom';
import { fetchCart, placeOrder } from '../api/axiosConfig';
import { useAuth } from '../context/AuthContext';
import LoadingSpinner from '../components/LoadingSpinner';
import { CheckCircle, ChevronDown, Lock, ChevronRight, ShieldCheck } from 'lucide-react';
import './Checkout.css';

/**
 * Checkout — Multi-step accordion checkout process.
 * Steps: 1: Delivery Address, 2: Payment Method, 3: Review & Place Order.
 */
const Checkout = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { user } = useAuth();

  const buyNowItem = location.state?.buyNow || null;

  const [cartItems, setCartItems] = useState([]);
  const [subtotal, setSubtotal] = useState(0);
  const [loading, setLoading] = useState(!buyNowItem);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [orderId, setOrderId] = useState(null);
  const [step, setStep] = useState(1);

  const [formData, setFormData] = useState({
    customer_name: user?.name || 'Test User',
    phone: user?.phone || '9876543210',
    address: 'Flat-215 Shivalik Apartments, Guru Teg Bahadur Nagar, Kharar, MOHALI, PUNJAB, 140301, India',
    payment_method: 'COD'
  });

  useEffect(() => {
    window.scrollTo(0, 0);
    if (!buyNowItem && user) {
      fetchCart()
        .then(res => {
          if (res.data?.success) {
            setCartItems(res.data.data.items || []);
            setSubtotal(Number(res.data.data.subtotal) || 0);
          }
        })
        .catch(() => setError('Failed to load cart.'))
        .finally(() => setLoading(false));
    } else if (buyNowItem) {
      setSubtotal(buyNowItem.price * buyNowItem.quantity);
      setLoading(false);
    }
  }, [user, buyNowItem]);

  const handlePlaceOrder = async () => {
    setSubmitting(true);
    setError('');
    try {
      const payload = {
        customer_name: formData.customer_name,
        phone: formData.phone,
        address: formData.address,
        payment_method: formData.payment_method,
        buy_now_item: buyNowItem ? { product_id: buyNowItem.product_id, quantity: buyNowItem.quantity } : null
      };
      const res = await placeOrder(payload);
      if (res.data?.success) {
        setOrderId(res.data.data.order_id);
      } else {
        setError(res.data?.message || 'Order failed');
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Order failed. Please check your details.');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) return <LoadingSpinner />;

  if (orderId) return (
    <div className="checkout-page">
      <div className="success-container">
        <div className="success-icon">
          <CheckCircle size={48} color="#007600" />
        </div>
        <h1 className="success-title">Order Placed, thank you!</h1>
        <p className="mb-6">
          Confirmation will be sent to <strong>{user?.email || 'your email'}</strong>.
        </p>
        <div className="bg-gray-50 border border-gray-200 rounded-md p-6 mb-8 text-left">
          <p className="font-bold mb-2">Order Summary</p>
          <p className="text-sm">Order ID: #{orderId}</p>
          <p className="text-sm">Items: ₹{subtotal.toLocaleString('en-IN')}</p>
          <p className="text-sm font-bold mt-2">Total: ₹{subtotal.toLocaleString('en-IN')}</p>
        </div>
        <div className="flex gap-4 justify-center">
          <button onClick={() => navigate('/')} className="btn-checkout px-8">Continue Shopping</button>
        </div>
      </div>
    </div>
  );

  const deliveryCharge = subtotal > 499 ? 0 : 40;
  const codFee = formData.payment_method === 'COD' ? 20 : 0;
  const grandTotal = subtotal + deliveryCharge + codFee;

  return (
    <div className="checkout-page">
      {/* Secure Header */}
      <header className="checkout-header">
        <Link to="/" className="checkout-header__logo">
          <img src="https://pngimg.com/uploads/amazon/amazon_PNG11.png" alt="Amazon" />
          <span>.in</span>
        </Link>
        <h1 className="checkout-header__title">
          Checkout ({buyNowItem ? 1 : cartItems.length} {buyNowItem || cartItems.length === 1 ? 'item' : 'items'})
        </h1>
        <div className="checkout-header__lock">
          <Lock size={20} />
        </div>
      </header>

      <div className="checkout-container">
        {/* Main Process */}
        <div className="checkout-main">
          
          {/* Step 1: Delivery Address */}
          <section className="checkout-step">
            <div 
              className={`checkout-step__header ${step > 1 ? '' : 'checkout-step__header--active'}`}
              onClick={() => step > 1 && setStep(1)}
            >
              <h2 className="checkout-step__title">
                <span className={`step-number ${step === 1 ? 'step-number--active' : ''}`}>1</span>
                <span>Delivery address</span>
              </h2>
              {step > 1 && <button className="checkout-step__change-btn">Change</button>}
            </div>

            {step === 1 ? (
              <div className="checkout-step__content">
                <div className="address-preview">
                  <p className="address-preview__name">{formData.customer_name}</p>
                  <p className="address-preview__text">{formData.address}</p>
                  <button onClick={() => setStep(2)} className="btn-place-order max-w-[200px] mt-2">
                    Use this address
                  </button>
                </div>
              </div>
            ) : (
              <div className="checkout-step__summary">
                {formData.customer_name}, {formData.address.substring(0, 60)}...
              </div>
            )}
          </section>

          {/* Step 2: Payment Method */}
          <section className="checkout-step">
            <div 
              className={`checkout-step__header ${step === 2 ? 'checkout-step__header--active' : ''}`}
              onClick={() => step > 2 && setStep(2)}
            >
              <h2 className="checkout-step__title">
                <span className={`step-number ${step === 2 ? 'step-number--active' : step < 2 ? 'text-gray-300' : ''}`}>2</span>
                <span className={step < 2 ? 'text-gray-400' : ''}>Payment method</span>
              </h2>
              {step > 2 && <button className="checkout-step__change-btn">Change</button>}
            </div>

            {step === 2 && (
              <div className="checkout-step__content">
                <div 
                  className={`payment-option ${formData.payment_method === 'COD' ? 'payment-option--selected' : ''}`}
                  onClick={() => setFormData({...formData, payment_method: 'COD'})}
                >
                  <input type="radio" checked={formData.payment_method === 'COD'} readOnly />
                  <div className="payment-option__info">
                    <p className="payment-option__title">Cash on Delivery/Pay on Delivery</p>
                    <p className="payment-option__desc">Scan & Pay using any UPI App at the time of delivery.</p>
                  </div>
                </div>

                <div className="payment-option payment-option--disabled">
                  <input type="radio" disabled />
                  <div className="payment-option__info">
                    <p className="payment-option__title">Credit or debit card</p>
                    <div className="flex gap-1 mt-1">
                      <img src="https://upload.wikimedia.org/wikipedia/commons/5/5e/Visa_Inc._logo.svg" className="h-3" alt="Visa" />
                      <img src="https://upload.wikimedia.org/wikipedia/commons/2/2a/Mastercard-logo.svg" className="h-3" alt="Mastercard" />
                    </div>
                  </div>
                </div>

                <button onClick={() => setStep(3)} className="btn-place-order max-w-[240px] mt-4">
                  Use this payment method
                </button>
              </div>
            )}

            {step > 2 && (
              <div className="checkout-step__summary">
                Paying with <strong>{formData.payment_method === 'COD' ? 'Cash on Delivery' : 'Card'}</strong>
              </div>
            )}
          </section>

          {/* Step 3: Review & Place Order */}
          <section className="checkout-step">
            <div className="checkout-step__header checkout-step__header--active">
              <h2 className="checkout-step__title">
                <span className={`step-number ${step === 3 ? 'step-number--active' : 'text-gray-300'}`}>3</span>
                <span className={step < 3 ? 'text-gray-400' : ''}>Offers, Items and shipping</span>
              </h2>
            </div>

            {step === 3 && (
              <div className="checkout-step__content">
                <div className="review-items">
                  {(buyNowItem ? [buyNowItem] : cartItems).map((item, i) => (
                    <div key={i} className="review-item">
                      <img src={item.image_url || 'https://placehold.co/100'} alt="" className="review-item__img" />
                      <div className="review-item__details">
                        <p className="review-item__name">{item.name}</p>
                        <p className="review-item__price">₹{Number(item.price).toLocaleString('en-IN')}</p>
                        <p className="text-xs text-gray-600 mt-1 font-bold">Quantity: {item.quantity}</p>
                        <p className="text-xs text-green-700 mt-1">Eligible for FREE Shipping</p>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="mt-8 border-t pt-6">
                  <div className="flex justify-between items-center bg-gray-50 p-4 rounded-md border border-gray-200">
                    <div className="flex flex-col gap-1">
                      <button 
                        onClick={handlePlaceOrder}
                        disabled={submitting}
                        className="btn-place-order max-w-[240px] py-2 font-bold"
                      >
                        {submitting ? 'Placing Order...' : 'Place your order'}
                      </button>
                      <p className="terms-text text-left">
                        By placing your order, you agree to Amazon's privacy notice and conditions of use.
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-lg font-bold text-red-700">Order Total: ₹{grandTotal.toLocaleString('en-IN')}</p>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </section>

        </div>

        {/* Sidebar Summary */}
        <aside className="checkout-sidebar">
          {step < 3 && (
            <button 
              onClick={() => step === 1 ? setStep(2) : setStep(3)}
              className="btn-place-order mt-0 mb-4 font-bold"
            >
              {step === 1 ? 'Use this address' : 'Use this payment method'}
            </button>
          )}
          
          <h3 className="checkout-sidebar__title">Order Summary</h3>
          <div className="checkout-sidebar__row">
            <span>Items:</span>
            <span>₹{subtotal.toLocaleString('en-IN')}</span>
          </div>
          <div className="checkout-sidebar__row">
            <span>Delivery:</span>
            <span>₹{deliveryCharge.toLocaleString('en-IN')}</span>
          </div>
          {codFee > 0 && (
            <div className="checkout-sidebar__row">
              <span>Cash/Pay on Delivery fee:</span>
              <span>₹{codFee.toLocaleString('en-IN')}</span>
            </div>
          )}
          {deliveryCharge > 0 && (
            <div className="checkout-sidebar__row text-green-700">
              <span>Promotion Applied:</span>
              <span>-₹{deliveryCharge.toLocaleString('en-IN')}</span>
            </div>
          )}
          
          <div className="checkout-sidebar__row row--total">
            <span>Order Total:</span>
            <span>₹{grandTotal.toLocaleString('en-IN')}</span>
          </div>

          <div className="mt-6 border-t pt-4">
             <div className="flex items-center gap-2 text-[#007185] text-xs font-bold cursor-pointer hover:text-[#c45500] hover:underline">
               How are delivery costs calculated?
             </div>
          </div>
        </aside>
      </div>
      
      {/* Footer Info */}
      <footer className="max-w-[1150px] mx-auto p-10 text-center text-[10px] text-gray-500">
        <p>Need help? Check our Help pages or contact us 24x7</p>
        <p className="mt-2">When your order is placed, we'll send you an e-mail confirmation with order details.</p>
      </footer>
    </div>
  );
};

export default Checkout;
