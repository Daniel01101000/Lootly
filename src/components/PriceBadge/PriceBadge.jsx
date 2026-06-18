import './PriceBadge.css';

const currencySymbols = {
  USD: '$',
  EUR: '€',
  GBP: '£',
  ARS: '$',
};

export default function PriceBadge({ current, original, currency = 'USD' }) {
  const symbol = currencySymbols[currency] || '$';
  const hasDiscount = original && original > current;
  const discount = hasDiscount ? Math.round((1 - current / original) * 100) : 0;

  return (
    <div className="price-badge">
      <span className="current-price">
        {symbol}
        {Number(current).toFixed(2)}
      </span>
      {hasDiscount && (
        <>
          <span className="original-price">
            {symbol}
            {Number(original).toFixed(2)}
          </span>
          <span className="discount-tag">-{discount}%</span>
        </>
      )}
    </div>
  );
}
