import { Link } from 'react-router-dom';
import { Heart, ShoppingCart, ImageOff } from 'lucide-react';
import { useWishlist } from '../../context/WishlistContext';
import { useCart } from '../../context/CartContext';
import PriceBadge from '../PriceBadge/PriceBadge';
import './ProductCard.css';

export default function ProductCard({ product }) {
  const { isWishlisted, addItem: addWishlist, removeItem: removeWishlist } = useWishlist();
  const { addItem } = useCart();
  const wishlisted = isWishlisted(product.id);

  const discount = product.original_price
    ? Math.round((1 - product.current_price / product.original_price) * 100)
    : 0;

  const handleWishlist = (e) => {
    e.preventDefault();
    e.stopPropagation();
    wishlisted ? removeWishlist(product.id) : addWishlist(product.id);
  };

  const handleAddToCart = (e) => {
    e.preventDefault();
    e.stopPropagation();
    addItem({
      productId: product.id,
      name: product.name,
      price: product.current_price,
      image: product.image_url,
    });
  };

  return (
    <Link to={`/deals/${product.id}`} className="product-card">
      <div className="product-card-image">
        {product.image_url ? (
          <img src={product.image_url} alt={product.name} loading="lazy" />
        ) : (
          <div className="product-placeholder">
            <ImageOff size={36} />
          </div>
        )}
        {discount > 0 && <span className="product-discount">-{discount}%</span>}
        <button
          className={`wishlist-btn ${wishlisted ? 'active' : ''}`}
          onClick={handleWishlist}
          aria-label={wishlisted ? 'Remove from wishlist' : 'Add to wishlist'}
        >
          <Heart
            size={16}
            fill={wishlisted ? 'currentColor' : 'none'}
          />
        </button>
      </div>

      <div className="product-card-body">
        <h3 className="product-name">{product.name}</h3>
        {product.store && <span className="product-store">{product.store}</span>}
        <PriceBadge current={product.current_price} original={product.original_price} currency={product.currency} />
        <button className="btn btn-sm btn-primary add-cart-btn" onClick={handleAddToCart}>
          <ShoppingCart size={14} />
          <span>Add to Cart</span>
        </button>
      </div>
    </Link>
  );
}