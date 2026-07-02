// CoinGecko free API — no key needed, CORS enabled
const CRYPTO_IDS = 'bitcoin,ethereum,solana,ripple,cardano,polkadot,chainlink';

// Top stocks — using Financial Modeling Prep demo key (limited but functional for MVP)
const FMP_KEY = 'demo';
const STOCK_SYMBOLS = ['AAPL', 'MSFT', 'NVDA', 'AMZN', 'GOOGL', 'META', 'TSLA'];
const SPANISH_SYMBOLS = ['ITX.MC', 'BBVA.MC', 'SAN.MC', 'IBE.MC', 'REP.MC'];

// Commodity display (static reference + CoinGecko for gold ETC approximation)
const COMMODITIES_STATIC = [
  { name: 'Oro', symbol: 'XAU', emoji: '🥇', note: 'Referencia global cobertura anti-inflación', url: 'https://myinvestor.es' },
  { name: 'Plata', symbol: 'XAG', emoji: '🥈', note: 'Mayor volatilidad que el oro, ratio oro/plata clave', url: 'https://myinvestor.es' },
  { name: 'Petróleo Brent', symbol: 'BRN', emoji: '🛢️', note: 'Indicador macroeconómico global', url: 'https://traderepublic.com/es-es' },
];

function fmt(n, decimals = 2) {
  return n?.toLocaleString('es-ES', { minimumFractionDigits: decimals, maximumFractionDigits: decimals }) ?? '—';
}

function changeClass(pct) {
  if (pct === null || pct === undefined) return 'text-gray-400';
  return pct >= 0 ? 'up' : 'down';
}

function changeArrow(pct) {
  if (pct === null || pct === undefined) return '';
  return pct >= 0 ? '▲' : '▼';
}

function sparkColor(pct) {
  if (!pct) return '#9ca3af';
  return pct >= 0 ? '#16a34a' : '#dc2626';
}

function renderCryptoCard(coin) {
  const pct = coin.price_change_percentage_24h;
  return `
    <div class="price-card">
      <div class="flex items-center justify-between mb-2">
        <div class="flex items-center gap-2">
          <img src="${coin.image}" alt="${coin.name}" class="w-7 h-7 rounded-full">
          <div>
            <p class="font-semibold text-gray-900 text-sm">${coin.name}</p>
            <p class="text-xs text-gray-400 uppercase">${coin.symbol}</p>
          </div>
        </div>
        <span class="tag ${pct >= 0 ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}">
          ${changeArrow(pct)} ${Math.abs(pct ?? 0).toFixed(2)}%
        </span>
      </div>
      <p class="text-xl font-bold text-gray-900">${fmt(coin.current_price)} €</p>
      <div class="flex justify-between text-xs text-gray-500 mt-2">
        <span>Cap. mercado: ${(coin.market_cap / 1e9).toFixed(1)}B €</span>
        <span>Vol 24h: ${(coin.total_volume / 1e6).toFixed(0)}M €</span>
      </div>
      <div class="mt-2 pt-2 border-t border-gray-100">
        <p class="text-xs text-gray-400">Máx 24h: <span class="text-gray-600">${fmt(coin.high_24h)} €</span> · Mín: <span class="text-gray-600">${fmt(coin.low_24h)} €</span></p>
      </div>
    </div>
  `;
}

function renderStockCard(stock) {
  const pct = stock.changesPercentage ?? stock.change_percentage;
  const price = stock.price ?? stock.c;
  const change = stock.change ?? stock.d;
  return `
    <div class="price-card">
      <div class="flex items-center justify-between mb-2">
        <div>
          <p class="font-semibold text-gray-900 text-sm">${stock.name ?? stock.symbol}</p>
          <p class="text-xs text-gray-400">${stock.symbol} · ${stock.exchange ?? ''}</p>
        </div>
        <span class="tag ${(pct ?? 0) >= 0 ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}">
          ${changeArrow(pct)} ${Math.abs(pct ?? 0).toFixed(2)}%
        </span>
      </div>
      <p class="text-xl font-bold text-gray-900">$${fmt(price)}</p>
      <p class="text-xs ${changeClass(pct)} mt-1">${(change ?? 0) >= 0 ? '+' : ''}${fmt(change)} hoy</p>
    </div>
  `;
}

function renderCommodityCard(c) {
  return `
    <div class="price-card">
      <div class="flex items-center justify-between mb-2">
        <div class="flex items-center gap-2">
          <span class="text-2xl">${c.emoji}</span>
          <div>
            <p class="font-semibold text-gray-900 text-sm">${c.name}</p>
            <p class="text-xs text-gray-400">${c.symbol}</p>
          </div>
        </div>
      </div>
      <p class="text-sm text-gray-500 mb-3">${c.note}</p>
      <a href="${c.url}" target="_blank" rel="noopener"
        class="text-xs font-medium text-blue-600 hover:text-blue-800">Invertir →</a>
    </div>
  `;
}

function setLoading(containerId, msg = '') {
  document.getElementById(containerId).innerHTML = `
    <div class="col-span-full flex items-center justify-center gap-2 py-8 text-gray-400 text-sm">
      <span class="loader"></span> ${msg || 'Cargando datos...'}
    </div>`;
}

