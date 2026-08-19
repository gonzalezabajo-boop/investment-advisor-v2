// ─── Helpers ──────────────────────────────────────────────────────────────────
function fmtEur(n) {
  var rounded = Math.round(n);
  var sign = rounded < 0 ? '-' : '';
  var withDots = Math.abs(rounded).toString().replace(/\B(?=(\d{3})+(?!\d))/g, '.');
  return sign + withDots + ' €';
}

function fmtPct(n) { return (Math.round(n * 10) / 10) + '%'; }

function projFV(capital, monthly, years, rate) {
  var r = rate / 100 / 12;
  var n = years * 12;
  if (r === 0) return capital + monthly * n;
  return capital * Math.pow(1 + r, n) + monthly * ((Math.pow(1 + r, n) - 1) / r);
}

// ─── Roboadvisor blueprints ────────────────────────────────────────────────────
var ROBO_BLUEPRINTS = {
  finizens: {
    name: 'Finizens',
    fee_mgmt: '0,15%', fee_mgmt_label: 'Comisión de gestión',
    fee_funds: '0,23%', fee_funds_label: 'TER fondos (estimado)',
    fee_total: '0,38%', fee_num: 0.38,
    history: 'Agresivo ~8,5% anual (2011–2025)',
    url: 'https://finizens.com',
    why: 'Sin mínimo de entrada, ideal para comenzar con cualquier importe. Con 15 años de historial real, es el roboadvisor más veterano de España.',
    portfolios: {
      conservador: { label: 'Cartera Conservadora', rv: 24,   rf: 75  },
      moderado:    { label: 'Cartera Equilibrada',  rv: 52.5, rf: 46.5},
      dinamico:    { label: 'Cartera Atrevida',     rv: 81,   rf: 18  },
      agresivo:    { label: 'Cartera Agresiva',     rv: 99,   rf: 0   },
    },
    // Finizens usa Vanguard e iShares pero no publica ISINs en su web pública
    main_funds: null,
    funds_note: 'Finizens usa fondos de Vanguard e iShares (BlackRock) custodiados en Inversis Banco. La composición exacta no está publicada públicamente — disponible en el área de cliente y en los documentos KID de la CNMV.',
    transparency_url: 'https://finizens.com',
  },
  myinvestor: {
    name: 'MyInvestor Cartera Indexada',
    fee_mgmt: '0,30%', fee_mgmt_label: 'Gestión + custodia',
    fee_funds: '0,14%', fee_funds_label: 'TER fondos Amundi',
    fee_total: '0,44%', fee_num: 0.44,
    history: 'Backtesting desde 2005, real desde ~2021',
    url: 'https://myinvestor.es',
    why: 'Una de las opciones más baratas del mercado con una cartera 100% indexada. Requiere mínimo 3.000 € para empezar.',
    portfolios: {
      conservador: { label: 'Cartera Clásica',     rv: 13,  rf: 87 },
      moderado:    { label: 'Cartera Indie',        rv: 60,  rf: 40 },
      dinamico:    { label: 'Cartera Rock',         rv: 78,  rf: 22 },
      agresivo:    { label: 'Cartera Heavy Metal',  rv: 100, rf: 0  },
    },
    // Fondos Amundi institucionales confirmados (pesos exactos por perfil no publicados)
    main_funds: [
      { name: 'Amundi Index MSCI World',                       isin: 'LU0996181599', ter: '0,20%', asset: 'RV Global',       desc: 'Las ~1.600 mayores empresas del mundo en un solo fondo. Cuando Apple, Nestlé o Toyota crecen, tú creces con ellas.' },
      { name: 'Amundi Index MSCI Europe',                      isin: 'LU0389811539', ter: '0,15%', asset: 'RV Europa',       desc: 'Las grandes empresas europeas: LVMH, Siemens, Santander... Da estabilidad y reduce la dependencia del dólar.' },
      { name: 'Amundi Index MSCI Emerging Markets',            isin: 'LU0996175948', ter: '0,20%', asset: 'RV Emergentes',   desc: 'China, India, Brasil y más. Mayor riesgo, pero son las economías que más crecerán en las próximas décadas.' },
      { name: 'Amundi Index J.P. Morgan GBI Global Govies EUR Hdg', isin: 'LU0389812693', ter: '0,20%', asset: 'Bonos Globales', desc: 'Deuda de gobiernos solventes de todo el mundo. Cuando la bolsa cae, estos bonos suelen subir o aguantar — son el amortiguador de la cartera.' },
      { name: 'Amundi Index J.P. Morgan EMU Govies IG',        isin: 'LU1050469870', ter: '0,15%', asset: 'Bonos EUR',       desc: 'Deuda pública de países del euro (Alemania, Francia, España...). Sin riesgo de divisa, estabilidad para el tramo conservador.' },
    ],
    funds_note: 'Pesos exactos por perfil no publicados. Disponibles en el área de cliente de MyInvestor.',
    transparency_url: 'https://myinvestor.es',
  },
  indexa: {
    name: 'Indexa Capital',
    fee_mgmt: '0,42%', fee_mgmt_label: 'Comisión de gestión',
    fee_funds: '0,11%', fee_funds_label: 'TER fondos Vanguard',
    fee_total: '0,53%', fee_num: 0.53,
    history: '+8,2% real anual desde 2015 (cartera 8/10)',
    url: 'https://indexacapital.com',
    why: 'El historial real más largo de España: desde 2015 con datos verificados. A partir de 10.000 € su comisión baja al 0,31% y sigue bajando con el patrimonio.',
    portfolios: {
      conservador: { label: 'Cartera 4/10',  rv: 40,  rf: 60 },
      moderado:    { label: 'Cartera 6/10',  rv: 60,  rf: 40 },
      dinamico:    { label: 'Cartera 8/10',  rv: 80,  rf: 20 },
      agresivo:    { label: 'Cartera 10/10', rv: 100, rf: 0  },
    },
    // Composición verificada desde indexacapital.com/es/esp/model (tramo 10k-100k€)
    funds_by_risk: {
      conservador: [
        { name: 'Vanguard US 500 Stock Index',         isin: 'IE00BFPM9V94', pct: 18, asset: 'RV EEUU',        desc: 'Las 500 mayores empresas de EEUU. Cuando Apple, Microsoft o Amazon crecen, tú creces con ellas.' },
        { name: 'Vanguard European Stock Index',       isin: 'IE00BFPM9L96', pct: 11, asset: 'RV Europa',      desc: 'Las grandes empresas europeas: LVMH, Siemens, Santander... Reduce la dependencia del dólar.' },
        { name: 'Vanguard Emerging Mkt Stock Index',   isin: 'IE00BFPM9J74', pct: 4,  asset: 'RV Emergentes',  desc: 'China, India, Brasil y más. Son las economías que más crecerán en las próximas décadas.' },
        { name: 'Vanguard Japan Stock Index',          isin: 'IE00BFPM9P35', pct: 3,  asset: 'RV Japón',       desc: 'Las grandes corporaciones japonesas (Toyota, Sony, SoftBank). Diversificación fuera de EEUU y Europa.' },
        { name: 'Vanguard Global Small Cap Index',     isin: 'IE00BFRTDD83', pct: 4,  asset: 'RV Small Cap',   desc: 'Empresas pequeñas de todo el mundo. Históricamente dan más rentabilidad que las grandes a largo plazo.' },
        { name: 'Vanguard Euro Gov Bond Index',        isin: 'IE00BFPM9W02', pct: 16, asset: 'Bonos Gov EUR',  desc: 'Deuda pública de países del euro. Sin riesgo de divisa, estabilidad y refugio cuando la bolsa baja.' },
        { name: 'Vanguard US Gov Bond Index EUR Hdg',  isin: 'IE00BF6T7R10', pct: 16, asset: 'Bonos Gov EEUU', desc: 'Bonos del gobierno de EEUU, cubiertos a euros. El activo refugio por excelencia a nivel mundial.' },
        { name: 'Vanguard Euro Inv Gr Bond Index',     isin: 'IE00BFPM9X19', pct: 11, asset: 'Bonos Corp EUR',  desc: 'Deuda de empresas solventes europeas. Más rentabilidad que la deuda pública con riesgo muy controlado.' },
        { name: 'Vanguard US Inv Gr Bond Index EUR Hdg', isin: 'IE00BZ04LQ92', pct: 11, asset: 'Bonos Corp EEUU', desc: 'Deuda de grandes empresas de EEUU, cubierta a euros. Apple, Microsoft o Johnson & Johnson te prestan dinero.' },
        { name: 'Vanguard Eurozone Infl-Lk Bond',     isin: 'IE00BGCZ0719', pct: 6,  asset: 'Bonos Inf EUR',  desc: 'Bonos ligados a la inflación del euro. Si los precios suben, este fondo también sube — te protege del IPC.' },
      ],
      moderado: [
        { name: 'Vanguard US 500 Stock Index',         isin: 'IE00BFPM9V94', pct: 27, asset: 'RV EEUU',        desc: 'Las 500 mayores empresas de EEUU. Cuando Apple, Microsoft o Amazon crecen, tú creces con ellas.' },
        { name: 'Vanguard European Stock Index',       isin: 'IE00BFPM9L96', pct: 16, asset: 'RV Europa',      desc: 'Las grandes empresas europeas: LVMH, Siemens, Santander... Reduce la dependencia del dólar.' },
        { name: 'Vanguard Emerging Mkt Stock Index',   isin: 'IE00BFPM9J74', pct: 6,  asset: 'RV Emergentes',  desc: 'China, India, Brasil y más. Son las economías que más crecerán en las próximas décadas.' },
        { name: 'Vanguard Japan Stock Index',          isin: 'IE00BFPM9P35', pct: 5,  asset: 'RV Japón',       desc: 'Las grandes corporaciones japonesas (Toyota, Sony, SoftBank). Diversificación fuera de EEUU y Europa.' },
        { name: 'Vanguard Global Small Cap Index',     isin: 'IE00BFRTDD83', pct: 6,  asset: 'RV Small Cap',   desc: 'Empresas pequeñas de todo el mundo. Históricamente dan más rentabilidad que las grandes a largo plazo.' },
        { name: 'Vanguard Euro Gov Bond Index',        isin: 'IE00BFPM9W02', pct: 11, asset: 'Bonos Gov EUR',  desc: 'Deuda pública de países del euro. Sin riesgo de divisa, estabilidad y refugio cuando la bolsa baja.' },
        { name: 'Vanguard US Gov Bond Index EUR Hdg',  isin: 'IE00BF6T7R10', pct: 11, asset: 'Bonos Gov EEUU', desc: 'Bonos del gobierno de EEUU, cubiertos a euros. El activo refugio por excelencia a nivel mundial.' },
        { name: 'Vanguard Euro Inv Gr Bond Index',     isin: 'IE00BFPM9X19', pct: 7,  asset: 'Bonos Corp EUR',  desc: 'Deuda de empresas solventes europeas. Más rentabilidad que la deuda pública con riesgo muy controlado.' },
        { name: 'Vanguard US Inv Gr Bond Index EUR Hdg', isin: 'IE00BZ04LQ92', pct: 7,  asset: 'Bonos Corp EEUU', desc: 'Deuda de grandes empresas de EEUU, cubierta a euros. Apple, Microsoft o Johnson & Johnson te prestan dinero.' },
        { name: 'Vanguard Eurozone Infl-Lk Bond',     isin: 'IE00BGCZ0719', pct: 4,  asset: 'Bonos Inf EUR',  desc: 'Bonos ligados a la inflación del euro. Si los precios suben, este fondo también sube — te protege del IPC.' },
      ],
      dinamico: [
        { name: 'Vanguard US 500 Stock Index',         isin: 'IE00BFPM9V94', pct: 35, asset: 'RV EEUU',        desc: 'Las 500 mayores empresas de EEUU. Cuando Apple, Microsoft o Amazon crecen, tú creces con ellas.' },
        { name: 'Vanguard European Stock Index',       isin: 'IE00BFPM9L96', pct: 22, asset: 'RV Europa',      desc: 'Las grandes empresas europeas: LVMH, Siemens, Santander... Reduce la dependencia del dólar.' },
        { name: 'Vanguard Emerging Mkt Stock Index',   isin: 'IE00BFPM9J74', pct: 9,  asset: 'RV Emergentes',  desc: 'China, India, Brasil y más. Son las economías que más crecerán en las próximas décadas.' },
        { name: 'Vanguard Japan Stock Index',          isin: 'IE00BFPM9P35', pct: 6,  asset: 'RV Japón',       desc: 'Las grandes corporaciones japonesas (Toyota, Sony, SoftBank). Diversificación fuera de EEUU y Europa.' },
        { name: 'Vanguard Global Small Cap Index',     isin: 'IE00BFRTDD83', pct: 8,  asset: 'RV Small Cap',   desc: 'Empresas pequeñas de todo el mundo. Históricamente dan más rentabilidad que las grandes a largo plazo.' },
        { name: 'Vanguard Euro Gov Bond Index',        isin: 'IE00BFPM9W02', pct: 5,  asset: 'Bonos Gov EUR',  desc: 'Deuda pública de países del euro. Sin riesgo de divisa, estabilidad y refugio cuando la bolsa baja.' },
        { name: 'Vanguard US Gov Bond Index EUR Hdg',  isin: 'IE00BF6T7R10', pct: 4,  asset: 'Bonos Gov EEUU', desc: 'Bonos del gobierno de EEUU, cubiertos a euros. El activo refugio por excelencia a nivel mundial.' },
        { name: 'Vanguard Euro Inv Gr Bond Index',     isin: 'IE00BFPM9X19', pct: 4,  asset: 'Bonos Corp EUR',  desc: 'Deuda de empresas solventes europeas. Más rentabilidad que la deuda pública con riesgo muy controlado.' },
        { name: 'Vanguard US Inv Gr Bond Index EUR Hdg', isin: 'IE00BZ04LQ92', pct: 4,  asset: 'Bonos Corp EEUU', desc: 'Deuda de grandes empresas de EEUU, cubierta a euros. Apple, Microsoft o Johnson & Johnson te prestan dinero.' },
        { name: 'Vanguard Eurozone Infl-Lk Bond',     isin: 'IE00BGCZ0719', pct: 3,  asset: 'Bonos Inf EUR',  desc: 'Bonos ligados a la inflación del euro. Si los precios suben, este fondo también sube — te protege del IPC.' },
      ],
      agresivo: [
        { name: 'Vanguard US 500 Stock Index',         isin: 'IE00BFPM9V94', pct: 44, asset: 'RV EEUU',       desc: 'Las 500 mayores empresas de EEUU. Cuando Apple, Microsoft o Amazon crecen, tú creces con ellas.' },
        { name: 'Vanguard European Stock Index',       isin: 'IE00BFPM9L96', pct: 27, asset: 'RV Europa',     desc: 'Las grandes empresas europeas: LVMH, Siemens, Santander... Reduce la dependencia del dólar.' },
        { name: 'Vanguard Emerging Mkt Stock Index',   isin: 'IE00BFPM9J74', pct: 11, asset: 'RV Emergentes', desc: 'China, India, Brasil y más. Son las economías que más crecerán en las próximas décadas.' },
        { name: 'Vanguard Japan Stock Index',          isin: 'IE00BFPM9P35', pct: 8,  asset: 'RV Japón',      desc: 'Las grandes corporaciones japonesas (Toyota, Sony, SoftBank). Diversificación fuera de EEUU y Europa.' },
        { name: 'Vanguard Global Small Cap Index',     isin: 'IE00BFRTDD83', pct: 10, asset: 'RV Small Cap',  desc: 'Empresas pequeñas de todo el mundo. Históricamente dan más rentabilidad que las grandes a largo plazo.' },
      ],
    },
    funds_note: 'Composición verificada en indexacapital.com/es/esp/model. Tramo 10.000–100.000 €.',
    transparency_url: 'https://indexacapital.com/es/esp/model',
  },
};

