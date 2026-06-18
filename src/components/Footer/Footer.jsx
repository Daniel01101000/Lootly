import { Link } from 'react-router-dom';
import { Gamepad2 } from 'lucide-react';
import './Footer.css';

export default function Footer() {
  return (
    <footer className="footer">
      <div className="footer-inner container">
        <div className="footer-brand">
          <div className="footer-brand-heading">
            <Gamepad2 size={22} className="footer-brand-icon" />
            <span className="brand-text">Lootly</span>
          </div>
          <p className="footer-desc">
            Track gaming deals, monitor prices, and never overpay again.
          </p>
        </div>

        <div className="footer-links">
          <div className="footer-col">
            <h4>Navigate</h4>
            <Link to="/">Home</Link>
            <Link to="/deals">Deals</Link>
            <Link to="/wishlist">Wishlist</Link>
          </div>
          <div className="footer-col">
            <h4>Account</h4>
            <Link to="/login">Sign In</Link>
            <Link to="/register">Register</Link>
            <Link to="/profile">Profile</Link>
          </div>
        </div>
      </div>
      <div className="footer-bottom container">
        <p>&copy; {new Date().getFullYear()} Lootly. All rights reserved.</p>
      </div>
    </footer>
  );
}