function setError(containerId, msg) {
  document.getElementById(containerId).innerHTML = `
    <div class="col-span-full text-center py-6 text-red-500 text-sm">${msg}</div>`;
}

async function loadCrypto() {
  setLoading('crypto-grid', 'Cargando criptomonedas...');
  try {
    const res = await fetch(
      `https://api.coingecko.com/api/v3/coins/markets?vs_currency=eur&ids=${CRYPTO_IDS}&order=market_cap_desc&per_page=10&page=1&sparkline=false&price_change_percentage=24h`
    );
    if (!res.ok) throw new Error('API error');
    const data = await res.json();
    document.getElementById('crypto-grid').innerHTML = data.map(renderCryptoCard).join('');
    document.getElementById('crypto-updated').textContent = `Actualizado: ${new Date().toLocaleTimeString('es-ES')}`;
  } catch (e) {
    setError('crypto-grid', 'No se pudieron cargar los datos de CoinGecko. Intenta recargar la página.');
  }
}

async function loadStocks() {
  setLoading('stocks-grid', 'Cargando cotizaciones...');
  try {
    const symbols = [...STOCK_SYMBOLS, ...SPANISH_SYMBOLS].join(',');
    const res = await fetch(
      `https://financialmodelingprep.com/api/v3/quote/${symbols}?apikey=${FMP_KEY}`
    );
    if (!res.ok) throw new Error('API error');
    const data = await res.json();
    if (!data || data.length === 0) throw new Error('No data');

    // Split US and Spanish
    const us = data.filter(s => !s.symbol.endsWith('.MC'));
    const es = data.filter(s => s.symbol.endsWith('.MC'));

    let html = '';
    if (us.length) {
      html += `<div class="col-span-full text-xs font-semibold text-gray-400 uppercase tracking-wide mt-2">🇺🇸 Mercados US</div>`;
      html += us.map(renderStockCard).join('');
    }
    if (es.length) {
      html += `<div class="col-span-full text-xs font-semibold text-gray-400 uppercase tracking-wide mt-4">🇪🇸 Bolsa española</div>`;
      html += es.map(renderStockCard).join('');
    }
    document.getElementById('stocks-grid').innerHTML = html;
    document.getElementById('stocks-updated').textContent = `Actualizado: ${new Date().toLocaleTimeString('es-ES')}`;
  } catch (e) {
    // FMP demo key sometimes rate-limits — show a friendly fallback
    document.getElementById('stocks-grid').innerHTML = `
      <div class="col-span-full bg-yellow-50 border border-yellow-200 rounded-xl p-4 text-sm text-yellow-800">
        <p class="font-medium mb-1">Datos de acciones no disponibles en este momento</p>
        <p class="text-yellow-700">La clave demo de la API tiene límite de peticiones. Para datos en tiempo real ilimitados, regístrate gratis en <a href="https://financialmodelingprep.com" target="_blank" class="underline">financialmodelingprep.com</a> y reemplaza la clave en <code>markets.js</code>.</p>
      </div>`;
  }
}

function loadCommodities() {
  document.getElementById('commodities-grid').innerHTML = COMMODITIES_STATIC.map(renderCommodityCard).join('');
}

// Movers: top gainers and losers from crypto
async function loadMovers() {
  try {
    const res = await fetch(
      `https://api.coingecko.com/api/v3/coins/markets?vs_currency=eur&order=percent_change_24h_desc&per_page=20&page=1&sparkline=false&price_change_percentage=24h`
    );
    if (!res.ok) throw new Error();
    const data = await res.json();
    const gainers = data.sort((a, b) => b.price_change_percentage_24h - a.price_change_percentage_24h).slice(0, 3);
    const losers  = data.sort((a, b) => a.price_change_percentage_24h - b.price_change_percentage_24h).slice(0, 3);

    const renderMover = (coin, type) => {
      const pct = coin.price_change_percentage_24h;
      return `
        <div class="flex items-center justify-between py-2 border-b border-gray-100 last:border-0">
          <div class="flex items-center gap-2">
            <img src="${coin.image}" alt="${coin.name}" class="w-5 h-5 rounded-full">
            <span class="text-sm font-medium text-gray-800">${coin.name}</span>
          </div>
          <span class="text-sm font-semibold ${type === 'gainer' ? 'text-green-600' : 'text-red-600'}">
            ${changeArrow(pct)} ${Math.abs(pct).toFixed(1)}%
          </span>
        </div>`;
    };

    document.getElementById('top-gainers').innerHTML = gainers.map(c => renderMover(c, 'gainer')).join('');
    document.getElementById('top-losers').innerHTML = losers.map(c => renderMover(c, 'loser')).join('');
  } catch (e) {
    ['top-gainers', 'top-losers'].forEach(id => {
      document.getElementById(id).innerHTML = '<p class="text-xs text-gray-400 py-2">No disponible</p>';
    });
  }
}

document.addEventListener('DOMContentLoaded', () => {
  loadCrypto();
  loadStocks();
  loadCommodities();
  loadMovers();
});