function getRoboKey(capital) {
  if (capital < 3000)  return 'finizens';
  if (capital < 10000) return 'myinvestor';
  return 'indexa';
}

// ─── DIY fund building blocks ──────────────────────────────────────────────────
var FUNDS = {
  world: { name: 'Fidelity MSCI World',            isin: 'IE00BYX5NX33', ter: '0,12%', terN: 0.12, asset: 'RV Mundo' },
  em:    { name: 'Amundi Index MSCI Emerging Markets',     isin: 'LU0996175948', ter: '0,20%', terN: 0.20, asset: 'RV Emergentes' },
  small: { name: 'Vanguard Global Small-Cap',             isin: 'IE00B42W3S00', ter: '0,29%', terN: 0.29, asset: 'RV Small-Cap' },
  bond:  { name: 'Vanguard Global Bond Index EUR Hdg',    isin: 'IE00B50W2R13', ter: '0,15%', terN: 0.15, asset: 'Renta Fija' },
};

var BOND_PCT = { conservador: 30, moderado: 20, dinamico: 10, agresivo: 0 };

// ─── Glossary (hover tooltips on jargon chips) ─────────────────────────────────
var GLOSSARY = {
  'TER': 'Total Expense Ratio: el coste anual que cobra el fondo por gestionarlo. Ya está descontado del precio, no lo pagas aparte. Cuanto más bajo, más rentabilidad neta te queda.',
  'RV Mundo': 'Renta variable mundial: acciones de miles de empresas de todo el mundo (EEUU, Europa, Asia...) en un solo fondo. Es la base de una cartera diversificada.',
  'RV Emergentes': 'Renta variable de países emergentes (China, India, Brasil...). Mayor potencial de crecimiento a largo plazo, pero con más oscilaciones que los mercados desarrollados.',
  'RV Small-Cap': 'Empresas de pequeña capitalización bursátil. Históricamente han dado más rentabilidad que las grandes a largo plazo, a cambio de más volatilidad.',
  'Renta Fija': 'Bonos: préstamos a gobiernos o empresas a cambio de un interés. Amortiguan las caídas de la bolsa y dan estabilidad a la cartera.',
};

