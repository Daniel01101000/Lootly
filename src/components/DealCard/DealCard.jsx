import { useState, useCallback, memo } from 'react';
import { useNavigate } from 'react-router-dom';
import { ShoppingCart, Check, ExternalLink, Zap, ImageOff } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useCart } from '../../context/CartContext';
import './DealCard.css';

const STORE_COLORS = {
  'Amazon México': '#ff9900',
  'Mercado Libre': '#fff059',
  'Steam': '#1b2838',
  'DDTech': '#00a859',
  'CyberPuerta': '#e63946',
  'GamePlanet': '#6c5ce7',
  'Digital Life': '#0984e3',
  'Zegucom': '#fdcb6e',
  'Newegg': '#f60',
  'Best Buy': '#0046be',
};

const CATEGORY_LABELS = {
  'gpu': 'GPU',
  'cpu': 'CPU',
  'monitor': 'Monitor',
  'keyboard': 'Teclado',
  'mouse': 'Mouse',
  'laptop': 'Laptop',
  'console': 'Consola',
  'games': 'Juego',
  'component': 'Componente',
  'headset': 'Audífonos',
  'phone': 'Celular',
  'appliance': 'Electro',
};

const STORE_BADGE_MAP = {
  'Amazon México': 'Amazon',
  'Mercado Libre': 'MELI',
  'Steam': 'Steam',
  'DDTech': 'DDTech',
  'CyberPuerta': 'CP',
  'GamePlanet': 'GP',
  'Digital Life': 'DL',
  'Zegucom': 'Zegucom',
  'Newegg': 'Newegg',
  'Best Buy': 'BB',
};

function DealCard({ product }) {
  const { user } = useAuth();
  const { addItem, isInCart } = useCart();
  const navigate = useNavigate();
  const [adding, setAdding] = useState(false);

  const {
    name = 'Producto sin nombre',
    current_price,
    original_price,
    discount,
    image_url,
    store,
    category,
    url,
    currency = 'MXN',
  } = product || {};

  const id = product?.id;
  const hasValidPrice = current_price != null && !isNaN(Number(current_price));
  const hasDiscount = hasValidPrice && original_price != null && original_price > current_price;
  const discountPercent = discount || (hasDiscount
    ? Math.round(((original_price - current_price) / original_price) * 100)
    : 0);
  const isHotDeal = discountPercent >= 30;
  const inCart = isInCart(id);

  const formatPrice = (price) => {
    return Number(price).toLocaleString('es-MX', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    });
  };

  const currencySymbol = currency === 'USD' ? '$' : 'MX$';

  const getStoreBadgeLabel = (storeName) => {
    if (!storeName) return '';
    return STORE_BADGE_MAP[storeName] || storeName;
  };

  const isValidUrl = (u) => {
    try {
      if (!u) return false;
      new URL(u);
      return u.startsWith('http://') || u.startsWith('https://');
    } catch { return false; }
  };

  const handleAddToCart = useCallback(async () => {
    if (!user) {
      navigate('/login');
      return;
    }
    if (adding || inCart || !id) return;
    setAdding(true);
    try {
      await addItem(id);
    } catch {
      // silently fail
    } finally {
      setAdding(false);
    }
  }, [user, navigate, adding, inCart, id, addItem]);

  const handleViewOffer = useCallback((e) => {
    if (!user) {
      e.preventDefault();
      navigate('/login');
    }
  }, [user, navigate]);

  const categoryLabel = CATEGORY_LABELS[category] || category || '';

  return (
    <article className="deal-card" data-category={category} data-store={store}>
      <div className="deal-card-image">
        {image_url ? (
          <>
            <img
              src={image_url}
              alt={name}
              loading="lazy"
              onError={(e) => {
                e.target.onerror = null;
                e.target.style.display = 'none';
                const fallback = e.target.parentElement.querySelector('.deal-card-img-fallback');
                if (fallback) {
                  fallback.classList.remove('deal-card-img-fallback-hidden');
                }
              }}
            />
            <div className="deal-card-img-fallback deal-card-img-fallback-hidden">
              <ImageOff size={40} />
              <span className="deal-card-img-fallback-text">Imagen no disponible</span>
            </div>
          </>
        ) : (
          <div className="deal-card-placeholder">
            <ImageOff size={40} />
            <span className="deal-card-placeholder-text">Sin imagen</span>
          </div>
        )}

        {isHotDeal && (
          <div className="deal-card-hot-badge">
            <Zap size={12} />
            HOT DEAL
          </div>
        )}

        {discountPercent > 0 && (
          <div className={`deal-card-discount-badge ${isHotDeal ? 'hot' : ''}`}>
            -{discountPercent}%
          </div>
        )}

        {store && (
          <div
            className="deal-card-store-badge"
            style={{ '--store-color': STORE_COLORS[store] || '#6c5ce7' }}
            title={store}
          >
            {getStoreBadgeLabel(store)}
          </div>
        )}

        {categoryLabel && (
          <div className="deal-card-category-badge">
            {categoryLabel}
          </div>
        )}
      </div>

      <div className="deal-card-body">
        <h3 className="deal-card-name" title={name}>{name}</h3>

        <div className="deal-card-pricing">
          {hasValidPrice ? (
            <>
              <span className="deal-card-current-price">
                {currencySymbol} {formatPrice(current_price)}
              </span>
              {hasDiscount && (
                <span className="deal-card-original-price">
                  {currencySymbol} {formatPrice(original_price)}
                </span>
              )}
            </>
          ) : (
            <span className="deal-card-price-na">Precio no disponible</span>
          )}
        </div>

        {hasDiscount && (
          <div className="deal-card-save-info">
            Ahorras {currencySymbol} {formatPrice(original_price - current_price)}
            <span className="deal-card-save-sep">&bull;</span>
            -{discountPercent}%
          </div>
        )}

        <div className="deal-card-actions">
          <button
            className={`deal-card-cart-btn ${inCart ? 'in-cart' : ''}`}
            onClick={handleAddToCart}
            disabled={adding || inCart}
            title={
              !user
                ? 'Inicia sesión para agregar al carrito'
                : inCart
                  ? 'Ya está en tu carrito'
                  : 'Agregar al carrito'
            }
          >
            {adding ? (
              <span className="deal-card-cart-spinner" />
            ) : inCart ? (
              <Check size={16} />
            ) : (
              <ShoppingCart size={16} />
            )}
            <span>{inCart ? 'En carrito' : 'Agregar'}</span>
          </button>

          {isValidUrl(url) ? (
            <a
              href={url}
              target="_blank"
              rel="noopener noreferrer"
              className="deal-card-btn"
              title={user ? `Ver oferta en ${store || 'tienda'}` : 'Inicia sesión para ver la oferta'}
              onClick={handleViewOffer}
            >
              Ver oferta
              <ExternalLink size={14} className="deal-card-btn-icon" />
            </a>
          ) : (
            <span className="deal-card-btn deal-card-btn-disabled" title="URL no disponible">
              Sin enlace disponible
            </span>
          )}
        </div>
      </div>
    </article>
  );
}

export default memo(DealCard);