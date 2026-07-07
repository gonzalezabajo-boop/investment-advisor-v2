// Asset allocation by risk profile × horizon
const ALLOCATIONS = {
  conservador: {
    short:  { equities: 10, fixedIncome: 60, alternatives: 5,  cash: 25, crypto: 0, commodities: 0  },
    medium: { equities: 25, fixedIncome: 50, alternatives: 10, cash: 10, crypto: 0, commodities: 5  },
    long:   { equities: 35, fixedIncome: 40, alternatives: 10, cash: 5,  crypto: 0, commodities: 10 },
  },
  moderado: {
    short:  { equities: 30, fixedIncome: 45, alternatives: 15, cash: 7,  crypto: 0, commodities: 3  },
    medium: { equities: 50, fixedIncome: 25, alternatives: 15, cash: 5,  crypto: 2, commodities: 3  },
    long:   { equities: 60, fixedIncome: 15, alternatives: 12, cash: 3,  crypto: 5, commodities: 5  },
  },
  dinamico: {
    short:  { equities: 45, fixedIncome: 30, alternatives: 15, cash: 5,  crypto: 3, commodities: 2  },
    medium: { equities: 60, fixedIncome: 12, alternatives: 15, cash: 3,  crypto: 5, commodities: 5  },
    long:   { equities: 72, fixedIncome: 5,  alternatives: 10, cash: 2,  crypto: 8, commodities: 3  },
  },
  agresivo: {
    short:  { equities: 50, fixedIncome: 15, alternatives: 18, cash: 5,  crypto: 8, commodities: 4  },
    medium: { equities: 62, fixedIncome: 5,  alternatives: 15, cash: 3,  crypto: 10, commodities: 5 },
    long:   { equities: 68, fixedIncome: 0,  alternatives: 10, cash: 2,  crypto: 15, commodities: 5 },
  },
};

const RETURNS = {
  equities: 0.07, fixedIncome: 0.025, alternatives: 0.055,
  cash: 0.025, crypto: 0.12, commodities: 0.03,
};

const PROFILE_META = {
  conservador: { label: 'Conservador', bg: 'bg-blue-50',   border: 'border-blue-200',   text: 'text-blue-700',   emoji: '🛡️' },
  moderado:    { label: 'Moderado',    bg: 'bg-yellow-50', border: 'border-yellow-200', text: 'text-yellow-700', emoji: '⚖️' },
  dinamico:    { label: 'Dinámico',    bg: 'bg-orange-50', border: 'border-orange-200', text: 'text-orange-700', emoji: '📈' },
  agresivo:    { label: 'Agresivo',    bg: 'bg-red-50',    border: 'border-red-200',    text: 'text-red-700',    emoji: '🚀' },
};

function getPortfolioComplexity(step1, step5) {
  const patrimony = step1?.patrimonio_neto || step1?.ahorros_liquidos || 0;
  if (patrimony >= 250000) return 6;
  if (patrimony >= 125000) return 5;
  if (patrimony >= 50000)  return 4;
  if (patrimony >= 15000)  return 3;
  if (patrimony >= 3000)   return 2;
  return 1;
}

const PORTFOLIO_BLUEPRINTS = {
  conservador: {
    1: {
      label: 'Construye tu base primero', managed: true, savings_mode: true,
      description: 'Con menos de 3.000 € la prioridad es acumular sin riesgo. Trade Republic paga ~3% TAE y el dinero está disponible en cualquier momento.',
      products: [
        { logo: '🟩', name: 'Trade Republic — Cuenta remunerada', isin: null, asset_class: 'cash', pct: 100, platform: 'Trade Republic', url: 'https://traderepublic.com/es-es', fees: '~3% TAE', min: '1 €', rationale: 'Ahorro seguro al 3% TAE sin volatilidad. Objetivo: llegar a 3.000 € para abrir Indexa Capital perfil 3/10.' },
      ],
    },
    2: {
      label: 'Indexa Capital — Perfil 3/10', managed: true,
      description: 'Indexa gestiona, rebalancea y optimiza sin que muevas un dedo. Perfil 3/10: ~30% RV / ~70% RF. Sin decisiones, sin errores emocionales.',
      products: [
        { logo: '📊', name: 'Indexa Capital · Perfil 3/10', isin: null, asset_class: 'fixedIncome', pct: 100, platform: 'Indexa Capital', url: 'https://indexacapital.com', fees: '~0.42%/año todo incluido', min: '3.000 €', rationale: '~30% RV global (Vanguard) / ~70% RF global. Rebalanceo automático. Sin que tengas que decidir nada.',
          est_return: '~4% anual (histórico 10 años)',
          composition: [
            { name: 'Vanguard Global Stock Market Index', pct: 22 },
            { name: 'Vanguard Emerging Markets Stock Index', pct: 8 },
            { name: 'Vanguard Euro Government Bond Index', pct: 42 },
            { name: 'Vanguard Global Bond Index', pct: 28 },
          ],
        },
      ],
    },
    3: {
      label: 'MyInvestor — Cartera Conservadora', managed: true,
      description: 'Igual de sencillo que Indexa, sin mínimo de entrada y algo más barata. Cartera Conservadora: predominio de renta fija con crecimiento moderado.',
      products: [
        { logo: '🏦', name: 'MyInvestor Cartera Conservadora', isin: null, asset_class: 'fixedIncome', pct: 100, platform: 'MyInvestor', url: 'https://myinvestor.es/carteras-indexadas/', fees: '~0.28%/año todo incluido', min: 'Sin mínimo', rationale: 'Cartera indexada gestionada ~30% RV / ~70% RF. Rebalanceo automático. Ahorra ~0.14%/año vs Indexa.',
          est_return: '~4% anual (histórico estimado)',
          composition: [
            { name: 'Amundi MSCI World', pct: 20 },
            { name: 'Amundi MSCI Emerging Markets', pct: 10 },
            { name: 'Amundi JPM GBI Global Govies', pct: 50 },
            { name: 'Amundi Global Corporate Bond', pct: 20 },
          ],
        },
      ],
    },
    4: {
      label: 'Cartera Simple',
      description: '4 productos: bonos globales como ancla, renta variable para crecer, bonos ligados a inflación y liquidez táctica.',
      products: [
        { logo: '🟢', name: 'Amundi IS J.P.Morgan GBI Global Govies AHE-C', isin: 'LU0389812988', asset_class: 'fixedIncome', pct: 40, platform: 'MyInvestor', url: 'https://myinvestor.es', fees: 'TER 0.10%', min: 'Sin mínimo', rationale: 'Ancla conservadora: RF gubernamental global cubierta a EUR. Estabilidad ante caídas de bolsa.' },
        { logo: '📈', name: 'Fidelity Index World P-ACC-EUR', isin: 'IE00BYX5NX33', asset_class: 'equities', pct: 30, platform: 'MyInvestor', url: 'https://myinvestor.es', fees: 'TER 0.12%', min: 'Sin mínimo', rationale: 'Motor de crecimiento: 1.600+ empresas de países desarrollados. Traspaso fiscal sin coste.' },
        { logo: '🔵', name: 'iShares € Inflation Linked Govt Bond ETF', isin: 'IE00B0M62X26', asset_class: 'fixedIncome', pct: 15, platform: 'Trade Republic', url: 'https://traderepublic.com/es-es', fees: 'TER 0.09%', min: '1 €', rationale: 'Bonos ligados a inflación zona euro. Protección real del capital cuando sube el IPC.' },
        { logo: '🟩', name: 'Trade Republic — Cuenta remunerada', isin: null, asset_class: 'cash', pct: 15, platform: 'Trade Republic', url: 'https://traderepublic.com/es-es', fees: '~3% TAE', min: '1 €', rationale: 'Liquidez inmediata al 3% TAE. Reserva táctica para rebalancear en caídas de mercado.' },
      ],
    },
    5: {
      label: 'Cartera Diversificada',
      description: '5 productos: bonos, renta variable, bonos ligados a inflación, REITs y oro.',
      products: [
        { logo: '🟢', name: 'Amundi IS J.P.Morgan GBI Global Govies AHE-C', isin: 'LU0389812988', asset_class: 'fixedIncome', pct: 35, platform: 'MyInvestor', url: 'https://myinvestor.es', fees: 'TER 0.10%', min: 'Sin mínimo', rationale: 'Core conservador: RF gubernamental global EUR. Ancla principal de la cartera.' },
        { logo: '📈', name: 'Fidelity Index World P-ACC-EUR', isin: 'IE00BYX5NX33', asset_class: 'equities', pct: 25, platform: 'MyInvestor', url: 'https://myinvestor.es', fees: 'TER 0.12%', min: 'Sin mínimo', rationale: 'RV global países desarrollados. Motor de crecimiento con traspaso fiscal.' },
        { logo: '🔵', name: 'iShares € Inflation Linked Govt Bond ETF', isin: 'IE00B0M62X26', asset_class: 'fixedIncome', pct: 15, platform: 'Trade Republic', url: 'https://traderepublic.com/es-es', fees: 'TER 0.09%', min: '1 €', rationale: 'Bonos ligados a inflación EUR. Protección ante subidas del IPC.' },
        { logo: '🏢', name: 'Amundi Index FTSE EPRA NAREIT Global AE-C', isin: 'LU1737652832', asset_class: 'alternatives', pct: 15, platform: 'MyInvestor', url: 'https://myinvestor.es', fees: 'TER 0.24%', min: 'Sin mínimo', rationale: 'REITs globales cotizados. Inmobiliario financiero con liquidez diaria y rendimiento por rentas.' },
        { logo: '🥇', name: 'iShares Physical Gold ETC', isin: 'IE00B4ND3602', asset_class: 'commodities', pct: 10, platform: 'Trade Republic', url: 'https://traderepublic.com/es-es', fees: 'TER 0.12%', min: '1 €', rationale: 'Oro físico. Cobertura frente a inflación, crisis y descorrelación con bonos y acciones.' },
      ],
    },
    6: {
      label: 'Cartera Completa',
      description: '6 productos: cobertura completa para un conservador con patrimonio elevado. Incluye REITs, oro y reserva líquida.',
      products: [
        { logo: '🟢', name: 'Amundi IS J.P.Morgan GBI Global Govies AHE-C', isin: 'LU0389812988', asset_class: 'fixedIncome', pct: 30, platform: 'MyInvestor', url: 'https://myinvestor.es', fees: 'TER 0.10%', min: 'Sin mínimo', rationale: 'Ancla principal. RF gubernamental global cubierta a EUR.' },
        { logo: '📈', name: 'Fidelity Index World P-ACC-EUR', isin: 'IE00BYX5NX33', asset_class: 'equities', pct: 25, platform: 'MyInvestor', url: 'https://myinvestor.es', fees: 'TER 0.12%', min: 'Sin mínimo', rationale: 'Motor de crecimiento: RV global países desarrollados. Traspaso fiscal.' },
        { logo: '🔵', name: 'iShares € Inflation Linked Govt Bond ETF', isin: 'IE00B0M62X26', asset_class: 'fixedIncome', pct: 15, platform: 'Trade Republic', url: 'https://traderepublic.com/es-es', fees: 'TER 0.09%', min: '1 €', rationale: 'Bonos ligados a inflación. Protección real a largo plazo.' },
        { logo: '🏢', name: 'Amundi Index FTSE EPRA NAREIT Global AE-C', isin: 'LU1737652832', asset_class: 'alternatives', pct: 12, platform: 'MyInvestor', url: 'https://myinvestor.es', fees: 'TER 0.24%', min: 'Sin mínimo', rationale: 'REITs globales. Inmobiliario líquido con dividendos.' },
        { logo: '🥇', name: 'iShares Physical Gold ETC', isin: 'IE00B4ND3602', asset_class: 'commodities', pct: 10, platform: 'Trade Republic', url: 'https://traderepublic.com/es-es', fees: 'TER 0.12%', min: '1 €', rationale: 'Oro físico. Cobertura de cola e inflación.' },
        { logo: '🟩', name: 'Trade Republic — Cuenta remunerada', isin: null, asset_class: 'cash', pct: 8, platform: 'Trade Republic', url: 'https://traderepublic.com/es-es', fees: '~3% TAE', min: '1 €', rationale: 'Reserva líquida al 3% TAE. Para rebalanceos y oportunidades.' },
      ],
    },
  },
  moderado: {
    1: {
      label: 'Construye tu base primero', managed: true, savings_mode: true,
      description: 'Con menos de 3.000 € acumula en Trade Republic al 3% TAE. Objetivo: 3.000 € para abrir Indexa Capital perfil 6/10.',
      products: [
        { logo: '🟩', name: 'Trade Republic — Cuenta remunerada', isin: null, asset_class: 'cash', pct: 100, platform: 'Trade Republic', url: 'https://traderepublic.com/es-es', fees: '~3% TAE', min: '1 €', rationale: 'Ahorro seguro al 3% TAE. Objetivo: 3.000 € para dar el salto a Indexa Capital perfil 6/10.' },
      ],
    },
    2: {
      label: 'Indexa Capital — Perfil 6/10', managed: true,
      description: 'Indexa gestiona, rebalancea y optimiza sin que muevas un dedo. Perfil 6/10: ~60% RV / ~40% RF. Equilibrio crecimiento-estabilidad.',
      products: [
        { logo: '📊', name: 'Indexa Capital · Perfil 6/10', isin: null, asset_class: 'equities', pct: 100, platform: 'Indexa Capital', url: 'https://indexacapital.com', fees: '~0.42%/año todo incluido', min: '3.000 €', rationale: '~60% RV global (Vanguard) / ~40% RF global. Rebalanceo automático. Carteras probadas durante más de 8 años.',
          est_return: '~6% anual (histórico 10 años)',
          composition: [
            { name: 'Vanguard Global Stock Market Index', pct: 47 },
            { name: 'Vanguard Emerging Markets Stock Index', pct: 13 },
            { name: 'Vanguard Euro Government Bond Index', pct: 25 },
            { name: 'Vanguard Global Bond Index', pct: 15 },
          ],
        },
      ],
    },
    3: {
      label: 'MyInvestor — Cartera Moderada', managed: true,
      description: 'Igual de sencillo que Indexa, sin mínimo y algo más barata. Cartera Moderada: equilibrio entre crecimiento y estabilidad.',
      products: [
        { logo: '🏦', name: 'MyInvestor Cartera Moderada', isin: null, asset_class: 'equities', pct: 100, platform: 'MyInvestor', url: 'https://myinvestor.es/carteras-indexadas/', fees: '~0.28%/año todo incluido', min: 'Sin mínimo', rationale: 'Cartera indexada gestionada ~60% RV / ~40% RF. Rebalanceo automático. Ahorra ~0.14%/año vs Indexa.',
          est_return: '~6% anual (histórico estimado)',
          composition: [
            { name: 'Amundi MSCI World', pct: 42 },
            { name: 'Amundi MSCI Emerging Markets', pct: 18 },
            { name: 'Amundi JPM GBI Global Govies', pct: 25 },
            { name: 'Amundi Global Corporate Bond', pct: 15 },
          ],
        },
      ],
    },
    4: {
      label: 'Cartera Simple',
      description: '4 productos: renta variable global como motor, emergentes, bonos y oro.',
      products: [
        { logo: '📈', name: 'Fidelity Index World P-ACC-EUR', isin: 'IE00BYX5NX33', asset_class: 'equities', pct: 45, platform: 'MyInvestor', url: 'https://myinvestor.es', fees: 'TER 0.12%', min: 'Sin mínimo', rationale: 'Core: RV global países desarrollados. Máxima diversificación con un solo fondo. Traspaso fiscal.' },
        { logo: '🌏', name: 'Amundi Index MSCI Emerging Markets AE-C', isin: 'LU0996177134', asset_class: 'equities', pct: 20, platform: 'MyInvestor', url: 'https://myinvestor.es', fees: 'TER 0.20%', min: 'Sin mínimo', rationale: 'Emergentes: China, India, Brasil. Mayor potencial de crecimiento. Traspaso fiscal.' },
        { logo: '🟢', name: 'Amundi IS J.P.Morgan GBI Global Govies AHE-C', isin: 'LU0389812988', asset_class: 'fixedIncome', pct: 20, platform: 'MyInvestor', url: 'https://myinvestor.es', fees: 'TER 0.10%', min: 'Sin mínimo', rationale: 'RF gubernamental global EUR. Amortiguador en caídas de renta variable.' },
        { logo: '🥇', name: 'iShares Physical Gold ETC', isin: 'IE00B4ND3602', asset_class: 'commodities', pct: 15, platform: 'Trade Republic', url: 'https://traderepublic.com/es-es', fees: 'TER 0.12%', min: '1 €', rationale: 'Oro físico. Cobertura frente a inflación y crisis. Descorrelación con acciones y bonos.' },
      ],
    },
    5: {
      label: 'Cartera Diversificada',
      description: '6 productos: RV global + emergentes + small caps + bonos + REITs + oro.',
      products: [
        { logo: '📈', name: 'Fidelity Index World P-ACC-EUR', isin: 'IE00BYX5NX33', asset_class: 'equities', pct: 40, platform: 'MyInvestor', url: 'https://myinvestor.es', fees: 'TER 0.12%', min: 'Sin mínimo', rationale: 'Core principal: RV países desarrollados. Traspaso fiscal.' },
        { logo: '🌏', name: 'Amundi Index MSCI Emerging Markets AE-C', isin: 'LU0996177134', asset_class: 'equities', pct: 15, platform: 'MyInvestor', url: 'https://myinvestor.es', fees: 'TER 0.20%', min: 'Sin mínimo', rationale: 'Emergentes: diversificación geográfica y mayor potencial. Traspaso fiscal.' },
        { logo: '🟢', name: 'Amundi IS J.P.Morgan GBI Global Govies AHE-C', isin: 'LU0389812988', asset_class: 'fixedIncome', pct: 15, platform: 'MyInvestor', url: 'https://myinvestor.es', fees: 'TER 0.10%', min: 'Sin mínimo', rationale: 'RF gubernamental global. Estabilizador de la cartera.' },
        { logo: '🏢', name: 'Amundi Index FTSE EPRA NAREIT Global AE-C', isin: 'LU1737652832', asset_class: 'alternatives', pct: 15, platform: 'MyInvestor', url: 'https://myinvestor.es', fees: 'TER 0.24%', min: 'Sin mínimo', rationale: 'REITs globales cotizados. Inmobiliario líquido con dividendos y revalorización.' },
        { logo: '🔹', name: 'Vanguard Global Small-Cap Index Inst EUR', isin: 'IE00B42W4L06', asset_class: 'equities', pct: 5, platform: 'MyInvestor', url: 'https://myinvestor.es', fees: 'TER 0.29%', min: 'Sin mínimo', rationale: 'Small caps globales. Factor premium histórico. Traspaso fiscal.' },
        { logo: '🥇', name: 'iShares Physical Gold ETC', isin: 'IE00B4ND3602', asset_class: 'commodities', pct: 10, platform: 'Trade Republic', url: 'https://traderepublic.com/es-es', fees: 'TER 0.12%', min: '1 €', rationale: 'Oro físico. Cobertura frente a inflación y activo refugio.' },
      ],
    },
    6: {
      label: 'Cartera Completa',
      description: '7 productos: cartera multi-activo completa para un moderado con patrimonio elevado.',
      products: [
        { logo: '📈', name: 'Fidelity Index World P-ACC-EUR', isin: 'IE00BYX5NX33', asset_class: 'equities', pct: 38, platform: 'MyInvestor', url: 'https://myinvestor.es', fees: 'TER 0.12%', min: 'Sin mínimo', rationale: 'Core principal. RV países desarrollados. Traspaso fiscal.' },
        { logo: '🌏', name: 'Amundi Index MSCI Emerging Markets AE-C', isin: 'LU0996177134', asset_class: 'equities', pct: 15, platform: 'MyInvestor', url: 'https://myinvestor.es', fees: 'TER 0.20%', min: 'Sin mínimo', rationale: 'Emergentes. Diversificación geográfica. Traspaso fiscal.' },
        { logo: '🟢', name: 'Amundi IS J.P.Morgan GBI Global Govies AHE-C', isin: 'LU0389812988', asset_class: 'fixedIncome', pct: 13, platform: 'MyInvestor', url: 'https://myinvestor.es', fees: 'TER 0.10%', min: 'Sin mínimo', rationale: 'RF gubernamental global. Componente de estabilidad.' },
        { logo: '🏢', name: 'Amundi Index FTSE EPRA NAREIT Global AE-C', isin: 'LU1737652832', asset_class: 'alternatives', pct: 12, platform: 'MyInvestor', url: 'https://myinvestor.es', fees: 'TER 0.24%', min: 'Sin mínimo', rationale: 'REITs globales. Inmobiliario cotizado con dividendos.' },
        { logo: '🔹', name: 'Vanguard Global Small-Cap Index Inst EUR', isin: 'IE00B42W4L06', asset_class: 'equities', pct: 12, platform: 'MyInvestor', url: 'https://myinvestor.es', fees: 'TER 0.29%', min: 'Sin mínimo', rationale: 'Small caps globales. Factor premium histórico.' },
        { logo: '🥇', name: 'iShares Physical Gold ETC', isin: 'IE00B4ND3602', asset_class: 'commodities', pct: 7, platform: 'Trade Republic', url: 'https://traderepublic.com/es-es', fees: 'TER 0.12%', min: '1 €', rationale: 'Oro físico. Cobertura de inflación y activo refugio.' },
        { logo: '🔵', name: 'iShares € Inflation Linked Govt Bond ETF', isin: 'IE00B0M62X26', asset_class: 'fixedIncome', pct: 3, platform: 'Trade Republic', url: 'https://traderepublic.com/es-es', fees: 'TER 0.09%', min: '1 €', rationale: 'Bonos ligados a inflación EUR. Protección adicional del poder adquisitivo.' },
      ],
    },
  },
  dinamico: {
    1: {
      label: 'Construye tu base primero', managed: true, savings_mode: true,
      description: 'Con menos de 3.000 € acumula en Trade Republic al 3% TAE. Objetivo: 3.000 € para abrir Indexa Capital perfil 8/10.',
      products: [
        { logo: '🟩', name: 'Trade Republic — Cuenta remunerada', isin: null, asset_class: 'cash', pct: 100, platform: 'Trade Republic', url: 'https://traderepublic.com/es-es', fees: '~3% TAE', min: '1 €', rationale: 'Ahorro seguro al 3% TAE. Objetivo: 3.000 € para dar el salto a Indexa Capital perfil 8/10.' },
      ],
    },
    2: {
      label: 'Indexa Capital — Perfil 8/10', managed: true,
      description: 'Indexa gestiona, rebalancea y optimiza sin que muevas un dedo. Perfil 8/10: ~80% RV / ~20% RF. Crecimiento con algo de protección.',
      products: [
        { logo: '📊', name: 'Indexa Capital · Perfil 8/10', isin: null, asset_class: 'equities', pct: 100, platform: 'Indexa Capital', url: 'https://indexacapital.com', fees: '~0.42%/año todo incluido', min: '3.000 €', rationale: '~80% RV global (Vanguard) / ~20% RF global. Rebalanceo automático. Sin que tengas que decidir nada.',
          est_return: '~7.5% anual (histórico 10 años)',
          composition: [
            { name: 'Vanguard Global Stock Market Index', pct: 62 },
            { name: 'Vanguard Emerging Markets Stock Index', pct: 18 },
            { name: 'Vanguard Euro Government Bond Index', pct: 12 },
            { name: 'Vanguard Global Bond Index', pct: 8 },
          ],
        },
      ],
    },
    3: {
      label: 'MyInvestor — Cartera Dinámica', managed: true,
      description: 'Igual de sencillo que Indexa, sin mínimo y algo más barata. Cartera Dinámica: fuerte peso en renta variable global.',
      products: [
        { logo: '🏦', name: 'MyInvestor Cartera Dinámica', isin: null, asset_class: 'equities', pct: 100, platform: 'MyInvestor', url: 'https://myinvestor.es/carteras-indexadas/', fees: '~0.28%/año todo incluido', min: 'Sin mínimo', rationale: 'Cartera indexada gestionada ~80% RV / ~20% RF. Rebalanceo automático. Más barata que Indexa.',
          est_return: '~7.5% anual (histórico estimado)',
          composition: [
            { name: 'Amundi MSCI World', pct: 55 },
            { name: 'Amundi MSCI Emerging Markets', pct: 25 },
            { name: 'Amundi JPM GBI Global Govies', pct: 12 },
            { name: 'Amundi Global Corporate Bond', pct: 8 },
          ],
        },
      ],
    },
    4: {
      label: 'Cartera Simple',
      description: '4 productos: RV global + emergentes + small caps ETF + oro. Sin renta fija.',
      products: [
        { logo: '📈', name: 'Fidelity Index World P-ACC-EUR', isin: 'IE00BYX5NX33', asset_class: 'equities', pct: 55, platform: 'MyInvestor', url: 'https://myinvestor.es', fees: 'TER 0.12%', min: 'Sin mínimo', rationale: 'Core: RV global países desarrollados. Máxima diversificación. Traspaso fiscal.' },
        { logo: '🌏', name: 'Amundi Index MSCI Emerging Markets AE-C', isin: 'LU0996177134', asset_class: 'equities', pct: 20, platform: 'MyInvestor', url: 'https://myinvestor.es', fees: 'TER 0.20%', min: 'Sin mínimo', rationale: 'Emergentes: alto potencial de crecimiento. Traspaso fiscal.' },
        { logo: '🔹', name: 'Vanguard Global Small-Cap Index Inst EUR', isin: 'IE00B42W4L06', asset_class: 'equities', pct: 15, platform: 'MyInvestor', url: 'https://myinvestor.es', fees: 'TER 0.29%', min: 'Sin mínimo', rationale: 'Small caps globales. Factor premium + diversificación por tamaño.' },
        { logo: '🥇', name: 'iShares Physical Gold ETC', isin: 'IE00B4ND3602', asset_class: 'commodities', pct: 10, platform: 'Trade Republic', url: 'https://traderepublic.com/es-es', fees: 'TER 0.12%', min: '1 €', rationale: 'Oro físico. Cobertura frente a inflación y activo refugio en crisis.' },
      ],
    },
    5: {
      label: 'Cartera Diversificada',
      description: '6 productos: bolsa global, emergentes, small caps, REITs, oro y cripto.',
      products: [
        { logo: '📈', name: 'Fidelity Index World P-ACC-EUR', isin: 'IE00BYX5NX33', asset_class: 'equities', pct: 45, platform: 'MyInvestor', url: 'https://myinvestor.es', fees: 'TER 0.12%', min: 'Sin mínimo', rationale: 'Core: RV global países desarrollados. Traspaso fiscal.' },
        { logo: '🌏', name: 'Amundi Index MSCI Emerging Markets AE-C', isin: 'LU0996177134', asset_class: 'equities', pct: 20, platform: 'MyInvestor', url: 'https://myinvestor.es', fees: 'TER 0.20%', min: 'Sin mínimo', rationale: 'Emergentes: mayor potencial de crecimiento. Traspaso fiscal.' },
        { logo: '🔹', name: 'Vanguard Global Small-Cap Index Inst EUR', isin: 'IE00B42W4L06', asset_class: 'equities', pct: 12, platform: 'MyInvestor', url: 'https://myinvestor.es', fees: 'TER 0.29%', min: 'Sin mínimo', rationale: 'Small caps: factor premium histórico. Traspaso fiscal.' },
        { logo: '🏢', name: 'Amundi Index FTSE EPRA NAREIT Global AE-C', isin: 'LU1737652832', asset_class: 'alternatives', pct: 10, platform: 'MyInvestor', url: 'https://myinvestor.es', fees: 'TER 0.24%', min: 'Sin mínimo', rationale: 'REITs globales. Inmobiliario cotizado con dividendos.' },
        { logo: '🥇', name: 'iShares Physical Gold ETC', isin: 'IE00B4ND3602', asset_class: 'commodities', pct: 8, platform: 'Trade Republic', url: 'https://traderepublic.com/es-es', fees: 'TER 0.12%', min: '1 €', rationale: 'Oro físico. Cobertura ante inflación y descorrelación.' },
        { logo: '₿', name: 'Bit2Me — Bitcoin', isin: null, asset_class: 'crypto', pct: 5, platform: 'Bit2Me', url: 'https://bit2me.com', fees: '1.49% por operación', min: '1 €', rationale: 'Bitcoin como activo de alto retorno potencial. Mantén en 5-8% del total.' },
      ],
    },
    6: {
      label: 'Cartera Completa',
      description: '7 productos: cobertura total de clases de activo para un dinámico con patrimonio elevado.',
      products: [
        { logo: '📈', name: 'Fidelity Index World P-ACC-EUR', isin: 'IE00BYX5NX33', asset_class: 'equities', pct: 40, platform: 'MyInvestor', url: 'https://myinvestor.es', fees: 'TER 0.12%', min: 'Sin mínimo', rationale: 'Core principal: RV países desarrollados. Traspaso fiscal.' },
        { logo: '🌏', name: 'Amundi Index MSCI Emerging Markets AE-C', isin: 'LU0996177134', asset_class: 'equities', pct: 18, platform: 'MyInvestor', url: 'https://myinvestor.es', fees: 'TER 0.20%', min: 'Sin mínimo', rationale: 'Emergentes. Mayor peso para patrimonio más elevado. Traspaso fiscal.' },
        { logo: '🔹', name: 'Vanguard Global Small-Cap Index Inst EUR', isin: 'IE00B42W4L06', asset_class: 'equities', pct: 12, platform: 'MyInvestor', url: 'https://myinvestor.es', fees: 'TER 0.29%', min: 'Sin mínimo', rationale: 'Small caps globales. Históricamente mayor rentabilidad que large caps.' },
        { logo: '🏢', name: 'Amundi Index FTSE EPRA NAREIT Global AE-C', isin: 'LU1737652832', asset_class: 'alternatives', pct: 10, platform: 'MyInvestor', url: 'https://myinvestor.es', fees: 'TER 0.24%', min: 'Sin mínimo', rationale: 'Inmobiliario cotizado global. Dividendos y revalorización.' },
        { logo: '🥇', name: 'iShares Physical Gold ETC', isin: 'IE00B4ND3602', asset_class: 'commodities', pct: 7, platform: 'Trade Republic', url: 'https://traderepublic.com/es-es', fees: 'TER 0.12%', min: '1 €', rationale: 'Oro físico. Cobertura de cola y activo refugio.' },
        { logo: '₿', name: 'Bit2Me — Bitcoin', isin: null, asset_class: 'crypto', pct: 8, platform: 'Bit2Me', url: 'https://bit2me.com', fees: '1.49% por operación', min: '1 €', rationale: 'Bitcoin: activo de alto retorno potencial a largo plazo.' },
        { logo: '🔸', name: 'Coinbase — Ethereum', isin: null, asset_class: 'crypto', pct: 5, platform: 'Coinbase', url: 'https://coinbase.com', fees: '1.49-2.99%', min: '2 €', rationale: 'Ethereum: segunda cripto por capitalización. Smart contracts y DeFi.' },
      ],
    },
  },
  agresivo: {
    1: {
      label: 'Construye tu base primero', managed: true, savings_mode: true,
      description: 'Con menos de 3.000 € acumula en Trade Republic al 3% TAE. Objetivo: 3.000 € para abrir Indexa Capital perfil 10/10.',
      products: [
        { logo: '🟩', name: 'Trade Republic — Cuenta remunerada', isin: null, asset_class: 'cash', pct: 100, platform: 'Trade Republic', url: 'https://traderepublic.com/es-es', fees: '~3% TAE', min: '1 €', rationale: 'Ahorra al 3% TAE sin riesgo. Objetivo: 3.000 € para dar el salto a Indexa Capital perfil 10/10.' },
      ],
    },
    2: {
      label: 'Indexa Capital — Perfil 10/10', managed: true,
      description: 'Indexa gestiona todo por ti. Perfil 10/10: ~100% RV global. Máximo crecimiento esperado, máxima volatilidad. Sin decisiones.',
      products: [
        { logo: '📊', name: 'Indexa Capital · Perfil 10/10', isin: null, asset_class: 'equities', pct: 100, platform: 'Indexa Capital', url: 'https://indexacapital.com', fees: '~0.42%/año todo incluido', min: '3.000 €', rationale: '~100% RV global (Vanguard: World + EM + Small Cap). Rebalanceo automático. La cartera más agresiva de Indexa.',
          est_return: '~8.5% anual (histórico 10 años)',
          composition: [
            { name: 'Vanguard Global Stock Market Index', pct: 67 },
            { name: 'Vanguard Emerging Markets Stock Index', pct: 23 },
            { name: 'Vanguard World Small Cap Index', pct: 10 },
          ],
        },
      ],
    },
    3: {
      label: 'MyInvestor — Cartera Metal', managed: true,
      description: 'La cartera más agresiva de MyInvestor. 100% RV global indexada. Sin mínimo de entrada.',
      products: [
        { logo: '🏦', name: 'MyInvestor Cartera Metal', isin: null, asset_class: 'equities', pct: 100, platform: 'MyInvestor', url: 'https://myinvestor.es/carteras-indexadas/', fees: '~0.28%/año todo incluido', min: 'Sin mínimo', rationale: '100% RV global indexada. Rebalanceo automático. La opción más agresiva de MyInvestor, más barata que Indexa.',
          est_return: '~8.5% anual (histórico estimado)',
          composition: [
            { name: 'Amundi MSCI World', pct: 70 },
            { name: 'Amundi MSCI Emerging Markets', pct: 20 },
            { name: 'Amundi MSCI World Small Cap', pct: 10 },
          ],
        },
      ],
    },
    4: {
      label: 'Cartera Simple',
      description: '4 productos: RV global + emergentes con alto peso + small caps + pequeña posición en oro.',
      products: [
        { logo: '📈', name: 'Fidelity Index World P-ACC-EUR', isin: 'IE00BYX5NX33', asset_class: 'equities', pct: 60, platform: 'MyInvestor', url: 'https://myinvestor.es', fees: 'TER 0.12%', min: 'Sin mínimo', rationale: 'Base principal: 1.600+ empresas países desarrollados. Traspaso fiscal.' },
        { logo: '🌏', name: 'Amundi Index MSCI Emerging Markets AE-C', isin: 'LU0996177134', asset_class: 'equities', pct: 25, platform: 'MyInvestor', url: 'https://myinvestor.es', fees: 'TER 0.20%', min: 'Sin mínimo', rationale: 'Alto peso en emergentes para un perfil agresivo. Traspaso fiscal.' },
        { logo: '🔹', name: 'Vanguard Global Small-Cap Index Inst EUR', isin: 'IE00B42W4L06', asset_class: 'equities', pct: 10, platform: 'MyInvestor', url: 'https://myinvestor.es', fees: 'TER 0.29%', min: 'Sin mínimo', rationale: 'Small caps globales: factor premium histórico. Traspaso fiscal.' },
        { logo: '🥇', name: 'iShares Physical Gold ETC', isin: 'IE00B4ND3602', asset_class: 'commodities', pct: 5, platform: 'Trade Republic', url: 'https://traderepublic.com/es-es', fees: 'TER 0.12%', min: '1 €', rationale: 'Pequeña posición en oro como cobertura de cola.' },
      ],
    },
    5: {
      label: 'Cartera Diversificada',
      description: '6 productos: bolsa global completa + REITs + oro + Bitcoin. Máxima diversificación en perfil agresivo.',
      products: [
        { logo: '📈', name: 'Fidelity Index World P-ACC-EUR', isin: 'IE00BYX5NX33', asset_class: 'equities', pct: 42, platform: 'MyInvestor', url: 'https://myinvestor.es', fees: 'TER 0.12%', min: 'Sin mínimo', rationale: 'Core: RV global. Traspaso fiscal.' },
        { logo: '🌏', name: 'Amundi Index MSCI Emerging Markets AE-C', isin: 'LU0996177134', asset_class: 'equities', pct: 20, platform: 'MyInvestor', url: 'https://myinvestor.es', fees: 'TER 0.20%', min: 'Sin mínimo', rationale: 'Emergentes con peso relevante. Traspaso fiscal.' },
        { logo: '🔹', name: 'Vanguard Global Small-Cap Index Inst EUR', isin: 'IE00B42W4L06', asset_class: 'equities', pct: 13, platform: 'MyInvestor', url: 'https://myinvestor.es', fees: 'TER 0.29%', min: 'Sin mínimo', rationale: 'Small caps: factor premium + diversificación.' },
        { logo: '🏢', name: 'Amundi Index FTSE EPRA NAREIT Global AE-C', isin: 'LU1737652832', asset_class: 'alternatives', pct: 10, platform: 'MyInvestor', url: 'https://myinvestor.es', fees: 'TER 0.24%', min: 'Sin mínimo', rationale: 'REITs globales. Inmobiliario cotizado con dividendos.' },
        { logo: '🥇', name: 'iShares Physical Gold ETC', isin: 'IE00B4ND3602', asset_class: 'commodities', pct: 5, platform: 'Trade Republic', url: 'https://traderepublic.com/es-es', fees: 'TER 0.12%', min: '1 €', rationale: 'Pequeña posición de cobertura en oro.' },
        { logo: '₿', name: 'Bit2Me — Bitcoin', isin: null, asset_class: 'crypto', pct: 10, platform: 'Bit2Me', url: 'https://bit2me.com', fees: '1.49% por operación', min: '1 €', rationale: 'Bitcoin: activo de mayor retorno potencial. Acepta la volatilidad.' },
      ],
    },
    6: {
      label: 'Cartera Completa',
      description: '7 productos: total market + REITs + oro + cripto diversificado. Máximo riesgo/retorno.',
      note: 'Equivalente a Indexa 10/10 con exposición adicional a cripto y small caps.',
      products: [
        { logo: '📈', name: 'Fidelity Index World P-ACC-EUR', isin: 'IE00BYX5NX33', asset_class: 'equities', pct: 37, platform: 'MyInvestor', url: 'https://myinvestor.es', fees: 'TER 0.12%', min: 'Sin mínimo', rationale: 'Core: RV países desarrollados. Traspaso fiscal.' },
        { logo: '🌏', name: 'Amundi Index MSCI Emerging Markets AE-C', isin: 'LU0996177134', asset_class: 'equities', pct: 18, platform: 'MyInvestor', url: 'https://myinvestor.es', fees: 'TER 0.20%', min: 'Sin mínimo', rationale: 'Emergentes: alto peso para perfil agresivo. Traspaso fiscal.' },
        { logo: '🔹', name: 'Vanguard Global Small-Cap Index Inst EUR', isin: 'IE00B42W4L06', asset_class: 'equities', pct: 12, platform: 'MyInvestor', url: 'https://myinvestor.es', fees: 'TER 0.29%', min: 'Sin mínimo', rationale: 'Small caps globales: factor premium histórico.' },
        { logo: '🏢', name: 'Amundi Index FTSE EPRA NAREIT Global AE-C', isin: 'LU1737652832', asset_class: 'alternatives', pct: 8, platform: 'MyInvestor', url: 'https://myinvestor.es', fees: 'TER 0.24%', min: 'Sin mínimo', rationale: 'Inmobiliario cotizado global. Dividendos + revalorización.' },
        { logo: '🥇', name: 'iShares Physical Gold ETC', isin: 'IE00B4ND3602', asset_class: 'commodities', pct: 5, platform: 'Trade Republic', url: 'https://traderepublic.com/es-es', fees: 'TER 0.12%', min: '1 €', rationale: 'Pequeña cobertura en oro.' },
        { logo: '₿', name: 'Bit2Me — Bitcoin', isin: null, asset_class: 'crypto', pct: 12, platform: 'Bit2Me', url: 'https://bit2me.com', fees: '1.49% por operación', min: '1 €', rationale: 'Bitcoin: posición principal de cripto.' },
        { logo: '🔸', name: 'Coinbase — Ethereum', isin: null, asset_class: 'crypto', pct: 8, platform: 'Coinbase', url: 'https://coinbase.com', fees: '1.49-2.99%', min: '2 €', rationale: 'Ethereum: segunda cripto. Smart contracts + DeFi.' },
      ],
    },
  },
};