function glossChip(label, key) {
  var def = GLOSSARY[key || label];
  if (!def) return '<span class="bg-white rounded-lg px-2 py-1 border border-gray-200">' + label + '</span>';
  return '<span class="gloss-tip bg-white rounded-lg px-2 py-1 border border-gray-200 border-dashed cursor-help">' + label +
    '<span class="gloss-tip-bubble">' + def + '</span></span>';
}

function getDiyLevel(capital) {
  if (capital < 3000)  return 1;
  if (capital < 15000) return 2;
  if (capital < 50000) return 3;
  return 4;
}

function getDiyAllocation(level, risk) {
  var bond = BOND_PCT[risk] !== undefined ? BOND_PCT[risk] : 10;
  var eq   = 100 - bond;
  if (level === 1) {
    return [{ fund: 'world', pct: 100 }];
  }
  if (level === 2) {
    if (bond === 0) return [{ fund: 'world', pct: 80 }, { fund: 'em', pct: 20 }];
    return [{ fund: 'world', pct: eq }, { fund: 'bond', pct: bond }];
  }
  if (level === 3) {
    var emPct3    = Math.round(eq * 0.20);
    var worldPct3 = eq - emPct3;
    if (bond === 0) return [
      { fund: 'world', pct: 70 },
      { fund: 'em',    pct: 20 },
      { fund: 'small', pct: 10 },
    ];
    return [
      { fund: 'world', pct: worldPct3 },
      { fund: 'em',    pct: emPct3 },
      { fund: 'bond',  pct: bond },
    ];
  }
  // Level 4
  var emPct    = Math.round(eq * 0.20);
  var smallPct = Math.round(eq * 0.10);
  var worldPct = eq - emPct - smallPct;
  var alloc4 = [
    { fund: 'world', pct: worldPct },
    { fund: 'em',    pct: emPct },
    { fund: 'small', pct: smallPct },
  ];
  if (bond > 0) alloc4.push({ fund: 'bond', pct: bond });
  return alloc4;
}

// ─── Profile/horizon meta ──────────────────────────────────────────────────────
var PROFILE_META = {
  conservador: { label: 'Conservador', emoji: '🛡️', desc: 'Prioridad en proteger el capital' },
  moderado:    { label: 'Moderado',    emoji: '⚖️', desc: 'Equilibrio entre crecimiento y estabilidad' },
  dinamico:    { label: 'Dinámico',    emoji: '🚀', desc: 'Crecimiento a largo plazo con algo de volatilidad' },
  agresivo:    { label: 'Agresivo',    emoji: '⚡', desc: 'Máximo crecimiento, alta tolerancia a caídas' },
};

var HORIZON_META = {
  short:  { label: 'Corto plazo (<3 años)',   years: 2  },
  medium: { label: 'Medio plazo (3–10 años)', years: 7  },
  long:   { label: 'Largo plazo (>10 años)',  years: 20 },
};

// ─── Emergency fund + savings account section ─────────────────────────────────
var SAVINGS_ACCOUNTS = [
  {
    name: 'Trade Republic',
    rate: '3,25%',
    rateN: 3.25,
    max: 50000,
    maxLabel: '50.000 €',
    note: 'Hasta 50.000 € garantizados (fondo alemán). Sin permanencia ni requisitos. Alta disponibilidad inmediata.',
    url: 'https://traderepublic.com/es-es',
    badge: 'Mejor opción',
    badgeColor: 'emerald',
  },
  {
    name: 'MyInvestor (Cuenta Ahorro)',
    rate: '2,50%',
    rateN: 2.50,
    max: null,
    maxLabel: 'Sin límite',
    note: 'Garantizado por el FGD español (hasta 100.000 €). Sin comisiones ni requisitos. Misma plataforma que los fondos indexados.',
    url: 'https://myinvestor.es',
    badge: 'Misma plataforma',
    badgeColor: 'blue',
  },
  {
    name: 'Openbank',
    rate: '2,27%',
    rateN: 2.27,
    max: null,
    maxLabel: 'Sin límite',
    note: 'Garantizado por el FGD español. Cuenta Ahorro Bienvenida sin requisitos ni permanencia.',
    url: 'https://www.openbank.es',
    badge: null,
    badgeColor: 'gray',
  },
];

var EMERGENCY_MONTHS = 3; // fondo de emergencia = 3 nóminas netas

function calcEmergencyTarget(step1, step2, totalSavings) {
  var ingresos = parseFloat((step2 || {}).ingresos) || 0;
  var ingresoHogar = parseFloat((step2 || {}).ingresos_hogar) || ingresos;
  if (ingresoHogar > 0) {
    return Math.round(ingresoHogar * EMERGENCY_MONTHS);
  }
  // No salary data available — fall back to reserving a conservative share of
  // liquid savings as an estimated cushion, instead of assuming a 0€ emergency fund.
  var savings = parseFloat(totalSavings) || 0;
  return Math.round(savings * 0.35);
}

