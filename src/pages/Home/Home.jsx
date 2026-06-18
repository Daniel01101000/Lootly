import { Link } from 'react-router-dom';
import { TrendingUp, Bell, Heart, ShoppingCart } from 'lucide-react';
import './Home.css';

export default function Home() {
  return (
    <div className="home">
      <section className="hero">
        <div className="container">
          <div className="hero-content">
            <span className="hero-badge">
              <TrendingUp size={14} />
              <span>Price Tracker</span>
            </span>
            <h1 className="hero-title">
              Never miss a <span className="highlight">gaming deal</span> again
            </h1>
            <p className="hero-subtitle">
              Track prices, get alerts, and buy games at the best price.
              Lootly monitors your favorite stores 24/7.
            </p>
            <div className="hero-actions">
              <Link to="/deals" className="btn btn-primary btn-lg">
                Browse Deals
              </Link>
              <Link to="/register" className="btn btn-secondary btn-lg">
                Get Started
              </Link>
            </div>
          </div>
        </div>
      </section>

      <section className="section features">
        <div className="container">
          <h2 className="section-title">Why Lootly?</h2>
          <div className="features-grid">
            <div className="feature-card">
              <TrendingUp size={32} className="feature-icon" />
              <h3>Price History</h3>
              <p>See how prices have changed over time and know if a deal is real.</p>
            </div>
            <div className="feature-card">
              <Bell size={32} className="feature-icon" />
              <h3>Smart Alerts</h3>
              <p>Set target prices and get notified the moment a game drops to your range.</p>
            </div>
            <div className="feature-card">
              <Heart size={32} className="feature-icon" />
              <h3>Wishlist</h3>
              <p>Save games to your wishlist and monitor them in one place.</p>
            </div>
            <div className="feature-card">
              <ShoppingCart size={32} className="feature-icon" />
              <h3>Multi-Store</h3>
              <p>Compare prices across Steam, Epic Games, GOG, and more.</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}