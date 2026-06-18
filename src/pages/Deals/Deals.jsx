import { useState, useEffect, useCallback } from 'react';
import {
  Cpu, Monitor, Keyboard, Mouse, Laptop,
  Gamepad2, Wrench, Package, Zap, AlertCircle,
  Smartphone, Refrigerator
} from 'lucide-react';
import DealCard from '../../components/DealCard/DealCard';
import MercadoLibreSection from '../../components/MercadoLibreSection/MercadoLibreSection';
import CategoryDropdown from '../../components/CategoryDropdown/CategoryDropdown';
import * as productService from '../../services/product.service';
import './Deals.css';

const CATEGORIES = [
  { value: '', label: 'Todas', icon: Package },
  { value: 'appliance', label: 'Electrodomésticos', icon: Refrigerator },
  { value: 'gpu', label: 'GPU', icon: Cpu },
  { value: 'cpu', label: 'CPU', icon: Zap },
  { value: 'monitor', label: 'Monitores', icon: Monitor },
  { value: 'keyboard', label: 'Teclados', icon: Keyboard },
  { value: 'mouse', label: 'Mouse', icon: Mouse },
  { value: 'laptop', label: 'Laptops', icon: Laptop },
  { value: 'console', label: 'Consolas', icon: Gamepad2 },
  { value: 'games', label: 'Juegos', icon: Gamepad2 },
  { value: 'component', label: 'Componentes', icon: Wrench },
  { value: 'phone', label: 'Celulares', icon: Smartphone },
];

const SORT_OPTIONS = [
  { value: 'discount', label: 'Mejor descuento' },
  { value: 'price_asc', label: 'Precio: menor a mayor' },
  { value: 'price_desc', label: 'Precio: mayor a menor' },
  { value: 'newest', label: 'Más recientes' },
];

const STORE_LABELS = {
  'Amazon': 'Amazon',
  'Mercado Libre': 'Mercado Libre',
  'Steam': 'Steam',
  'Best Buy': 'Best Buy',
  'Newegg': 'Newegg',
  'DDTech': 'DDTech',
  'CyberPuerta': 'CyberPuerta',
  'GamePlanet': 'GamePlanet',
  'Digital Life': 'Digital Life',
  'Zegucom': 'Zegucom',
  'Micro Center': 'Micro Center',
  'Razer': 'Razer',
  'SteelSeries': 'SteelSeries',
  'HyperX': 'HyperX',
  'Dell': 'Dell',
  'Lenovo': 'Lenovo',
  'GameStop': 'GameStop',
  'Walmart': 'Walmart',
  'GOG': 'GOG',
};

function DealCardSkeleton() {
  return (
    <div className="skeleton-card">
      <div className="skeleton-card-image" />
      <div className="skeleton-card-body">
        <div className="skeleton-line skeleton-line-title" />
        <div className="skeleton-line skeleton-line-price" />
        <div className="skeleton-line skeleton-line-save" />
        <div className="skeleton-btn" />
      </div>
    </div>
  );
}