function buildEmergencySection(step1, step2, totalSavings, investibleCapital, accentColor, monthly) {
  var emergencyTarget = calcEmergencyTarget(step1, step2, totalSavings);
  if (emergencyTarget === 0) return '';

  var reserved = Math.min(totalSavings, emergencyTarget);
  var meses = EMERGENCY_MONTHS;
  var shortfall = Math.max(0, emergencyTarget - totalSavings);
  var alreadyCovered = totalSavings >= emergencyTarget;
  var bestAccount = SAVINGS_ACCOUNTS[0];
  var interestYear = Math.round(reserved * bestAccount.rateN / 100);

  var statusHtml;
  if (alreadyCovered) {
    statusHtml =
      '<div class="flex items-center gap-2 mb-3">' +
        '<span class="text-emerald-600 font-bold text-sm">✓ Colchón cubierto</span>' +
        '<span class="text-xs text-gray-400">(' + meses + ' meses de gastos estimados)</span>' +
      '</div>' +
      '<div class="grid grid-cols-2 gap-3 mb-4">' +
        '<div class="bg-emerald-50 rounded-xl p-3 text-center">' +
          '<p class="text-xs text-gray-500 mb-0.5">En cuenta remunerada</p>' +
          '<p class="font-bold text-emerald-700 text-base">' + fmtEur(reserved) + '</p>' +
        '</div>' +
        '<div class="bg-blue-50 rounded-xl p-3 text-center">' +
          '<p class="text-xs text-gray-500 mb-0.5">Disponible para invertir</p>' +
          '<p class="font-bold text-blue-700 text-base">' + fmtEur(investibleCapital) + '</p>' +
        '</div>' +
      '</div>' +
      '<p class="text-xs text-gray-400 mb-4">La cuenta remunerada te genera ~<strong class="text-gray-600">' + fmtEur(interestYear) + '/año</strong> de intereses mientras el dinero espera.</p>';
  } else {
    var monthlyNum = parseFloat(monthly) || 0;
    var monthsToGo = monthlyNum > 0 ? Math.ceil(shortfall / monthlyNum) : null;
    var etaHtml = monthsToGo
      ? ' A tu ritmo actual (' + fmtEur(monthlyNum) + '/mes), lo tendrías cubierto en unos <strong>' + monthsToGo + (monthsToGo === 1 ? ' mes' : ' meses') + '</strong>.'
      : '';
    statusHtml =
      '<div class="flex items-center gap-2 mb-3">' +
        '<span class="w-5 h-5 rounded-full bg-amber-500 text-white text-[10px] font-bold flex items-center justify-center shrink-0">1</span>' +
        '<span class="text-amber-700 font-bold text-sm">Paso 1 · Completa tu colchón antes de invertir</span>' +
      '</div>' +
      '<div class="grid grid-cols-2 gap-3 mb-4">' +
        '<div class="bg-amber-50 rounded-xl p-3 text-center">' +
          '<p class="text-xs text-gray-500 mb-0.5">Objetivo (' + meses + ' meses)</p>' +
          '<p class="font-bold text-amber-700 text-base">' + fmtEur(emergencyTarget) + '</p>' +
        '</div>' +
        '<div class="bg-red-50 rounded-xl p-3 text-center">' +
          '<p class="text-xs text-gray-500 mb-0.5">Te faltan</p>' +
          '<p class="font-bold text-red-600 text-base">' + fmtEur(shortfall) + '</p>' +
        '</div>' +
      '</div>' +
      '<p class="text-xs text-amber-700 font-medium mb-3">Antes de invertir nada, dirige tu ahorro mensual a una cuenta remunerada hasta alcanzar ' + fmtEur(emergencyTarget) + '.' + etaHtml + '</p>';
  }

  var accountsHtml = SAVINGS_ACCOUNTS.map(function(acc, i) {
    var badgeHtml = acc.badge
      ? '<span class="ml-2 text-xs font-semibold px-2 py-0.5 rounded-full bg-' + acc.badgeColor + '-100 text-' + acc.badgeColor + '-700">' + acc.badge + '</span>'
      : '';
    return '<div class="flex items-start justify-between py-3' + (i > 0 ? ' border-t border-gray-100' : '') + '">' +
      '<div class="flex-1 mr-3">' +
        '<div class="flex items-center flex-wrap gap-1 mb-0.5">' +
          '<p class="font-semibold text-gray-900 text-sm">' + acc.name + '</p>' +
          badgeHtml +
        '</div>' +
        '<p class="text-xs text-gray-400">' + acc.note + '</p>' +
      '</div>' +
      '<div class="text-right shrink-0">' +
        '<p class="font-bold text-emerald-600 text-base">' + acc.rate + '</p>' +
        '<p class="text-xs text-gray-400">' + acc.maxLabel + '</p>' +
      '</div>' +
    '</div>';
  }).join('');

  return '<div class="bg-white rounded-3xl border border-gray-100 shadow-sm p-6">' +
    '<h3 class="text-lg font-bold text-gray-900 mb-1">🛡️ Fondo de emergencia</h3>' +
    '<p class="text-sm text-gray-400 mb-4">Tu colchón de seguridad antes de invertir</p>' +
    statusHtml +
    '<p class="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">Cuentas remuneradas más competitivas (España, 2025)</p>' +
    '<div class="bg-gray-50 rounded-2xl p-4">' +
      accountsHtml +
    '</div>' +
    '<a href="' + bestAccount.url + '" target="_blank" rel="noopener" ' +
      'class="mt-4 w-full block text-center bg-emerald-600 text-white font-bold py-3 rounded-2xl hover:bg-emerald-700 transition-all text-sm">' +
      'Abrir ' + bestAccount.name + ' · ' + bestAccount.rate + ' TAE →' +
    '</a>' +
  '</div>';
}

// ─── Shared projection cards ───────────────────────────────────────────────────
function projectionCards(capital, monthly, rate, colA, colB, colC) {
  var y10 = Math.round(projFV(capital, monthly, 10, rate));
  var y20 = Math.round(projFV(capital, monthly, 20, rate));
  var y30 = Math.round(projFV(capital, monthly, 30, rate));
  var i10 = capital + monthly * 120;
  var i20 = capital + monthly * 240;
  var i30 = capital + monthly * 360;
  return '<div class="grid grid-cols-3 gap-3 mb-4">' +
    '<div class="text-center p-3 bg-' + colA + '-50 rounded-2xl"><p class="text-xs text-gray-500 mb-1">En 10 años</p><p class="text-lg font-bold text-' + colA + '-700">' + fmtEur(y10) + '</p><p class="text-xs text-gray-400">aportado: ' + fmtEur(Math.round(i10)) + '</p></div>' +
    '<div class="text-center p-3 bg-' + colB + '-50 rounded-2xl"><p class="text-xs text-gray-500 mb-1">En 20 años</p><p class="text-lg font-bold text-' + colB + '-700">' + fmtEur(y20) + '</p><p class="text-xs text-gray-400">aportado: ' + fmtEur(Math.round(i20)) + '</p></div>' +
    '<div class="text-center p-3 bg-' + colC + '-50 rounded-2xl"><p class="text-xs text-gray-500 mb-1">En 30 años</p><p class="text-lg font-bold text-' + colC + '-700">' + fmtEur(y30) + '</p><p class="text-xs text-gray-400">aportado: ' + fmtEur(Math.round(i30)) + '</p></div>' +
    '</div><p class="text-xs text-gray-400 text-center">Proyección estimada. Rentabilidades pasadas no garantizan resultados futuros.</p>';
}

