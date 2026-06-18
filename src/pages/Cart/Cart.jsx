import { Link, useNavigate } from 'react-router-dom';
import { useCart } from '../../context/CartContext';
import { useAuth } from '../../context/AuthContext';
import './Cart.css';

export default function Cart() {
  const { user } = useAuth();
  const { items, removeItem, updateQuantity, clearCart, totalItems, totalPrice, loading } = useCart();
  const navigate = useNavigate();

  if (!user) {
    return (
      <div className="cart-page container section">
        <div className="cart-empty-state">
          <div className="cart-empty-icon">
            <svg viewBox="0 0 24 24" width="56" height="56" fill="none" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="9" cy="21" r="1"/><circle cx="20" cy="21" r="1"/>
              <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"/>
            </svg>
          </div>
          <h3 className="cart-empty-title">Inicia sesión para ver tu carrito</h3>
          <p className="cart-empty-text">Tu carrito se guarda en tu cuenta y lo tendrás disponible en todos tus dispositivos.</p>
          <Link to="/login" className="btn btn-primary">Iniciar sesión</Link>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="cart-page container section">
        <h1 className="page-title">Tu Carrito</h1>
        <div className="cart-loading">
          <div className="spinner" />
          <p className="cart-loading-text">Cargando carrito...</p>
        </div>
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div className="cart-page container section">
        <h1 className="page-title">Tu Carrito</h1>
        <div className="cart-empty-state">
          <div className="cart-empty-icon">
            <svg viewBox="0 0 24 24" width="56" height="56" fill="none" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="9" cy="21" r="1"/><circle cx="20" cy="21" r="1"/>
              <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"/>
            </svg>
          </div>
          <h3 className="cart-empty-title">Tu carrito está vacío</h3>
          <p className="cart-empty-text">Explora las mejores ofertas en gaming y agrega productos a tu carrito.</p>
          <Link to="/deals" className="btn btn-primary">Ver ofertas</Link>
        </div>
      </div>
    );
  }

  return (
    <div className="cart-page container section">
      <div className="cart-header">
        <h1 className="page-title">Tu Carrito</h1>
        <button className="btn btn-sm btn-danger" onClick={clearCart}>
          Vaciar carrito
        </button>
      </div>

      <div className="cart-content">
        <div className="cart-items">
          {items.map((item) => (
            <div key={item.product_id} className="cart-item">
              <div className="cart-item-img-wrap">
                {item.image_url ? (
                  <img
                    src={item.image_url}
                    alt={item.name}
                    className="cart-item-img"
                    loading="lazy"
                    onError={(e) => {
                      e.target.style.display = 'none';
                      e.target.parentElement.querySelector('.cart-item-img-fallback')?.classList.remove('cart-item-img-fallback-hidden');
                    }}
                  />
                ) : null}
                <div className="cart-item-img-fallback cart-item-img-fallback-hidden">
                  <svg viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M2 12c0-2.8 0-4.2.5-5.3a5 5 0 0 1 2.2-2.2C5.8 4 7.2 4 10 4h4c2.8 0 4.2 0 5.3.5a5 5 0 0 1 2.2 2.2C22 7.8 22 9.2 22 12s0 4.2-.5 5.3a5 5 0 0 1-2.2 2.2C18.2 20 16.8 20 14 20h-4c-2.8 0-4.2 0-5.3-.5a5 5 0 0 1-2.2-2.2C2 16.2 2 14.8 2 12z"/>
                    <circle cx="8" cy="11" r="1" fill="currentColor"/>
                    <circle cx="16" cy="11" r="1" fill="currentColor"/>
                    <path d="M10 16h4"/>
                  </svg>
                </div>
              </div>

              <div className="cart-item-info">
                <h3 className="cart-item-name">{item.name}</h3>
                <div className="cart-item-meta">
                  {item.store && <span className="cart-item-store">{item.store}</span>}
                  {item.category && <span className="cart-item-category">{item.category}</span>}
                </div>
                <div className="cart-item-pricing">
                  <span className="cart-item-price">
                    {item.currency === 'USD' ? '$' : 'MX$'} {Number(item.current_price).toLocaleString('es-MX', { minimumFractionDigits: 2 })}
                  </span>
                  {item.original_price > item.current_price && (
                    <span className="cart-item-original">
                      {item.currency === 'USD' ? '$' : 'MX$'} {Number(item.original_price).toLocaleString('es-MX', { minimumFractionDigits: 2 })}
                    </span>
                  )}
                </div>
              </div>

              <div className="cart-item-actions">
                <div className="qty-control">
                  <button
                    onClick={() => updateQuantity(item.product_id, item.quantity - 1)}
                    disabled={item.quantity <= 1}
                    aria-label="Disminuir cantidad"
                  >
                    −
                  </button>
                  <span>{item.quantity}</span>
                  <button
                    onClick={() => updateQuantity(item.product_id, item.quantity + 1)}
                    aria-label="Aumentar cantidad"
                  >
                    +
                  </button>
                </div>

                <div className="cart-item-subtotal">
                  <span className="cart-subtotal-label">Subtotal</span>
                  <span className="cart-subtotal-value">
                    {item.currency === 'USD' ? '$' : 'MX$'} {Number(item.current_price * item.quantity).toLocaleString('es-MX', { minimumFractionDigits: 2 })}
                  </span>
                </div>

                <div className="cart-item-btns">
                  {item.url && (
                    <a
                      href={item.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="btn btn-sm btn-secondary cart-deal-btn"
                      title="Ir a la oferta"
                    >
                      Ir a la oferta
                    </a>
                  )}
                  <button
                    className="btn btn-sm btn-danger"
                    onClick={() => removeItem(item.product_id)}
                  >
                    Eliminar
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="cart-summary">
          <h3>Resumen</h3>
          <div className="summary-row">
            <span>Productos</span>
            <span>{totalItems}</span>
          </div>
          <div className="summary-row">
            <span>Subtotal</span>
            <span>
              MX$ {totalPrice.toLocaleString('es-MX', { minimumFractionDigits: 2 })}
            </span>
          </div>
          <div className="summary-divider" />
          <div className="summary-row total">
            <span>Total</span>
            <span>
              MX$ {totalPrice.toLocaleString('es-MX', { minimumFractionDigits: 2 })}
            </span>
          </div>
          <p className="summary-note">Los precios pueden variar en la tienda original.</p>
        </div>
      </div>
    </div>
  );
}