export default function Deals() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [storeCounts, setStoreCounts] = useState([]);
  const [filters, setFilters] = useState({ sort: 'discount', page: 1, store: '', category: '' });

  useEffect(() => {
    productService
      .getStores()
      .then((res) => {
        if (Array.isArray(res.data)) {
          setStoreCounts(res.data);
        }
      })
      .catch(() => {});
  }, []);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    setError(null);
    productService
      .getProducts(filters)
      .then((res) => {
        if (!cancelled) {
          setProducts(res.data || []);
        }
      })
      .catch((err) => {
        if (!cancelled) {
          setError(err?.message || err?.error || 'Error al cargar ofertas');
        }
      })
      .finally(() => {
        if (!cancelled) {
          setLoading(false);
        }
      });
    return () => { cancelled = true; };
  }, [filters]);

  const updateFilter = useCallback((key, value) => {
    setFilters((prev) => ({ ...prev, [key]: value, page: 1 }));
  }, []);

  const clearFilters = useCallback(() => {
    setFilters({ sort: 'discount', page: 1, store: '', category: '' });
  }, []);

  const retry = useCallback(() => {
    setFilters((prev) => ({ ...prev }));
  }, []);

  const storeFilters = [
    { value: '', label: 'Todas las tiendas', count: null },
    ...storeCounts
      .filter((s) => s.count > 0)
      .map((s) => ({
        value: s.store,
        label: STORE_LABELS[s.store] || s.store,
        count: s.count,
      })),
  ];

  const activeStoreCount = storeFilters.length - 1;

  return (
    <div className="deals-page">
      <div className="deals-hero">
        <div className="container">
          <div className="deals-hero-content">
            <h1 className="deals-hero-title">Ofertas Gamer</h1>
            <p className="deals-hero-subtitle">
              {activeStoreCount > 0
                ? `Los mejores descuentos en gaming de ${activeStoreCount} tiendas`
                : 'Cargando tiendas...'}
            </p>
          </div>
        </div>
      </div>

      <div className="container section">
        <div className="deals-categories-wrapper">
          <div className="deals-categories">
            {CATEGORIES.map((cat) => {
              const Icon = cat.icon;
              return (
                <button
                  key={cat.value}
                  className={`deals-cat-btn ${filters.category === cat.value ? 'active' : ''}`}
                  onClick={() => updateFilter('category', cat.value)}
                >
                  <Icon size={16} className="deals-cat-icon" />
                  <span className="deals-cat-label">{cat.label}</span>
                </button>
              );
            })}
          </div>

          <CategoryDropdown
            categories={CATEGORIES}
            activeCategory={filters.category}
            onSelect={(value) => updateFilter('category', value)}
          />
        </div>

        <div className="deals-toolbar">
          <div className="deals-store-filters">
            {storeFilters.map((store) => (
              <button
                key={store.value}
                className={`deals-store-btn ${filters.store === store.value ? 'active' : ''}`}
                onClick={() => updateFilter('store', store.value)}
              >
                {store.label}
                {store.count != null && (
                  <span className="deals-store-count">{store.count}</span>
                )}
              </button>
            ))}
          </div>

          <div className="deals-sort">
            <label className="deals-sort-label" htmlFor="deals-sort-select">Ordenar por</label>
            <select
              id="deals-sort-select"
              value={filters.sort}
              onChange={(e) => updateFilter('sort', e.target.value)}
              className="filter-select"
            >
              {SORT_OPTIONS.map((opt) => (
                <option key={opt.value} value={opt.value}>{opt.label}</option>
              ))}
            </select>
          </div>
        </div>

        {loading && (
          <div className="deals-grid" key={`skeleton-${filters.category}-${filters.store}-${filters.sort}`}>
            {Array.from({ length: 8 }, (_, i) => (
              <DealCardSkeleton key={i} />
            ))}
          </div>
        )}

        {!loading && error && (
          <div className="page-error">
            <AlertCircle size={40} className="error-icon" />
            <p className="error-message">{error}</p>
            <button className="btn btn-primary" onClick={retry}>
              Reintentar
            </button>
          </div>
        )}

        {!loading && !error && products.length === 0 && (
          <div className="empty-state">
            <div className="empty-state-icon">
              <Package size={56} />
            </div>
            <h3 className="empty-state-title">Sin resultados</h3>
            <p className="empty-state-text">
              {filters.store || filters.category
                ? 'No encontramos ofertas con esos filtros. Intenta con otras opciones.'
                : 'No hay ofertas disponibles en este momento. Vuelve pronto.'}
            </p>
            {(filters.store || filters.category) && (
              <button className="btn btn-primary" onClick={clearFilters}>
                Limpiar filtros
              </button>
            )}
          </div>
        )}

        {!loading && !error && products.length > 0 && (
          <>
            <div
              className="deals-grid deals-grid-enter"
              key={`grid-${filters.category}-${filters.store}-${filters.sort}-${filters.page}`}
            >
              {products.map((product) => (
                <DealCard key={product.id} product={product} />
              ))}
            </div>
            <p className="deals-count">
              {products.length} ofertas encontradas
            </p>
          </>
        )}
      </div>

      <MercadoLibreSection />
    </div>
  );
}