// ─── Render: Roboadvisor plan ──────────────────────────────────────────────────
function buildFundsSection(robo, risk) {
  var funds = robo.funds_by_risk ? robo.funds_by_risk[risk] || robo.funds_by_risk.moderado : robo.main_funds;
  var hasWeights = robo.funds_by_risk != null;

  var fundsHtml = '';
  if (funds && funds.length) {
    var rows = funds.map(function(f) {
      var nameCell = f.desc
        ? '<td class="py-2.5 pr-3 align-top">' +
            '<p class="text-xs text-gray-800 font-medium leading-snug">' + f.name + '</p>' +
            '<p class="text-xs text-gray-400 mt-0.5 leading-snug">' + f.desc + '</p>' +
          '</td>'
        : '<td class="py-2.5 pr-3 text-xs text-gray-800 font-medium align-top">' + f.name + '</td>';
      return '<tr class="border-t border-gray-100">' +
        nameCell +
        '<td class="py-2.5 pr-3 text-xs text-gray-400 font-mono align-top whitespace-nowrap">' + f.isin + '</td>' +
        (hasWeights
          ? '<td class="py-2.5 text-xs font-bold text-blue-700 text-right align-top whitespace-nowrap">' + f.pct + '%</td>'
          : (f.ter ? '<td class="py-2.5 text-xs text-gray-400 text-right align-top whitespace-nowrap">' + f.ter + '</td>' : '<td></td>')
        ) +
        '</tr>';
    }).join('');

    var thPct = hasWeights ? '<th class="pb-2 text-right text-xs font-semibold text-gray-400 whitespace-nowrap">Peso</th>' : '<th class="pb-2 text-right text-xs font-semibold text-gray-400 whitespace-nowrap">TER</th>';

    fundsHtml = '<div class="overflow-x-auto">' +
      '<table class="w-full">' +
      '<thead><tr>' +
        '<th class="pb-2 text-left text-xs font-semibold text-gray-400">Fondo</th>' +
        '<th class="pb-2 text-left text-xs font-semibold text-gray-400 whitespace-nowrap">ISIN</th>' +
        thPct +
      '</tr></thead>' +
      '<tbody>' + rows + '</tbody>' +
      '</table>' +
    '</div>';
  }

  if (!hasWeights && !funds) {
    fundsHtml = '';
  }

  var noteHtml = robo.funds_note
    ? '<p class="text-xs text-gray-400 mt-3 italic">' + robo.funds_note + '</p>'
    : '';

  var linkHtml = robo.transparency_url
    ? '<a href="' + robo.transparency_url + '" target="_blank" rel="noopener" class="text-xs text-blue-600 hover:underline mt-2 inline-block">Ver composición oficial →</a>'
    : '';

  return '<details class="mt-5 border-t border-gray-100 group">' +
    '<summary class="cursor-pointer select-none list-none flex items-center justify-between pt-4 pb-1 hover:text-blue-600 transition-colors">' +
      '<span class="text-sm font-semibold text-gray-700 group-hover:text-blue-600">🔍 Fondos subyacentes</span>' +
      '<span class="text-gray-400 text-xs group-open:hidden">▼ ver</span>' +
      '<span class="text-gray-400 text-xs hidden group-open:inline">▲ ocultar</span>' +
    '</summary>' +
    '<div class="pt-3">' +
      fundsHtml +
      noteHtml +
      linkHtml +
    '</div>' +
  '</details>';
}

