import './Footer.css';

/**
 * Footer — Amazon-style multi-column footer
 * Matches Amazon.in footer with 4 columns + bottom bar
 */
const Footer = () => (
  <footer className="footer">
    {/* Back to top */}
    <div className="footer__top-bar" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>
      Back to top
    </div>

    {/* Main columns */}
    <div className="footer__main">
      <div className="footer__col">
        <h3 className="footer__col-title">Get to Know Us</h3>
        <ul>
          <li><a href="#">About Amazon Clone</a></li>
          <li><a href="#">Careers</a></li>
          <li><a href="#">Press Releases</a></li>
          <li><a href="#">Amazon Science</a></li>
        </ul>
      </div>
      <div className="footer__col">
        <h3 className="footer__col-title">Connect with Us</h3>
        <ul>
          <li><a href="#">Facebook</a></li>
          <li><a href="#">Twitter</a></li>
          <li><a href="#">Instagram</a></li>
        </ul>
      </div>
      <div className="footer__col">
        <h3 className="footer__col-title">Make Money with Us</h3>
        <ul>
          <li><a href="#">Sell on Amazon Clone</a></li>
          <li><a href="#">Sell under Amazon Accelerator</a></li>
          <li><a href="#">Protect and Build Your Brand</a></li>
          <li><a href="#">Amazon Global Selling</a></li>
          <li><a href="#">Become an Affiliate</a></li>
          <li><a href="#">Advertise Your Products</a></li>
        </ul>
      </div>
      <div className="footer__col">
        <h3 className="footer__col-title">Let Us Help You</h3>
        <ul>
          <li><a href="#">Your Account</a></li>
          <li><a href="#">Returns Centre</a></li>
          <li><a href="#">Recalls and Product Safety Alerts</a></li>
          <li><a href="#">100% Purchase Protection</a></li>
          <li><a href="#">Amazon App Download</a></li>
          <li><a href="#">Help</a></li>
        </ul>
      </div>
    </div>

    {/* Divider */}
    <div className="footer__divider" />

    {/* Logo row */}
    <div className="footer__logo-row">
      <span className="footer__logo">
        <span style={{ color: '#FF9900' }}>amazon</span>
        <span style={{ color: '#fff' }}>.clone</span>
      </span>
      <div className="footer__locale">
        <span>🌐 English</span>
        <span>🇮🇳 India</span>
      </div>
    </div>

    {/* Bottom sub-footer */}
    <div className="footer__bottom">
      <div className="footer__bottom-links">
        {['AbeBooks', 'Amazon Web Services', 'Audible', 'IMDb', 'Shopbop', 'Amazon Business'].map(l => (
          <a key={l} href="#">{l}</a>
        ))}
      </div>
      <p className="footer__copy">© 2024-2025, Amazon Clone (Scaler AI Project). All rights reserved.</p>
    </div>
  </footer>
);

export default Footer;
