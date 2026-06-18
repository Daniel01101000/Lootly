import api from './api';

const TOKEN_URL = 'https://mnfapp.ath.cx/pruebas/mercadolibre/token.json';
const ML_SEARCH_BASE = 'https://api.mercadolibre.com/sites/MLM/search';

const QUERIES = [
  { q: 'tarjeta de video gaming', category: 'gpu' },
  { q: 'procesador gaming AMD Intel', category: 'cpu' },
  { q: 'memoria RAM gaming DDR4 DDR5', category: 'component' },
  { q: 'SSD NVMe gaming', category: 'component' },
  { q: 'monitor gamer 144hz', category: 'monitor' },
  { q: 'teclado mecanico gamer', category: 'keyboard' },
  { q: 'mouse gamer inalambrico', category: 'mouse' },
  { q: 'laptop gamer RTX', category: 'laptop' },
  { q: 'audifonos gamer', category: 'headset' },
];

const STORE_DB = 'Mercado Libre';
const STORE_DISPLAY = 'Mercado Libre';

function mapMLItem(item) {
  const discount = item.original_price
    ? Math.round((1 - item.price / item.original_price) * 100)
    : 0;

  if (!item.original_price || discount < 10) return null;

  const category = QUERIES.find((q) => q.q === item._query)?.category || 'component';

  return {
    id: item.id,
    name: item.title,
    current_price: item.price,
    original_price: item.original_price,
    discount,
    image_url: item.thumbnail?.replace('http://', 'https://').replace('I.jpg', 'O.jpg') || '',
    url: item.permalink,
    store: STORE_DISPLAY,
    category,
    currency: 'MXN',
    free_shipping: item.shipping?.free_shipping || false,
  };
}

async function fetchToken() {
  const res = await fetch(TOKEN_URL);
  if (!res.ok) throw new Error('Failed to fetch Mercado Libre token');
  const data = await res.json();
  return data.access_token;
}

async function searchMLQuery(token, query, category) {
  const url = `${ML_SEARCH_BASE}?q=${encodeURIComponent(query)}&discount=10-100&limit=50`;
  const res = await fetch(url, {
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
  });
  if (!res.ok) {
    console.warn(`[ML API] Error ${res.status} for "${query}"`);
    return [];
  }
  const data = await res.json();
  return (data.results || []).map((item) => ({ ...item, _query: query, _category: category }));
}

export async function fetchMercadoLibreDeals() {
  try {
    const token = await fetchToken();
    const allResults = [];

    for (const { q, category } of QUERIES) {
      const items = await searchMLQuery(token, q, category);
      allResults.push(...items);
      await new Promise((r) => setTimeout(r, 200));
    }

    const seenUrls = new Set();
    const mapped = allResults
      .map(mapMLItem)
      .filter(Boolean)
      .filter((item) => {
        if (seenUrls.has(item.url)) return false;
        seenUrls.add(item.url);
        return true;
      });

    console.log(`[ML Service] ${mapped.length} productos de Mercado Libre cargados`);
    return mapped;
  } catch (err) {
    console.error('[ML Service] Error:', err.message);
    throw err;
  }
}

export async function fetchMercadoLibreFromDB() {
  try {
    const res = await api.get('/products', {
      params: { store: STORE_DB, sort: 'discount', limit: 500 },
    });
    const products = (res.data || []).map((p) => ({
      ...p,
      store: STORE_DISPLAY,
    }));
    console.log(`[ML Service] ${products.length} productos desde DB`);
    return products;
  } catch (err) {
    console.warn('[ML Service] DB fetch failed, falling back to direct API');
    return fetchMercadoLibreDeals();
  }
}