// ─── Archetype portfolios ─────────────────────────────────────────────────────
// Shown as "Estrategias alternativas" in DIY results for matching profiles.

const ARCHETYPE_BLUEPRINTS = [
  {
    id: 'boglehead',
    label: 'La Boglehead — 3 fondos',
    description: 'La cartera más simple y eficiente que existe. 3 fondos, rebalanceo anual, sin complicaciones. Inventada por John Bogle, fundador de Vanguard. Históricamente bate al 90% de los gestores activos.',
    profiles: ['moderado', 'dinamico'],
    min_complexity: 3,
    products: [
      { logo: '📈', name: 'Fidelity Index World P-ACC-EUR', isin: 'IE00BYX5NX33', asset_class: 'equities',    pct: 70, platform: 'MyInvestor', url: 'https://myinvestor.es',               fees: 'TER 0.12%', min: 'Sin mínimo', rationale: 'El núcleo: 1.600+ empresas desarrolladas en un solo fondo. Traspaso fiscal.' },
      { logo: '🌍', name: 'Amundi Index MSCI Emerging Markets AE-C', isin: 'LU0996177134', asset_class: 'equities', pct: 15, platform: 'MyInvestor', url: 'https://myinvestor.es', fees: 'TER 0.20%', min: 'Sin mínimo', rationale: 'Emergentes: China, India, Brasil. Diversificación geográfica. Traspaso fiscal.' },
      { logo: '🟢', name: 'Vanguard Global Bond Index Hdg EUR', isin: 'IE00B18GC888', asset_class: 'fixedIncome', pct: 15, platform: 'MyInvestor', url: 'https://myinvestor.es',           fees: 'TER 0.15%', min: 'Sin mínimo', rationale: 'Bonos globales cubiertos a EUR. Estabilizador de cartera. Traspaso fiscal.' },
    ],
  },
  {
    id: 'permanente',
    label: 'La Permanente — 4 activos iguales',
    description: 'Harry Browne la diseñó para sobrevivir a cualquier escenario macroeconómico: crecimiento, recesión, inflación o deflación. Un 25% en cada régimen económico. Rentabilidad moderada, pero volatilidad mínima.',
    profiles: ['conservador', 'moderado'],
    min_complexity: 4,
    products: [
      { logo: '📈', name: 'Fidelity Index World P-ACC-EUR', isin: 'IE00BYX5NX33', asset_class: 'equities',    pct: 25, platform: 'MyInvestor',      url: 'https://myinvestor.es',               fees: 'TER 0.12%', min: 'Sin mínimo', rationale: 'Acciones: se beneficia del crecimiento económico.' },
      { logo: '🟢', name: 'Amundi IS J.P.Morgan GBI Global Govies AHE-C', isin: 'LU0389812988', asset_class: 'fixedIncome', pct: 25, platform: 'MyInvestor', url: 'https://myinvestor.es', fees: 'TER 0.10%', min: 'Sin mínimo', rationale: 'Bonos: se beneficia en deflación y crisis.' },
      { logo: '🥇', name: 'iShares Physical Gold ETC', isin: 'IE00B4ND3602', asset_class: 'commodities',      pct: 25, platform: 'Trade Republic',  url: 'https://traderepublic.com/es-es',     fees: 'TER 0.12%', min: '1 €',        rationale: 'Oro: se beneficia en inflación alta y crisis sistémicas.' },
      { logo: '💵', name: 'Efectivo — Cuenta Trade Republic (~4%)', isin: null, asset_class: 'cash',          pct: 25, platform: 'Trade Republic',  url: 'https://traderepublic.com/es-es',     fees: '0%',         min: '1 €',        rationale: 'Liquidez total. Trade Republic paga ~4% en efectivo sin plazo ni comisiones.' },
    ],
  },
  {
    id: 'allweather',
    label: 'All-Weather EUR — Todo clima',
    description: 'La versión europea de la cartera All Weather de Ray Dalio (Bridgewater). Diseñada para funcionar bien en los 4 regímenes económicos: crecimiento, contracción, inflación y deflación. Resultado: baja volatilidad, buena rentabilidad ajustada a riesgo.',
    profiles: ['conservador', 'moderado'],
    min_complexity: 4,
    products: [
      { logo: '📈', name: 'Fidelity Index World P-ACC-EUR', isin: 'IE00BYX5NX33', asset_class: 'equities',     pct: 30, platform: 'MyInvestor', url: 'https://myinvestor.es',               fees: 'TER 0.12%', min: 'Sin mínimo', rationale: 'Acciones globales: motor de crecimiento a largo plazo.' },
      { logo: '🟢', name: 'Amundi IS J.P.Morgan GBI Global Govies AHE-C', isin: 'LU0389812988', asset_class: 'fixedIncome', pct: 40, platform: 'MyInvestor', url: 'https://myinvestor.es', fees: 'TER 0.10%', min: 'Sin mínimo', rationale: 'Bonos gubernamentales globales: estabilidad en contracción y deflación.' },
      { logo: '🏦', name: 'iShares EUR Inflation Linked Govt Bond', isin: 'IE00B0M62X26', asset_class: 'fixedIncome', pct: 15, platform: 'Trade Republic', url: 'https://traderepublic.com/es-es', fees: 'TER 0.09%', min: '1 €',        rationale: 'Bonos ligados a inflación EUR: protección cuando suben los precios.' },
      { logo: '🥇', name: 'iShares Physical Gold ETC', isin: 'IE00B4ND3602', asset_class: 'commodities',       pct: 8,  platform: 'Trade Republic', url: 'https://traderepublic.com/es-es',     fees: 'TER 0.12%', min: '1 €',        rationale: 'Oro: cobertura ante inflación y crisis. Descorrelación con bonos y acciones.' },
      { logo: '🏢', name: 'Amundi Index FTSE EPRA NAREIT Global AE-C', isin: 'LU1737652832', asset_class: 'alternatives', pct: 7, platform: 'MyInvestor', url: 'https://myinvestor.es',       fees: 'TER 0.24%', min: 'Sin mínimo', rationale: 'REITs globales: inmobiliario cotizado, rentas y diversificación real.' },
    ],
  },
  {
    id: 'core_satelite',
    label: 'Core-Satélite — 80/20',
    description: 'El 80% en un núcleo indexado muy diversificado; el 20% en satélites de alta convicción. Combinas la eficiencia de la gestión pasiva con algo de exposición táctica a sectores y geografías con más potencial.',
    profiles: ['dinamico', 'agresivo'],
    min_complexity: 5,
    products: [
      { logo: '📈', name: 'Fidelity Index World P-ACC-EUR', isin: 'IE00BYX5NX33', asset_class: 'equities',    pct: 40, platform: 'MyInvestor', url: 'https://myinvestor.es',               fees: 'TER 0.12%', min: 'Sin mínimo', rationale: 'Core principal: países desarrollados, 1.600+ empresas. Traspaso fiscal.' },
      { logo: '🌍', name: 'Amundi Index MSCI Emerging Markets AE-C', isin: 'LU0996177134', asset_class: 'equities', pct: 20, platform: 'MyInvestor', url: 'https://myinvestor.es', fees: 'TER 0.20%', min: 'Sin mínimo', rationale: 'Core emergentes: diversificación global completa. Traspaso fiscal.' },
      { logo: '🔹', name: 'Vanguard Global Small-Cap Index Inst EUR', isin: 'IE00B42W4L06', asset_class: 'equities', pct: 10, platform: 'MyInvestor', url: 'https://myinvestor.es', fees: 'TER 0.29%', min: 'Sin mínimo', rationale: 'Core small caps: factor premium histórico. Traspaso fiscal.' },
      { logo: '🟢', name: 'Amundi IS J.P.Morgan GBI Global Govies AHE-C', isin: 'LU0389812988', asset_class: 'fixedIncome', pct: 10, platform: 'MyInvestor', url: 'https://myinvestor.es', fees: 'TER 0.10%', min: 'Sin mínimo', rationale: 'Core bonos: ancla de estabilidad en el núcleo.' },
      { logo: '🥇', name: 'iShares Physical Gold ETC', isin: 'IE00B4ND3602', asset_class: 'commodities',      pct: 7,  platform: 'Trade Republic', url: 'https://traderepublic.com/es-es',     fees: 'TER 0.12%', min: '1 €',        rationale: 'Satélite: cobertura de cola y descorrelación.' },
      { logo: '💻', name: 'VanEck Semiconductor UCITS ETF', isin: 'IE00BMW3QX54', asset_class: 'equities',    pct: 7,  platform: 'Trade Republic', url: 'https://traderepublic.com/es-es',     fees: 'TER 0.35%', min: '1 €',        rationale: 'Satélite: semiconductores, el petróleo del siglo XXI.' },
      { logo: '🇮🇳', name: 'iShares MSCI India UCITS ETF', isin: 'IE00B0M63177', asset_class: 'equities',    pct: 6,  platform: 'Trade Republic', url: 'https://traderepublic.com/es-es',     fees: 'TER 0.65%', min: '1 €',        rationale: 'Satélite: India, la economía de mayor crecimiento del G20.' },
    ],
  },
  {
    id: 'dividendos',
    label: 'Dividendos — Rentas pasivas',
    description: 'Para quien quiere ver dinero en cuenta de forma periódica. Combina ETFs de dividendos crecientes con REITs y una base estabilizadora. No es la estrategia de mayor rentabilidad total, pero genera flujo de caja real y reduce la tentación de vender en caídas.',
    profiles: ['moderado', 'dinamico'],
    min_complexity: 5,
    products: [
      { logo: '💰', name: 'Vanguard FTSE All-World High Div Yield ETF', isin: 'IE00B8GKDB10', asset_class: 'equities',   pct: 35, platform: 'Trade Republic', url: 'https://traderepublic.com/es-es', fees: 'TER 0.22%', min: '1 €',        rationale: 'Empresas con alto dividendo actual. Distribución trimestral.' },
      { logo: '📊', name: 'WisdomTree Global Quality Dividend Growth', isin: 'IE00BZ56SW52', asset_class: 'equities',    pct: 25, platform: 'Trade Republic', url: 'https://traderepublic.com/es-es', fees: 'TER 0.38%', min: '1 €',        rationale: 'Dividendo creciente + calidad. Mejor para inflación a largo plazo.' },
      { logo: '🏢', name: 'Amundi Index FTSE EPRA NAREIT Global AE-C', isin: 'LU1737652832', asset_class: 'alternatives', pct: 15, platform: 'MyInvestor', url: 'https://myinvestor.es',       fees: 'TER 0.24%', min: 'Sin mínimo', rationale: 'REITs: inmobiliario global + rentas. Traspaso fiscal.' },
      { logo: '🟢', name: 'Amundi IS J.P.Morgan GBI Global Govies AHE-C', isin: 'LU0389812988', asset_class: 'fixedIncome', pct: 15, platform: 'MyInvestor', url: 'https://myinvestor.es', fees: 'TER 0.10%', min: 'Sin mínimo', rationale: 'Bonos: estabilidad y cobertura de volatilidad. Traspaso fiscal.' },
      { logo: '🥇', name: 'iShares Physical Gold ETC', isin: 'IE00B4ND3602', asset_class: 'commodities',       pct: 10, platform: 'Trade Republic', url: 'https://traderepublic.com/es-es',     fees: 'TER 0.12%', min: '1 €',        rationale: 'Oro: cobertura de inflación y diversificación de riesgo.' },
    ],
  },
  {
    id: 'growth_extremo',
    label: 'Growth Extremo — Máximo crecimiento',
    description: 'Todo orientado a crecimiento. Sin bonos, sin oro, máxima exposición a renta variable global con sesgo a los mercados y sectores de más potencial. Volatilidad alta, posibles caídas del 40-50%, pero retorno esperado máximo a 15+ años.',
    profiles: ['agresivo'],
    min_complexity: 4,
    products: [
      { logo: '📈', name: 'Fidelity Index World P-ACC-EUR', isin: 'IE00BYX5NX33', asset_class: 'equities',    pct: 40, platform: 'MyInvestor', url: 'https://myinvestor.es',               fees: 'TER 0.12%', min: 'Sin mínimo', rationale: 'Base: 1.600+ empresas países desarrollados. TER mínimo. Traspaso fiscal.' },
      { logo: '🌍', name: 'Amundi Index MSCI Emerging Markets AE-C', isin: 'LU0996177134', asset_class: 'equities', pct: 20, platform: 'MyInvestor', url: 'https://myinvestor.es', fees: 'TER 0.20%', min: 'Sin mínimo', rationale: 'Emergentes: 2.000M de clase media creciendo. Traspaso fiscal.' },
      { logo: '🔹', name: 'Vanguard Global Small-Cap Index Inst EUR', isin: 'IE00B42W4L06', asset_class: 'equities', pct: 15, platform: 'MyInvestor', url: 'https://myinvestor.es', fees: 'TER 0.29%', min: 'Sin mínimo', rationale: 'Small caps: factor premium + tamaño. Mayor rentabilidad esperada a largo plazo.' },
      { logo: '💻', name: 'Invesco EQQQ Nasdaq-100 UCITS ETF', isin: 'IE0032077012', asset_class: 'equities',   pct: 15, platform: 'Trade Republic', url: 'https://traderepublic.com/es-es',     fees: 'TER 0.30%', min: '1 €',        rationale: 'Las 100 mayores tecnológicas no financieras del mundo. Apple, NVIDIA, Microsoft.' },
      { logo: '🇮🇳', name: 'iShares MSCI India UCITS ETF', isin: 'IE00B0M63177', asset_class: 'equities',    pct: 10, platform: 'Trade Republic', url: 'https://traderepublic.com/es-es',     fees: 'TER 0.65%', min: '1 €',        rationale: 'India: 1.400M personas, pirámide poblacional joven, crecimiento del PIB >6%.' },
    ],
  },
];

