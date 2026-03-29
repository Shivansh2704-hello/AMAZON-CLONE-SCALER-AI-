import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { fetchUserOrders } from '../api/axiosConfig';
import LoadingSpinner from '../components/LoadingSpinner';
import './Orders.css';

const Orders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('orders');

  useEffect(() => {
    fetchUserOrders()
      .then(res => {
        setOrders(res.data.data);
        setLoading(false);
      })
      .catch(err => {
        console.error(err);
        setLoading(false);
      });
  }, []);

  if (loading) return <LoadingSpinner />;

  return (
    <div className="orders-container">
      {/* Breadcrumbs */}
      <nav className="orders-breadcrumb">
        <Link to="/">Your Account</Link> › <span className="orders-breadcrumb-active">Your Orders</span>
      </nav>

      {/* Header & Search */}
      <div className="orders-header">
        <h1 className="orders-title">Your Orders</h1>
        <div className="orders-search">
          <input type="text" className="orders-search-input" placeholder="Search all orders" />
          <button className="orders-search-btn">Search Orders</button>
        </div>
      </div>

      {/* Tabs */}
      <div className="orders-tabs">
        <span 
          className={`orders-tab ${activeTab === 'orders' ? 'orders-tab--active' : ''}`}
          onClick={() => setActiveTab('orders')}
        >
          Orders
        </span>
        <span 
          className={`orders-tab ${activeTab === 'buyAgain' ? 'orders-tab--active' : ''}`}
          onClick={() => setActiveTab('buyAgain')}
        >
          Buy Again
        </span>
        <span 
          className={`orders-tab ${activeTab === 'notShipped' ? 'orders-tab--active' : ''}`}
          onClick={() => setActiveTab('notShipped')}
        >
          Not Yet Shipped
        </span>
        <span 
          className={`orders-tab ${activeTab === 'cancelled' ? 'orders-tab--active' : ''}`}
          onClick={() => setActiveTab('cancelled')}
        >
          Cancelled Orders
        </span>
      </div>

      {/* Filter */}
      <div className="orders-filter">
        <span>{orders.length} orders placed in</span>
        <select className="orders-filter-select">
          <option>past 3 months</option>
          <option>2026</option>
          <option>2025</option>
        </select>
      </div>

      {/* Orders List */}
      {orders.length === 0 ? (
        <div className="order-card p-10 text-center">
          <p className="text-lg text-gray-600">You haven't placed any orders yet.</p>
          <Link to="/" className="link-btn mt-2 inline-block">Start Shopping</Link>
        </div>
      ) : (
        <div className="orders-list">
          {orders.map(order => (
            <div key={order.id} className="order-card">
              {/* Card Header */}
              <div className="order-card-header">
                <div className="order-header-left">
                  <div>
                    <div className="order-header-label">Order Placed</div>
                    <div className="order-header-value">
                      {new Date(order.created_at).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' })}
                    </div>
                  </div>
                  <div>
                    <div className="order-header-label">Total</div>
                    <div className="order-header-value">₹{Number(order.total_price).toLocaleString('en-IN')}</div>
                  </div>
                  <div>
                    <div className="order-header-label">Ship To</div>
                    <div className="order-header-value">
                      <Link to="#" className="order-header-link">{order.customer_name || 'Shivansh Singh'}</Link>
                    </div>
                  </div>
                </div>
                <div className="order-header-right">
                  <div className="order-header-label">Order # {order.id}</div>
                  <div className="order-header-links">
                    <Link to="#" className="order-header-link">View order details</Link>
                    <span className="mx-1 text-gray-300">|</span>
                    <Link to="#" className="order-header-link">Invoice</Link>
                  </div>
                </div>
              </div>

              {/* Card Body */}
              <div className="order-card-body">
                <div className="order-status">
                  {order.status === 'SHIPPED' ? 'Arrived' : 'Arriving tomorrow'}
                </div>
                
                {order.items.map(item => (
                  <div key={item.id} className="order-item-container mb-6">
                    <div className="order-item-main">
                      <img src={item.image_url} alt={item.product_name} className="order-item-img" />
                      <div className="order-item-info">
                        <Link to={`/product/${item.product_id}`} className="order-item-title">
                          {item.product_name}
                        </Link>
                        <p className="text-xs text-gray-500 mt-1">Sold by: Appario Retail Private Ltd</p>
                        <div className="order-item-btn-row">
                          <button className="btn-order-secondary bg-[#ffd814] border-[#fcd200]">Buy it again</button>
                          <button className="btn-order-secondary">View your item</button>
                        </div>
                      </div>
                    </div>
                    
                    <div className="order-item-actions">
                      <button className="btn-order-action btn-order-track">Track package</button>
                      <button className="btn-order-action">Return or replace items</button>
                      <button className="btn-order-action">Share gift receipt</button>
                      <button className="btn-order-action">Leave seller feedback</button>
                      <button className="btn-order-action">Write a product review</button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Orders;
