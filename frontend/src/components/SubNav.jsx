import { Link } from 'react-router-dom';
import { Menu } from 'lucide-react';
import './SubNav.css';

const SubNav = () => {
  const links = [
    { name: "Amazon miniTV", url: "#" },
    { name: "Sell", url: "#" },
    { name: "Best Sellers", url: "#" },
    { name: "Today's Deals", url: "#" },
    { name: "Mobiles", url: "/?category=6" },
    { name: "Customer Service", url: "#" },
    { name: "Electronics", url: "/?category=1" },
    { name: "Home & Kitchen", url: "/?category=4" },
    { name: "Fashion", url: "/?category=3" },
    { name: "Books", url: "/?category=5" },
    { name: "Fresh", url: "/?category=Fresh" },
  ];

  return (
    <div className="subnav">
      <div className="subnav__inner">
        <div className="subnav__link" style={{ fontWeight: 'bold' }}>
          <Menu size={20} style={{ marginRight: '4px' }} />
          <span>All</span>
        </div>

        {links.map((link, index) => (
          <Link 
            key={index} 
            to={link.url} 
            className="subnav__link"
          >
            {link.name}
          </Link>
        ))}
      </div>
    </div>
  );
};

export default SubNav;