// ─── Platforms catalog ─────────────────────────────────────────────────────────

const PLATFORMS = {
  roboadvisors: [
    {
      id: 'indexa',
      name: 'Indexa Capital',
      logo: '🔵',
      url: 'https://indexacapital.com',
      fees: '0.40–0.54% total/año',
      min: '3.000 €',
      badge: '⭐ Mejor valorado',
      est_returns: { conservador: '3–5%', moderado: '5–7%', dinamico: '7–9%', agresivo: '8–11%' },
      pros: ['Fondos Vanguard + Dimensional', 'Rebalanceo automático', 'Sin coste de entrada/salida', 'Perfil personalizado 1–10'],
      cons: ['Mínimo 3.000€', 'Sin cuenta remunerada incluida'],
      highlight: ['conservador', 'moderado'],
    },
    {
      id: 'myinvestor_carteras',
      name: 'MyInvestor Carteras',
      logo: '🟠',
      url: 'https://myinvestor.es',
      fees: '~0.37–0.45% total/año',
      min: 'Sin mínimo',
      badge: null,
      est_returns: { conservador: '3–4%', moderado: '5–6%', dinamico: '7–8%', agresivo: '8–10%' },
      pros: ['Sin mínimo de entrada', 'Comisión de gestión muy baja', 'Cuenta remunerada 2.5% integrada', 'Fondos Vanguard y Amundi'],
      cons: ['Menos personalización de perfil', 'Plataforma más genérica'],
      highlight: [],
    },
    {
      id: 'finizens',
      name: 'Finizens',
      logo: '🟢',
      url: 'https://finizens.com',
      fees: '0.34% total/año',
      min: '1.000 €',
      badge: null,
      est_returns: { conservador: '3–5%', moderado: '5–7%', dinamico: '7–9%', agresivo: '8–10%' },
      pros: ['Fondos Vanguard de bajo coste', 'Ajuste automático según edad', 'Plan de pensiones indexado integrado'],
      cons: ['Menos reconocido que Indexa', 'Menor track record público'],
      highlight: [],
    },
    {
      id: 'inbestme',
      name: 'inbestMe',
      logo: '🔷',
      url: 'https://inbestme.com',
      fees: '0.36–0.48% total/año',
      min: '1.000 €',
      badge: null,
      est_returns: { conservador: '3–5%', moderado: '5–7%', dinamico: '7–9%', agresivo: '9–11%' },
      pros: ['Mayor personalización (ISR, factores)', 'Hasta 10 perfiles de riesgo distintos', 'Análisis fiscal detallado', 'Plan de pensiones integrado'],
      cons: ['Interfaz más compleja', 'Menor notoriedad de marca'],
      highlight: ['dinamico', 'agresivo'],
    },
  ],

  brokers: [
    {
      id: 'myinvestor_broker',
      name: 'MyInvestor',
      logo: '🟠',
      url: 'https://myinvestor.es',
      fees: '0% custodia + 0% comisión en fondos',
      min: '1 €',
      badge: '✅ Mejor para fondos',
      est_returns: null,
      pros: ['Sin custodia en fondos de inversión', 'Vanguard, Amundi, iShares disponibles', 'Cuenta remunerada 2.5% incluida', 'Traspaso entre fondos sin tributar'],
      cons: ['ETFs con tarifa de custodia separada', 'App mejorable respecto a competidores'],
    },
    {
      id: 'trade_republic',
      name: 'Trade Republic',
      logo: '🖤',
      url: 'https://traderepublic.com/es-es',
      fees: '1 € por operación · 0% custodia',
      min: '1 €',
      badge: '⭐ Mejor para ETFs',
      est_returns: null,
      pros: ['1€ por operación en ETFs', 'Cuenta remunerada 3.25% integrada', 'Planes de ahorro automáticos gratis', 'App muy bien valorada'],
      cons: ['Solo app (sin plataforma web de operativa)', 'Sin fondos de inversión tradicionales'],
    },
    {
      id: 'degiro',
      name: 'DEGIRO',
      logo: '🔴',
      url: 'https://degiro.es',
      fees: '~2€ + 0.038%/op · 2.5€/posición/año custodia',
      min: '1 €',
      badge: null,
      est_returns: null,
      pros: ['Acceso a más de 50 mercados globales', 'Gran catálogo de ETFs', 'Tarifas competitivas en ETFs europeos'],
      cons: ['Sin cuenta remunerada', 'Sin fondos de inversión', 'Custodia anual por posición ETF'],
    },
    {
      id: 'xtb',
      name: 'XTB',
      logo: '🔵',
      url: 'https://xtb.com/es',
      fees: '0% ETFs hasta 100k€/mes · 0.2% después',
      min: '1 €',
      badge: null,
      est_returns: null,
      pros: ['0% comisiones en ETFs (límite 100k€/mes)', 'Planes de ahorro automáticos', 'Cuenta remunerada 3.8%', 'Plataforma de análisis potente'],
      cons: ['Sin fondos de inversión tradicionales', 'Comisión tras 100k€/mes de operaciones'],
    },
  ],

  savings: [
    {
      id: 'trade_republic_savings',
      name: 'Trade Republic',
      logo: '🖤',
      url: 'https://traderepublic.com/es-es',
      fees: 'Sin comisiones',
      min: 'Sin mínimo',
      badge: '⭐ Mejor TAE',
      est_return: '3.25% TAE',
      pros: ['3.25% TAE liquidación diaria', 'Liquidez inmediata', 'Garantía FGD hasta 100.000€', 'Sin plazo ni penalización'],
      cons: ['Solo accesible vía app móvil', 'Sin acceso web de operativa'],
    },
    {
      id: 'xtb_savings',
      name: 'XTB (cuenta)',
      logo: '🔵',
      url: 'https://xtb.com/es',
      fees: 'Sin comisiones',
      min: 'Sin mínimo',
      badge: null,
      est_return: '3.8% TAE',
      pros: ['3.8% TAE (la más alta del mercado)', 'Disponible vía web y app', 'Sin plazo mínimo'],
      cons: ['Plataforma pensada para trading', 'Requiere abrir cuenta de broker'],
    },
    {
      id: 'revolut_savings',
      name: 'Revolut Savings',
      logo: '🟣',
      url: 'https://revolut.com/es',
      fees: 'Sin comisiones (plan básico)',
      min: 'Sin mínimo',
      badge: null,
      est_return: '~3.0% TAE',
      pros: ['Apertura inmediata', 'Liquidez total', 'Integrado con cuenta corriente Revolut'],
      cons: ['Tipo variable sin garantía de permanencia', 'No es banco tradicional (e-money)'],
    },
    {
      id: 'raisin',
      name: 'Raisin',
      logo: '💛',
      url: 'https://raisin.es',
      fees: 'Sin comisiones al inversor',
      min: '1.000 €',
      badge: null,
      est_return: 'Hasta 3.5% TAE en depósitos',
      pros: ['Acceso a depósitos bancarios europeos', 'Garantía FGD europea por banco', 'Hasta 3.5% TAE en plazos fijos'],
      cons: ['Mínimo 1.000€', 'Depósitos a plazo son ilíquidos', 'Alta más laboriosa'],
    },
  ],

  real_estate: [
    {
      id: 'urbanitae',
      name: 'Urbanitae',
      logo: '🏙️',
      url: 'https://urbanitae.com',
      fees: 'Sin comisión al inversor',
      min: '500 €',
      badge: '🏆 Líder en España',
      est_return: '12–18% TIR proyectado',
      pros: ['Mayor plataforma española de crowdfunding', 'Regulada por CNMV', 'Proyectos en Madrid, Barcelona, Valencia', 'Due diligence riguroso'],
      cons: ['Ilíquido (12–36 meses)', 'Rentabilidad no garantizada', 'Riesgo de promotor'],
    },
    {
      id: 'wecity',
      name: 'Wecity',
      logo: '🏘️',
      url: 'https://wecity.eu',
      fees: 'Sin comisión al inversor',
      min: '500 €',
      badge: null,
      est_return: '8–14% TIR proyectado',
      pros: ['Regulada por CNMV', 'Proyectos residenciales y terciarios diversificados', 'Historial de rentabilidades sólido'],
      cons: ['Ilíquido', 'Menor volumen de proyectos que Urbanitae'],
    },
    {
      id: 'civislend',
      name: 'Civislend',
      logo: '🏛️',
      url: 'https://civislend.com',
      fees: 'Sin comisión al inversor',
      min: '250 €',
      badge: null,
      est_return: '8–12% TIR proyectado',
      pros: ['Mínimo de entrada más bajo (250€)', 'Regulada por CNMV', 'Préstamos con garantía hipotecaria'],
      cons: ['Ilíquido', 'Menos proyectos activos que Urbanitae'],
    },
  ],

  crypto: [
    {
      id: 'coinbase',
      name: 'Coinbase',
      logo: '🔵',
      url: 'https://coinbase.com',
      fees: '0.5–1.5%/operación (spread)',
      min: 'Sin mínimo',
      badge: '✅ Más regulada',
      est_return: null,
      pros: ['Empresa cotizada NASDAQ (máxima transparencia)', 'Regulada en EE.UU. y Europa', 'App muy fácil de usar', 'Seguros sobre activos en custodia'],
      cons: ['Comisiones más altas que exchanges profesionales', 'Custodia en plataforma (riesgo exchange)'],
    },
    {
      id: 'kraken',
      name: 'Kraken',
      logo: '🟣',
      url: 'https://kraken.com',
      fees: '0.16–0.26% maker/taker',
      min: 'Sin mínimo',
      badge: null,
      est_return: null,
      pros: ['Comisiones profesionales más bajas', 'Historial de seguridad excelente', 'Gran variedad de activos y staking', 'Opción de autocustodia sencilla'],
      cons: ['Interfaz más técnica', 'Verificación KYC más rigurosa y lenta'],
    },
    {
      id: 'bit2me',
      name: 'Bit2Me',
      logo: '🇪🇸',
      url: 'https://bit2me.com',
      fees: '0.80–1.49%/operación',
      min: '5 €',
      badge: null,
      est_return: null,
      pros: ['Exchange español con soporte en español 24/7', 'Regulado en España (inscrito AEPD)', 'Integración bancaria española más fácil'],
      cons: ['Comisiones más altas que Kraken o Coinbase', 'Menor liquidez en pares no mayores'],
    },
  ],

  pensions: [
    {
      id: 'indexa_pension',
      name: 'Indexa Planes',
      logo: '🔵',
      url: 'https://indexacapital.com/planes-pensiones',
      fees: '0.29–0.42% total/año',
      min: 'Sin mínimo',
      badge: '💸 Comisión más baja',
      est_returns: { conservador: '3–5%', moderado: '5–7%', dinamico: '7–9%', agresivo: '8–11%' },
      pros: ['La comisión más baja del mercado', 'Misma gestión automática que el fondo', 'Ajuste de riesgo automático según edad', 'Traspaso desde cualquier plan sin tributar'],
      cons: ['Ilíquido hasta jubilación (salvo contingencias legales)', 'Límite 1.500€/año aportación individual'],
    },
    {
      id: 'myinvestor_pension',
      name: 'MyInvestor Pensiones',
      logo: '🟠',
      url: 'https://myinvestor.es/plan-pensiones',
      fees: '0.25% gestión + 0.10% depósito/año',
      min: 'Sin mínimo',
      badge: null,
      est_returns: { conservador: '3–5%', moderado: '5–7%', dinamico: '7–9%', agresivo: '8–10%' },
      pros: ['Comisiones muy bajas', 'Fondos Vanguard y Amundi', 'Integrado en MyInvestor si ya tienes cuenta', 'Sin mínimo de aportación'],
      cons: ['Ilíquido hasta jubilación', 'Límite 1.500€/año individual'],
    },
    {
      id: 'finizens_pension',
      name: 'Finizens Pensiones',
      logo: '🟢',
      url: 'https://finizens.com/plan-de-pensiones',
      fees: '0.34% total/año',
      min: 'Sin mínimo',
      badge: null,
      est_returns: { conservador: '3–5%', moderado: '5–7%', dinamico: '7–9%', agresivo: '8–10%' },
      pros: ['Gestión automatizada con perfil de riesgo dinámico', 'Sin comisión de traspaso saliente', 'Opción ISR (inversión sostenible)', 'Sin mínimo de aportación'],
      cons: ['Ilíquido hasta jubilación', 'Límite 1.500€/año individual'],
    },
  ],
};

// ─── Known funds catalog (ISIN → profile) ─────────────────────────────────────

const KNOWN_FUNDS = {
  // ── MSCI World / Developed Markets ──────────────────────────────────────────
  'LU0996182563': { name: 'Amundi Index MSCI World AE-C',           index_group: 'world_equity', asset_class: 'equities',     note: '' },
  'IE00B4L5Y983': { name: 'iShares Core MSCI World UCITS ETF',    index_group: 'world_equity', asset_class: 'equities',     note: '' },
  'LU0552385295': { name: 'Vanguard Global Stock Index EUR Acc',   index_group: 'world_equity', asset_class: 'equities',     note: '' },
  'IE00B3RBWM25': { name: 'Vanguard FTSE All-World ETF (Dist)',    index_group: 'world_equity', asset_class: 'equities',     note: 'Incluye ~10% emergentes — cobertura global completa.' },
  'IE00BK5BQV03': { name: 'Vanguard FTSE All-World ETF (Acc)',     index_group: 'world_equity', asset_class: 'equities',     note: 'Incluye ~10% emergentes — cobertura global completa.' },
  'IE00B7KQ7B66': { name: 'SPDR MSCI World UCITS ETF',            index_group: 'world_equity', asset_class: 'equities',     note: '' },
  'LU1781541179': { name: 'Lyxor MSCI World UCITS ETF',           index_group: 'world_equity', asset_class: 'equities',     note: '' },
  'IE00BYX5NX33': { name: 'Fidelity Index World P-ACC-EUR',       index_group: 'world_equity', asset_class: 'equities',     note: '' },
  // ── S&P 500 (cubre solo EE.UU.) ──────────────────────────────────────────────
  'LU1681048804': { name: 'Amundi Index S&P 500 AE-C',            index_group: 'sp500',        asset_class: 'equities',     note: 'Excelente fondo, pero solo cubre EE.UU. (~65% del MSCI World). Considera complementar con mercados internacionales.' },
  'IE00B5BMR087': { name: 'iShares Core S&P 500 UCITS ETF',       index_group: 'sp500',        asset_class: 'equities',     note: 'Solo EE.UU. — considera complementar con mercados internacionales.' },
  'IE00BFMXXD54': { name: 'Vanguard S&P 500 UCITS ETF',           index_group: 'sp500',        asset_class: 'equities',     note: 'Solo EE.UU. — considera complementar con mercados internacionales.' },
  'LU0274208692': { name: 'Vanguard U.S. 500 Stock Index Fund',   index_group: 'sp500',        asset_class: 'equities',     note: 'Solo EE.UU. — considera complementar con mercados internacionales.' },
  'IE00B3XXRP09': { name: 'SPDR S&P 500 UCITS ETF',               index_group: 'sp500',        asset_class: 'equities',     note: 'Solo EE.UU.' },
  // ── Emerging Markets ─────────────────────────────────────────────────────────
  'LU0996177134': { name: 'Amundi Index MSCI Emerging Markets',   index_group: 'em_equity',    asset_class: 'equities',     note: '' },
  'IE00BKM4GZ66': { name: 'iShares Core MSCI EM IMI UCITS ETF',   index_group: 'em_equity',    asset_class: 'equities',     note: '' },
  'IE00B95PGT31': { name: 'Vanguard FTSE Emerging Markets ETF',   index_group: 'em_equity',    asset_class: 'equities',     note: '' },
  // ── Small Cap ────────────────────────────────────────────────────────────────
  'IE00BF4RFH31': { name: 'iShares MSCI World Small Cap ETF',         index_group: 'small_cap',    asset_class: 'equities',     note: '' },
  'IE00B42W4L06': { name: 'Vanguard Global Small-Cap Index Inst EUR', index_group: 'small_cap', asset_class: 'equities',    note: '' },
  // ── Global Bonds ─────────────────────────────────────────────────────────────
  'LU0389812988': { name: 'Amundi J.P.Morgan GBI Global Govies',  index_group: 'global_bonds', asset_class: 'fixedIncome',  note: '' },
  'IE00B18GC888': { name: 'Vanguard Global Bond Index Hdg EUR',   index_group: 'global_bonds', asset_class: 'fixedIncome',  note: '' },
  // ── Inflation-linked Bonds ────────────────────────────────────────────────────
  'IE00B0M62X26': { name: 'iShares EUR Inflation Linked Bonds',   index_group: 'infl_bonds',   asset_class: 'fixedIncome',  note: '' },
  // ── REITs ────────────────────────────────────────────────────────────────────
  'LU1737652832': { name: 'Amundi FTSE EPRA NAREIT Global',       index_group: 'reits',        asset_class: 'alternatives', note: '' },
  'IE00B1FZS350': { name: 'iShares Developed Markets Property',   index_group: 'reits',        asset_class: 'alternatives', note: '' },
  // ── Gold ─────────────────────────────────────────────────────────────────────
  'JE00B1VS3770': { name: 'WisdomTree Physical Gold ETC',      index_group: 'gold',         asset_class: 'commodities',  note: '' },
  'IE00B4ND3602': { name: 'iShares Physical Gold ETC',            index_group: 'gold',         asset_class: 'commodities',  note: '' },
  'DE000A0S9GB0': { name: 'Xetra-Gold',                          index_group: 'gold',         asset_class: 'commodities',  note: '' },
  // ── Dividend ─────────────────────────────────────────────────────────────────
  'IE00B8GKDB10': { name: 'Vanguard FTSE All-World High Div Yield ETF', index_group: 'high_div', asset_class: 'equities',  note: '' },
  'IE00BZ56SW52': { name: 'WisdomTree Global Quality Dividend Growth',  index_group: 'div_growth', asset_class: 'equities', note: '' },
  // ── Sector / Thematic ────────────────────────────────────────────────────────
  'IE0032077012': { name: 'Invesco EQQQ Nasdaq-100 UCITS ETF',   index_group: 'tech',         asset_class: 'equities',     note: '' },
  'IE00B0M63177': { name: 'iShares MSCI India UCITS ETF',        index_group: 'em_equity',    asset_class: 'equities',     note: '' },
  'IE00BMW3QX54': { name: 'VanEck Semiconductor UCITS ETF',      index_group: 'tech',         asset_class: 'equities',     note: '' },
};

