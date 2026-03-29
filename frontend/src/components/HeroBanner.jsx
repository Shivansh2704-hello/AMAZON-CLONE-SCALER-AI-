import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import './HeroBanner.css';

/** 
 * HeroBanner — Auto-sliding promotional banner carousel
 * Matches the Amazon homepage hero carousel style
 */
const slides = [
  {
    id: 1,
    bg: 'linear-gradient(135deg, #1a1a2e 0%, #16213e 50%, #0f3460 100%)',
    badge: 'Up to 60% off',
    headline: 'Tech Deals of the Season',
    subline: 'Headphones, Tablets & More',
    cta: 'Shop Electronics',
    accent: '#FF9900',
    img: '/images/banners/electronics.png',
    link: '/?category=1'
  },
  {
    id: 2,
    bg: 'linear-gradient(135deg, #1b4332 0%, #2d6a4f 50%, #40916c 100%)',
    badge: 'Starting ₹499',
    headline: 'Kitchen Must-Haves',
    subline: 'Cook smarter, eat better',
    cta: 'Shop Home & Kitchen',
    accent: '#FFD814',
    img: '/images/banners/kitchen.png',
    link: '/?category=4'
  },
  {
    id: 3,
    bg: 'linear-gradient(135deg, #3d0c02 0%, #6a1a0b 50%, #922b21 100%)',
    badge: 'Best Sellers',
    headline: 'Books That Change Lives',
    subline: 'Top-rated reads, delivered fast',
    cta: 'Shop Books',
    accent: '#FFA41C',
    img: '/images/banners/books.png',
    link: '/?category=5'
  },
];

const HeroBanner = () => {
  const [idx, setIdx] = useState(0);

  // Auto-advance every 4 seconds
  useEffect(() => {
    const timer = setInterval(() => {
      setIdx(i => (i + 1) % slides.length);
    }, 4000);
    return () => clearInterval(timer);
  }, []);

  const slide = slides[idx];

  return (
    <div className="hero" style={{ background: slide.bg }}>
      {/* Prev Button */}
      <button className="hero__arrow hero__arrow--left" onClick={() => setIdx((idx - 1 + slides.length) % slides.length)} aria-label="Previous">
        <ChevronLeft size={28} />
      </button>

      <div className="hero__content">
        <div className="hero__text">
          <span className="hero__badge" style={{ background: slide.accent, color: '#111' }}>{slide.badge}</span>
          <h2 className="hero__headline">{slide.headline}</h2>
          <p className="hero__subline">{slide.subline}</p>
          <Link to={slide.link} className="hero__cta" style={{ background: slide.accent, color: '#111' }}>
            {slide.cta}
          </Link>
        </div>
        <Link to={slide.link} className="hero__img-wrap">
          <img src={slide.img} alt={slide.headline} className="hero__img" />
        </Link>
      </div>

      {/* Next Button */}
      <button className="hero__arrow hero__arrow--right" onClick={() => setIdx((idx + 1) % slides.length)} aria-label="Next">
        <ChevronRight size={28} />
      </button>

      {/* Dot indicators */}
      <div className="hero__dots">
        {slides.map((_, i) => (
          <button
            key={i}
            className={`hero__dot ${i === idx ? 'hero__dot--active' : ''}`}
            onClick={() => setIdx(i)}
            aria-label={`Go to slide ${i + 1}`}
          />
        ))}
      </div>
    </div>
  );
};

export default HeroBanner;