function renderRoboadvisorPlan(profile) {
  var totalSavings = parseFloat((profile.step1 || {}).ahorros_liquidos) || 0;
  var monthly      = parseFloat((profile.step2 || {}).ahorro_mensual)   || 0;
  var risk         = profile.riskProfile || 'moderado';
  var horizKey     = profile.horizonKey  || 'long';
  var pm           = PROFILE_META[risk]     || PROFILE_META.moderado;
  var hm           = HORIZON_META[horizKey] || HORIZON_META.long;
  var emergTarget  = calcEmergencyTarget(profile.step1, profile.step2, totalSavings);
  var capital      = Math.max(0, totalSavings - emergTarget);
  var roboKey      = getRoboKey(capital);
  var robo         = ROBO_BLUEPRINTS[roboKey];
  var portf        = robo.portfolios[risk] || robo.portfolios.moderado;
  var rate         = roboKey === 'indexa' ? 7.5 : 7;
  var feeYear      = capital > 0 ? Math.round(capital * robo.fee_num / 100) : 0;
  var roboFirst    = robo.name.split(' ')[0];

  var emergSection    = buildEmergencySection(profile.step1, profile.step2, totalSavings, capital, 'blue', monthly);
  var emergencyCovered = totalSavings >= emergTarget;
  var recoEyebrow     = emergencyCovered ? 'Recomendado para ti' : 'Tu plan · cuando completes tu colchón';
  var step2Badge = emergencyCovered ? '' : `
    <div class="flex items-center gap-2 mb-3">
      <span class="w-5 h-5 rounded-full bg-gray-300 text-white text-[10px] font-bold flex items-center justify-center shrink-0">2</span>
      <p class="text-xs font-semibold text-gray-400 uppercase tracking-wide">Paso 2 · Después de cubrir tu fondo de emergencia</p>
    </div>`;

  return `
    ${emergSection}

    <div class="bg-gradient-to-r from-blue-700 to-blue-900 rounded-3xl p-6 text-white">
      <p class="text-blue-200 text-xs font-semibold uppercase tracking-widest mb-3">Tu perfil inversor</p>
      <div class="flex items-center gap-4 mb-4">
        <div class="w-14 h-14 bg-white bg-opacity-20 rounded-2xl flex items-center justify-center text-3xl">${pm.emoji}</div>
        <div>
          <h2 class="font-display text-2xl font-semibold">Perfil ${pm.label}</h2>
          <p class="text-blue-200 text-sm">${hm.label} · ${pm.desc}</p>
        </div>
      </div>
      <div class="grid grid-cols-3 gap-3">
        <div class="bg-white bg-opacity-15 rounded-xl p-3 text-center">
          <p class="text-xs text-blue-200">A invertir</p>
          <p class="text-lg font-bold">${fmtEur(capital)}</p>
        </div>
        <div class="bg-white bg-opacity-15 rounded-xl p-3 text-center">
          <p class="text-xs text-blue-200">Mensual</p>
          <p class="text-lg font-bold">${monthly > 0 ? fmtEur(monthly) : '—'}</p>
        </div>
        <div class="bg-white bg-opacity-15 rounded-xl p-3 text-center">
          <p class="text-xs text-blue-200">Cartera</p>
          <p class="text-lg font-bold">${portf.rv}/${portf.rf}</p>
        </div>
      </div>
    </div>

    <div>
      ${step2Badge}
      <div class="bg-white rounded-3xl border ${emergencyCovered ? 'border-gray-100' : 'border-dashed border-gray-300'} shadow-sm overflow-hidden ${emergencyCovered ? '' : 'opacity-90'}">
        <div class="bg-blue-700 px-6 py-4">
          <div class="flex items-center justify-between gap-3 mb-1">
            <p class="text-white text-xs font-semibold uppercase tracking-widest">${recoEyebrow}</p>
            <span class="text-xs font-bold text-emerald-300 bg-emerald-900 bg-opacity-40 px-2.5 py-1 rounded-full whitespace-nowrap">📊 ${robo.history}</span>
          </div>
          <h3 class="font-display text-white text-xl font-semibold">${robo.name}</h3>
          <p class="text-blue-200 text-sm">${portf.label} · ${portf.rv}% RV / ${portf.rf}% RF</p>
        </div>
        <div class="p-6">
          <div class="flex items-start gap-3 mb-5">
            <div class="w-12 h-12 bg-blue-50 rounded-xl flex items-center justify-center shrink-0 text-2xl">🤖</div>
            <div class="flex-1">
              <p class="font-semibold text-gray-900">¿Por qué ${roboFirst}?</p>
              <p class="text-sm text-gray-500 mt-1">${robo.why}</p>
              ${buildFundsSection(robo, risk)}
            </div>
          </div>
          <div class="bg-gray-50 rounded-2xl p-4 mb-4">
            <p class="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-3">Coste total anual</p>
            <div class="space-y-2">
              <div class="flex justify-between text-sm"><span class="text-gray-600">${robo.fee_mgmt_label || 'Comisión de gestión'}</span><span class="font-medium text-gray-900">${robo.fee_mgmt}</span></div>
              <div class="flex justify-between text-sm"><span class="text-gray-600">${robo.fee_funds_label || 'TER fondos subyacentes'}</span><span class="font-medium text-gray-900">${robo.fee_funds}</span></div>
              <div class="border-t border-gray-200 pt-2 flex justify-between text-sm font-bold">
                <span class="text-gray-900">Total anual</span>
                <span class="text-blue-700">${robo.fee_total}${feeYear > 0 ? ' · ~' + fmtEur(feeYear) + '/año' : ''}</span>
              </div>
            </div>
            <p class="text-xs text-gray-400 mt-2">La banca tradicional cobra de media un 2–3%/año. Este roboadvisor te ahorra esa diferencia año tras año.</p>
          </div>
          ${emergencyCovered
            ? `<a href="${robo.url}" target="_blank" rel="noopener" class="w-full block text-center bg-blue-700 text-white font-bold py-3.5 rounded-2xl hover:bg-blue-800 transition-all text-sm">Abrir cuenta en ${roboFirst} →</a>`
            : `<p class="text-xs text-gray-400 text-center italic">Vuelve a esta pantalla cuando tengas tu colchón completo para abrir la cuenta.</p>`
          }
        </div>
      </div>
    </div>

    <div class="bg-white rounded-3xl border border-gray-100 shadow-sm p-6">
      <h3 class="text-lg font-bold text-gray-900 mb-1">🗺️ Tu hoja de ruta</h3>
      <p class="text-sm text-gray-400 mb-6">Cómo evoluciona tu inversión en el tiempo</p>

      <div class="flex gap-4 mb-6">
        <div class="flex flex-col items-center shrink-0" style="width:28px">
          <div class="w-7 h-7 rounded-full bg-blue-600 flex items-center justify-center text-white text-xs font-bold z-10">1</div>
          <div class="w-0.5 bg-gray-200 flex-1 mt-1" style="min-height:60px"></div>
        </div>
        <div class="flex-1 pb-2">
          <p class="text-xs font-semibold text-blue-600 uppercase tracking-wide mb-1">Ahora mismo</p>
          <div class="bg-blue-50 border border-blue-100 rounded-2xl p-4">
            ${emergencyCovered ? `
            <p class="font-semibold text-gray-900 text-sm mb-2">Abre tu cuenta y empieza</p>
            <div class="space-y-1.5 text-sm text-gray-700">
              ${capital > 0 ? `<p>→ Ingresa <strong>${fmtEur(capital)}</strong> como capital inicial</p>` : '<p>→ Empieza con aportaciones mensuales</p>'}
              ${monthly > 0 ? `<p>→ Activa aportación automática de <strong>${fmtEur(monthly)}/mes</strong></p>` : ''}
              <p>→ Elige el perfil <strong>${portf.label}</strong></p>
            </div>
            <div class="mt-3 pt-3 border-t border-blue-100">
              <p class="text-xs text-blue-700 font-medium">💡 Empieza ya, no esperes</p>
              <p class="text-xs text-blue-600 mt-0.5">Cada mes que esperas es tiempo que el interés compuesto no trabaja para ti.</p>
            </div>` : `
            <p class="font-semibold text-gray-900 text-sm mb-2">Completa tu fondo de emergencia</p>
            <div class="space-y-1.5 text-sm text-gray-700">
              <p>→ Dirige tu ahorro mensual (<strong>${fmtEur(monthly)}/mes</strong>) a una cuenta remunerada</p>
              <p>→ Objetivo: <strong>${fmtEur(emergTarget)}</strong> (3 nóminas netas)</p>
            </div>
            <div class="mt-3 pt-3 border-t border-blue-100">
              <p class="text-xs text-blue-700 font-medium">💡 Todavía no inviertas</p>
              <p class="text-xs text-blue-600 mt-0.5">Sin colchón, una caída del mercado te obligaría a vender en el peor momento. Primero seguridad, luego rentabilidad.</p>
            </div>`}
          </div>
        </div>
      </div>

      <div class="flex gap-4 mb-6">
        <div class="flex flex-col items-center shrink-0" style="width:28px">
          <div class="w-7 h-7 rounded-full bg-emerald-500 flex items-center justify-center text-white text-xs font-bold z-10">2</div>
          <div class="w-0.5 bg-gray-200 flex-1 mt-1" style="min-height:60px"></div>
        </div>
        <div class="flex-1 pb-2">
          <p class="text-xs font-semibold text-emerald-600 uppercase tracking-wide mb-1">Años 3–5 · Tu cartera gana escala</p>
          <div class="bg-emerald-50 border border-emerald-100 rounded-2xl p-4">
            <p class="font-semibold text-gray-900 text-sm mb-2">No toques nada — la constancia es tu mayor ventaja</p>
            <div class="space-y-1.5 text-sm text-gray-700">
              <p>→ El interés compuesto ya es visible en tu cartera</p>
              ${roboKey === 'indexa' ? '<p>→ A partir de 10.000 € la comisión de Indexa baja al <strong>0,31%</strong></p>' : ''}
              ${roboKey === 'finizens' ? '<p>→ Al llegar a 3.000 € puedes valorar MyInvestor Cartera Indexada (comisión total 0,44%)</p>' : ''}
              <p>→ Activa el rebalanceo automático si está disponible</p>
            </div>
            <div class="mt-3 pt-3 border-t border-emerald-100">
              <p class="text-xs text-emerald-700 font-medium">🧠 No intentes predecir el mercado</p>
              <p class="text-xs text-emerald-600 mt-0.5">Los inversores que intentan "adivinar" el mejor momento obtienen peores resultados que los que se quedan quietos.</p>
            </div>
          </div>
        </div>
      </div>

      <div class="flex gap-4">
        <div class="flex flex-col items-center shrink-0" style="width:28px">
          <div class="w-7 h-7 rounded-full bg-purple-600 flex items-center justify-center text-white text-xs font-bold z-10">3</div>
        </div>
        <div class="flex-1">
          <p class="text-xs font-semibold text-purple-600 uppercase tracking-wide mb-1">Al llegar a 100.000 € · Da el salto</p>
          <div class="bg-purple-50 border border-purple-100 rounded-2xl p-4">
            <p class="font-semibold text-gray-900 text-sm mb-2">Gestión propia con fondos en MyInvestor</p>
            <p class="text-sm text-gray-600 mb-3">A este nivel, gestionar una cartera de 3–4 fondos indexados te ahorra entre 500 € y 1.500 € al año en comisiones.</p>
            <div class="grid grid-cols-2 gap-2 mb-3">
              <div class="bg-white rounded-xl p-3 border border-purple-100">
                <p class="text-xs text-gray-500 mb-1">Con roboadvisor (${robo.fee_total})</p>
                <p class="font-bold text-gray-700 text-sm">${fmtEur(Math.round(100000 * robo.fee_num / 100))}/año</p>
              </div>
              <div class="bg-white rounded-xl p-3 border border-purple-100">
                <p class="text-xs text-gray-500 mb-1">Con fondos propios (~0,15%)</p>
                <p class="font-bold text-purple-700 text-sm">150 €/año ✓</p>
              </div>
            </div>
            <p class="text-xs text-purple-700 font-medium">💡 Traspaso sin coste fiscal</p>
            <p class="text-xs text-purple-600 mt-0.5">En España puedes traspasar entre fondos sin tributar. Podrás mover tu dinero de ${roboFirst} a MyInvestor sin pagar impuestos.</p>
          </div>
        </div>
      </div>
    </div>

    <div class="bg-white rounded-3xl border border-gray-100 shadow-sm p-6">
      <h3 class="text-lg font-bold text-gray-900 mb-1">📈 ¿Cuánto puede crecer tu dinero?</h3>
      <p class="text-sm text-gray-400 mb-4">Con ${fmtEur(capital)} iniciales${monthly > 0 ? ' + ' + fmtEur(monthly) + '/mes' : ''} · ~${rate}% anual histórico</p>
      ${projectionCards(capital, monthly, rate, 'blue', 'emerald', 'purple')}
    </div>

    <details class="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden group">
      <summary class="cursor-pointer select-none list-none flex items-center justify-between px-6 py-4 hover:bg-gray-50 transition-colors">
        <span class="font-semibold text-gray-900">📚 Conceptos que debes saber</span>
        <span class="text-gray-400 text-sm group-open:hidden">▼ ver</span>
        <span class="text-gray-400 text-sm hidden group-open:inline">▲ ocultar</span>
      </summary>
      <div class="px-6 pb-6 space-y-4">
        <div class="border-l-4 border-blue-200 pl-4">
          <p class="font-semibold text-gray-800 text-sm">¿Qué es un roboadvisor?</p>
          <p class="text-sm text-gray-500 mt-1">Un gestor automatizado que construye y mantiene una cartera de fondos indexados por ti. Sin decisiones manuales, sin emociones, sin errores humanos.</p>
        </div>
        <div class="border-l-4 border-emerald-200 pl-4">
          <p class="font-semibold text-gray-800 text-sm">¿Qué es un fondo indexado?</p>
          <p class="text-sm text-gray-500 mt-1">Un fondo que replica un índice (como el MSCI World) comprando todas sus empresas. Al no necesitar gestores activos, cobra comisiones mucho menores.</p>
        </div>
        <div class="border-l-4 border-purple-200 pl-4">
          <p class="font-semibold text-gray-800 text-sm">¿Qué es el rebalanceo?</p>
          <p class="text-sm text-gray-500 mt-1">Ajustar periódicamente la proporción de cada activo para que la cartera vuelva a tu perfil objetivo. El roboadvisor lo hace automáticamente.</p>
        </div>
        <div class="border-l-4 border-amber-200 pl-4">
          <p class="font-semibold text-gray-800 text-sm">¿Es seguro mi dinero?</p>
          <p class="text-sm text-gray-500 mt-1">Tu dinero está en fondos regulados por la CNMV, custodiados en entidades separadas del roboadvisor. Si el roboadvisor cierra, tu dinero sigue siendo tuyo.</p>
        </div>
      </div>
    </details>
  `;
}