// ─── Math helpers ─────────────────────────────────────────────────────────────

function calcBlendedReturn(allocation) {
  return Object.keys(RETURNS).reduce((sum, key) => sum + (allocation[key] || 0) / 100 * RETURNS[key], 0);
}

function calcProjection(initial, monthly, rate, years) {
  const r = rate / 12;
  const n = years * 12;
  if (r === 0) return initial + monthly * n;
  return initial * Math.pow(1 + r, n) + monthly * (Math.pow(1 + r, n) - 1) / r;
}

function calcNeededMonthly(target, annualRate, years) {
  const r = annualRate / 12;
  const n = years * 12;
  if (r === 0) return target / n;
  return target * r / (Math.pow(1 + r, n) - 1);
}

function getHorizonKey(years) {
  if (years < 5) return 'short';
  if (years <= 15) return 'medium';
  return 'long';
}

function fmtEur(n) {
  return Math.round(n).toLocaleString('es-ES') + ' €';
}

// ─── Financial health ─────────────────────────────────────────────────────────

function calcFinancialHealth(step2, step1) {
  const vivienda = step2.vivienda_coste || 0;
  const gastosMensuales = Math.max(0, (step2.ingresos || 0) - (step2.ahorro_mensual || 0));
  const fondoActual = step2?.fondo_emergencia ?? step1?.ahorros_liquidos ?? 0;
  const mesesEmergencia = gastosMensuales > 0 ? fondoActual / gastosMensuales : 0;
  const savingsRate = step2.ingresos > 0 ? (step2.ahorro_mensual / step2.ingresos) * 100 : 0;
  const debtRatio = step2.ingresos > 0 ? (step2.deudas || 0) / (step2.ingresos * 12) : 0;
  const hasTarjeta = (step2.tipos_deuda || []).includes('tarjeta');
  return {
    mesesEmergencia: mesesEmergencia.toFixed(1),
    emergencyStatus: mesesEmergencia >= 6 ? 'ok' : mesesEmergencia >= 3 ? 'warn' : 'bad',
    savingsRate: savingsRate.toFixed(1),
    savingsStatus: savingsRate >= 20 ? 'ok' : savingsRate >= 10 ? 'warn' : 'bad',
    debtRatio: debtRatio.toFixed(2),
    debtStatus: hasTarjeta ? 'bad' : debtRatio > 0.4 ? 'warn' : 'ok',
    hasTarjeta,
    gastosMensuales,
  };
}

function renderFinancialHealth(health) {
  const statusEmoji = { ok: '🟢', warn: '🟡', bad: '🔴' };
  const efLabel = health.mesesEmergencia >= 6
    ? `${health.mesesEmergencia} meses`
    : health.mesesEmergencia >= 3
      ? `${health.mesesEmergencia} meses (apunta a 6)`
      : `${health.mesesEmergencia} meses — insuficiente`;
  const srLabel = health.savingsRate >= 20
    ? `${health.savingsRate}% — excelente`
    : health.savingsRate >= 10
      ? `${health.savingsRate}% — mejorable`
      : `${health.savingsRate}% — bajo`;
  return `
    <div class="flex flex-wrap gap-3 mb-2">
      <div class="flex items-center gap-2 px-3 py-2 bg-white border border-gray-100 rounded-xl shadow-sm">
        <span class="text-base">${statusEmoji[health.emergencyStatus]}</span>
        <div>
          <p class="text-xs font-semibold text-gray-600">Fondo emergencia</p>
          <p class="text-xs text-gray-800">${efLabel}</p>
        </div>
      </div>
      <div class="flex items-center gap-2 px-3 py-2 bg-white border border-gray-100 rounded-xl shadow-sm">
        <span class="text-base">${statusEmoji[health.savingsStatus]}</span>
        <div>
          <p class="text-xs font-semibold text-gray-600">Tasa de ahorro</p>
          <p class="text-xs text-gray-800">${srLabel}</p>
        </div>
      </div>
    </div>`;
}

// ─── Hipoteca analysis ────────────────────────────────────────────────────────

function renderHipotecaAnalysis(step1) {
  if (step1?.vivienda !== 'hipoteca' || !step1.hipoteca_capital) return '';

  const capital = step1.hipoteca_capital || 0;
  const cuota = step1.hipoteca_cuota || 0;
  const anos = step1.hipoteca_anos || 0;
  const tipo = step1.hipoteca_tipo;
  const tin = step1.hipoteca_tin;
  const euribor = step1.hipoteca_euribor;
  const bonificaciones = step1.hipoteca_bonificaciones || [];
  const costeBonificacionesAnual = step1.hipoteca_coste_anual_bonificaciones || 0;
  const costeBonificacionesMensual = costeBonificacionesAnual / 12;

  // Coste real mensual (cuota + repercusión mensual de bonificaciones)
  const costeRealMensual = cuota + costeBonificacionesMensual;
  const costeRealAnual = costeRealMensual * 12;

  // TAE efectiva aproximada (interés implícito en los pagos respecto al capital)
  // Simplified: coste_financiero_anual / capital_pendiente
  // Interés mensual implícito via Newton-Raphson would be complex — use linear approx
  const totalPagado = cuota * anos * 12;
  const interesesTotales = totalPagado > capital ? totalPagado - capital : 0;
  const interesAnualAprox = anos > 0 ? interesesTotales / anos : 0;
  const taeEfectivaAprox = capital > 0 ? ((interesAnualAprox / capital) * 100).toFixed(2) : null;

  // Market reference: Euribor 12m ~2.5% + spread 0.75% = 3.25% for variable
  const EURIBOR_REF = 2.5;
  const SPREAD_MERCADO = 0.75;
  const taeMercadoVariable = EURIBOR_REF + SPREAD_MERCADO;

  // Chips
  const chips = [];

  // Coste real chip
  chips.push(`<div class="flex items-center gap-2 px-3 py-2 bg-white border border-gray-100 rounded-xl shadow-sm">
    <span class="text-base">💶</span>
    <div>
      <p class="text-xs font-semibold text-gray-600">Coste real mensual</p>
      <p class="text-xs text-gray-800">${fmtEur(costeRealMensual)}/mes${costeBonificacionesMensual > 0 ? ` (cuota ${fmtEur(cuota)} + bonif. ${fmtEur(costeBonificacionesMensual)})` : ''}</p>
    </div>
  </div>`);

  // Tipo interés chip
  if (tin) {
    const tipoLabel = tipo === 'fijo' ? `TIN fijo ${tin}%` : tipo === 'variable' ? `Euribor + ${tin}%` : `TIN mixto ${tin}%`;
    let compLabel = '';
    let compStatus = 'ok';
    if (tipo === 'fijo') {
      const taeComp = 3.5; // fixed market ref
      compStatus = tin <= taeComp ? 'ok' : tin <= taeComp + 1 ? 'warn' : 'bad';
      compLabel = tin <= taeComp ? 'Competitiva vs. mercado' : tin <= taeComp + 1 ? 'Ligeramente alta' : 'Por encima del mercado';
    } else {
      const spread = tin;
      compStatus = spread <= SPREAD_MERCADO ? 'ok' : spread <= SPREAD_MERCADO + 0.5 ? 'warn' : 'bad';
      compLabel = spread <= SPREAD_MERCADO ? `Diferencial competitivo (ref. mercado: +${SPREAD_MERCADO}%)` : spread <= SPREAD_MERCADO + 0.5 ? `Diferencial mejorable (ref. +${SPREAD_MERCADO}%)` : `Diferencial alto vs. mercado (+${SPREAD_MERCADO}%)`;
      if (euribor) compLabel += ` · Tipo aplicado actual: ${(euribor + spread).toFixed(2)}%`;
    }
    const statusEmoji = { ok: '🟢', warn: '🟡', bad: '🔴' }[compStatus];
    chips.push(`<div class="flex items-center gap-2 px-3 py-2 bg-white border border-gray-100 rounded-xl shadow-sm">
      <span class="text-base">${statusEmoji}</span>
      <div>
        <p class="text-xs font-semibold text-gray-600">${tipoLabel}</p>
        <p class="text-xs text-gray-800">${compLabel}</p>
      </div>
    </div>`);
  }

  // Bonificaciones chip
  if (bonificaciones.length > 0) {
    const BONI_LABEL = {
      seguro_hogar: 'Hogar', seguro_vida: 'Vida', nomina: 'Nómina',
      tarjetas: 'Tarjetas', plan_pensiones: 'Plan pensiones', alarma: 'Alarma'
    };
    const lista = bonificaciones.map(b => BONI_LABEL[b.tipo] || b.tipo).join(', ');
    const costeMensual = costeBonificacionesAnual / 12;
    const alertaBonif = costeBonificacionesAnual > 1500;
    chips.push(`<div class="flex items-center gap-2 px-3 py-2 bg-white border border-gray-100 rounded-xl shadow-sm">
      <span class="text-base">${alertaBonif ? '🟡' : '🔵'}</span>
      <div>
        <p class="text-xs font-semibold text-gray-600">Bonificaciones (${bonificaciones.length})</p>
        <p class="text-xs text-gray-800">${lista} · ${fmtEur(costeBonificacionesAnual)}/año (${fmtEur(costeMensual)}/mes)</p>
      </div>
    </div>`);
  }

  // Advisory notes
  const notas = [];

  if (costeBonificacionesAnual > 1200 && capital > 0) {
    const reduccionTinEquiv = ((costeBonificacionesAnual / capital) * 100).toFixed(2);
    notas.push(`Las bonificaciones te cuestan <strong>${fmtEur(costeBonificacionesAnual)}/año</strong>, equivalente a un ${reduccionTinEquiv}% adicional sobre tu capital. Compara si ese descuento en TIN compensa realmente ese gasto — en muchos casos los seguros del banco son más caros que en el mercado libre.`);
  }

  if (tipo === 'variable' && tin && euribor) {
    const tipoAplicado = euribor + tin;
    if (tipoAplicado > taeMercadoVariable + 0.5) {
      notas.push(`Tu tipo variable actual (${tipoAplicado.toFixed(2)}%) está por encima de la referencia de mercado (Euribor + ${SPREAD_MERCADO}% ≈ ${taeMercadoVariable.toFixed(2)}%). Puede valer la pena explorar una subrogación.`);
    }
  }

  if (tipo === 'fijo' && tin && tin > 3.5) {
    notas.push(`Tu tipo fijo del ${tin}% está por encima del mercado actual para hipotecas fijas (~3–3.5%). Si llevas pocos años de hipoteca, puede compensar estudiar una subrogación.`);
  }

  if (!bonificaciones.length && cuota > 0) {
    notas.push(`No tienes bonificaciones registradas. Si tu banco te ofrece descuentos de TIN a cambio de contratar seguros o productos, valora siempre el coste total real — a menudo el descuento es menor que el gasto.`);
  }

  const notasHtml = notas.length
    ? `<div class="mt-3 space-y-2">${notas.map(n => `<p class="text-xs text-gray-600 px-1">💡 ${n}</p>`).join('')}</div>`
    : '';

  return `
    <div class="mt-4 p-4 bg-amber-50 rounded-xl border border-amber-100">
      <p class="text-xs font-semibold text-amber-700 uppercase tracking-wide mb-3">🏦 Análisis de tu hipoteca</p>
      <div class="flex flex-wrap gap-3 mb-2">${chips.join('')}</div>
      ${notasHtml}
    </div>`;
}

// ─── Pension estimate ─────────────────────────────────────────────────────────

function renderPensionEstimate(step1, step2, step4) {
  const anios = Number(step1?.anios_cotizados) || 0;
  if (!anios) return '';

  const ingresosBrutos = Number(step2?.ingresos_brutos) || 0;
  const edad = Number(step1?.edad) || 0;
  const ANOS_COMPLETOS = 37;
  const EDAD_JUBILACION = 67;

  // Spanish system: 50% at 15 years, +3%/yr up to 25 (=80%), +2%/yr up to 37 (=100%)
  let pct = 0;
  if (anios >= 15 && anios <= 25) pct = 50 + (anios - 15) * 3;
  else if (anios > 25)            pct = 80 + Math.min(anios - 25, 12) * 2;
  pct = Math.min(100, pct);

  const anosRestantesCompleto = Math.max(0, ANOS_COMPLETOS - anios);
  const anosHastaJubilacion   = edad > 0 ? Math.max(0, EDAD_JUBILACION - edad) : null;

  const baseReguladora = ingresosBrutos > 0 ? ingresosBrutos / 12 : null;
  const MAX_PENSION = 3175;
  const pensionEstimada = baseReguladora ? Math.min(Math.round(baseReguladora * pct / 100), MAX_PENSION) : null;

  const rentaObjetivo = step4?.jubilacion?.renta_mensual || (ingresosBrutos > 0 ? Math.round(ingresosBrutos / 12 * 0.7) : null);
  const gapMensual = (pensionEstimada && rentaObjetivo)
    ? Math.max(0, rentaObjetivo - pensionEstimada)
    : null;

  const statusEmoji = pct >= 100 ? '🟢' : pct >= 70 ? '🔵' : pct >= 50 ? '🟡' : '🟠';
  const statusText  = pct >= 100 ? 'Cobertura completa'
    : pct >= 70 ? `${pct}% cubierto`
    : pct >= 50 ? `${pct}% — cobertura parcial`
    : anios < 15 ? 'Menos de 15 años — sin derecho aún'
    : `Solo ${pct}% — cobertura baja`;

  const chipsHtml = [
    `<div class="flex items-center gap-2 px-3 py-2 bg-white border border-gray-100 rounded-xl shadow-sm">
      <span class="text-base">${statusEmoji}</span>
      <div>
        <p class="text-xs font-semibold text-gray-600">Cotización</p>
        <p class="text-xs text-gray-800">${anios} años · ${statusText}</p>
      </div>
    </div>`,
    pensionEstimada ? `<div class="flex items-center gap-2 px-3 py-2 bg-white border border-gray-100 rounded-xl shadow-sm">
      <span class="text-base">🏛️</span>
      <div>
        <p class="text-xs font-semibold text-gray-600">Pensión estimada</p>
        <p class="text-xs text-gray-800">~${fmtEur(pensionEstimada)}/mes ${pct < 100 ? `(si jubiles hoy)` : ''}</p>
      </div>
    </div>` : '',
    gapMensual && gapMensual > 0 ? `<div class="flex items-center gap-2 px-3 py-2 bg-white border border-gray-100 rounded-xl shadow-sm">
      <span class="text-base">⚠️</span>
      <div>
        <p class="text-xs font-semibold text-gray-600">Brecha a cubrir</p>
        <p class="text-xs text-gray-800">~${fmtEur(gapMensual)}/mes no cubiertos</p>
      </div>
    </div>` : '',
    anosRestantesCompleto > 0 ? `<div class="flex items-center gap-2 px-3 py-2 bg-white border border-gray-100 rounded-xl shadow-sm">
      <span class="text-base">📅</span>
      <div>
        <p class="text-xs font-semibold text-gray-600">Para cobertura 100%</p>
        <p class="text-xs text-gray-800">${anosHastaJubilacion !== null && anosHastaJubilacion < anosRestantesCompleto
          ? `No alcanzarás los 37 años antes de los 67 — el plan de inversión cubre la diferencia`
          : `Faltan ${anosRestantesCompleto} años cotizando`}</p>
      </div>
    </div>` : '',
  ].filter(Boolean).join('');

  const rentaRef = rentaObjetivo ? `${fmtEur(rentaObjetivo)}/mes${step4?.jubilacion?.renta_mensual ? ' (objetivo definido)' : ' (70% ingresos actuales)'}` : 'tu objetivo de renta';
  const nota = gapMensual && gapMensual > 0
    ? `La brecha de <strong>${fmtEur(gapMensual)}/mes</strong> entre tu pensión estimada y ${rentaRef} es lo que tu cartera de inversión deberá cubrir en la jubilación — es uno de los inputs clave de tu plan.`
    : pct >= 100
    ? 'Con cobertura completa, la pensión pública cubrirá una parte sustancial de tus ingresos. Aun así, invertir mejora tu nivel de vida y protege contra inflación.'
    : 'Estima cuánto necesitarás en jubilación para saber qué parte deberá venir de tu cartera de inversión.';

  return `
    <section class="mb-8">
      <h2 class="text-lg font-semibold text-gray-900 mb-3">🏛️ Pensión pública estimada</h2>
      <div class="flex flex-wrap gap-3 mb-3">${chipsHtml}</div>
      <p class="text-xs text-gray-500 px-1">${nota}</p>
      <p class="text-xs text-gray-400 px-1 mt-1">Cálculo simplificado basado en el sistema de tramos español (2024). No incluye complementos mínimos ni actualizaciones de base reguladora. Actualiza los años cotizados en tu perfil si cambias de empleo.</p>
    </section>`;
}

// ─── Real estate panel ────────────────────────────────────────────────────────

function renderInmueblesPanel(inmuebles) {
  if (!inmuebles || inmuebles.length === 0) return '';

  const TIPO_LABEL = {
    vivienda_habitual:   '🏠 Vivienda habitual',
    vivienda_secundaria: '🏖️ Segunda residencia',
    alquiler:            '🏢 Alquiler',
    local_comercial:     '🏪 Local comercial',
    solar:               '📐 Solar / terreno',
  };

  const totalValor   = inmuebles.reduce((s, i) => s + (i.valor || 0), 0);
  const totalDeuda   = inmuebles.reduce((s, i) => s + (i.hipoteca_pendiente || 0), 0);
  const totalEquity  = totalValor - totalDeuda;
  const totalAlquiler = inmuebles.reduce((s, i) => s + (i.alquiler_renta || 0), 0);
  const ltv = totalValor > 0 ? ((totalDeuda / totalValor) * 100).toFixed(0) : 0;

  const rows = inmuebles.map(inm => {
    const equity = (inm.valor || 0) - (inm.hipoteca_pendiente || 0);
    const ltvInm = inm.valor > 0 ? ((inm.hipoteca_pendiente / inm.valor) * 100).toFixed(0) : 0;
    const rentaYield = (inm.alquiler_renta && inm.valor)
      ? ((inm.alquiler_renta * 12 / inm.valor) * 100).toFixed(1) : null;

    return `
      <div class="flex items-start justify-between gap-2 py-2 border-b border-gray-100 last:border-0">
        <div class="flex-1">
          <p class="text-sm font-medium text-gray-800">${TIPO_LABEL[inm.tipo] || inm.tipo}</p>
          <div class="flex flex-wrap gap-x-4 gap-y-0.5 mt-0.5 text-xs text-gray-500">
            <span>Valor: <strong class="text-gray-700">${fmtEur(inm.valor)}</strong></span>
            ${inm.hipoteca_pendiente > 0 ? `<span>Hipoteca: <strong class="text-gray-700">${fmtEur(inm.hipoteca_pendiente)}</strong>${inm.hipoteca_cuota > 0 ? ` (${fmtEur(inm.hipoteca_cuota)}/mes)` : ''}</span>` : ''}
            ${rentaYield ? `<span>Rentabilidad bruta: <strong class="text-green-700">${rentaYield}%</strong></span>` : ''}
            ${inm.anio_compra ? `<span>Comprado: ${inm.anio_compra}</span>` : ''}
          </div>
        </div>
        <div class="text-right shrink-0">
          <p class="text-sm font-semibold ${equity >= 0 ? 'text-green-700' : 'text-red-600'}">${fmtEur(equity)}</p>
          <p class="text-xs text-gray-400">equity${inm.hipoteca_pendiente > 0 ? ` · LTV ${ltvInm}%` : ''}</p>
        </div>
      </div>`;
  }).join('');

  const ltvStatus = ltv < 60 ? 'text-green-700' : ltv < 80 ? 'text-yellow-700' : 'text-red-600';

  return `
    <div class="mt-4 bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
      <div class="flex items-center justify-between mb-3">
        <h3 class="text-sm font-semibold text-gray-800">🏠 Patrimonio inmobiliario</h3>
        <div class="flex gap-4 text-xs">
          <span class="text-gray-500">Valor total: <strong class="text-gray-800">${fmtEur(totalValor)}</strong></span>
          <span class="text-gray-500">Equity neto: <strong class="${totalEquity >= 0 ? 'text-green-700' : 'text-red-600'}">${fmtEur(totalEquity)}</strong></span>
          ${totalDeuda > 0 ? `<span class="text-gray-500">LTV global: <strong class="${ltvStatus}">${ltv}%</strong></span>` : ''}
          ${totalAlquiler > 0 ? `<span class="text-gray-500">Ingresos alquiler: <strong class="text-green-700">${fmtEur(totalAlquiler)}/mes</strong></span>` : ''}
        </div>
      </div>
      ${rows}
      ${totalDeuda > 0 && ltv > 80 ? `<p class="mt-3 text-xs text-yellow-800 bg-yellow-50 rounded-lg px-3 py-2">⚠️ LTV por encima del 80%. Considera si tiene sentido amortizar hipoteca antes de invertir en activos de riesgo.</p>` : ''}
      ${totalAlquiler > 0 ? `<p class="mt-3 text-xs text-blue-800 bg-blue-50 rounded-lg px-3 py-2">💡 Los ingresos de alquiler cuentan como rendimientos del capital inmobiliario en IRPF. Si es tu vivienda habitual arrendada, aplica la reducción del 60% en la declaración.</p>` : ''}
    </div>`;
}

// ─── Existing investments ─────────────────────────────────────────────────────

function guessAssetClass(tipo) {
  if (tipo === 'deposito' || tipo === 'cuenta_remunerada') return 'cash';
  if (tipo === 'cripto') return 'crypto';
  return 'equities';
}

