import { useState, useEffect } from 'react';
import { ExternalLink, ShoppingBag, AlertCircle, Package } from 'lucide-react';
import DealCard from '../DealCard/DealCard';
import { fetchMercadoLibreFromDB } from '../../services/mercadolibre';
import './MercadoLibreSection.css';

function Skeleton() {
  return (
    <div className="ml-skeleton">
      <div className="ml-skeleton-image" />
      <div className="ml-skeleton-body">
        <div className="ml-skeleton-line" />
        <div className="ml-skeleton-line" />
        <div className="ml-skeleton-line" />
        <div className="ml-skeleton-btn" />
      </div>
    </div>
  );
}

export default function MercadoLibreSection() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let cancelled = false;

    fetchMercadoLibreFromDB()
      .then((data) => {
        if (!cancelled) {
          setProducts(data);
        }
      })
      .catch((err) => {
        if (!cancelled) {
          setError(err?.message || 'Error al cargar ofertas');
        }
      })
      .finally(() => {
        if (!cancelled) {
          setLoading(false);
        }
      });

    return () => { cancelled = true; };
  }, []);

  return (
    <section className="ml-section">
      <div className="container">
        <div className="ml-header">
          <div className="ml-header-icon">
            <ShoppingBag size={22} />
          </div>
          <div className="ml-header-content">
            <h2 className="ml-header-title">
              Ofertas en Mercado Libre
              <span className="ml-header-badge">MELI</span>
            </h2>
            <p className="ml-header-subtitle">
              Los mejores descuentos en tecnología y gaming
            </p>
          </div>
        </div>

        {loading && (
          <div className="ml-loading">
            {Array.from({ length: 8 }, (_, i) => (
              <Skeleton key={i} />
            ))}
          </div>
        )}

        {!loading && error && (
          <div className="ml-error">
            <AlertCircle size={40} className="ml-error-icon" />
            <h3 className="ml-error-title">Error al cargar ofertas</h3>
            <p className="ml-error-text">{error}</p>
            <button
              className="btn btn-primary"
              onClick={() => window.location.reload()}
            >
              Reintentar
            </button>
          </div>
        )}

        {!loading && !error && products.length === 0 && (
          <div className="ml-empty">
            <Package size={56} className="ml-empty-icon" />
            <h3 className="ml-empty-title">Sin ofertas disponibles</h3>
            <p className="ml-empty-text">
              No hay ofertas de Mercado Libre en este momento. Vuelve pronto.
            </p>
          </div>
        )}

        {!loading && !error && products.length > 0 && (
          <>
            <div className="ml-grid">
              {products.map((product) => (
                <DealCard key={product.id} product={product} />
              ))}
            </div>

            <div className="ml-footer">
              <a
                href="https://www.mercadolibre.com.mx"
                target="_blank"
                rel="noopener noreferrer"
                className="ml-footer-btn"
              >
                Ver más en Mercado Libre
                <ExternalLink size={16} className="ml-footer-btn-icon" />
              </a>
            </div>
          </>
        )}
      </div>
    </section>
  );
}
