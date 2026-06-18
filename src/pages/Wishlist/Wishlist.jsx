import { useEffect } from 'react';
import { Heart } from 'lucide-react';
import ProductCard from '../../components/ProductCard/ProductCard';
import { useWishlist } from '../../context/WishlistContext';
import './Wishlist.css';

export default function Wishlist() {
  const { items, loading, fetchWishlist } = useWishlist();

  useEffect(() => {
    fetchWishlist();
  }, [fetchWishlist]);

  if (loading) {
    return (
      <div className="page-loading">
        <div className="spinner" />
      </div>
    );
  }

  return (
    <div className="wishlist-page container section">
      <h1 className="page-title">My Wishlist</h1>

      {items.length === 0 ? (
        <div className="empty-state">
          <Heart size={48} className="empty-icon" />
          <p>Your wishlist is empty. Start adding games you want!</p>
        </div>
      ) : (
        <div className="deals-grid">
          {items.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      )}
    </div>
  );
}