function analyzePortfolioFunds(inversiones) {
  inversiones = inversiones || [];
  const fundAnalyses = [];
  const indexGroupsCovered = {};
  let totalAmount = 0;
  let weightedTerNumerator = 0;

  inversiones.forEach(inv => {
    const importe = inv.importe || 0;
    totalAmount += importe;
    const isin = (inv.isin || '').toUpperCase().trim();
    const fundInfo = isin ? KNOWN_FUNDS[isin] : null;
    const ter = inv.ter || 0;
    let rating, issue, note;

    const years20Impact = (baseImporte, terDiff) => {
      const d = Math.max(0, terDiff) / 100;
      return Math.round(baseImporte * (Math.pow(1.07, 20) - Math.pow(Math.max(0.01, 1.07 - d), 20)));
    };

    if (inv.tipo === 'fondo_activo') {
      if (ter > 1.0) {
        const annualExtra = Math.round(importe * Math.max(0, ter - 0.25) / 100);
        const impact20 = years20Impact(importe, ter - 0.25);
        rating = 'bad';
        issue = `TER ${ter}% — estás pagando ~${fmtEur(annualExtra)}/año de más vs. un indexado equivalente. En 20 años esa diferencia puede suponer hasta ${fmtEur(impact20)} en rentabilidad perdida. El traspaso entre fondos no tributa.`;
      } else if (ter > 0.5) {
        rating = 'improvable';
        issue = `TER ${ter}% — algo alto para lo que ofrece. Fondos indexados equivalentes desde 0.10-0.30%, sin necesidad de pagar a un gestor activo que raramente bate al mercado.`;
      } else {
        rating = 'ok';
        note = 'Gestión activa con comisión razonable. Verifica que su historial justifique el coste vs. su benchmark.';
      }
    } else if (inv.tipo === 'fondo_indexado' || inv.tipo === 'etf') {
      if (fundInfo) {
        rating = 'excellent';
        note = fundInfo.note || 'Fondo indexado de bajo coste — buena elección.';
        if (!indexGroupsCovered[fundInfo.index_group]) {
          indexGroupsCovered[fundInfo.index_group] = { inv, fundInfo };
        }
        weightedTerNumerator += ter * importe;
      } else if (ter > 0.5) {
        rating = 'improvable';
        issue = `TER ${ter}% — inusualmente alto para un indexado. Puede existir una clase institucional más barata del mismo fondo — busca por el mismo nombre con otro sufijo (AE vs. AH, Acc vs. Dist).`;
      } else {
        rating = 'good';
        note = 'Fondo indexado con TER razonable. ISIN no encontrado en nuestro catálogo — verifica que sea un fondo de réplica física o sintética de un índice amplio.';
        weightedTerNumerator += ter * importe;
      }
    } else if (inv.tipo === 'plan_pensiones') {
      if (ter > 0.5) {
        const annualExtra = Math.round(importe * Math.max(0, ter - 0.15) / 100);
        const impact20 = years20Impact(importe, ter - 0.15);
        rating = 'improvable';
        issue = `TER ${ter}% — los mejores planes indexados cuestan 0.10-0.30%. Estás pagando ~${fmtEur(annualExtra)}/año de más, lo que puede suponer hasta ${fmtEur(impact20)} en 20 años. El traspaso entre planes no tributa.`;
      } else if (ter > 0) {
        rating = 'good';
        note = 'Plan de pensiones con comisiones razonables.';
      } else {
        rating = 'ok';
        note = 'Plan de pensiones — verifica que las comisiones sean inferiores al 0.3% anual. Los planes de bancos tradicionales suelen cobrar entre 1 y 2%, lo que puede suponer decenas de miles de euros perdidos a largo plazo.';
      }
    } else if (inv.tipo === 'deposito') {
      rating = 'ok';
      note = 'Depósito/cuenta — apropiado para liquidez. Si es tu fondo de emergencia, está en el sitio correcto. Si es dinero que no necesitarás en 3+ años, podría estar generando más en un fondo indexado.';
    } else if (inv.tipo === 'cripto') {
      const pct = totalAmount > 0 ? (importe / totalAmount) * 100 : 100;
      if (pct > 15) {
        rating = 'improvable';
        issue = `Cripto representa el ${Math.round(pct)}% de tu cartera — por encima del 10-15% que se considera razonable. Alta volatilidad y sin respaldo de activos reales. Bien como apuesta especulativa, pero con el resto bien diversificado.`;
      } else {
        rating = 'ok';
        note = `Posición en cripto dentro de un rango razonable (${Math.round(pct)}%). Bien como parte del portfolio siempre que el resto esté bien diversificado en activos más estables.`;
      }
    } else if (inv.tipo === 'crowdfunding') {
      rating = 'ok';
      note = 'El crowdfunding inmobiliario tiene rentabilidades atractivas pero con liquidez muy baja — no puedes sacar el dinero hasta que vence el proyecto. Bien como parte del portfolio si tienes el resto en inversiones más líquidas. No como inversión única.';
    } else if (inv.tipo === 'acciones') {
      const pct = totalAmount > 0 ? (importe / totalAmount) * 100 : 100;
      if (pct > 30) {
        rating = 'improvable';
        issue = `Acciones individuales representan el ${Math.round(pct)}% de tu cartera — alta concentración en pocos valores. Los fondos indexados globales diversifican en 1.500+ empresas con el mismo coste y menos riesgo específico.`;
      } else {
        rating = 'ok';
        note = 'Acciones individuales implican riesgo de concentración. Bien como parte del portfolio, pero conviene que la base esté en fondos diversificados.';
      }
    } else {
      rating = 'ok';
      note = null;
    }

    fundAnalyses.push({ inv, fundInfo, rating, issue, note });
  });

  const weightedTER = totalAmount > 0 ? weightedTerNumerator / totalAmount : 0;
  return { fundAnalyses, indexGroupsCovered, totalAmount, weightedTER };
}

// ─── Portfolio rationale ──────────────────────────────────────────────────────

function renderPortfolioRationale(riskProfile, data) {
  const { step1, step3, step4, step5 } = data;
  const profile = PROFILE_META[riskProfile] || PROFILE_META.moderado;
  const inversiones = step3?.inversiones || [];
  const totalInvertido = inversiones.reduce((s, i) => s + i.importe, 0);
  const objetivos = step4?.objetivos || [];
  const maxHorizon = objetivos.filter(o => o.plazo > 0).length > 0
    ? Math.max(...objetivos.filter(o => o.plazo > 0).map(o => o.plazo)) : 10;
  const horizonKey = getHorizonKey(maxHorizon);
  const allocation = ALLOCATIONS[riskProfile]?.[horizonKey] || {};
  const score = step5?.total || 0;
  const edad = step1?.edad;
  const estabilidad = step1?.estabilidad_ingresos;

  const bullets = [];
  if (edad) {
    if (edad <= 35) bullets.push(`Con ${edad} años el tiempo está de tu lado — el horizonte largo permite asumir más volatilidad a cambio de mayor rentabilidad esperada.`);
    else if (edad <= 50) bullets.push(`Con ${edad} años tienes un horizonte razonable para crecer en renta variable sin asumir riesgos innecesarios.`);
    else bullets.push(`Con ${edad} años la cartera prioriza consolidar y preservar lo que ya tienes, con menos exposición a volatilidad.`);
  }
  if (estabilidad === 'muy_estable' || estabilidad === 'estable') {
    bullets.push('Tus ingresos son estables — puedes mantener posiciones en momentos de caída sin necesidad de vender en mal momento.');
  } else if (estabilidad) {
    bullets.push('Con ingresos variables la cartera incluye mayor colchón de liquidez para evitar liquidar posiciones en momentos inoportunos.');
  }
  if (totalInvertido > 0) {
    bullets.push(`Ya tienes ${fmtEur(totalInvertido)} invertidos, lo que indica que conoces los mercados y gestionas bien la incertidumbre.`);
  } else {
    bullets.push('Partes desde cero en inversión financiera — el plan está diseñado para empezar con confianza y sin complejidad innecesaria.');
  }
  if (maxHorizon >= 10) bullets.push(`Tu objetivo más lejano está a ${maxHorizon} años — un horizonte largo que justifica mayor peso en renta variable.`);
  else if (maxHorizon >= 5) bullets.push(`Con un horizonte de ${maxHorizon} años la cartera equilibra crecimiento y estabilidad.`);
  else if (maxHorizon > 0) bullets.push(`Horizonte corto (${maxHorizon} años) — la cartera prioriza preservar capital sobre crecimiento agresivo.`);
  if (step5?.scores?.[5] === -1) bullets.push('En bajadas anteriores vendiste posiciones para limitar pérdidas — la cartera recomendada es ligeramente más conservadora para evitar decisiones emocionales en momentos de caída.');

  const allParts = [];
  if (allocation.equities) allParts.push(`${allocation.equities}% renta variable`);
  const rfLiq = (allocation.fixedIncome || 0) + (allocation.cash || 0);
  if (rfLiq > 0) allParts.push(`${rfLiq}% renta fija / liquidez`);
  if (allocation.alternatives >= 5) allParts.push(`${allocation.alternatives}% alternativos`);
  if (allocation.crypto >= 3) allParts.push(`${allocation.crypto}% cripto`);
  if (allocation.commodities >= 3) allParts.push(`${allocation.commodities}% materias primas`);

  const profileWhyText = {
    muy_conservador: 'Una cartera más agresiva te generaría ansiedad en las caídas — y eso suele terminar en ventas en el peor momento. El perfil conservador te permite mantener las posiciones cuando el mercado baja, que es lo que más importa para el resultado final.',
    conservador: 'Tu puntuación indica baja tolerancia a la volatilidad y/o un horizonte corto. Más riesgo podría traducirse en decisiones emocionales en caídas. El perfil conservador te da estabilidad para mantener el rumbo.',
    moderado: 'Tu horizonte razonable y tu capacidad para absorber algo de volatilidad justifican un equilibrio entre crecimiento y estabilidad. Uno más conservador recortaría demasiado la rentabilidad potencial; uno más agresivo requeriría aguantar caídas mayores de lo que tu situación hace aconsejable.',
    crecimiento: 'Tu horizonte largo, estabilidad de ingresos y tolerancia a la volatilidad justifican más peso en renta variable. Históricamente, más exposición a bolsa = mejor rentabilidad a largo plazo, pero también más caídas temporales. Tu puntuación indica que puedes asumir eso y esperar la recuperación.',
    agresivo: 'Tu perfil indica alta tolerancia al riesgo y horizonte largo. La cartera maximiza la exposición a renta variable — mayor potencial de crecimiento, y también más caídas en mercados bajistas. La clave es no vender cuando baja y tener el horizonte para recuperar.',
    muy_agresivo: 'Con puntuación máxima y horizonte muy largo, la cartera va a tope de renta variable y activos de alto crecimiento. Es la estrategia con más potencial y también la que puede caer más. Requiere convicción y no tocar el dinero cuando las cosas se pongan feas.',
  };
  const whyProfile = profileWhyText[riskProfile] || profileWhyText.moderado;

  return `
    <div class="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
      <div class="flex items-center gap-3 mb-4">
        <span class="text-3xl">${profile.emoji}</span>
        <div>
          <h3 class="font-semibold text-gray-900">¿Por qué eres un inversor ${profile.label}?</h3>
          <p class="text-xs text-gray-400">${score} puntos de perfil · horizonte ${horizonKey === 'short' ? 'corto' : horizonKey === 'medium' ? 'medio' : 'largo'} plazo</p>
        </div>
      </div>
      <ul class="space-y-2.5 mb-4">
        ${bullets.map(b => `<li class="flex gap-2.5 text-sm text-gray-700"><span class="text-blue-500 shrink-0 font-bold mt-0.5">→</span>${b}</li>`).join('')}
      </ul>
      ${allParts.length > 0 ? `
      <div class="pt-3 border-t border-gray-100">
        <p class="text-xs text-gray-500">Asignación objetivo: <strong>${allParts.join(' · ')}</strong></p>
      </div>` : ''}
    </div>
    <details class="mt-4 group">
      <summary class="cursor-pointer select-none list-none flex items-center justify-between bg-white rounded-2xl border border-gray-100 shadow-sm px-5 py-4 hover:bg-gray-50 transition-colors">
        <span class="text-sm font-semibold text-gray-700">💡 Entender mi recomendación</span>
        <span class="text-gray-400 text-xs group-open:hidden">▼ leer más</span>
        <span class="text-gray-400 text-xs hidden group-open:inline">▲ cerrar</span>
      </summary>
      <div class="mt-2 bg-white rounded-2xl border border-gray-100 shadow-sm p-6 space-y-5">
        <div>
          <h4 class="text-sm font-semibold text-gray-900 mb-1.5">¿Por qué fondos indexados y no fondos de gestión activa?</h4>
          <p class="text-sm text-gray-600 leading-relaxed">Los fondos activos los gestiona un equipo que intenta batir al mercado. La mayoría no lo consigue de forma consistente — y cobran entre 10 y 20 veces más por intentarlo. Los fondos indexados simplemente replican el mercado global, sin sorpresas, con comisiones entre 0.10% y 0.30% al año. Históricamente, la diferencia en rentabilidad neta de comisiones a 20 años es enorme. Para la gran mayoría de inversores, es la opción más eficiente y predecible.</p>
        </div>
        <div class="pt-4 border-t border-gray-100">
          <h4 class="text-sm font-semibold text-gray-900 mb-1.5">¿Por qué este perfil de riesgo y no uno más conservador o más agresivo?</h4>
          <p class="text-sm text-gray-600 leading-relaxed">${whyProfile}</p>
        </div>
        <div class="pt-4 border-t border-gray-100">
          <h4 class="text-sm font-semibold text-gray-900 mb-1.5">¿Por qué estas plataformas y no el banco?</h4>
          <p class="text-sm text-gray-600 leading-relaxed">Tu banco probablemente ofrece fondos también. El problema es que cobran entre 3 y 5 veces más en comisiones. En 20 años, esa diferencia puede suponer decenas de miles de euros en rentabilidad perdida. Las plataformas que te mostramos están reguladas por la CNMV, tienen las mismas garantías legales que un banco, y cobran entre 10 y 20 veces menos. No hay truco — simplemente compiten en precio porque no tienen red de oficinas que financiar.</p>
        </div>
      </div>
    </details>`;
}

// ─── Objectives ───────────────────────────────────────────────────────────────

function renderObjectivesAnalysis(objetivos, riskProfile, ahorro_mensual) {
  const alloc_all = ALLOCATIONS[riskProfile];
  let html = '';
  const ahorroPerObj = objetivos.length > 0 ? ahorro_mensual / objetivos.length : 0;

  const labels = {
    jubilacion: '🏖️ Jubilación', vivienda: '🏠 Vivienda', independencia: '🦋 Independencia financiera',
    educacion: '🎓 Educación', viaje_proyecto: '✈️ Proyecto personal', coche: '🚗 Coche',
    negocio: '💼 Negocio', proyecto: '✈️ Proyecto personal', colchon: '🛡️ Colchón', otro: '🎯 Objetivo',
  };

  objetivos.forEach(obj => {
    if (!obj.plazo || obj.plazo <= 0) return;
    const horizonKey = getHorizonKey(obj.plazo);
    const allocation = alloc_all[horizonKey];
    const blended = calcBlendedReturn(allocation);
    const initialCapital = obj.tipo === 'vivienda' ? (obj.ya_ahorrado || 0) : 0;
    const projected = calcProjection(initialCapital, ahorroPerObj, blended, obj.plazo);
    const onTrack = obj.importe > 0 ? projected >= obj.importe : true;
    const needed = obj.importe > 0 ? calcNeededMonthly(obj.importe - initialCapital, blended, obj.plazo) : 0;

    html += `
      <div class="product-card mb-4">
        <div class="flex items-start justify-between mb-3">
          <div>
            <h3 class="font-semibold text-gray-900">${obj.label || labels[obj.tipo] || obj.tipo}</h3>
            <p class="text-sm text-gray-500">Plazo: ${obj.plazo} años${obj.importe > 0 ? ` · Importe: ${fmtEur(obj.importe)}` : ''}</p>
          </div>
          ${obj.importe > 0 ? `<span class="tag ${onTrack ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'}">${onTrack ? '✅ Alcanzable' : '⚠️ Revisar'}</span>` : ''}
        </div>
        <div class="bg-gray-50 rounded-lg p-3 text-sm">
          <p class="text-gray-700">Con <strong>${Math.round(ahorroPerObj).toLocaleString('es-ES')} €/mes</strong> y un retorno estimado del <strong>${(blended * 100).toFixed(1)}%/año</strong>, proyectamos <strong>${fmtEur(projected)}</strong> en ${obj.plazo} años.</p>
          ${(!onTrack && needed > 0) ? `<p class="text-yellow-700 mt-2">Para alcanzar ${fmtEur(obj.importe)} necesitarías destinar <strong>${fmtEur(needed)}/mes</strong> a este objetivo.</p>` : ''}
        </div>
        <div class="mt-3">
          <p class="text-xs font-semibold text-gray-500 mb-2">Asignación recomendada:</p>
          ${renderAllocationBar(allocation)}
        </div>
      </div>`;
  });

  return html || '<p class="text-gray-400 text-sm">No definiste objetivos con plazo e importe. Vuelve al cuestionario y completa el paso 4.</p>';
}

function renderAllocationBar(allocation) {
  const colors = {
    equities: 'bg-blue-500', fixedIncome: 'bg-green-500', alternatives: 'bg-purple-500',
    cash: 'bg-gray-300', crypto: 'bg-orange-500', commodities: 'bg-yellow-500',
  };
  const labels = {
    equities: 'Renta Variable', fixedIncome: 'Renta Fija', alternatives: 'Inmobiliario',
    cash: 'Liquidez', crypto: 'Criptos', commodities: 'Commodities',
  };
  const entries = Object.entries(allocation).filter(([, v]) => v > 0);
  const bar = entries.map(([k, v]) => `<div class="${colors[k]} h-full" style="width:${v}%" title="${labels[k]}: ${v}%"></div>`).join('');
  const legend = entries.map(([k, v]) =>
    `<span class="flex items-center gap-1 text-xs text-gray-600"><span class="w-2.5 h-2.5 rounded-sm inline-block ${colors[k]}"></span>${labels[k]} ${v}%</span>`
  ).join('');
  return `<div class="h-3 rounded-full overflow-hidden flex mb-2">${bar}</div><div class="flex flex-wrap gap-x-3 gap-y-1">${legend}</div>`;
}

// ─── Platform context detection ──────────────────────────────────────────────

function detectUserPlatformContext(inversiones) {
  inversiones = inversiones || [];
  const byAmount = {};
  let switchSavings = 0, highFeeTotal = 0;
  inversiones.forEach(inv => {
    const plat = inv.plataforma || '';
    if (plat) byAmount[plat] = (byAmount[plat] || 0) + (inv.importe || 0);
    if (inv.tipo === 'fondo_activo' && (inv.ter || 0) > 0.5) {
      switchSavings += Math.round((inv.importe || 0) * Math.max(0, (inv.ter - 0.20)) / 100);
      highFeeTotal += (inv.importe || 0);
    }
  });
  const primaryPlatform = Object.entries(byAmount).sort((a, b) => b[1] - a[1])[0]?.[0] || null;
  return {
    primaryPlatform,
    hasIndexa: !!byAmount['indexa'],
    hasMyInvestor: !!byAmount['myinvestor'],
    hasHighFeeFunds: highFeeTotal > 0,
    switchSavings,
    highFeeTotal,
  };
}

// ─── Current portfolio analysis section ──────────────────────────────────────

function renderCurrentPortfolioAnalysis(inversiones) {
  inversiones = inversiones || [];
  if (inversiones.length === 0) return '';

  const analysis = analyzePortfolioFunds(inversiones);
  const { fundAnalyses, totalAmount, weightedTER } = analysis;

  const RATING_META = {
    excellent: { icon: '✅', label: 'Buena elección', color: 'text-green-700',  border: 'border-green-100',  bg: '' },
    good:      { icon: '✅', label: 'Correcto',        color: 'text-green-700',  border: 'border-green-100',  bg: '' },
    ok:        { icon: '🔵', label: 'Neutro',          color: 'text-blue-600',   border: 'border-gray-100',   bg: '' },
    improvable:{ icon: '⚠️', label: 'Mejorable',       color: 'text-amber-700',  border: 'border-amber-200',  bg: 'bg-amber-50' },
    bad:       { icon: '❌', label: 'Revisar',          color: 'text-red-700',    border: 'border-red-200',    bg: 'bg-red-50' },
  };

  const cardsHtml = fundAnalyses.map(({ inv, fundInfo, rating, issue, note }) => {
    const meta = RATING_META[rating] || RATING_META.ok;
    const displayName = fundInfo?.name
      || inv.nombre
      || (inv.isin ? `Fondo ${inv.isin}` : (inv.tipo?.replace(/_/g, ' ') || 'Inversión'));
    const isinPill = inv.isin
      ? `<span class="font-mono text-xs bg-gray-100 text-gray-500 px-1.5 py-0.5 rounded">${inv.isin}</span>`
      : '';
    const detail = issue || note || '';
    const platStr = inv.plataforma ? ` · ${inv.plataforma}` : '';
    const terStr = inv.ter ? ` · TER ${inv.ter}%` : '';

    return `<div class="flex items-start gap-3 p-3 bg-white rounded-xl border ${meta.border} ${meta.bg} mb-2">
      <span class="text-base mt-0.5 shrink-0">${meta.icon}</span>
      <div class="flex-1 min-w-0">
        <div class="flex items-center gap-2 flex-wrap mb-0.5">
          <span class="font-semibold text-sm text-gray-900">${displayName}</span>
          ${isinPill}
        </div>
        <p class="text-xs text-gray-500 mb-0.5"><strong>${fmtEur(inv.importe || 0)}</strong>${terStr}${platStr}</p>
        ${detail ? `<p class="text-xs ${meta.color} leading-snug">${detail}</p>` : ''}
      </div>
      <span class="text-xs font-semibold ${meta.color} shrink-0 mt-0.5">${meta.label}</span>
    </div>`;
  }).join('');

  const hasStockOptions = inversiones.some(i => i.tipo === 'stock_options');
  const stockOptionsWarning = hasStockOptions
    ? `<div class="mb-3 p-3 bg-amber-50 border border-amber-200 rounded-xl text-sm text-amber-800">
        ⚠️ <strong>Concentración en empleador:</strong> Tienes acciones u opciones de tu empresa. Combinas riesgo laboral e inversor en el mismo activo — si la empresa va mal, pierdes ingresos e inversión al mismo tiempo. Diversifica gradualmente al hacer vesting vendiendo y reinvirtiendo en fondos indexados globales.
      </div>`
    : '';

  const badCount    = fundAnalyses.filter(a => a.rating === 'bad').length;
  const improvCount = fundAnalyses.filter(a => a.rating === 'improvable').length;

  let verdictHtml;
  if (badCount > 0) {
    const annualWaste = fundAnalyses
      .filter(a => a.rating === 'bad')
      .reduce((s, a) => s + Math.round((a.inv.importe || 0) * Math.max(0, (a.inv.ter || 0) - 0.25) / 100), 0);
    verdictHtml = `<div class="mb-4 p-3 bg-red-50 border border-red-200 rounded-xl text-sm text-red-800">
      <strong>Hay ${badCount} posición${badCount > 1 ? 'es' : ''} a revisar.</strong>${annualWaste > 0 ? ` Estás pagando ~${fmtEur(annualWaste)}/año de más en comisiones. El traspaso a fondos indexados no tributa.` : ''}
    </div>`;
  } else if (improvCount > 0) {
    verdictHtml = `<div class="mb-4 p-3 bg-amber-50 border border-amber-200 rounded-xl text-sm text-amber-800">
      <strong>Cartera mayormente bien construida</strong> con ${improvCount} punto${improvCount > 1 ? 's' : ''} de mejora. Las recomendaciones de abajo lo tienen en cuenta.
    </div>`;
  } else {
    verdictHtml = `<div class="mb-4 p-3 bg-green-50 border border-green-200 rounded-xl text-sm text-green-800">
      <strong>✅ Cartera bien construida.</strong> Fondos indexados de bajo coste y buena estructura. Las recomendaciones mantienen lo que tienes y proponen ajustes solo si son necesarios.
    </div>`;
  }

  const terLine = weightedTER > 0.01 ? ` · TER medio ${weightedTER.toFixed(2)}%` : '';

  return `<section class="mb-10">
    <h2 class="text-lg font-semibold text-gray-900 mb-1">🔍 Tu cartera actual</h2>
    <p class="text-xs text-gray-400 mb-4">${fmtEur(totalAmount)} · ${fundAnalyses.length} posición${fundAnalyses.length !== 1 ? 'es' : ''}${terLine}</p>
    ${stockOptionsWarning}
    ${verdictHtml}
    ${cardsHtml}
  </section>`;
}