// ─── Render: DIY plan ──────────────────────────────────────────────────────────
function renderDIYPlan(profile) {
  var totalSavings = parseFloat((profile.step1 || {}).ahorros_liquidos) || 0;
  var monthly      = parseFloat((profile.step2 || {}).ahorro_mensual)   || 0;
  var risk         = profile.riskProfile || 'moderado';
  var horizKey     = profile.horizonKey  || 'long';
  var pm           = PROFILE_META[risk]     || PROFILE_META.moderado;
  var hm           = HORIZON_META[horizKey] || HORIZON_META.long;
  var emergTarget  = calcEmergencyTarget(profile.step1, profile.step2, totalSavings);
  var capital      = Math.max(0, totalSavings - emergTarget);
  var emergencyCovered = totalSavings >= emergTarget;
  var level        = getDiyLevel(capital);
  var alloc    = getDiyAllocation(level, risk);
  var rate     = 7;
  var levelLabel = ['', '1 fondo', '2 fondos', '3 fondos', '4 fondos'][level];

  var avgTer = alloc.reduce(function(sum, item) {
    return sum + FUNDS[item.fund].terN * item.pct / 100;
  }, 0);

  var FUND_COL = { world: 'blue', em: 'amber', small: 'purple', bond: 'emerald' };

  var fundCardsHtml = alloc.map(function(item) {
    var f   = FUNDS[item.fund];
    var col = FUND_COL[item.fund] || 'gray';
    var capAmt = capital > 0 ? Math.round(capital * item.pct / 100) : 0;
    var monAmt = (emergencyCovered && monthly > 0) ? Math.round(monthly * item.pct / 100) : 0;
    return '<div class="bg-gray-50 rounded-2xl p-4 border border-gray-100">' +
      '<div class="flex items-start justify-between mb-2">' +
        '<div class="flex-1"><p class="font-semibold text-gray-900 text-sm">' + f.name + '</p>' +
        '<p class="text-xs text-gray-400 mt-0.5 font-mono">' + f.isin + '</p></div>' +
        '<span class="ml-3 px-2.5 py-1 bg-' + col + '-100 text-' + col + '-700 text-sm font-bold rounded-xl shrink-0">' + item.pct + '%</span>' +
      '</div>' +
      '<div class="flex flex-wrap gap-2 mt-2 text-xs text-gray-500">' +
        glossChip('TER ' + f.ter, 'TER') +
        glossChip(f.asset, f.asset) +
        (capAmt > 0 ? '<span class="bg-white rounded-lg px-2 py-1 border border-gray-200">Inicial: ' + fmtEur(capAmt) + '</span>' : '') +
        (monAmt > 0 ? '<span class="bg-white rounded-lg px-2 py-1 border border-gray-200">' + fmtEur(monAmt) + '/mes</span>' : '') +
      '</div></div>';
  }).join('');

  var stepN = monthly > 0 ? 4 : 3;

  var emergSectionDiy  = buildEmergencySection(profile.step1, profile.step2, totalSavings, capital, 'purple', monthly);
  var recoEyebrowDiy   = emergencyCovered ? 'Recomendado para ti' : 'Tu plan · cuando completes tu colchón';
  var step2BadgeDiy = emergencyCovered ? '' : `
    <div class="flex items-center gap-2 mb-1">
      <span class="w-5 h-5 rounded-full bg-gray-300 text-white text-[10px] font-bold flex items-center justify-center shrink-0">2</span>
      <p class="text-xs font-semibold text-gray-400 uppercase tracking-wide">Paso 2 · Después de cubrir tu fondo de emergencia</p>
    </div>`;

  return `
    ${emergSectionDiy}

    <div class="bg-gradient-to-r from-purple-700 to-purple-900 rounded-3xl p-6 text-white">
      <p class="text-purple-200 text-xs font-semibold uppercase tracking-widest mb-3">Tu perfil inversor</p>
      <div class="flex items-center gap-4 mb-4">
        <div class="w-14 h-14 bg-white bg-opacity-20 rounded-2xl flex items-center justify-center text-3xl">${pm.emoji}</div>
        <div>
          <h2 class="font-display text-2xl font-semibold">Perfil ${pm.label}</h2>
          <p class="text-purple-200 text-sm">${hm.label} · ${pm.desc}</p>
        </div>
      </div>
      <div class="grid grid-cols-3 gap-3">
        <div class="bg-white bg-opacity-15 rounded-xl p-3 text-center">
          <p class="text-xs text-purple-200">A invertir</p>
          <p class="text-lg font-bold">${fmtEur(capital)}</p>
        </div>
        <div class="bg-white bg-opacity-15 rounded-xl p-3 text-center">
          <p class="text-xs text-purple-200">Mensual</p>
          <p class="text-lg font-bold">${monthly > 0 ? fmtEur(monthly) : '—'}</p>
        </div>
        <div class="bg-white bg-opacity-15 rounded-xl p-3 text-center">
          <p class="text-xs text-purple-200">Complejidad</p>
          <p class="text-lg font-bold">${levelLabel}</p>
        </div>
      </div>
    </div>

    <div>
      ${step2BadgeDiy}
      <div class="bg-white rounded-3xl border ${emergencyCovered ? 'border-gray-100' : 'border-dashed border-gray-300'} shadow-sm p-6 ${emergencyCovered ? '' : 'opacity-90'}">
        <div class="flex items-center justify-between gap-3 mb-1">
          <p class="text-xs font-semibold uppercase tracking-widest text-purple-700">${recoEyebrowDiy}</p>
          <span class="text-xs font-bold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-full whitespace-nowrap">📊 MSCI World ~8% anual (últimos 20 años)</span>
        </div>
        <div class="flex items-center justify-between mb-4">
          <div>
            <h3 class="font-display text-lg font-semibold text-gray-900">🧩 Tu cartera en MyInvestor</h3>
            <p class="text-sm text-gray-400 mt-0.5">Cartera de ${levelLabel} · TER medio ~${fmtPct(avgTer)}/año</p>
          </div>
          ${emergencyCovered ? `<a href="https://myinvestor.es" target="_blank" rel="noopener" class="text-xs text-blue-700 hover:underline font-medium">Abrir cuenta →</a>` : ''}
        </div>
        <div class="space-y-3 mb-5">${fundCardsHtml}</div>
        <div class="bg-purple-50 border border-purple-100 rounded-2xl p-4">
          <p class="text-xs font-semibold text-purple-700 mb-1">💡 ¿Por qué MyInvestor?</p>
          <p class="text-xs text-purple-600">Es la única plataforma española que permite comprar fondos de Fidelity, Vanguard e iShares directamente, sin intermediarios ni comisiones de custodia. Cuenta regulada por la CNMV.</p>
        </div>
        ${emergencyCovered ? '' : `<p class="text-xs text-gray-400 text-center italic mt-3">Vuelve a esta pantalla cuando tengas tu colchón completo para empezar.</p>`}
      </div>
    </div>

    <div class="bg-white rounded-3xl border border-gray-100 shadow-sm p-6">
      <h3 class="text-lg font-bold text-gray-900 mb-4">⚙️ Cómo gestionar tu cartera</h3>
      <div class="space-y-4">
        <div class="flex gap-3">
          <div class="w-8 h-8 rounded-full bg-purple-100 flex items-center justify-center text-purple-700 font-bold text-sm shrink-0">1</div>
          <div><p class="font-semibold text-gray-900 text-sm">Abre cuenta en MyInvestor</p>
          <p class="text-sm text-gray-500">Proceso 100% online en 10 minutos. Busca cada fondo por ISIN en el buscador de fondos.</p></div>
        </div>
        <div class="flex gap-3">
          <div class="w-8 h-8 rounded-full bg-purple-100 flex items-center justify-center text-purple-700 font-bold text-sm shrink-0">2</div>
          <div><p class="font-semibold text-gray-900 text-sm">Invierte según la distribución</p>
          <p class="text-sm text-gray-500">Compra cada fondo en la proporción indicada. No hace falta hacerlo todo de una vez.</p></div>
        </div>
        ${monthly > 0 ? `<div class="flex gap-3">
          <div class="w-8 h-8 rounded-full bg-purple-100 flex items-center justify-center text-purple-700 font-bold text-sm shrink-0">3</div>
          <div><p class="font-semibold text-gray-900 text-sm">Automatiza las aportaciones</p>
          <p class="text-sm text-gray-500">Configura una transferencia automática de ${fmtEur(monthly)}/mes y repártela entre los fondos según los porcentajes.</p></div>
        </div>` : ''}
        <div class="flex gap-3">
          <div class="w-8 h-8 rounded-full bg-purple-100 flex items-center justify-center text-purple-700 font-bold text-sm shrink-0">${stepN}</div>
          <div><p class="font-semibold text-gray-900 text-sm">Rebalancea una vez al año</p>
          <p class="text-sm text-gray-500">Si algún fondo se desvía más de un 5% de su objetivo, compra el más rezagado para volver al equilibrio.</p></div>
        </div>
      </div>
    </div>

    <div class="bg-white rounded-3xl border border-gray-100 shadow-sm p-6">
      <h3 class="text-lg font-bold text-gray-900 mb-1">📈 ¿Cuánto puede crecer tu dinero?</h3>
      <p class="text-sm text-gray-400 mb-4">Con ${fmtEur(capital)} iniciales${monthly > 0 ? ' + ' + fmtEur(monthly) + '/mes' : ''} · ~${rate}% anual histórico</p>
      ${projectionCards(capital, monthly, rate, 'purple', 'emerald', 'blue')}
    </div>
  `;
}

