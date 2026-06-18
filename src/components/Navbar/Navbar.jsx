import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useCart } from '../../context/CartContext';
import { ShoppingCart, Menu, X, Gamepad2, LogOut, User } from 'lucide-react';
import './Navbar.css';

const navLinks = [
  { path: '/', label: 'Home' },
  { path: '/deals', label: 'Deals' },
  { path: '/wishlist', label: 'Wishlist' },
];

export default function Navbar() {
  const { user, logout } = useAuth();
  const { totalItems } = useCart();
  const [menuOpen, setMenuOpen] = useState(false);
  const location = useLocation();

  return (
    <nav className="navbar">
      <div className="navbar-inner container">
        <Link to="/" className="navbar-brand" onClick={() => setMenuOpen(false)}>
          <Gamepad2 size={24} className="brand-icon" />
          <span className="brand-text">Lootly</span>
        </Link>

        <button
          className={`hamburger ${menuOpen ? 'open' : ''}`}
          onClick={() => setMenuOpen(!menuOpen)}
          aria-label="Toggle menu"
        >
          {menuOpen ? <X size={22} /> : <Menu size={22} />}
        </button>

        <div className={`navbar-menu ${menuOpen ? 'open' : ''}`}>
          <div className="nav-links">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                className={`nav-link ${location.pathname === link.path ? 'active' : ''}`}
                onClick={() => setMenuOpen(false)}
              >
                {link.label}
              </Link>
            ))}
          </div>

          <div className="nav-actions">
            <Link to="/cart" className="cart-btn" onClick={() => setMenuOpen(false)}>
              <ShoppingCart size={20} />
              {totalItems > 0 && <span className="cart-badge">{totalItems}</span>}
            </Link>

            {user ? (
              <div className="user-menu">
                <Link to="/profile" className="user-avatar" onClick={() => setMenuOpen(false)}>
                  {user.username.charAt(0).toUpperCase()}
                </Link>
                <button className="btn btn-sm btn-secondary logout-btn" onClick={logout}>
                  <LogOut size={14} />
                  <span>Logout</span>
                </button>
              </div>
            ) : (
              <Link
                to="/login"
                className="btn btn-sm btn-primary"
                onClick={() => setMenuOpen(false)}
              >
                <User size={14} />
                <span>Sign In</span>
              </Link>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}