function findEquivalentUserFund(blueprintProduct, analysis) {
  if (!blueprintProduct.isin) return null;
  const bpInfo = KNOWN_FUNDS[blueprintProduct.isin];
  if (!bpInfo) return null;

  const direct = analysis.indexGroupsCovered[bpInfo.index_group];
  if (direct) return { ...direct, partial: false };

  // S&P 500 partially covers world_equity — flag but don't fully substitute
  if (bpInfo.index_group === 'world_equity' && analysis.indexGroupsCovered['sp500']) {
    return { ...analysis.indexGroupsCovered['sp500'], partial: true };
  }

  return null;
}

// ─── Products ─────────────────────────────────────────────────────────────────

function renderPlatformSection({ title, subtitle, platforms, riskProfile, disclaimer = false, warning = null, compact = false }) {
  const cardHtml = platforms.map(p => {
    const isBadged = !!p.badge;
    const borderClass = isBadged ? 'border-blue-300 shadow-md' : 'border-gray-200 shadow-sm';
    const estReturn = p.est_returns ? (p.est_returns[riskProfile] || '') : (p.est_return || '');
    const returnLine = estReturn ? `<span class="text-xs text-green-700 font-medium">📈 ~${estReturn}</span>` : '';

    const prosHtml = p.pros.slice(0, compact ? 2 : 3).map(pro =>
      `<li class="flex items-start gap-1.5 text-xs text-gray-600"><span class="text-green-500 shrink-0 font-bold">✓</span><span>${pro}</span></li>`
    ).join('');
    const conHtml = (p.cons || []).slice(0, 1).map(con =>
      `<li class="flex items-start gap-1.5 text-xs text-gray-400"><span class="text-gray-300 shrink-0 font-bold">−</span><span>${con}</span></li>`
    ).join('');

    return `
      <div class="relative p-4 bg-white rounded-xl border-2 ${borderClass} flex flex-col">
        ${isBadged ? `<span class="absolute -top-3 left-3 bg-blue-600 text-white text-xs font-bold px-2.5 py-0.5 rounded-full whitespace-nowrap">${p.badge}</span>` : ''}
        <div class="flex items-start gap-2.5 ${isBadged ? 'mt-1.5' : ''}">
          <span class="text-2xl shrink-0 leading-none mt-0.5">${p.logo}</span>
          <div class="min-w-0 flex-1">
            <p class="font-bold text-gray-900 text-sm leading-tight">${p.name}</p>
            <p class="text-xs text-gray-500 mt-0.5 leading-tight">${p.fees}${p.min && p.min !== 'Sin mínimo' ? ' · Mín ' + p.min : (p.min === 'Sin mínimo' ? ' · Sin mínimo' : '')}</p>
            ${returnLine ? `<div class="mt-1">${returnLine}</div>` : ''}
          </div>
        </div>
        <ul class="mt-3 space-y-1 flex-1">${prosHtml}${conHtml}</ul>
        <a href="${p.url}" target="_blank" rel="noopener noreferrer"
          class="mt-3 block text-center py-2 bg-blue-600 text-white text-sm font-semibold rounded-lg hover:bg-blue-700 transition-colors">
          Ver plataforma →
        </a>
      </div>`;
  }).join('');

  const cols = platforms.length === 2 ? 'sm:grid-cols-2' : platforms.length >= 3 ? 'sm:grid-cols-2 lg:grid-cols-3' : '';
  const warningHtml = warning
    ? `<div class="mt-3 p-3 bg-amber-50 border border-amber-200 rounded-xl text-xs text-amber-800">${warning}</div>` : '';
  const disclaimerHtml = disclaimer
    ? `<p class="text-xs text-gray-400 text-center mt-2">🔍 No recibimos ningún pago por estas recomendaciones</p>` : '';

  return `
    <section class="mb-8">
      <h2 class="text-sm font-bold text-gray-800 uppercase tracking-wide mb-1">${title}</h2>
      <p class="text-xs text-gray-500 leading-relaxed mb-4">${subtitle}</p>
      <div class="grid grid-cols-1 ${cols} gap-3">${cardHtml}</div>
      ${warningHtml}${disclaimerHtml}
    </section>`;
}

function renderDiyPortfolioSection(blueprint, riskProfile, inversiones) {
  const portfolioAnalysis = analyzePortfolioFunds(inversiones);
  let inner = '';

  blueprint.products.forEach(p => {
    const weightBadge = p.pct ? `<span class="tag bg-blue-50 text-blue-700 text-xs font-semibold">${p.pct}%</span>` : '';
    const isinBadge = p.isin ? `<span class="tag bg-gray-100 text-gray-500 font-mono text-xs">${p.isin}</span>` : '';
    const equivalent = findEquivalentUserFund(p, portfolioAnalysis);

    if (equivalent && !equivalent.partial) {
      const existingName = equivalent.fundInfo?.name || equivalent.inv?.isin || 'tu fondo actual';
      const existingIsin = equivalent.inv?.isin || '';
      inner += `
        <div class="flex items-center gap-3 p-3 bg-green-50 rounded-xl border border-green-200">
          <span class="text-xl shrink-0">✅</span>
          <div class="flex-1 min-w-0">
            <div class="flex items-center gap-2 flex-wrap">
              <span class="font-semibold text-green-900 text-sm">Mantén: ${existingName}</span>
              ${existingIsin ? `<span class="tag bg-gray-100 text-gray-500 font-mono text-xs">${existingIsin}</span>` : ''}${weightBadge}
            </div>
            <p class="text-xs text-green-700 mt-0.5">Ya cubre el papel de «${p.name}» — no necesitas cambiar nada.</p>
          </div>
        </div>`;
    } else if (equivalent && equivalent.partial) {
      const existingName = equivalent.fundInfo?.name || equivalent.inv?.isin || 'tu fondo actual';
      inner += `
        <div class="flex items-center gap-3 p-3 bg-amber-50 rounded-xl border border-amber-200">
          <span class="text-xl shrink-0">⚠️</span>
          <div class="flex-1 min-w-0">
            <div class="flex items-center gap-2 flex-wrap">
              <span class="font-semibold text-amber-900 text-sm">Tienes: ${existingName}</span>
              ${weightBadge}
            </div>
            <p class="text-xs text-amber-700 mt-0.5">Cubre ~65% del MSCI World (solo EE.UU.). Considera añadir mercados internacionales para completar la cobertura global.</p>
          </div>
        </div>`;
    } else {
      const compositionHtml = p.composition ? `
        <div class="mt-2 pt-2 border-t border-gray-100">
          <p class="text-xs font-medium text-gray-400 mb-1">Fondos incluidos</p>
          <div class="grid grid-cols-2 gap-x-4 gap-y-0.5">
            ${p.composition.map(f => `<div class="flex items-center justify-between text-xs"><span class="text-gray-500 truncate">${f.name}</span><span class="font-semibold text-gray-700 ml-2 shrink-0">${f.pct}%</span></div>`).join('')}
          </div>
        </div>` : '';
      const estReturnBadge = p.est_return
        ? `<span class="inline-block mt-1.5 text-xs bg-green-50 text-green-700 px-2 py-0.5 rounded-full border border-green-100 font-medium">📈 ${p.est_return}</span>`
        : '';
      inner += `
        <div class="p-3 bg-white rounded-xl border border-gray-100 shadow-sm">
          <div class="flex items-center gap-3">
            <span class="text-xl shrink-0">${p.logo}</span>
            <div class="flex-1 min-w-0">
              <div class="flex items-center gap-2 flex-wrap">
                <span class="font-semibold text-gray-900 text-sm">${p.name}</span>
                ${isinBadge}${weightBadge}
              </div>
              <p class="text-xs text-gray-400 mt-0.5">${p.fees}${p.min ? ' · mín. ' + p.min : ''}</p>
              ${p.rationale ? `<p class="text-xs text-gray-500 mt-0.5">${p.rationale}</p>` : ''}
              ${estReturnBadge}
            </div>
            <a href="${p.url}" target="_blank" rel="noopener"
              class="shrink-0 px-2.5 py-1.5 text-xs font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-colors whitespace-nowrap">
              ${p.platform} →
            </a>
          </div>
          ${compositionHtml}
        </div>`;
    }
  });

  const labelHtml = blueprint.label
    ? `<p class="text-sm font-semibold text-gray-700 mb-1">${blueprint.label}</p>`
    : '';

  return `
    <section class="mb-8">
      <h2 class="text-sm font-bold text-gray-800 uppercase tracking-wide mb-1">📊 Tu cartera de fondos indexados</h2>
      ${labelHtml}
      <p class="text-xs text-gray-500 leading-relaxed mb-3">${blueprint.description}</p>
      <div class="space-y-2">${inner}</div>
      <p class="text-xs text-gray-400 mt-3 px-1">💡 Revisa y rebalancea una vez al año. El traspaso entre fondos de inversión no tributa en España.</p>
    </section>`;
}

function renderProductCards(riskProfile, objetivos, ccaa, inversiones, step1, step5) {
  const complexity = getPortfolioComplexity(step1, step5);
  const blueprint = PORTFOLIO_BLUEPRINTS[riskProfile]?.[complexity];
  if (!blueprint) return '<p class="text-gray-400 text-sm">No hay cartera disponible para tu perfil.</p>';

  const ctx = detectUserPlatformContext(inversiones);
  const horizonKey = objetivos.length > 0
    ? getHorizonKey(Math.max(...objetivos.filter(o => o.plazo > 0).map(o => o.plazo), 1))
    : getHorizonKey(20);
  const allocation = ALLOCATIONS[riskProfile]?.[horizonKey] || {};
  const isManaged = !!blueprint.managed;
  const isSavingsMode = !!blueprint.savings_mode;
  const showRealEstate = (allocation.alternatives || 0) > 0 && complexity >= 2;
  const showCrypto = riskProfile === 'dinamico' || riskProfile === 'agresivo';
  const isEpsv = ccaa === 'PVA';

  // Context banner (high fee funds alert)
  let contextBanner = '';
  if (ctx.hasHighFeeFunds) {
    contextBanner = `
      <div class="mb-6 p-3 bg-amber-50 border border-amber-200 rounded-xl">
        <p class="text-sm font-semibold text-amber-800">⚠️ Tienes fondos de gestión activa con comisiones altas</p>
        <p class="text-xs text-amber-700 mt-1">Traspasándolos a fondos indexados ahorrarías ~<strong>${fmtEur(ctx.switchSavings)}/año</strong> en comisiones. El traspaso entre fondos de inversión es <strong>sin coste fiscal en España</strong>.</p>
      </div>`;
  }

  let html = contextBanner;

  // ── Section 1: Main investment ────────────────────────────────────────────
  if (isSavingsMode) {
    html += renderPlatformSection({
      title: '💰 Ahorra primero, invierte después',
      subtitle: `Con menos de 3.000€ lo mejor es un depósito remunerado mientras llegas al mínimo de los roboadvisores. Apunta al ${PLATFORMS.roboadvisors[0].name} cuando llegues.`,
      platforms: PLATFORMS.savings,
      riskProfile,
      disclaimer: false,
    });
    html += `<div class="mb-6 p-3 bg-blue-50 border border-blue-100 rounded-xl text-sm text-blue-800">
      💡 <strong>Objetivo: 3.000€</strong> — Cuando llegues, traspasa a un roboadvisor indexado. Rentabilidad esperada ~${PLATFORMS.roboadvisors[0].est_returns[riskProfile]}/año, comisión total ~0.4–0.5%/año.
    </div>`;
    html += renderPlatformSection({
      title: '📊 Tu próximo paso — roboadvisor indexado',
      subtitle: 'Para cuando superes los 3.000€. Compara las mejores opciones del mercado español:',
      platforms: PLATFORMS.roboadvisors.slice(0, 3),
      riskProfile,
      disclaimer: true,
      compact: true,
    });
  } else if (isManaged) {
    const advisors = showCrypto ? PLATFORMS.roboadvisors : PLATFORMS.roboadvisors.filter(p => p.id !== 'inbestme');
    html += renderPlatformSection({
      title: '📊 Las mejores carteras gestionadas para tu perfil',
      subtitle: `Elige una plataforma, configura tu perfil de riesgo, aporta mensualmente — ellos invierten y rebalancean por ti. Rentabilidad esperada ~${PLATFORMS.roboadvisors[0].est_returns[riskProfile]}/año.`,
      platforms: advisors,
      riskProfile,
      disclaimer: true,
    });
  } else {
    // DIY mode: ETF portfolio + broker comparison
    html += renderDiyPortfolioSection(blueprint, riskProfile, inversiones);
    html += renderPlatformSection({
      title: '🏦 Dónde comprar estos fondos y ETFs',
      subtitle: 'Compara los mejores brokers y plataformas de fondos del mercado español — elige uno y contrata los productos de arriba:',
      platforms: PLATFORMS.brokers,
      riskProfile,
      disclaimer: false,
    });

    // ── Archetype alternatives ───────────────────────────────────────────────
    const matchingArchetypes = ARCHETYPE_BLUEPRINTS.filter(a =>
      a.profiles.includes(riskProfile) && complexity >= a.min_complexity
    );
    if (matchingArchetypes.length > 0) {
      html += `
        <div class="mt-10 mb-4">
          <h3 class="text-base font-semibold text-gray-800 mb-1">📐 Estrategias alternativas</h3>
          <p class="text-xs text-gray-500">Carteras con filosofías distintas pero igualmente válidas para tu perfil. Compáralas con la de arriba y elige la que más encaje contigo.</p>
        </div>`;
      matchingArchetypes.forEach(arch => {
        html += renderDiyPortfolioSection(arch, riskProfile, inversiones);
      });
    }
  }

  // ── Section 2: Savings / cash ─────────────────────────────────────────────
  if (!isSavingsMode) {
    html += renderPlatformSection({
      title: '💰 Ahorro remunerado — para tu liquidez y fondo de emergencia',
      subtitle: 'Mantén aquí tu fondo de emergencia y el efectivo que aún no has invertido. Hasta un 3.8% TAE sin riesgo, con liquidez inmediata.',
      platforms: PLATFORMS.savings,
      riskProfile,
      disclaimer: false,
    });
  }

  // ── Section 3: Real estate crowdfunding ──────────────────────────────────
  if (showRealEstate) {
    const reAlloc = allocation.alternatives || 0;
    html += renderPlatformSection({
      title: `🏢 Diversificación inmobiliaria (${reAlloc}% de tu cartera)`,
      subtitle: 'Crowdfunding inmobiliario regulado por CNMV — accede a proyectos de promotora desde 250–500€ como complemento a tu cartera indexada.',
      platforms: PLATFORMS.real_estate,
      riskProfile,
      disclaimer: false,
      warning: '⚠️ Activos ilíquidos (12–36 meses). Solo para capital que no vayas a necesitar a corto plazo. Las rentabilidades proyectadas no son garantizadas.',
    });
  }

  // ── Section 4: Crypto ─────────────────────────────────────────────────────
  if (showCrypto) {
    const cryptoAlloc = allocation.crypto || 0;
    const cryptoLabel = cryptoAlloc > 0 ? `${cryptoAlloc}% de tu cartera` : 'máximo 5% como satélite';
    html += renderPlatformSection({
      title: `₿ Criptomonedas (${cryptoLabel})`,
      subtitle: 'Solo si aceptas alta volatilidad. Limita a BTC y ETH — el resto son activos especulativos. Usa siempre exchanges regulados.',
      platforms: PLATFORMS.crypto,
      riskProfile,
      disclaimer: false,
      warning: '⚠️ Activo de muy alto riesgo. Nunca inviertas más de lo que puedas perder completamente. Los saldos en exchanges no tienen garantía FGD.',
    });
  }

  // ── Section 5: Pension plans ──────────────────────────────────────────────
  const pensionSubtitle = isEpsv
    ? 'EPSV (Euskadi): hasta 5.000€/año deducibles en IRPF foral, más eficiente que el plan de pensiones estándar. Para plan de pensiones convencional, MyInvestor o Finizens son excelentes opciones.'
    : 'Plan de pensiones indexado: deducción directa en IRPF (límite 1.500€/año individual). Aporta cada enero para maximizar el tiempo en mercado. El traspaso desde otro plan no tributa.';
  html += renderPlatformSection({
    title: '🏦 Plan de pensiones indexado (deducción IRPF)',
    subtitle: pensionSubtitle,
    platforms: PLATFORMS.pensions,
    riskProfile,
    disclaimer: false,
  });

  return html;
}

// ─── Action plan ──────────────────────────────────────────────────────────────

function renderActionPlan(health, riskProfile, data) {
  const { step1, step2 } = data;
  const deuda_tae = step2?.deuda_tae || {};

  const urgentItems = [];
  if (health.hasTarjeta) {
    const tae = deuda_tae.tarjeta;
    const advice = tae === 'baja'
      ? 'Tienes tarjeta de crédito con saldo. Aunque el interés es bajo, liquida primero antes de invertir para no arrastrar coste financiero innecesario.'
      : 'Liquida la deuda en tarjeta de crédito antes que todo lo demás. Con TAE de hasta 18-28%, cancelarla es la inversión con mayor rentabilidad garantizada que puedes hacer ahora mismo.';
    urgentItems.push({ icon: '🔴', text: advice });
  }
  const deudas = step2?.deudas || 0;
  if (!health.hasTarjeta && deudas > 0 && (step2?.tipos_deuda || []).includes('prestamo_personal')) {
    const tae = deuda_tae.prestamo_personal;
    let deudaText;
    if (tae === 'alta') {
      deudaText = `Tienes un préstamo personal con interés alto (>8%). Amortiza antes de invertir — el rendimiento libre de riesgo que obtienes es superior a cualquier depósito o renta fija conservadora.`;
    } else if (tae === 'media') {
      deudaText = `Tienes un préstamo personal con interés medio (3–8%). Amortiza en paralelo a invertir: reparte el ahorro entre amortización anticipada y cartera para no perder el beneficio del tiempo en mercado.`;
    } else {
      deudaText = `Tienes un préstamo personal con interés bajo (<3%). Puedes invertir en paralelo sin problema — el rendimiento esperado de tu cartera supera el coste de la deuda.`;
    }
    urgentItems.push({ icon: tae === 'alta' ? '🔴' : '🟡', text: deudaText });
  }
  if ((step2?.tipos_deuda || []).includes('coche') && deuda_tae.coche === 'alta') {
    urgentItems.push({ icon: '🟡', text: 'Tienes financiación de coche con tipo alto. Valora amortizar anticipadamente si no hay penalización — el ahorro en intereses es inmediato.' });
  }
  if (health.emergencyStatus === 'bad') {
    urgentItems.push({ icon: '🔴', text: `Tu fondo de emergencia recomendado es <strong>${fmtEur(health.gastosMensuales * 3)}</strong> (3 meses de gastos). Prioriza acumularlo antes de invertir — sin este colchón, un imprevisto te obliga a vender en el peor momento.` });
  } else if (health.emergencyStatus === 'warn') {
    urgentItems.push({ icon: '🟡', text: `Tu fondo de emergencia recomendado es <strong>${fmtEur(health.gastosMensuales * 6)}</strong> (6 meses de gastos). Estás en camino — reserva parte del ahorro mensual hasta completarlo.` });
  }

  if (urgentItems.length === 0) {
    return '';
  }

  return `
    <div class="mb-10">
      <div class="p-4 bg-red-50 border border-red-100 rounded-2xl">
        <h2 class="font-semibold text-red-800 text-lg mb-3">⚡ Prioridades urgentes</h2>
        <div class="space-y-2">
          ${urgentItems.map(item => `<div class="flex gap-3 items-start"><span class="shrink-0 mt-0.5">${item.icon}</span><p class="text-sm text-red-700">${item.text}</p></div>`).join('')}
        </div>
      </div>
    </div>`;
}