// ─── Simulator ────────────────────────────────────────────────────────────────
var simChart = null;

function initSimulator(defaultCapital, defaultMonthly) {
  var wrap = document.getElementById('simulator-wrap');
  if (!wrap) return;
  wrap.style.display = 'block';

  var capitalEl = document.getElementById('sim-capital');
  var monthlyEl = document.getElementById('sim-monthly');
  var yearsEl   = document.getElementById('sim-years');
  var returnEl  = document.getElementById('sim-return');

  if (defaultCapital && capitalEl) capitalEl.value = Math.min(defaultCapital, 200000);
  if (defaultMonthly && monthlyEl) monthlyEl.value = Math.min(defaultMonthly, 5000);

  function update() {
    var capital = parseFloat(capitalEl.value) || 0;
    var monthly = parseFloat(monthlyEl.value) || 0;
    var years   = parseInt(yearsEl.value)     || 20;
    var rate    = parseFloat(returnEl.value)  || 7;

    document.getElementById('sim-capital-val').textContent = fmtEur(capital);
    document.getElementById('sim-monthly-val').textContent = fmtEur(monthly) + '/mes';
    document.getElementById('sim-years-val').textContent   = years + ' años';
    document.getElementById('sim-return-val').textContent  = rate + '%';

    var fv       = projFV(capital, monthly, years, rate);
    var invested = capital + monthly * years * 12;
    var gains    = fv - invested;

    document.getElementById('sim-result-final').textContent    = fmtEur(Math.round(fv));
    document.getElementById('sim-result-invested').textContent = fmtEur(Math.round(invested));
    document.getElementById('sim-result-gains').textContent    = fmtEur(Math.round(gains));

    var labels = [], fvData = [], invData = [];
    for (var y = 0; y <= years; y++) {
      labels.push(y === 0 ? 'Hoy' : 'Año ' + y);
      fvData.push(Math.round(projFV(capital, monthly, y, rate)));
      invData.push(Math.round(capital + monthly * y * 12));
    }

    var ctx = document.getElementById('simulator-chart');
    if (!ctx) return;
    if (simChart) { simChart.destroy(); simChart = null; }
    simChart = new Chart(ctx, {
      type: 'line',
      data: {
        labels: labels,
        datasets: [
          { label: 'Valor estimado', data: fvData,  fill: true,  borderColor: '#2563EB', backgroundColor: 'rgba(37,99,235,0.08)', tension: 0.4, pointRadius: 0 },
          { label: 'Total aportado', data: invData, fill: false, borderColor: '#9CA3AF', borderDash: [4,4], tension: 0.4, pointRadius: 0 },
        ]
      },
      options: {
        responsive: true, maintainAspectRatio: false,
        plugins: { legend: { display: false }, tooltip: { mode: 'index', intersect: false } },
        scales: {
          x: { grid: { display: false }, ticks: { maxTicksLimit: 6, font: { size: 10 } } },
          y: { grid: { color: '#F3F4F6' }, ticks: { font: { size: 10 }, callback: function(v) { return fmtEur(v); } } }
        }
      }
    });
  }

  [capitalEl, monthlyEl, yearsEl, returnEl].forEach(function(el) {
    el.addEventListener('input', update);
  });
  update();
}

// ─── Entry point ──────────────────────────────────────────────────────────────
function generateResults() {
  var raw = localStorage.getItem('iw_profile');
  var el  = document.getElementById('results-main');

  if (!raw || !el) {
    if (el) el.innerHTML =
      '<div class="text-center py-20">' +
        '<p class="text-5xl mb-4">🤔</p>' +
        '<p class="text-gray-600 font-medium mb-2">No encontramos tu perfil</p>' +
        '<p class="text-gray-400 text-sm mb-6">Completa el cuestionario para ver tu plan personalizado.</p>' +
        '<a href="index.html" class="inline-block bg-blue-600 text-white font-bold py-3 px-6 rounded-2xl hover:bg-blue-700 transition-all">Empezar el cuestionario →</a>' +
      '</div>';
    return;
  }

  var profile;
  try { profile = JSON.parse(raw); }
  catch(e) {
    el.innerHTML = '<p class="text-center text-red-500 py-10">Error al leer tu perfil. <a href="index.html" class="underline">Vuelve al cuestionario</a></p>';
    return;
  }

  var track = profile.track || 'robo';
  el.innerHTML = (track === 'diy') ? renderDIYPlan(profile) : renderRoboadvisorPlan(profile);

  var capital = parseFloat((profile.step1 || {}).ahorros_liquidos) || 0;
  var monthly = parseFloat((profile.step2 || {}).ahorro_mensual)   || 0;
  initSimulator(capital, monthly);
}