function buildMonthlyAllocationSection(ahorro, allocation, riskProfile, isEpsv, laboral, tramo, inversiones, step1, step5, step2) {
  inversiones = inversiones || [];
  const hasTax = laboral === 'asalariado' || laboral === 'autonomo';
  const complexity = getPortfolioComplexity(step1, step5);
  const blueprint = PORTFOLIO_BLUEPRINTS[riskProfile]?.[complexity];

  // Managed levels (1–3): no allocation table, just a simple action card
  if (blueprint?.managed) {
    const primary = blueprint.products[0];
    const tramoRates = { t1: 19, t2: 24, t3: 30, t4: 37, t5: 45, t6: 47 };
    const taxRate = tramoRates[tramo] || 0;
    const pensionMonthly = hasTax ? Math.min(Math.round((isEpsv ? 5000 : 1500) / 12), Math.round(ahorro * 0.15)) : 0;
    const pensionSaving = hasTax && pensionMonthly > 0 && taxRate > 0 ? Math.round(pensionMonthly * 12 * taxRate / 100) : 0;

    const isSavingsMode = !!blueprint.savings_mode;
    const bodyText = isSavingsMode
      ? `Aún no es momento de invertir en mercados — primero necesitas alcanzar los <strong>3.000 €</strong> que pide Indexa Capital como mínimo. Mientras tanto, guarda tu ahorro en <strong>Trade Republic</strong>: ~3% TAE, sin riesgo, disponible en cualquier momento.`
      : `Transfiere tu ahorro mensual directamente a <strong>${primary?.platform || 'la gestora'}</strong>. Ellos invierten, rebalancean y optimizan fiscalmente por ti — sin que tengas que tomar ninguna decisión.`;
    const actionLabel = isSavingsMode
      ? `${ahorro.toLocaleString('es-ES')} €/mes → Trade Republic (cuenta remunerada)`
      : `${ahorro.toLocaleString('es-ES')} €/mes → ${primary?.platform || 'la gestora'}`;
    const actionSub = isSavingsMode
      ? `~3% TAE · sin riesgo · retirada inmediata · objetivo: 3.000 €`
      : `${primary?.fees || ''} · configuración única, aportaciones automáticas recomendadas`;

    return `
      <div class="mb-6 p-4 bg-white border border-gray-200 rounded-xl">
        <h3 class="font-semibold text-gray-800 mb-2">📊 Qué hacer con tus <strong>${ahorro.toLocaleString('es-ES')} €/mes</strong></h3>
        <p class="text-sm text-gray-600 mb-4">${bodyText}</p>
        <div class="flex items-center gap-3 p-3 bg-blue-50 rounded-lg">
          <span class="text-2xl">→</span>
          <div>
            <p class="text-sm font-bold text-blue-900">${actionLabel}</p>
            <p class="text-xs text-blue-600">${actionSub}</p>
          </div>
        </div>
        ${!isSavingsMode && hasTax && pensionMonthly > 0 ? `<div class="mt-3 p-3 bg-amber-50 border border-amber-100 rounded-lg text-xs text-amber-800">⭐ <strong>Bonus fiscal:</strong> Aporta también ${pensionMonthly.toLocaleString('es-ES')} €/mes al ${isEpsv ? 'EPSV' : 'plan de pensiones'} indexado de ${primary?.platform || 'la plataforma'} y ahórrate ~${pensionSaving.toLocaleString('es-ES')} €/año en el IRPF.</div>` : ''}
      </div>`;
  }

  // Check if existing pension contributions already cover the deductible limit
  const existingPensions = inversiones.filter(i => i.tipo === 'plan_pensiones');
  const existingPensionPersonalMonthly = existingPensions.reduce((s, i) => s + (i.aportacion_mensual || 0), 0);
  const existingPensionEmpresaMonthly = existingPensions.reduce((s, i) => s + (i.aportacion_empresa || 0), 0);
  const existingPensionAnnual = existingPensionPersonalMonthly * 12;
  const pensionLimitYear = isEpsv ? 5000 : 1500;
  const pensionLimitCovered = existingPensionAnnual >= pensionLimitYear;

  // Only recommend adding pension if tax-eligible and limit not already reached
  const pensionMaxYear = pensionLimitCovered ? 0 : (pensionLimitYear - existingPensionAnnual);
  const pensionMonthly = hasTax && !pensionLimitCovered
    ? Math.min(Math.round(pensionMaxYear / 12), Math.round(ahorro * 0.15))
    : 0;
  const investible = ahorro - pensionMonthly;
  const tramoRates = { t1: 19, t2: 24, t3: 30, t4: 37, t5: 45, t6: 47 };
  const taxRate = tramoRates[tramo] || 0;
  const pensionSaving = hasTax && pensionMonthly > 0 && taxRate > 0 ? Math.round(pensionMonthly * 12 * taxRate / 100) : 0;

  // Note about existing pension if it covers the limit
  const existingPensionNote = pensionLimitCovered && existingPensions.length > 0
    ? `<div class="mt-3 p-3 bg-green-50 border border-green-100 rounded-lg text-xs text-green-800">✅ <strong>Plan de pensiones cubierto.</strong> Ya aportas ${existingPensionPersonalMonthly.toLocaleString('es-ES')} €/mes${existingPensionEmpresaMonthly > 0 ? ` (+ ${existingPensionEmpresaMonthly.toLocaleString('es-ES')} €/mes de la empresa)` : ''}, lo que supera el límite de desgravación de ${pensionLimitYear.toLocaleString('es-ES')} €/año. No necesitas abrir otro plan.</div>`
    : '';

  const rows = [];
  if (blueprint && !blueprint.managed) {
    // Use blueprint products directly — weights and names always match the products section
    blueprint.products.forEach(p => {
      rows.push({
        asset: `${p.logo || '📊'} ${p.name}${p.isin ? ' (' + p.isin + ')' : ''}`,
        amount: Math.round(investible * p.pct / 100),
        pct: p.pct,
        platform: p.platform,
        note: p.rationale || '',
        style: 'bg-white',
      });
    });
  } else {
    // Fallback: generic allocation rows (no blueprint available)
    if (allocation.equities >= 5)    rows.push({ asset: '📈 Fondos indexados globales — MSCI World',  amount: Math.round(investible * allocation.equities / 100),    pct: allocation.equities,    platform: 'MyInvestor',        note: 'Core de la cartera.',                    style: 'bg-blue-50' });
    if (allocation.fixedIncome >= 5) rows.push({ asset: '🟢 Renta fija — bonos gubernamentales',       amount: Math.round(investible * allocation.fixedIncome / 100), pct: allocation.fixedIncome, platform: 'MyInvestor',        note: 'Diversificación y estabilidad.',         style: 'bg-green-50' });
    if (allocation.alternatives >= 5)rows.push({ asset: '🏗️ Inmobiliario — REIT global',              amount: Math.round(investible * allocation.alternatives / 100),pct: allocation.alternatives,platform: 'MyInvestor',        note: 'Diversificación inmobiliaria líquida.',  style: 'bg-purple-50' });
    if (allocation.commodities >= 3) rows.push({ asset: '🥇 Oro / Materias primas',                   amount: Math.round(investible * allocation.commodities / 100), pct: allocation.commodities, platform: 'Trade Republic',    note: 'Cobertura frente a inflación.',          style: 'bg-yellow-50' });
    if (allocation.crypto >= 3)      rows.push({ asset: '₿ Criptomonedas (BTC/ETH)',                  amount: Math.round(investible * allocation.crypto / 100),     pct: allocation.crypto,      platform: 'Bit2Me · Coinbase', note: 'Alta volatilidad.',                      style: 'bg-orange-50' });
    if (allocation.cash >= 5)        rows.push({ asset: '💵 Liquidez — cuenta remunerada',            amount: Math.round(investible * allocation.cash / 100),       pct: allocation.cash,        platform: 'Trade Republic',    note: 'Disponible inmediatamente.',             style: 'bg-gray-50' });
  }

  const parejaData = step2?.pareja;
  const dualIncomeNote = parejaData?.tiene_ingresos && parejaData.ingresos > 0
    ? `<div class="mb-4 p-3 bg-green-50 border border-green-100 rounded-xl text-sm text-green-800">
        <p class="font-semibold mb-1">👫 Capacidad de ahorro del hogar</p>
        <p>Ingresos netos combinados: <strong>${fmtEur((Number(step2?.ingresos) || 0) + parejaData.ingresos)}/mes</strong> (tú ${fmtEur(step2?.ingresos || 0)} + pareja ${fmtEur(parejaData.ingresos)}). El ahorro mensual de <strong>${fmtEur(ahorro)}</strong> refleja la capacidad conjunta del hogar.${parejaData.tramo_irpf ? ` Tramo marginal pareja: ${parejaData.tipo_marginal}%.` : ''}</p>
      </div>`
    : '';

  const ahorroCorto = Number(step2?.ahorro_corto_plazo) || 0;
  const ahorroLargo = ahorroCorto > 0 ? Math.max(0, ahorro - ahorroCorto) : ahorro;
  const shortTermSplit = ahorroCorto > 0 ? `
    <div class="mb-4 p-3 bg-sky-50 border border-sky-100 rounded-xl text-sm text-sky-800">
      <p class="font-semibold mb-1">📅 Separación por horizonte</p>
      <p>De tus ${fmtEur(ahorro)}/mes de ahorro: <strong>${fmtEur(ahorroCorto)}/mes</strong> va a cuenta remunerada (objetivos &lt;3 años, sin riesgo) y <strong>${fmtEur(ahorroLargo)}/mes</strong> a la cartera de inversión a largo plazo.</p>
    </div>` : '';

  const tableHtml = `
    <div class="overflow-x-auto">
      <table class="w-full text-sm">
        <thead>
          <tr class="border-b border-gray-200">
            <th class="text-left pb-2 font-semibold text-gray-700">Activo</th>
            <th class="text-right pb-2 font-semibold text-gray-700 whitespace-nowrap">€/mes</th>
            <th class="text-right pb-2 font-semibold text-gray-700">%</th>
            <th class="text-left pb-2 font-semibold text-gray-700 pl-3">Plataformas</th>
            <th class="text-left pb-2 font-semibold text-gray-700 pl-3 hidden sm:table-cell">Nota</th>
          </tr>
        </thead>
        <tbody class="divide-y divide-gray-100">
          ${rows.map(r => `
            <tr class="${r.style}">
              <td class="py-2.5 pr-2 font-medium text-gray-800">${r.asset}</td>
              <td class="py-2.5 text-right font-bold text-gray-900 whitespace-nowrap">${r.amount.toLocaleString('es-ES')} €</td>
              <td class="py-2.5 text-right text-gray-600">${r.pct}%</td>
              <td class="py-2.5 pl-3 text-gray-500 text-xs">${r.platform}</td>
              <td class="py-2.5 pl-3 text-gray-400 text-xs hidden sm:table-cell">${r.note}</td>
            </tr>`).join('')}
          ${hasTax && pensionMonthly > 0 ? `
            <tr class="bg-amber-50 border-t-2 border-amber-200">
              <td class="py-2.5 pr-2 font-medium text-amber-800">⭐ ${isEpsv ? 'EPSV indexada (País Vasco)' : 'Plan de pensiones indexado'}</td>
              <td class="py-2.5 text-right font-bold text-amber-800 whitespace-nowrap">+${pensionMonthly.toLocaleString('es-ES')} €</td>
              <td class="py-2.5 text-right text-amber-600">extra</td>
              <td class="py-2.5 pl-3 text-amber-700 text-xs">${isEpsv ? 'Entidades vascas' : 'MyInvestor PP Indexado'}</td>
              <td class="py-2.5 pl-3 text-amber-600 text-xs hidden sm:table-cell">Deducción fiscal directa en IRPF</td>
            </tr>` : ''}
        </tbody>
        <tfoot class="border-t-2 border-gray-300">
          <tr>
            <td class="pt-2.5 font-bold text-gray-900">Total mensual</td>
            <td class="pt-2.5 text-right font-bold text-gray-900 whitespace-nowrap">${(investible + pensionMonthly).toLocaleString('es-ES')} €</td>
            <td colspan="3"></td>
          </tr>
        </tfoot>
      </table>
    </div>`;

  const taxNote = hasTax && pensionMonthly > 0 && taxRate > 0
    ? `<div class="mt-3 p-3 bg-amber-50 border border-amber-100 rounded-lg text-xs text-amber-800">⭐ <strong>Ahorro fiscal estimado:</strong> Aportando ${fmtEur(pensionMonthly * 12)}/año al ${isEpsv ? 'EPSV' : 'plan de pensiones'} te ahorras aproximadamente <strong>${fmtEur(pensionSaving)}/año</strong> en la declaración de la renta (tramo ${taxRate}%). Hacienda te devuelve ese dinero directamente.</div>`
    : '';

  const tramoNumeric = { t1: 1, t2: 2, t3: 3, t4: 4, t5: 5, t6: 6 };
  const tramoNum = tramoNumeric[tramo] || 0;
  const bonusAnual = Number(step2?.bonus_anual) || 0;
  const bonusTip = bonusAnual > 0 && tramoNum >= 3 && hasTax
    ? `<div class="mt-3 p-3 bg-green-50 border border-green-100 rounded-lg text-xs text-green-800">💡 <strong>Optimiza tu bonus:</strong> El mes que cobres los ${fmtEur(bonusAnual)} de bonus, aporta primero hasta el límite anual del ${isEpsv ? 'EPSV' : 'plan de pensiones'} (${(isEpsv ? 5000 : 1500).toLocaleString('es-ES')} €/año). Con tu tramo IRPF del ${taxRate}%, la deducción es de hasta ${fmtEur(Math.round((isEpsv ? 5000 : 1500) * taxRate / 100))} — es dinero que Hacienda te devuelve directamente.</div>`
    : '';

  const hasEmpresaPension = (step2?.beneficios_empresa || []).includes('plan_pensiones_empresa');
  const hasPensionInStep3 = inversiones.some(i => i.tipo === 'plan_pensiones');
  const companyPensionNote = hasEmpresaPension && !hasPensionInStep3
    ? `<div class="mt-3 p-3 bg-blue-50 border border-blue-100 rounded-lg text-xs text-blue-800">ℹ️ <strong>Plan de pensiones de empresa:</strong> Añade tu plan de empresa en el paso 3 del cuestionario para calcular correctamente cuánto espacio de deducción te queda antes de llegar al límite anual.</div>`
    : '';

  return `
    <div class="mb-6 p-4 bg-white border border-gray-200 rounded-xl">
      <h3 class="font-semibold text-gray-800 mb-4">📊 Cómo distribuir tus <strong>${ahorro.toLocaleString('es-ES')} €/mes</strong> de ahorro</h3>
      ${dualIncomeNote}
      ${shortTermSplit}
      ${tableHtml}
      ${existingPensionNote}
      ${taxNote}
      ${bonusTip}
      ${companyPensionNote}
      <p class="text-xs text-gray-400 mt-3">Porcentajes según perfil <span class="capitalize font-medium">${riskProfile}</span> con tu horizonte temporal.${pensionMonthly > 0 ? ' El plan de pensiones/EPSV va <em>adicional</em> a la inversión base porque su beneficio fiscal compensa el esfuerzo extra.' : ''}</p>
    </div>`;
}

function buildExistingInvestmentsSection(inversiones, riskProfile) {
  const totalInvertido = inversiones.reduce((s, i) => s + i.importe, 0);
  const TIPO_LABELS = { plan_pensiones: 'Plan de pensiones', fondo_indexado: 'Fondo indexado', fondo_activo: 'Fondo activo', etf: 'ETF', acciones: 'Acciones', inmobiliario: 'Inmobiliario directo', crowdfunding: 'Crowdfunding', cripto: 'Criptomonedas', deposito: 'Depósito / Cuenta', oro_plata: 'Oro / Plata', otro: 'Otro' };

  const getAction = (inv) => {
    const pct = totalInvertido > 0 ? Math.round(inv.importe / totalInvertido * 100) : 0;
    if (inv.tipo === 'fondo_indexado') {
      if (!inv.ter || inv.ter <= 0.3) return { action: '✅ Mantener', color: 'green', text: 'Fondo indexado de bajo coste — exactamente lo que queremos. Continúa aportando regularmente.' };
      return { action: '🔄 Optimizar', color: 'yellow', text: `TER del ${inv.ter}% — algo elevado para un indexado. Puedes traspasarlo sin tributar a uno con TER &lt; 0.20% en MyInvestor (Amundi MSCI World, TER 0.07%) y ahorrar ${fmtEur(Math.round(inv.importe * (inv.ter - 0.20) / 100))}/año.` };
    }
    if (inv.tipo === 'fondo_activo') {
      const ahorro = inv.ter > 0 ? Math.round(inv.importe * (inv.ter - 0.20) / 100) : 0;
      return { action: '🔄 Traspasar a indexado', color: 'yellow', text: `Los fondos activos rara vez baten al índice a largo plazo y cobran más por ello. Traspásalo sin tributar a un fondo indexado equivalente${ahorro > 0 ? ` y ahorra ~${fmtEur(ahorro)}/año en comisiones` : ''}.` };
    }
    if (inv.tipo === 'plan_pensiones') {
      const isEmpresa = inv.tipo_pension === 'empresa';
      const totalMensual = (inv.aportacion_mensual || 0) + (inv.aportacion_empresa || 0);
      const terOk = !inv.ter || inv.ter <= 0.5;
      if (isEmpresa) {
        const baseText = totalMensual > 0
          ? `Tienes un plan de empresa con ${fmtEur(totalMensual)}/mes en total (tuyo + empresa). `
          : 'Tienes un plan de empresa colectivo. ';
        if (terOk) return { action: '✅ Mantener', color: 'green', text: baseText + 'Las comisiones son razonables. Aprovecha al máximo la aportación que te hace la empresa — es retribución flexible sin coste fiscal inmediato para ti.' };
        return { action: '⚠️ Revisar TER', color: 'yellow', text: baseText + `El TER del ${inv.ter}% es algo elevado. En planes de empresa no siempre puedes elegir el fondo, pero vale la pena preguntar al departamento de RRHH si hay opciones de menor coste dentro del plan.` };
      }
      if (terOk) return { action: '✅ Mantener', color: 'green', text: 'Plan de pensiones con comisiones razonables. Sigue aportando para maximizar la deducción fiscal anual (hasta 1.500€).' };
      return { action: '🔄 Traspasar', color: 'yellow', text: `TER del ${inv.ter}% — caro para un plan de pensiones. Puedes traspasar sin tributar a MyInvestor Plan Indexado (0.30%) y ahorrar ${fmtEur(Math.round(inv.importe * (inv.ter - 0.30) / 100))}/año.` };
    }
    if (inv.tipo === 'etf') return { action: '✅ Mantener', color: 'green', text: 'ETF eficiente y de bajo coste. Recuerda que cada venta tributa — no hay traspaso fiscal como en fondos de inversión españoles.' };
    if (inv.tipo === 'acciones') {
      if (pct > 40) return { action: '⚠️ Revisar concentración', color: 'yellow', text: `Las acciones representan el ${pct}% de tu cartera. Considera diversificar parte hacia fondos indexados globales para reducir el riesgo individual.` };
      return { action: '✅ Mantener', color: 'green', text: 'Acciones directas como complemento están bien. Vigila que no tengas demasiada concentración en un sector o empresa.' };
    }
    if (inv.tipo === 'inmobiliario') return { action: '✅ Mantener', color: 'green', text: 'Inmobiliario directo es un activo real con buena cobertura a inflación. Contabilízalo correctamente en tu patrimonio neto.' };
    if (inv.tipo === 'crowdfunding') return { action: '✅ Mantener', color: 'green', text: 'Crowdfunding inmobiliario bien diversificado puede añadir rentabilidad descorrelacionada. Distribúyelo entre varios proyectos y plataformas.' };
    if (inv.tipo === 'cripto') {
      if (pct > 15) return { action: '⚠️ Reducir exposición', color: 'red', text: `Las criptos representan el ${pct}% de tu cartera. Para perfil ${riskProfile}, se recomienda no superar el 10-15% para limitar la volatilidad total de la cartera.` };
      return { action: '✅ Mantener', color: 'green', text: `${pct}% en criptomonedas — dentro de lo razonable para tu perfil. Mantén esta proporción y resiste la tentación de aumentarla en momentos alcistas.` };
    }
    if (inv.tipo === 'deposito') {
      if (inv.importe > 30000) return { action: '⚠️ Revisar exceso', color: 'yellow', text: `${fmtEur(inv.importe)} en depósito es mucho capital parado si tu horizonte es largo. Una vez cubierto el fondo de emergencia, considera invertir el exceso en fondos indexados para batir la inflación.` };
      return { action: '✅ Mantener', color: 'green', text: 'Depósito / cuenta remunerada. Perfecto para el fondo de emergencia. Revisa si el tipo de interés es competitivo (Trade Republic o MyInvestor suelen superar a la banca tradicional).' };
    }
    if (inv.tipo === 'oro_plata') return { action: '✅ Mantener', color: 'green', text: 'Buena cobertura frente a inflación y crisis. Vigila que no supere el 10% de la cartera.' };
    return { action: '👀 Revisar', color: 'gray', text: 'Comprueba sus costes, liquidez y cómo encaja en tu asignación objetivo.' };
  };

  const colorMap = { green: 'bg-green-50 border-green-200 text-green-800', yellow: 'bg-yellow-50 border-yellow-200 text-yellow-800', red: 'bg-red-50 border-red-200 text-red-800', gray: 'bg-gray-50 border-gray-200 text-gray-700' };

  const rows = inversiones.map(inv => {
    const { action, color, text } = getAction(inv);
    const pct = totalInvertido > 0 ? Math.round(inv.importe / totalInvertido * 100) : 0;
    const isinTypes = ['fondo_indexado', 'fondo_activo', 'etf'];
    const isinLinks = inv.isin && isinTypes.includes(inv.tipo)
      ? `<div class="mt-1.5 flex flex-wrap gap-2 items-center">
          <span class="font-mono text-xs bg-white px-1.5 py-0.5 rounded border border-current opacity-60">${inv.isin}</span>
          <a href="https://www.morningstar.es/es/funds/snapshot/snapshot.aspx?id=${inv.isin}" target="_blank" rel="noopener"
            class="text-xs underline opacity-70 hover:opacity-100">Morningstar ↗</a>
          <a href="https://www.justetf.com/es/etf-profile.html?isin=${inv.isin}" target="_blank" rel="noopener"
            class="text-xs underline opacity-70 hover:opacity-100">justETF ↗</a>
        </div>`
      : '';
    const aportacionBadge = inv.aportacion_mensual > 0
      ? `<span class="inline-block ml-2 text-xs bg-white px-1.5 py-0.5 rounded border border-current opacity-60">+${inv.aportacion_mensual.toLocaleString('es-ES')} €/mes</span>`
      : '';
    const empresaBadge = inv.tipo_pension === 'empresa' && inv.aportacion_empresa > 0
      ? `<span class="inline-block ml-1 text-xs bg-white px-1.5 py-0.5 rounded border border-current opacity-60">empresa: +${inv.aportacion_empresa.toLocaleString('es-ES')} €/mes</span>`
      : '';
    return `
      <div class="border rounded-lg p-3 ${colorMap[color]}">
        <div class="flex items-start justify-between gap-2 mb-1">
          <div class="flex-1 min-w-0">
            <div class="flex flex-wrap items-baseline gap-1">
              <span class="font-semibold text-sm">${TIPO_LABELS[inv.tipo] || inv.tipo}</span>
              ${inv.tipo_pension === 'empresa' ? '<span class="text-xs font-medium opacity-70">(empresa)</span>' : ''}
              ${inv.plataforma ? `<span class="text-xs opacity-60">— ${inv.plataforma}</span>` : ''}
              ${aportacionBadge}${empresaBadge}
            </div>
          </div>
          <div class="text-right shrink-0">
            <p class="text-sm font-bold">${fmtEur(inv.importe)}</p>
            <p class="text-xs opacity-60">${pct}% de cartera</p>
          </div>
        </div>
        <div class="flex items-start gap-2 mt-1.5">
          <span class="text-xs font-semibold shrink-0 whitespace-nowrap">${action}</span>
          <p class="text-xs leading-relaxed">${text}</p>
        </div>
        ${isinLinks}
      </div>`;
  }).join('');

  return `
    <div class="mb-6 p-4 bg-white border border-gray-200 rounded-xl">
      <h3 class="font-semibold text-gray-800 mb-4">🔍 Lo que ya tienes — qué hacer con ello</h3>
      <div class="space-y-3">${rows}</div>
      <p class="text-xs text-gray-400 mt-3">Los traspasos entre fondos de inversión (no ETFs, no criptos) son <strong>sin coste fiscal</strong> en España — puedes mover capital de fondos caros a baratos sin tributar.</p>
    </div>`;
}

function buildRoadmapSection(health, riskProfile, ahorro, totalInvertido, isEpsv, laboral, step2, step1, objetivos) {
  const hasTax = laboral === 'asalariado' || laboral === 'autonomo';
  const startingFromScratch = totalInvertido === 0;
  const needsEmergency = health.emergencyStatus !== 'ok';

  const p1Steps = [];
  if (health.hasTarjeta) p1Steps.push('Llama a tu banco o entra en la app: liquida o negocia la tarjeta de crédito. Es urgente y rentable.');
  if (needsEmergency) {
    const target = health.gastosMensuales * (health.emergencyStatus === 'bad' ? 3 : 6);
    p1Steps.push(`Abre cuenta en Trade Republic o MyInvestor y pon ${fmtEur(target)} de fondo de emergencia al 3%. Haz la transferencia hoy.`);
  }
  if (startingFromScratch && !needsEmergency) {
    p1Steps.push('Abre cuenta en MyInvestor y haz tu primera aportación a un fondo indexado global, aunque sea pequeña. Lo importante es empezar.');
    if (ahorro > 0) p1Steps.push(`Configura aportación automática de ${fmtEur(ahorro)}/mes el día 1 de cada mes, nada más cobrar.`);
  } else if (!startingFromScratch) {
    p1Steps.push('Revisa el análisis de inversiones de arriba y lanza los traspasos que tengas pendientes (son gratuitos fiscalmente).');
    if (ahorro > 0) p1Steps.push(`Configura aportación automática de ${fmtEur(ahorro)}/mes si aún no lo tienes automatizado.`);
  }
  if (hasTax && !needsEmergency) {
    p1Steps.push(`Abre ${isEpsv ? 'EPSV indexada' : 'plan de pensiones indexado en MyInvestor'} y haz la primera aportación del año${isEpsv ? ' (hasta 5.000€/año)' : ' (hasta 1.500€/año)'} para tener deducción en el IRPF de este ejercicio.`);
  }

  const p2Steps = [];
  if (startingFromScratch) p2Steps.push('Verifica que la aportación automática está funcionando. Si no lo automatizaste, hazlo ahora — sin automatización la mayoría abandona.');
  if (riskProfile === 'dinamico' || riskProfile === 'agresivo') {
    p2Steps.push('Con los fondos indexados funcionando, diversifica: abre cuenta en Urbanitae o Wecity para tu primera posición en crowdfunding inmobiliario.');
  }
  if (riskProfile === 'agresivo') {
    p2Steps.push('Si quieres cripto, estudia bien antes de entrar. Empieza con BTC/ETH únicamente y limita la posición al 10% de la cartera total.');
  }
  if (riskProfile === 'conservador' || riskProfile === 'moderado') {
    p2Steps.push('Revisa el tipo de interés de tu renta fija. Trade Republic y MyInvestor suelen superar lo que ofrece la banca tradicional.');
  }
  p2Steps.push('Organiza contraseñas y documentación de cada plataforma. Es el momento antes de que la cartera crezca y todo se complique.');

  const p3Steps = [];
  p3Steps.push('Revisión anual de cartera completa. Si alguna clase de activo se ha desviado más del 5% respecto al objetivo, rebalancea.');
  if (hasTax) p3Steps.push(`Maximiza la aportación al ${isEpsv ? 'EPSV' : 'plan de pensiones'} antes del 31 de diciembre para que compute en la declaración de ese ejercicio fiscal.`);
  p3Steps.push('Revisa si tu perfil de riesgo sigue siendo el mismo. Con los años la situación personal cambia y la cartera debe adaptarse.');
  const maxPlazo = objetivos.filter(o => o.plazo > 0).length > 0 ? Math.max(...objetivos.filter(o => o.plazo > 0).map(o => o.plazo)) : 0;
  if (maxPlazo > 5) p3Steps.push(`Cuando queden 3-5 años para tu objetivo principal, empieza a reducir la renta variable gradualmente para no depender del mercado en el momento clave.`);
  p3Steps.push('No cambies de estrategia por las noticias del mercado. La inversión indexada exige disciplina, no actividad.');

  const phases = [
    { phase: 'Fase 1 — Esta semana', icon: '🚀', colorBg: 'bg-blue-50 border-blue-200', colorText: 'text-blue-800', colorBadge: 'bg-blue-600', steps: p1Steps },
    { phase: 'Fase 2 — En 1-3 meses', icon: '📈', colorBg: 'bg-green-50 border-green-200', colorText: 'text-green-800', colorBadge: 'bg-green-600', steps: p2Steps },
    { phase: 'Fase 3 — Revisión anual', icon: '🎯', colorBg: 'bg-purple-50 border-purple-200', colorText: 'text-purple-800', colorBadge: 'bg-purple-600', steps: p3Steps },
  ];

  const phasesHtml = phases.map(p => `
    <div class="border rounded-xl p-4 ${p.colorBg}">
      <div class="flex items-center gap-2 mb-3">
        <span class="text-lg">${p.icon}</span>
        <h4 class="font-semibold ${p.colorText}">${p.phase}</h4>
      </div>
      <ul class="space-y-2">
        ${p.steps.map((s, i) => `
          <li class="flex gap-2.5 items-start">
            <span class="shrink-0 w-5 h-5 ${p.colorBadge} text-white rounded-full flex items-center justify-center text-xs font-bold mt-0.5">${i + 1}</span>
            <p class="text-sm ${p.colorText}">${s}</p>
          </li>`).join('')}
      </ul>
    </div>`).join('');

  return `
    <div class="mb-6 p-4 bg-white border border-gray-200 rounded-xl">
      <h3 class="font-semibold text-gray-800 mb-4">🗺️ Hoja de ruta — ¿por dónde empiezo?</h3>
      <div class="space-y-4">${phasesHtml}</div>
    </div>`;
}

// ─── Simulator ────────────────────────────────────────────────────────────────

let simChart = null;
let currentPortfolioChart = null;
let recommendedPortfolioChart = null;

const ASSET_CLASS_LABELS = {
  equities:    'Renta variable',
  fixedIncome: 'Renta fija',
  alternatives:'Alternativos',
  cash:        'Efectivo / Depósitos',
  crypto:      'Criptomonedas',
  commodities: 'Materias primas',
  realEstate:  'Inmobiliario (equity)',
};

const ASSET_CLASS_COLORS = {
  equities:    '#3B82F6',
  fixedIncome: '#22C55E',
  alternatives:'#8B5CF6',
  cash:        '#6B7280',
  crypto:      '#F97316',
  commodities: '#EAB308',
  realEstate:  '#14B8A6',
};

const TIPO_TO_ASSET_CLASS = {
  fondo_indexado: 'equities',
  fondo_activo:   'equities',
  etf:            'equities',
  acciones:       'equities',
  plan_pensiones: 'equities',
  inmobiliario:   'alternatives',
  crowdfunding:   'alternatives',
  cripto:         'crypto',
  deposito:       'cash',
  oro_plata:      'commodities',
  otro:           'alternatives',
};

function buildRebalancingSection(inversiones, riskProfile, horizonKey, step1, step5) {
  const totalInvertido = inversiones.reduce((s, i) => s + i.importe, 0);
  if (totalInvertido === 0) return '';

  // Use blueprint targets so this table matches what's shown in Products.
  // Fall back to theoretical ALLOCATIONS if no blueprint (Level 1 / managed).
  const complexity = getPortfolioComplexity(step1, step5);
  const blueprint = PORTFOLIO_BLUEPRINTS[riskProfile]?.[complexity];
  let allocation;
  if (blueprint && !blueprint.managed) {
    allocation = {};
    blueprint.products.forEach(p => {
      allocation[p.asset_class] = (allocation[p.asset_class] || 0) + p.pct;
    });
  } else {
    allocation = ALLOCATIONS[riskProfile]?.[horizonKey] || {};
  }

  const currentByClass = {};
  inversiones.forEach(i => {
    const cls = TIPO_TO_ASSET_CLASS[i.tipo] || 'alternatives';
    currentByClass[cls] = (currentByClass[cls] || 0) + (i.importe || 0);
  });

  const rows = Object.keys(allocation).filter(k => allocation[k] > 0).map(k => {
    const currentPct = totalInvertido > 0 ? Math.round((currentByClass[k] || 0) / totalInvertido * 100) : 0;
    const targetPct = allocation[k];
    const diff = targetPct - currentPct;
    let action, actionColor;
    if (diff >= 5) { action = '↑ Aumentar'; actionColor = 'text-green-700 bg-green-50'; }
    else if (diff <= -5) { action = '↓ Reducir'; actionColor = 'text-red-700 bg-red-50'; }
    else { action = '✓ Mantener'; actionColor = 'text-gray-600 bg-gray-50'; }
    return { k, currentPct, targetPct, diff, action, actionColor };
  });

  return `
    <div class="mb-4 p-4 bg-blue-50 border border-blue-100 rounded-xl">
      <h4 class="font-semibold text-blue-800 mb-1">🔄 Rebalanceo sugerido</h4>
      <p class="text-xs text-blue-600 mb-3">Tu distribución actual vs el objetivo para tu perfil. Prioriza ajustar vía nuevas aportaciones antes que vender.</p>
      <div class="overflow-x-auto">
        <table class="w-full text-sm">
          <thead><tr class="text-xs text-gray-400 border-b border-gray-200">
            <th class="pb-1 text-left font-medium">Clase de activo</th>
            <th class="pb-1 text-center font-medium">Actual</th>
            <th class="pb-1 text-center font-medium">Objetivo</th>
            <th class="pb-1 text-center font-medium">Acción</th>
          </tr></thead>
          <tbody class="divide-y divide-gray-100">
            ${rows.map(r => `
              <tr>
                <td class="py-1.5 pr-2 text-gray-700">${ASSET_CLASS_LABELS[r.k] || r.k}</td>
                <td class="py-1.5 text-center text-gray-600">${r.currentPct}%</td>
                <td class="py-1.5 text-center font-medium text-gray-800">${r.targetPct}%</td>
                <td class="py-1.5 text-center">
                  <span class="inline-block px-2 py-0.5 rounded-md text-xs font-medium ${r.actionColor}">${r.action}</span>
                </td>
              </tr>`).join('')}
          </tbody>
        </table>
      </div>
      <p class="text-xs text-gray-400 mt-2">Cartera financiera actual: ${fmtEur(totalInvertido)}</p>
    </div>`;
}

function buildInvestmentPlanSection(inversiones, riskProfile, horizonKey, ahorro, data) {
  const { step1, step2, step5 } = data;
  const allocation = ALLOCATIONS[riskProfile]?.[horizonKey] || {};
  const ccaa = step1?.ccaa;
  const laboral = step1?.laboral;
  const isEpsv = ccaa === 'PVA';
  const totalInvertido = inversiones.reduce((s, i) => s + i.importe, 0);

  let html = '';

  if (totalInvertido > 0) {
    html += buildRebalancingSection(inversiones, riskProfile, horizonKey, step1, step5);
  }

  if (ahorro > 0) {
    html += buildMonthlyAllocationSection(ahorro, allocation, riskProfile, isEpsv, laboral, step2?.tramo_irpf, inversiones, step1, step5, step2);
  } else {
    html += `<div class="p-4 bg-yellow-50 border border-yellow-100 rounded-xl"><p class="text-sm text-yellow-800"><strong>Sin ahorro mensual calculado.</strong> Vuelve al paso 2 e introduce tus ingresos y gastos para ver cuánto puedes invertir cada mes.</p></div>`;
  }

  return html;
}

function renderPortfolioCharts(inversiones, riskProfile, horizonKey, inmuebles) {
  if (!document.getElementById('recommended-chart')) return;
  // --- Chart 1: current portfolio ---
  const totalFinancial = (inversiones || []).reduce((s, i) => s + (i.importe || 0), 0);
  const totals = {};
  (inversiones || []).forEach(inv => {
    const ac = TIPO_TO_ASSET_CLASS[inv.tipo] || 'alternatives';
    totals[ac] = (totals[ac] || 0) + (inv.importe || 0);
  });
  // Add real estate equity (valor - hipoteca) as its own slice
  const reEquity = (inmuebles || []).reduce((s, i) => s + Math.max(0, (i.valor || 0) - (i.hipoteca_pendiente || 0)), 0);
  if (reEquity > 0) totals.realEstate = reEquity;

  const currentWrap = document.getElementById('current-chart-wrap');
  if (Object.keys(totals).length > 0) {
    currentWrap.classList.remove('hidden');
    const totalSum = Object.values(totals).reduce((a, b) => a + b, 0);
    document.getElementById('current-chart-total').textContent =
      'Total: ' + fmtEur(totalSum);

    const currentKeys = Object.keys(totals);
    if (currentPortfolioChart) currentPortfolioChart.destroy();
    currentPortfolioChart = new Chart(
      document.getElementById('current-chart'),
      {
        type: 'doughnut',
        data: {
          labels: currentKeys.map(k => ASSET_CLASS_LABELS[k] || k),
          datasets: [{
            data: currentKeys.map(k => totals[k]),
            backgroundColor: currentKeys.map(k => ASSET_CLASS_COLORS[k] || '#94A3B8'),
            borderWidth: 2,
            borderColor: '#fff',
          }],
        },
        options: {
          cutout: '60%',
          plugins: {
            legend: { position: 'bottom', labels: { font: { size: 11 }, padding: 10, boxWidth: 12 } },
            tooltip: {
              callbacks: {
                label: ctx => {
                  const val = ctx.parsed;
                  const pct = ((val / totalSum) * 100).toFixed(1);
                  return ` ${fmtEur(val)} (${pct}%)`;
                },
              },
            },
          },
        },
      }
    );
  }

  // --- Chart 2: recommended portfolio (includes real estate if present) ---
  const allocation = ALLOCATIONS[riskProfile]?.[horizonKey] || {};
  const recKeys = Object.keys(allocation).filter(k => allocation[k] > 0);

  const profileMeta = PROFILE_META[riskProfile];
  const hasReInChart = reEquity > 0;

  let chartKeys, chartValues, tooltipFn;
  if (hasReInChart && totalFinancial > 0) {
    const totalWealth = totalFinancial + reEquity;
    const rePct = Math.max(1, Math.round(reEquity / totalWealth * 100));
    const remaining = 100 - rePct;
    const recData = { realEstate: rePct };
    recKeys.forEach(k => {
      const scaled = Math.round(allocation[k] * remaining / 100);
      if (scaled > 0) recData[k] = scaled;
    });
    chartKeys = Object.keys(recData).filter(k => recData[k] > 0);
    chartValues = chartKeys.map(k => recData[k]);
    tooltipFn = ctx => ` ${ctx.parsed}% (incl. inmueble)`;
  } else if (hasReInChart && totalFinancial === 0) {
    // Only real estate, no financial portfolio yet — show target for investable + RE note
    chartKeys = recKeys;
    chartValues = recKeys.map(k => allocation[k]);
    tooltipFn = ctx => ` ${ctx.parsed}%`;
  } else {
    chartKeys = recKeys;
    chartValues = recKeys.map(k => allocation[k]);
    tooltipFn = ctx => ` ${ctx.parsed}%`;
  }

  document.getElementById('recommended-chart-profile').textContent =
    `Perfil ${profileMeta?.label || riskProfile} · horizonte ${horizonKey === 'short' ? 'corto' : horizonKey === 'medium' ? 'medio' : 'largo'} plazo${hasReInChart && totalFinancial > 0 ? ' · incl. inmueble' : ''}`;

  if (recommendedPortfolioChart) recommendedPortfolioChart.destroy();
  recommendedPortfolioChart = new Chart(
    document.getElementById('recommended-chart'),
    {
      type: 'doughnut',
      data: {
        labels: chartKeys.map(k => ASSET_CLASS_LABELS[k] || k),
        datasets: [{
          data: chartValues,
          backgroundColor: chartKeys.map(k => ASSET_CLASS_COLORS[k] || '#94A3B8'),
          borderWidth: 2,
          borderColor: '#fff',
        }],
      },
      options: {
        cutout: '60%',
        plugins: {
          legend: { position: 'bottom', labels: { font: { size: 11 }, padding: 10, boxWidth: 12 } },
          tooltip: { callbacks: { label: tooltipFn } },
        },
      },
    }
  );
}

function buildSimulatorData(capital, monthly, years, annualRate) {
  const labels = [];
  const withStrategy = [];
  const onlyContributions = [];
  for (let y = 0; y <= years; y++) {
    labels.push(y === 0 ? 'Hoy' : `Año ${y}`);
    withStrategy.push(Math.round(calcProjection(capital, monthly, annualRate / 100, y)));
    onlyContributions.push(Math.round(capital + monthly * 12 * y));
  }
  return { labels, withStrategy, onlyContributions };
}

function updateSimulator() {
  const capital = Number(document.getElementById('sim-capital').value);
  const monthly = Number(document.getElementById('sim-monthly').value);
  const years = Number(document.getElementById('sim-years').value);
  const ret = Number(document.getElementById('sim-return').value);

  document.getElementById('sim-capital-val').textContent = capital.toLocaleString('es-ES') + ' €';
  document.getElementById('sim-monthly-val').textContent = monthly.toLocaleString('es-ES') + ' €';
  document.getElementById('sim-years-val').textContent = years + ' años';
  document.getElementById('sim-return-val').textContent = ret + '%';

  const finalVal = Math.round(calcProjection(capital, monthly, ret / 100, years));
  const invested = Math.round(capital + monthly * 12 * years);
  const gains = finalVal - invested;

  document.getElementById('sim-result-final').textContent = fmtEur(finalVal);
  document.getElementById('sim-result-invested').textContent = fmtEur(invested);
  document.getElementById('sim-result-gains').textContent = fmtEur(gains);

  const { labels, withStrategy, onlyContributions } = buildSimulatorData(capital, monthly, years, ret);

  if (simChart) {
    simChart.data.labels = labels;
    simChart.data.datasets[0].data = withStrategy;
    simChart.data.datasets[1].data = onlyContributions;
    simChart.update('none');
  }
}

function initSimulator(defaultMonthly, defaultReturn) {
  const canvas = document.getElementById('simulator-chart');
  if (!canvas) return;

  // Pre-set sliders to user's profile values
  if (defaultMonthly > 0) {
    const clampedMonthly = Math.min(defaultMonthly, 5000);
    document.getElementById('sim-monthly').value = clampedMonthly;
  }
  if (defaultReturn > 0) {
    const clampedReturn = Math.min(Math.max(defaultReturn * 100, 1), 15);
    document.getElementById('sim-return').value = clampedReturn.toFixed(1);
  }

  const capital = Number(document.getElementById('sim-capital').value);
  const monthly = Number(document.getElementById('sim-monthly').value);
  const years = Number(document.getElementById('sim-years').value);
  const ret = Number(document.getElementById('sim-return').value);

  const { labels, withStrategy, onlyContributions } = buildSimulatorData(capital, monthly, years, ret);

  simChart = new Chart(canvas, {
    type: 'line',
    data: {
      labels,
      datasets: [
        {
          label: 'Con tu estrategia',
          data: withStrategy,
          borderColor: '#2563eb',
          backgroundColor: 'rgba(37,99,235,0.10)',
          fill: true,
          tension: 0.4,
          pointRadius: 0,
          borderWidth: 2,
        },
        {
          label: 'Solo aportaciones (sin rentabilidad)',
          data: onlyContributions,
          borderColor: '#d1d5db',
          backgroundColor: 'transparent',
          fill: false,
          tension: 0,
          pointRadius: 0,
          borderWidth: 1.5,
          borderDash: [6, 4],
        },
      ],
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      interaction: { mode: 'index', intersect: false },
      plugins: {
        legend: { position: 'bottom', labels: { boxWidth: 12, font: { size: 11 } } },
        tooltip: {
          callbacks: {
            label: ctx => `${ctx.dataset.label}: ${ctx.raw.toLocaleString('es-ES')} €`,
          },
        },
      },
      scales: {
        x: { grid: { display: false }, ticks: { maxTicksLimit: 8, font: { size: 10 } } },
        y: {
          grid: { color: '#f3f4f6' },
          ticks: {
            font: { size: 10 },
            callback: v => v >= 1000 ? (v / 1000).toFixed(0) + 'k €' : v + ' €',
          },
        },
      },
    },
  });

  updateSimulator();

  ['sim-capital', 'sim-monthly', 'sim-years', 'sim-return'].forEach(id => {
    document.getElementById(id).addEventListener('input', updateSimulator);
  });
}

// ─── Main entry point ─────────────────────────────────────────────────────────

window.generateResults = function () {
  const data = JSON.parse(localStorage.getItem('iw_profile') || '{}');
  if (!data.step1) {
    document.getElementById('results-container').innerHTML = `
      <div class="text-center py-16">
        <p class="text-gray-500 text-lg mb-4">No hay datos de perfil aún.</p>
        <a href="index.html" class="px-6 py-3 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700">Completar perfil</a>
      </div>`;
    return;
  }

  const { step1, step2, step3, step4, step5, riskProfile = 'moderado' } = data;
  const profile = PROFILE_META[riskProfile] || PROFILE_META.moderado;
  const health = calcFinancialHealth(step2, step1);
  const inversiones = step3?.inversiones || [];
  const objetivos = step4?.objetivos || [];
  const ccaa = step1?.ccaa || '';


  // Profile badge
  const maxScore = 15;
  document.getElementById('profile-badge').innerHTML = `
    <div class="inline-flex items-center gap-2 px-4 py-2 rounded-full ${profile.bg} border ${profile.border}">
      <span class="text-xl">${profile.emoji}</span>
      <span class="font-semibold ${profile.text}">Perfil ${profile.label}</span>
      <span class="text-xs ${profile.text} opacity-70">(${step5?.total || 0}/${maxScore} pts)</span>
    </div>`;

  const healthEl = document.getElementById('financial-health');
  healthEl.innerHTML = renderFinancialHealth(health) + renderHipotecaAnalysis(step1);
  const inmueblesPanelEl = document.getElementById('inmuebles-panel');
  if (inmueblesPanelEl) inmueblesPanelEl.innerHTML = renderInmueblesPanel(step3?.inmuebles || []);

  const portfolioAnalysisEl = document.getElementById('portfolio-analysis');
  if (portfolioAnalysisEl) {
    portfolioAnalysisEl.innerHTML = renderCurrentPortfolioAnalysis(inversiones);
  }

  document.getElementById('products-section').innerHTML = renderProductCards(riskProfile, objetivos, ccaa, inversiones, step1, step5);
  document.getElementById('action-plan').innerHTML = renderActionPlan(health, riskProfile, data);

  const pensionEl = document.getElementById('pension-estimate');
  if (pensionEl) {
    const horizonForRetirement = step4?.jubilacion?.plazo || (step1?.edad ? Math.max(0, 67 - step1.edad) : 30);
    const ahorroMensual = Number(step2?.ahorro_mensual) || 0;
    const ahorroCorto = Number(step2?.ahorro_corto_plazo) || 0;
    const ahorroLargoMensual = Math.max(0, ahorroMensual - ahorroCorto);
    const alloc = ALLOCATIONS[riskProfile]?.[getHorizonKey(horizonForRetirement)] || {};
    const blendedRate = calcBlendedReturn(alloc);
    const patrimonioNeto = Number(step1?.patrimonio_neto) || 0;
    const projectedAtRetirement = calcProjection(patrimonioNeto, ahorroLargoMensual, blendedRate, horizonForRetirement);
    const rentaObjetivoMensual = step4?.jubilacion?.renta_mensual || (step2?.ingresos_brutos ? Math.round(step2.ingresos_brutos / 12 * 0.7) : 0);

    let onTrackCard = '';
    if (rentaObjetivoMensual > 0 && horizonForRetirement > 0 && ahorroLargoMensual > 0) {
      const capitalNeeded = Math.round(rentaObjetivoMensual * 12 / 0.04);
      const onTrack = projectedAtRetirement >= capitalNeeded;
      onTrackCard = `<div class="mt-3 p-3 ${onTrack ? 'bg-green-50 border-green-200' : 'bg-yellow-50 border-yellow-200'} border rounded-xl text-sm ${onTrack ? 'text-green-800' : 'text-yellow-800'}">
        ${onTrack
          ? `✅ <strong>Vas por buen camino.</strong> Con tu ritmo actual proyectamos ~${fmtEur(projectedAtRetirement)} en ${horizonForRetirement} años — suficiente para generar ${fmtEur(rentaObjetivoMensual)}/mes (regla del 4%).`
          : `⚠️ <strong>Brecha de capital.</strong> Con tu ritmo actual proyectamos ~${fmtEur(projectedAtRetirement)} — tu objetivo requiere ~${fmtEur(capitalNeeded)} (para ${fmtEur(rentaObjetivoMensual)}/mes). Revisa el simulador para ver cómo cerrar la brecha.`}
      </div>`;
    }
    pensionEl.innerHTML = renderPensionEstimate(step1, step2, step4) + onTrackCard;
  }

  // Portfolio distribution charts
  const horizonKey = getHorizonKey(objetivos.length > 0 ? Math.max(...objetivos.filter(o => o.plazo > 0).map(o => o.plazo), 1) : 20);
  renderPortfolioCharts(inversiones, riskProfile, horizonKey, step3?.inmuebles || []);

  // Portfolio rationale ("¿Por qué eres este perfil?")
  const rationaleEl = document.getElementById('portfolio-rationale');
  if (rationaleEl) rationaleEl.innerHTML = renderPortfolioRationale(riskProfile, data);

  // Investment plan ("Cómo invertirlo" — rebalancing or fresh start + monthly allocation)
  const investmentPlanEl = document.getElementById('investment-plan');
  if (investmentPlanEl) {
    investmentPlanEl.innerHTML = buildInvestmentPlanSection(inversiones, riskProfile, horizonKey, step2?.ahorro_mensual || 0, data);
  }

  // Init simulator with user's actual numbers
  const allocation = ALLOCATIONS[riskProfile][horizonKey];
  const blended = calcBlendedReturn(allocation);

  // Set initial capital from patrimonio neto if available
  const patrimonioNeto = step1?.patrimonio_neto || 0;
  if (patrimonioNeto > 0) {
    document.getElementById('sim-capital').value = Math.min(patrimonioNeto, 200000);
  }

  initSimulator(step2?.ahorro_mensual || 300, blended);
};
