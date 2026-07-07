// PDF.js worker
if (typeof pdfjsLib !== 'undefined') {
  pdfjsLib.GlobalWorkerOptions.workerSrc =
    'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js';
}

const STEPS = [
  { label: 'Datos personales' },
  { label: 'Situación financiera' },
  { label: 'Inversiones actuales' },
  { label: 'Objetivos' },
  { label: 'Perfil de riesgo' },
];

const INVESTMENT_TYPES = [
  { value: 'plan_pensiones', label: 'Plan de pensiones' },
  { value: 'fondo_indexado', label: 'Fondo indexado' },
  { value: 'fondo_activo', label: 'Fondo de inversión activo' },
  { value: 'etf', label: 'ETF' },
  { value: 'acciones', label: 'Acciones' },
  { value: 'inmobiliario', label: 'Inmobiliario directo' },
  { value: 'crowdfunding', label: 'Crowdfunding inmobiliario' },
  { value: 'cripto', label: 'Criptomonedas' },
  { value: 'deposito', label: 'Depósito / Cuenta remunerada' },
  { value: 'oro_plata', label: 'Oro / Plata / Commodities' },
  { value: 'stock_options', label: 'Stock options / RSUs' },
  { value: 'otro', label: 'Otro' },
];

const FUND_SEARCH_CATALOG = [
  // ── Fondos Indexados (traspaso fiscal) ──────────────────────────────────────
  { name: 'Amundi Index MSCI World AE-C',                  isin: 'LU0996182563', ter: 0.30, tag: 'FI',  category: 'RV Global' },
  { name: 'Amundi Index S&P 500 AE-C',                     isin: 'LU1681048804', ter: 0.15, tag: 'FI',  category: 'RV EEUU' },
  { name: 'Amundi Index MSCI Emerging Markets AE-C',       isin: 'LU0996177134', ter: 0.20, tag: 'FI',  category: 'RV Emergentes' },
  { name: 'Amundi Index Nasdaq 100 AE-C',                  isin: 'LU1681038672', ter: 0.23, tag: 'FI',  category: 'RV Tecnología' },
  { name: 'Amundi Index MSCI Europe AE-C',                 isin: 'LU0389811885', ter: 0.30, tag: 'FI',  category: 'RV Europa' },
  { name: 'Amundi J.P. Morgan GBI Global Govies AHE-C',    isin: 'LU0389812988', ter: 0.10, tag: 'FI',  category: 'RF Global' },
  { name: 'Amundi FTSE EPRA NAREIT Global AHE-C',          isin: 'LU1737652832', ter: 0.24, tag: 'FI',  category: 'Inmobiliario' },
  { name: 'Vanguard Global Stock Index EUR Acc',            isin: 'LU0552385295', ter: 0.18, tag: 'FI',  category: 'RV Global' },
  { name: 'Vanguard U.S. 500 Stock Index EUR Acc',          isin: 'IE0032126645', ter: 0.10, tag: 'FI',  category: 'RV EEUU' },
  { name: 'Vanguard European Stock Index EUR Acc',          isin: 'IE0007987690', ter: 0.12, tag: 'FI',  category: 'RV Europa' },
  { name: 'Vanguard Emerging Markets Stock EUR Acc',        isin: 'IE0031786696', ter: 0.23, tag: 'FI',  category: 'RV Emergentes' },
  { name: 'Vanguard Global Bond Index EUR Hdg Acc',         isin: 'IE00B18GC888', ter: 0.15, tag: 'FI',  category: 'RF Global' },
  { name: 'Vanguard Japan Stock Index EUR Acc',             isin: 'IE0007282080', ter: 0.16, tag: 'FI',  category: 'RV Japón' },
  { name: 'Fidelity MSCI World Index EUR Acc',              isin: 'IE00BYX5NX33', ter: 0.12, tag: 'FI',  category: 'RV Global' },
  { name: 'Fidelity S&P 500 Index EUR Acc',                 isin: 'IE00BYX5MX67', ter: 0.06, tag: 'FI',  category: 'RV EEUU' },
  { name: 'Fidelity Emerging Markets Index EUR Acc',        isin: 'IE00BYX5P786', ter: 0.20, tag: 'FI',  category: 'RV Emergentes' },
  { name: 'BlackRock iShares North America Index D2 EUR',   isin: 'LU0827884555', ter: 0.18, tag: 'FI',  category: 'RV EEUU' },
  { name: 'BlackRock iShares Developed World Index D2 EUR', isin: 'LU0827889745', ter: 0.18, tag: 'FI',  category: 'RV Global' },
  // ── Fondos Activos ───────────────────────────────────────────────────────────
  { name: 'Cobas Internacional FI',                         isin: 'ES0119388035', ter: 1.85, tag: 'FI',  category: 'RV Internacional' },
  { name: 'Cobas Selección FI',                             isin: 'ES0119388043', ter: 1.85, tag: 'FI',  category: 'RV Global' },
  { name: 'Az Valor Internacional FI',                      isin: 'ES0119388019', ter: 1.85, tag: 'FI',  category: 'RV Internacional' },
  { name: 'Magallanes European Equity FI',                  isin: 'ES0162204030', ter: 1.65, tag: 'FI',  category: 'RV Europa' },
  { name: 'Magallanes Iberian Equity FI',                   isin: 'ES0162204022', ter: 1.65, tag: 'FI',  category: 'RV Ibérica' },
  { name: 'Bestinver Internacional FI',                     isin: 'ES0114930038', ter: 1.74, tag: 'FI',  category: 'RV Internacional' },
  { name: 'Fundsmith Equity T EUR Acc',                     isin: 'IE00B4MR8721', ter: 1.00, tag: 'FI',  category: 'RV Global Calidad' },
  { name: 'Seilern World Growth EUR U R',                   isin: 'IE0031724234', ter: 0.81, tag: 'FI',  category: 'RV Global Calidad' },
  { name: 'True Capital FI',                                isin: 'ES0180804001', ter: 1.35, tag: 'FI',  category: 'RV Global' },
  // ── ETFs ─────────────────────────────────────────────────────────────────────
  { name: 'iShares Core MSCI World UCITS ETF (Acc)',         isin: 'IE00B4L5Y983', ter: 0.20, tag: 'ETF', category: 'RV Global' },
  { name: 'iShares Core S&P 500 UCITS ETF (Acc)',            isin: 'IE00B5BMR087', ter: 0.07, tag: 'ETF', category: 'RV EEUU' },
  { name: 'Vanguard FTSE All-World UCITS ETF (Acc)',         isin: 'IE00BK5BQV03', ter: 0.22, tag: 'ETF', category: 'RV Global' },
  { name: 'Vanguard FTSE All-World UCITS ETF (Dist)',        isin: 'IE00B3RBWM25', ter: 0.22, tag: 'ETF', category: 'RV Global' },
  { name: 'Vanguard S&P 500 UCITS ETF (Acc)',                isin: 'IE00BFMXXD54', ter: 0.07, tag: 'ETF', category: 'RV EEUU' },
  { name: 'iShares Core MSCI EM IMI UCITS ETF (Acc)',        isin: 'IE00BKM4GZ66', ter: 0.18, tag: 'ETF', category: 'RV Emergentes' },
  { name: 'iShares MSCI World Small Cap UCITS ETF (Acc)',    isin: 'IE00BF4RFH31', ter: 0.35, tag: 'ETF', category: 'RV Small Cap' },
  { name: 'iShares Core MSCI Europe UCITS ETF (Acc)',        isin: 'IE00B4K48X80', ter: 0.12, tag: 'ETF', category: 'RV Europa' },
  { name: 'Vanguard FTSE Developed Europe UCITS ETF (Acc)',  isin: 'IE00B945VV12', ter: 0.10, tag: 'ETF', category: 'RV Europa' },
  { name: 'iShares NASDAQ 100 UCITS ETF (Acc)',              isin: 'IE00B53SZB19', ter: 0.33, tag: 'ETF', category: 'RV Tecnología' },
  { name: 'Invesco EQQQ NASDAQ-100 UCITS ETF (Acc)',         isin: 'IE00B8PCF712', ter: 0.20, tag: 'ETF', category: 'RV Tecnología' },
  { name: 'SPDR S&P 500 UCITS ETF (Dist)',                   isin: 'IE00B6YX5C33', ter: 0.03, tag: 'ETF', category: 'RV EEUU' },
  { name: 'Xtrackers MSCI World Swap UCITS ETF (Acc)',       isin: 'IE00BJ0KDQ92', ter: 0.19, tag: 'ETF', category: 'RV Global' },
  { name: 'Vanguard LifeStrategy 80% Equity UCITS ETF',     isin: 'IE00BMVB5P51', ter: 0.25, tag: 'ETF', category: 'Mixto' },
  { name: 'Vanguard LifeStrategy 60% Equity UCITS ETF',     isin: 'IE00BMVB5R75', ter: 0.25, tag: 'ETF', category: 'Mixto' },
  { name: 'iShares Core Global Aggregate Bond UCITS ETF',   isin: 'IE00B3F81409', ter: 0.10, tag: 'ETF', category: 'RF Global' },
  { name: 'iShares $ Treasury Bond 7-10yr UCITS ETF',       isin: 'IE00B1FZS798', ter: 0.07, tag: 'ETF', category: 'RF EEUU' },
  // ── ETCs (Commodities) ───────────────────────────────────────────────────────
  { name: 'WisdomTree Physical Gold ETC',                   isin: 'JE00B1VS3770', ter: 0.35, tag: 'ETC', category: 'Oro' },
  { name: 'iShares Physical Gold ETC',                      isin: 'IE00B4ND3602', ter: 0.25, tag: 'ETC', category: 'Oro' },
  { name: 'Invesco Physical Gold ETC',                      isin: 'IE00B579F325', ter: 0.19, tag: 'ETC', category: 'Oro' },
  { name: 'WisdomTree Physical Silver ETC',                 isin: 'JE00B1VS3333', ter: 0.49, tag: 'ETC', category: 'Plata' },
  { name: 'WisdomTree Physical Platinum ETC',               isin: 'JE00B1VS3226', ter: 0.49, tag: 'ETC', category: 'Platino' },
  // ── Acciones — IBEX 35 ───────────────────────────────────────────────────────
  { name: 'Inditex',                        isin: 'ES0148396007', ter: 0, tag: 'Acc', category: 'IBEX 35' },
  { name: 'Iberdrola',                      isin: 'ES0144580Y14', ter: 0, tag: 'Acc', category: 'IBEX 35' },
  { name: 'Banco Santander',                isin: 'ES0113900J37', ter: 0, tag: 'Acc', category: 'IBEX 35' },
  { name: 'BBVA',                           isin: 'ES0113211835', ter: 0, tag: 'Acc', category: 'IBEX 35' },
  { name: 'Telefónica',                     isin: 'ES0178430E18', ter: 0, tag: 'Acc', category: 'IBEX 35' },
  { name: 'Repsol',                         isin: 'ES0173516115', ter: 0, tag: 'Acc', category: 'IBEX 35' },
  { name: 'CaixaBank',                      isin: 'ES0140609018', ter: 0, tag: 'Acc', category: 'IBEX 35' },
  { name: 'Amadeus IT Group',               isin: 'ES0109067019', ter: 0, tag: 'Acc', category: 'IBEX 35' },
  { name: 'Endesa',                         isin: 'ES0130670112', ter: 0, tag: 'Acc', category: 'IBEX 35' },
  { name: 'Redeia (Red Eléctrica)',         isin: 'ES0173093024', ter: 0, tag: 'Acc', category: 'IBEX 35' },
  { name: 'ACS Actividades Construcción',   isin: 'ES0167050915', ter: 0, tag: 'Acc', category: 'IBEX 35' },
  { name: 'Ferrovial',                      isin: 'NL0015001JR4', ter: 0, tag: 'Acc', category: 'IBEX 35' },
  { name: 'Banco Sabadell',                 isin: 'ES0113860J30', ter: 0, tag: 'Acc', category: 'IBEX 35' },
  { name: 'Bankinter',                      isin: 'ES0113679I37', ter: 0, tag: 'Acc', category: 'IBEX 35' },
  { name: 'Mapfre',                         isin: 'ES0124244E34', ter: 0, tag: 'Acc', category: 'IBEX 35' },
  { name: 'Aena SME',                       isin: 'ES0105046009', ter: 0, tag: 'Acc', category: 'IBEX 35' },
  { name: 'Grifols',                        isin: 'ES0171996087', ter: 0, tag: 'Acc', category: 'IBEX 35' },
  { name: 'Naturgy Energy Group',           isin: 'ES0116870315', ter: 0, tag: 'Acc', category: 'IBEX 35' },
  { name: 'IAG (International Airlines)',   isin: 'ES0177542018', ter: 0, tag: 'Acc', category: 'IBEX 35' },
  { name: 'Acciona',                        isin: 'ES0125220311', ter: 0, tag: 'Acc', category: 'IBEX 35' },
  // ── Acciones — Europa ────────────────────────────────────────────────────────
  { name: 'ASML Holding',                   isin: 'NL0010273215', ter: 0, tag: 'Acc', category: 'Europa' },
  { name: 'LVMH Moët Hennessy',             isin: 'FR0000121014', ter: 0, tag: 'Acc', category: 'Europa' },
  { name: 'Nestlé',                         isin: 'CH0038863350', ter: 0, tag: 'Acc', category: 'Europa' },
  { name: 'SAP SE',                         isin: 'DE0007164600', ter: 0, tag: 'Acc', category: 'Europa' },
  { name: 'Hermès International',           isin: 'FR0000251211', ter: 0, tag: 'Acc', category: 'Europa' },
  { name: 'Novo Nordisk',                   isin: 'DK0060534915', ter: 0, tag: 'Acc', category: 'Europa' },
  { name: "L'Oréal",                        isin: 'FR0000120321', ter: 0, tag: 'Acc', category: 'Europa' },
  { name: 'Airbus SE',                      isin: 'NL0000235190', ter: 0, tag: 'Acc', category: 'Europa' },
  { name: 'Siemens AG',                     isin: 'DE0007236101', ter: 0, tag: 'Acc', category: 'Europa' },
  { name: 'Schneider Electric',             isin: 'FR0000121972', ter: 0, tag: 'Acc', category: 'Europa' },
  { name: 'TotalEnergies SE',               isin: 'FR0000120271', ter: 0, tag: 'Acc', category: 'Europa' },
  // ── Acciones — EEUU ──────────────────────────────────────────────────────────
  { name: 'Apple Inc.',                     isin: 'US0378331005', ter: 0, tag: 'Acc', category: 'EEUU' },
  { name: 'Microsoft Corporation',          isin: 'US5949181045', ter: 0, tag: 'Acc', category: 'EEUU' },
  { name: 'Amazon.com Inc.',                isin: 'US0231351067', ter: 0, tag: 'Acc', category: 'EEUU' },
  { name: 'Alphabet Inc. (Google)',         isin: 'US02079K3059', ter: 0, tag: 'Acc', category: 'EEUU' },
  { name: 'Meta Platforms Inc.',            isin: 'US30303M1027', ter: 0, tag: 'Acc', category: 'EEUU' },
  { name: 'NVIDIA Corporation',             isin: 'US67066G1040', ter: 0, tag: 'Acc', category: 'EEUU' },
  { name: 'Tesla Inc.',                     isin: 'US88160R1014', ter: 0, tag: 'Acc', category: 'EEUU' },
  { name: 'Berkshire Hathaway B',           isin: 'US0846707026', ter: 0, tag: 'Acc', category: 'EEUU' },
  { name: 'Visa Inc.',                      isin: 'US92826C8394', ter: 0, tag: 'Acc', category: 'EEUU' },
  { name: 'JPMorgan Chase & Co.',           isin: 'US46625H1005', ter: 0, tag: 'Acc', category: 'EEUU' },
  { name: 'Johnson & Johnson',              isin: 'US4781601046', ter: 0, tag: 'Acc', category: 'EEUU' },
  { name: 'ExxonMobil Corporation',         isin: 'US30231G1022', ter: 0, tag: 'Acc', category: 'EEUU' },
];

// Derive ISIN→details lookup from catalog
const FUND_LOOKUP = {};
FUND_SEARCH_CATALOG.forEach(f => { if (f.isin) FUND_LOOKUP[f.isin] = { name: f.name, ter: f.ter }; });

const PLATFORMS = [
  { value: 'indexa', label: 'Indexa Capital' },
  { value: 'myinvestor', label: 'MyInvestor' },
  { value: 'degiro', label: 'DEGIRO' },
  { value: 'trade_republic', label: 'Trade Republic' },
  { value: 'urbanitae', label: 'Urbanitae' },
  { value: 'wecity', label: 'Wecity' },
  { value: 'bit2me', label: 'Bit2Me' },
  { value: 'coinbase', label: 'Coinbase' },
  { value: 'finizens', label: 'Finizens' },
  { value: 'inbestme', label: 'inbestMe' },
  { value: 'banco_tradicional', label: 'Banco tradicional' },
  { value: 'otro', label: 'Otro' },
];

function calcularTramoIRPF(brutos) {
  if (!brutos || brutos <= 0) return { tramo: '', tipo: 0, label: '' };
  if (brutos <= 12450)  return { tramo: 't1', tipo: 19, label: 'Hasta 12.450 € — 19%' };
  if (brutos <= 20200)  return { tramo: 't2', tipo: 24, label: '12.450–20.200 € — 24%' };
  if (brutos <= 35200)  return { tramo: 't3', tipo: 30, label: '20.200–35.200 € — 30%' };
  if (brutos <= 60000)  return { tramo: 't4', tipo: 37, label: '35.200–60.000 € — 37%' };
  if (brutos <= 300000) return { tramo: 't5', tipo: 45, label: '60.000–300.000 € — 45%' };
  return                       { tramo: 't6', tipo: 47, label: 'Más de 300.000 € — 47%' };
}

let currentStep = 1;
let inversionCount = 0;
const activeGastos = new Set();

// ─── Navigation ───────────────────────────────────────────────────────────────

function showStep(n) {
  document.querySelectorAll('.step-content').forEach(el => el.classList.add('hidden'));

  document.getElementById('btn-next').textContent = 'Continuar →';
  document.getElementById(`step-${n}`).classList.remove('hidden');

  const pct = (n / STEPS.length) * 100;
  document.getElementById('progress-bar').style.width = pct + '%';
  document.getElementById('step-label').textContent = `Paso ${n} de ${STEPS.length}`;
  document.getElementById('step-name').textContent = STEPS[n - 1].label;

  document.getElementById('btn-prev').classList.toggle('hidden', n === 1);
  document.getElementById('btn-next').classList.toggle('hidden', n === STEPS.length);
  document.getElementById('btn-submit').classList.toggle('hidden', n !== STEPS.length);

  if (n === 4) updateJubilacionInfo();
  if (n === 2) toggleParejaIngresoStep2();
  window.scrollTo({ top: 0, behavior: 'smooth' });
}

document.getElementById('btn-prev').addEventListener('click', () => {
  if (currentStep > 1) { currentStep--; showStep(currentStep); restoreStep(currentStep); }
});

document.getElementById('btn-next').addEventListener('click', () => {
  if (!validateStep(currentStep)) return;
  saveData(currentStep);
  if (currentStep === 1) {
    currentStep = 2; showStep(currentStep); restoreStep(currentStep); renderStep1Analysis(); return;
  }
  if (currentStep === 2) {
    currentStep = 3; showStep(currentStep); restoreStep(currentStep); renderStep2Analysis(); return;
  }
  currentStep++; showStep(currentStep); restoreStep(currentStep);
});

document.getElementById('btn-submit').addEventListener('click', () => {
  if (!validateStep(currentStep)) return;
  saveData(currentStep);
  buildRiskProfile();
  window.location.href = 'results.html';
});

// ─── Validation ───────────────────────────────────────────────────────────────

function validateStep(n) {
  if (n === 1) {
    const edad = document.getElementById('edad').value;
    const laboral = document.querySelector('input[name="laboral"]:checked');
    const familiar = document.querySelector('input[name="familiar"]:checked');
    const vivienda = document.querySelector('input[name="vivienda"]:checked');
    if (!edad || edad < 18 || edad > 90) {
      alert('Introduce una edad válida (18–90 años).');
      return false;
    }
    if (!laboral) { alert('Selecciona tu situación laboral.'); return false; }
    if (!familiar) { alert('Selecciona tu situación familiar.'); return false; }
    if (!vivienda) { alert('Selecciona tu situación de vivienda.'); return false; }
    return true;
  }
  if (n === 2) {
    const ingresos = document.getElementById('ingresos').value;
    if (!ingresos || Number(ingresos) < 1) {
      alert('Introduce tus ingresos mensuales netos.');
      return false;
    }
    return true;
  }
  if (n === 3) return true;
  if (n === 4) {
    const independencia = document.querySelector('input[name="independencia_quiere"]:checked');
    if (!independencia) {
      document.getElementById('no-objetivo-warning').classList.remove('hidden');
      return false;
    }
    document.getElementById('no-objetivo-warning').classList.add('hidden');
    return true;
  }
  if (n === 5) {
    const questionNames = ['riesgo_1', 'riesgo_2', 'riesgo_3', 'riesgo_5', 'riesgo_7'];
    for (const name of questionNames) {
      if (!document.querySelector(`input[name="${name}"]:checked`)) {
        const num = name.replace('riesgo_', '');
        alert(`Responde la pregunta ${num} para continuar.`);
        return false;
      }
    }
    return true;
  }
  return true;
}

// ─── Save ─────────────────────────────────────────────────────────────────────

function saveData(n) {
  const profile = JSON.parse(localStorage.getItem('iw_profile') || '{}');

  if (n === 1) {
    const viviendaVal = document.querySelector('input[name="vivienda"]:checked')?.value;
    const hipotecaCapital = viviendaVal === 'hipoteca' ? (Number(document.getElementById('hipoteca_capital')?.value) || 0) : 0;
    const hipotecaCuota = viviendaVal === 'hipoteca' ? (Number(document.getElementById('hipoteca_cuota')?.value) || 0) : 0;
    const hipotecaAnos = viviendaVal === 'hipoteca' ? (Number(document.getElementById('hipoteca_anos')?.value) || 0) : 0;
    const alquilerMensual = viviendaVal === 'alquiler' ? (Number(document.getElementById('alquiler_mensual')?.value) || 0) : 0;
    const hipotecaTipo = viviendaVal === 'hipoteca' ? (document.querySelector('input[name="hipoteca_tipo"]:checked')?.value || null) : null;
    const hipotecaTin = viviendaVal === 'hipoteca' ? (Number(document.getElementById('hipoteca_tin')?.value) || null) : null;
    const hipotecaEuribor = viviendaVal === 'hipoteca' ? (Number(document.getElementById('hipoteca_euribor')?.value) || null) : null;
    const hipotecaBonificaciones = viviendaVal === 'hipoteca' ? (() => {
      const ids = ['seguro_hogar', 'seguro_vida', 'nomina', 'tarjetas', 'plan_pensiones', 'alarma'];
      return ids
        .filter(id => document.getElementById(`boni_${id}`)?.checked)
        .map(id => ({ tipo: id, coste_anual: Number(document.getElementById(`boni_${id}_coste`)?.value) || 0 }));
    })() : [];
    const hipotecaCosteAnualBonificaciones = hipotecaBonificaciones.reduce((s, b) => s + b.coste_anual, 0);
    profile.step1 = {
      edad: Number(document.getElementById('edad').value),
      ccaa: document.getElementById('ccaa').value,
      ahorros_liquidos: Number(document.getElementById('ahorros_liquidos').value) || 0,
      anios_cotizados: Number(document.getElementById('anios_cotizados').value) || 0,
      hipoteca_capital: hipotecaCapital,
      hipoteca_cuota: hipotecaCuota,
      hipoteca_anos: hipotecaAnos,
      hipoteca_tipo: hipotecaTipo,
      hipoteca_tin: hipotecaTin,
      hipoteca_euribor: hipotecaEuribor,
      hipoteca_bonificaciones: hipotecaBonificaciones,
      hipoteca_coste_anual_bonificaciones: hipotecaCosteAnualBonificaciones,
      alquiler_mensual: alquilerMensual,
      vivienda_coste_sugerido: viviendaVal === 'alquiler' ? alquilerMensual : (viviendaVal === 'hipoteca' ? hipotecaCuota : 0),
      laboral: document.querySelector('input[name="laboral"]:checked')?.value,
      estabilidad_ingresos: document.querySelector('input[name="estabilidad_ingresos"]:checked')?.value,
      familiar: document.querySelector('input[name="familiar"]:checked')?.value,
      pareja_ingresos_propios: document.getElementById('pareja_ingresos_propios')?.checked || false,
      vivienda: viviendaVal,
      dependientes: Number(document.getElementById('dependientes').value),
      tiene_seguro_vida: document.getElementById('tiene_seguro_vida')?.checked || false,
      tiene_seguro_invalidez: document.getElementById('tiene_seguro_invalidez')?.checked || false,
    };
  }

  if (n === 2) {
    profile.step2 = {
      ingresos: Number(document.getElementById('ingresos').value) || 0,
      vivienda_coste: Number(document.getElementById('vivienda_coste').value) || 0,
      ahorro_mensual: Number(document.getElementById('ahorro_mensual').value) || 0,
      fondo_emergencia: Number(document.getElementById('fondo_emergencia').value) || 0,
      deudas: Number(document.getElementById('deudas').value) || 0,
      ahorro_corto_plazo: Number(document.getElementById('ahorro_corto_plazo')?.value) || 0,
      tipos_deuda: (() => {
        const checked = [...document.querySelectorAll('input[name="tipo_deuda"]:checked')].map(el => el.value);
        if (profile.step1?.vivienda === 'hipoteca' && !checked.includes('hipoteca')) checked.unshift('hipoteca');
        return checked;
      })(),
      deuda_tae: {
        prestamo_personal: document.querySelector('input[name="tae_prestamo_personal"]:checked')?.value || null,
        tarjeta: document.querySelector('input[name="tae_tarjeta"]:checked')?.value || null,
        coche: document.querySelector('input[name="tae_coche"]:checked')?.value || null,
      },
      beneficios_empresa: [...document.querySelectorAll('input[name="beneficios_empresa"]:checked')].map(el => el.value),
      pareja: (() => {
        const tieneIngresos = document.getElementById('pareja_tiene_ingresos')?.checked || false;
        if (!tieneIngresos) return { tiene_ingresos: false };
        return {
          tiene_ingresos: true,
          ingresos: Number(document.getElementById('pareja_ingresos')?.value) || 0,
        };
      })(),
    };
    // Household income = sum of both net incomes when partner has income
    if (profile.step2.pareja?.tiene_ingresos) {
      profile.step2.ingresos_hogar = (profile.step2.ingresos || 0) + (profile.step2.pareja.ingresos || 0);
    } else {
      profile.step2.ingresos_hogar = profile.step2.ingresos || 0;
    }
  }

  if (n === 3) {
    const inversiones = collectInversiones();
    const inmuebles = collectInmuebles();
    profile.step3 = { inversiones, inmuebles };
    const invTotal = inversiones.reduce((sum, inv) => sum + inv.importe, 0);
    const inmTotal = inmuebles.reduce((sum, inm) => sum + Math.max(0, inm.valor - inm.hipoteca_pendiente), 0);
    const ahorros = profile.step1?.ahorros_liquidos || 0;
    const patrimonioTotal = ahorros + invTotal + inmTotal;
    // Keep patrimonio_neto compatible with recommendation.js
    if (!profile.step1) profile.step1 = {};
    profile.step1.patrimonio_neto = patrimonioTotal;
    profile.step1.patrimonio_bruto = patrimonioTotal;
  }

  if (n === 4) {
    const indQ = document.querySelector('input[name="independencia_quiere"]:checked')?.value;
    const rentaMensual = Number(document.getElementById('independencia_renta')?.value) || 0;
    const indPlazo = Number(document.getElementById('independencia_plazo')?.value) || 0;
    const carteraNecesaria = rentaMensual > 0 ? Math.round((rentaMensual * 12) / 0.04) : 0;

    const grandesGastos = [];
    activeGastos.forEach(tipo => {
      const entry = {
        tipo,
        importe: Number(document.getElementById(`gasto_${tipo}_importe`)?.value) || 0,
        plazo: Number(document.getElementById(`gasto_${tipo}_plazo`)?.value) || 0,
      };
      if (tipo === 'vivienda') {
        entry.ya_ahorrado = Number(document.getElementById('gasto_vivienda_ya_ahorrado')?.value) || 0;
      }
      grandesGastos.push(entry);
    });

    const edadJubilacion = Number(document.getElementById('edad_jubilacion').value) || 65;
    const edadActual = profile.step1?.edad || 0;

    const objetivos = [];
    if (indQ === 'si' || indQ === 'probablemente') {
      if (rentaMensual > 0) {
        objetivos.push({
          tipo: 'independencia',
          importe: carteraNecesaria,
          plazo: indPlazo || (edadJubilacion - edadActual),
          prioridad: 'alta',
          label: `Independencia financiera — ${rentaMensual.toLocaleString('es-ES')} €/mes`,
        });
      }
    }
    grandesGastos.forEach(g => {
      if (g.importe > 0) {
        objetivos.push({
          tipo: g.tipo,
          importe: g.importe,
          plazo: g.plazo,
          prioridad: 'media',
          label: labelGasto(g.tipo),
        });
      }
    });
    const hasIndependencia = objetivos.some(o => o.tipo === 'independencia');
    if (!hasIndependencia && edadActual > 0 && edadJubilacion > edadActual) {
      objetivos.push({
        tipo: 'jubilacion',
        importe: 0,
        plazo: edadJubilacion - edadActual,
        prioridad: 'media',
        label: `Jubilación a los ${edadJubilacion} años`,
      });
    }

    profile.step4 = {
      independencia: { quiere: indQ, renta_mensual: rentaMensual, cartera_necesaria: carteraNecesaria, plazo: indPlazo },
      grandes_gastos: grandesGastos,
      jubilacion: { edad_objetivo: edadJubilacion, edad_actual: edadActual, plazo: edadActual > 0 ? edadJubilacion - edadActual : null, renta_mensual: Number(document.getElementById('jubilacion_renta_mensual')?.value) || 0 },
      objetivos,
    };
  }

  if (n === 5) {
    const questionNames = ['riesgo_1', 'riesgo_2', 'riesgo_3', 'riesgo_5', 'riesgo_7'];
    const scores = questionNames.map(name => Number(document.querySelector(`input[name="${name}"]:checked`)?.value || 0));
    profile.step5 = { scores, total: scores.reduce((a, b) => a + b, 0) };
  }

  localStorage.setItem('iw_profile', JSON.stringify(profile));
}

function labelGasto(tipo) {
  const map = { vivienda: 'Comprar vivienda', educacion: 'Educación hijos', coche: 'Coche', negocio: 'Montar negocio', proyecto: 'Proyecto personal' };
  return map[tipo] || tipo;
}

function buildRiskProfile() {
  const profile = JSON.parse(localStorage.getItem('iw_profile') || '{}');
  const total = profile.step5?.total || 0;
  let riskProfile;
  if (total <= 3) riskProfile = 'conservador';
  else if (total <= 7) riskProfile = 'moderado';
  else if (total <= 9) riskProfile = 'dinamico';
  else riskProfile = 'agresivo';
  profile.riskProfile = riskProfile;
  profile.riskScore = total;
  localStorage.setItem('iw_profile', JSON.stringify(profile));
}

// ─── Restore ──────────────────────────────────────────────────────────────────

function restoreStep(n) {
  const profile = JSON.parse(localStorage.getItem('iw_profile') || '{}');

  if (n === 1 && profile.step1) {
    const s = profile.step1;
    if (s.edad) document.getElementById('edad').value = s.edad;
    if (s.ccaa) document.getElementById('ccaa').value = s.ccaa;
    if (s.ahorros_liquidos) document.getElementById('ahorros_liquidos').value = s.ahorros_liquidos;
    if (s.anios_cotizados) document.getElementById('anios_cotizados').value = s.anios_cotizados;
    if (s.laboral) { const el = document.querySelector(`input[name="laboral"][value="${s.laboral}"]`); if (el) el.checked = true; }
    if (s.estabilidad_ingresos) { const el = document.querySelector(`input[name="estabilidad_ingresos"][value="${s.estabilidad_ingresos}"]`); if (el) el.checked = true; }
    if (s.familiar) {
      const el = document.querySelector(`input[name="familiar"][value="${s.familiar}"]`);
      if (el) el.checked = true;
      toggleParejaWrap(s.familiar);
    }
    if (s.pareja_ingresos_propios) { const el = document.getElementById('pareja_ingresos_propios'); if (el) el.checked = true; }
    if (s.vivienda) {
      const el = document.querySelector(`input[name="vivienda"][value="${s.vivienda}"]`);
      if (el) el.checked = true;
      toggleViviendaFields(s.vivienda);
    }
    if (s.alquiler_mensual) { const el = document.getElementById('alquiler_mensual'); if (el) el.value = s.alquiler_mensual; }
    if (s.hipoteca_capital) { const el = document.getElementById('hipoteca_capital'); if (el) el.value = s.hipoteca_capital; }
    if (s.hipoteca_cuota) { const el = document.getElementById('hipoteca_cuota'); if (el) el.value = s.hipoteca_cuota; }
    if (s.hipoteca_anos) { const el = document.getElementById('hipoteca_anos'); if (el) el.value = s.hipoteca_anos; }
    if (s.hipoteca_tipo) {
      const r = document.querySelector(`input[name="hipoteca_tipo"][value="${s.hipoteca_tipo}"]`);
      if (r) { r.checked = true; onHipotecaTipoChange(); }
    }
    if (s.hipoteca_tin != null) { const el = document.getElementById('hipoteca_tin'); if (el) el.value = s.hipoteca_tin; }
    if (s.hipoteca_euribor != null) { const el = document.getElementById('hipoteca_euribor'); if (el) el.value = s.hipoteca_euribor; }
    if (s.hipoteca_bonificaciones?.length) {
      s.hipoteca_bonificaciones.forEach(b => {
        const cb = document.getElementById(`boni_${b.tipo}`);
        if (cb) cb.checked = true;
        const costeEl = document.getElementById(`boni_${b.tipo}_coste`);
        if (costeEl && b.coste_anual) costeEl.value = b.coste_anual;
      });
    }
    if (s.dependientes !== undefined) document.getElementById('dependientes').value = s.dependientes;
    if (s.tiene_seguro_vida) { const el = document.getElementById('tiene_seguro_vida'); if (el) el.checked = true; }
    if (s.tiene_seguro_invalidez) { const el = document.getElementById('tiene_seguro_invalidez'); if (el) el.checked = true; }
  }

  if (n === 2) {
    const s = profile.step2 || {};
    ['ingresos', 'vivienda_coste', 'ahorro_mensual', 'fondo_emergencia', 'deudas'].forEach(key => {
      const el = document.getElementById(key);
      if (el && s[key] !== undefined) el.value = s[key];
    });
    const vcEl = document.getElementById('vivienda_coste');
    if (vcEl && (!s.vivienda_coste || s.vivienda_coste === 0) && profile.step1?.vivienda_coste_sugerido) {
      vcEl.value = profile.step1.vivienda_coste_sugerido;
    }
    // Ocultar opción Hipoteca si ya fue capturada en paso 1
    const hipotecaLabel = document.getElementById('tipo-deuda-hipoteca-label');
    if (hipotecaLabel) {
      if (profile.step1?.vivienda === 'hipoteca') {
        hipotecaLabel.classList.add('hidden');
        const deudasEl = document.getElementById('deudas');
        if (deudasEl && (!deudasEl.value || deudasEl.value === '0') && profile.step1.hipoteca_capital) {
          deudasEl.value = profile.step1.hipoteca_capital;
        }
      } else {
        hipotecaLabel.classList.remove('hidden');
      }
    }
    if (s.ahorro_corto_plazo) { const el = document.getElementById('ahorro_corto_plazo'); if (el) el.value = s.ahorro_corto_plazo; }
    // Restaurar checkboxes de tipo_deuda (excluyendo hipoteca que se gestiona arriba)
    if (profile.step2) {
      (s.tipos_deuda || []).forEach(v => {
        const el = document.querySelector(`input[name="tipo_deuda"][value="${v}"]`);
        if (el) el.checked = true;
      });
      // Restaurar TAE por tipo de deuda
      const taeMap = s.deuda_tae || {};
      ['prestamo_personal', 'tarjeta', 'coche'].forEach(tipo => {
        if (taeMap[tipo]) {
          const el = document.querySelector(`input[name="tae_${tipo}"][value="${taeMap[tipo]}"]`);
          if (el) el.checked = true;
        }
      });
      updateDeudaTaeWrap();
    }
    (s.beneficios_empresa || []).forEach(v => {
      const el = document.querySelector(`input[name="beneficios_empresa"][value="${v}"]`);
      if (el) el.checked = true;
    });
    // Partner income section
    toggleParejaIngresoStep2();
    if (s.pareja?.tiene_ingresos) {
      const cb = document.getElementById('pareja_tiene_ingresos');
      if (cb) { cb.checked = true; onParejaIngresosChange(); }
    }
    if (s.pareja?.ingresos) { const el = document.getElementById('pareja_ingresos'); if (el) el.value = s.pareja.ingresos; }
    updateAhorroHint();
  }

  if (n === 3) {
    document.getElementById('inversiones-container').innerHTML = '';
    inversionCount = 0;
    document.getElementById('inmuebles-container').innerHTML = '';
    inmuebleCount = 0;
    if (profile.step3) {
      (profile.step3.inversiones || []).forEach(inv => addInversion(inv));
      (profile.step3.inmuebles || []).forEach(inm => addInmueble(inm));
    } else if (profile.step1?.vivienda === 'hipoteca') {
      addInmueble({
        tipo: 'vivienda_habitual',
        hipoteca_pendiente: profile.step1.hipoteca_capital || '',
        hipoteca_cuota: profile.step1.hipoteca_cuota || '',
      });
    }
  }

  if (n === 4 && profile.step4) {
    const s = profile.step4;
    if (s.independencia?.quiere) {
      const el = document.querySelector(`input[name="independencia_quiere"][value="${s.independencia.quiere}"]`);
      if (el) { el.checked = true; toggleIndependenciaDetails(s.independencia.quiere); }
    }
    if (s.independencia?.renta_mensual) { const el = document.getElementById('independencia_renta'); if (el) el.value = s.independencia.renta_mensual; }
    if (s.independencia?.plazo) { const el = document.getElementById('independencia_plazo'); if (el) el.value = s.independencia.plazo; }
    (s.grandes_gastos || []).forEach(g => {
      const el = document.getElementById(`gasto_${g.tipo}`);
      if (el) { el.checked = true; activeGastos.add(g.tipo); showBigExpenseForm(g.tipo); }
      if (g.importe) { const imp = document.getElementById(`gasto_${g.tipo}_importe`); if (imp) imp.value = g.importe; }
      if (g.plazo) { const pl = document.getElementById(`gasto_${g.tipo}_plazo`); if (pl) pl.value = g.plazo; }
      if (g.tipo === 'vivienda' && g.ya_ahorrado) { const ya = document.getElementById('gasto_vivienda_ya_ahorrado'); if (ya) ya.value = g.ya_ahorrado; }
    });
    if (s.jubilacion?.edad_objetivo) {
      document.getElementById('edad_jubilacion').value = s.jubilacion.edad_objetivo;
      document.getElementById('jubilacion-edad-display').textContent = s.jubilacion.edad_objetivo;
    }
    updateJubilacionInfo();
    updateIndependenciaCalc();
  }

  if (n === 5 && profile.step5) {
    const questionNames = ['riesgo_1', 'riesgo_2', 'riesgo_3', 'riesgo_5', 'riesgo_7'];
    (profile.step5.scores || []).forEach((val, idx) => {
      const name = questionNames[idx];
      if (!name) return;
      const radios = document.querySelectorAll(`input[name="${name}"]`);
      for (const r of radios) {
        if (r.value === String(val) && !r.checked) { r.checked = true; break; }
      }
    });
  }
}

// ─── Step 1: Vivienda dynamic fields ─────────────────────────────────────────

function toggleViviendaFields(val) {
  document.getElementById('vivienda-alquiler-fields').classList.toggle('hidden', val !== 'alquiler');
  document.getElementById('vivienda-hipoteca-fields').classList.toggle('hidden', val !== 'hipoteca');
}

function onHipotecaTipoChange() {
  const tipo = document.querySelector('input[name="hipoteca_tipo"]:checked')?.value;
  const label = document.getElementById('hipoteca_tin_label');
  const hint = document.getElementById('hipoteca_tin_hint');
  if (!label) return;
  if (tipo === 'fijo') {
    label.textContent = 'TIN (%)';
    hint.textContent = 'Tipo de interés nominal anual fijo.';
  } else if (tipo === 'variable') {
    label.textContent = 'Diferencial sobre Euribor (%)';
    hint.textContent = 'Ej: Euribor + 0.75 → escribe 0.75';
  } else if (tipo === 'mixto') {
    label.textContent = 'TIN fase fija / diferencial (%)';
    hint.textContent = 'Introduce el tipo de la fase actual.';
  }
}

document.querySelectorAll('input[name="vivienda"]').forEach(radio => {
  radio.addEventListener('change', () => toggleViviendaFields(radio.value));
});

// ─── Step 1: Pareja toggle ────────────────────────────────────────────────────

function toggleParejaIngresoStep2() {
  const profile = JSON.parse(localStorage.getItem('iw_profile') || '{}');
  const familiar = profile.step1?.familiar;
  const wrap = document.getElementById('pareja-ingreso-step2-wrap');
  if (!wrap) return;
  const show = familiar === 'pareja' || familiar === 'familia';
  wrap.classList.toggle('hidden', !show);
}

function onParejaIngresosChange() {
  const checked = document.getElementById('pareja_tiene_ingresos')?.checked;
  const col = document.getElementById('pareja-netos-col');
  if (col) col.classList.toggle('hidden', !checked);
  updateHogarAhorroHint();
  updateAhorroHint();
}

function updateHogarAhorroHint() {
  const hintEl = document.getElementById('hogar-ahorro-hint');
  if (!hintEl) return;
  const miNetos = Number(document.getElementById('ingresos')?.value) || 0;
  const parejaCheck = document.getElementById('pareja_tiene_ingresos')?.checked;
  const parejaNetos = parejaCheck ? (Number(document.getElementById('pareja_ingresos')?.value) || 0) : 0;
  if (parejaCheck && (miNetos > 0 || parejaNetos > 0)) {
    const total = miNetos + parejaNetos;
    hintEl.textContent = `Ingresos netos del hogar: ${total.toLocaleString('es-ES')} €/mes`;
    hintEl.classList.remove('hidden');
  } else {
    hintEl.classList.add('hidden');
  }
}

function toggleParejaWrap(val) {
  const wrap = document.getElementById('pareja-ingresos-wrap');
  if (!wrap) return;
  const show = val === 'pareja' || val === 'familia';
  wrap.classList.toggle('hidden', !show);
  if (!show) {
    const cb = document.getElementById('pareja_ingresos_propios');
    if (cb) cb.checked = false;
  }
}

document.querySelectorAll('input[name="familiar"]').forEach(radio => {
  radio.addEventListener('change', () => toggleParejaWrap(radio.value));
});

// ─── Step 2: Ahorro hint ──────────────────────────────────────────────────────

function updateAhorroHint() {
  const propios = Number(document.getElementById('ingresos')?.value) || 0;
  const parejaCheck = document.getElementById('pareja_tiene_ingresos')?.checked;
  const pareja = parejaCheck ? (Number(document.getElementById('pareja_ingresos')?.value) || 0) : 0;
  const ingresos = propios + pareja;
  const vivienda = Number(document.getElementById('vivienda_coste')?.value) || 0;
  const ahorro = Number(document.getElementById('ahorro_mensual')?.value) || 0;
  const hint = document.getElementById('ahorro-hint');
  if (!hint) return;
  if (ingresos > 0) {
    const quedan = ingresos - vivienda - ahorro;
    hint.textContent = quedan >= 0
      ? `Quedan ${quedan.toLocaleString('es-ES')} € estimados para gastos`
      : `⚠️ El ahorro supera los ingresos menos vivienda`;
  } else {
    hint.textContent = '';
  }
}

document.addEventListener('input', e => {
  if (['ingresos', 'vivienda_coste', 'ahorro_mensual'].includes(e.target.id)) {
    updateAhorroHint();
  }
});

function updateDeudaTaeWrap() {
  const checked = [...document.querySelectorAll('input[name="tipo_deuda"]:checked')].map(el => el.value);
  const nonHipotecaTypes = ['prestamo_personal', 'tarjeta', 'coche'];
  const anyChecked = checked.some(v => nonHipotecaTypes.includes(v));
  const wrap = document.getElementById('deuda-tae-wrap');
  if (wrap) wrap.classList.toggle('hidden', !anyChecked);
  nonHipotecaTypes.forEach(tipo => {
    const sub = document.getElementById(`tae-${tipo}`);
    if (sub) sub.classList.toggle('hidden', !checked.includes(tipo));
  });
}

document.addEventListener('change', e => {
  if (e.target.name === 'tipo_deuda') updateDeudaTaeWrap();
});

// ─── Step 3: Investment rows ───────────────────────────────────────────────────

document.getElementById('add-inversion').addEventListener('click', () => addInversion());

function addInversion(data) {
  data = data || {};
  inversionCount++;
  const id = inversionCount;
  const container = document.getElementById('inversiones-container');
  const div = document.createElement('div');
  div.className = 'bg-gray-50 p-3 rounded-xl space-y-2';
  div.id = `inv-row-${id}`;

  const typeOptions = INVESTMENT_TYPES.map(t =>
    `<option value="${t.value}" ${data.tipo === t.value ? 'selected' : ''}>${t.label}</option>`
  ).join('');
  const platformOptions = PLATFORMS.map(p =>
    `<option value="${p.value}" ${data.plataforma === p.value ? 'selected' : ''}>${p.label}</option>`
  ).join('');

  const isinTypes = ['fondo_indexado', 'fondo_activo', 'etf'];
  const showIsin = isinTypes.includes(data.tipo);
  const showNombre = showIsin;
  const showPension = data.tipo === 'plan_pensiones';
  const showVesting = data.tipo === 'stock_options';
  const isEmpresa = data.tipo_pension === 'empresa';

  div.innerHTML = `
    <div class="grid grid-cols-12 gap-2 items-start">
      <div class="col-span-4">
        <label class="text-xs text-gray-500 mb-1 block">Tipo</label>
        <select id="inv-tipo-${id}" onchange="onInvTipoChange(${id})"
          class="w-full px-2 py-1.5 border border-gray-300 rounded-lg text-xs focus:outline-none focus:ring-1 focus:ring-blue-500">
          ${typeOptions}
        </select>
        <span id="inv-illiquid-badge-${id}" class="${showPension ? '' : 'hidden'} inline-block mt-1 px-1.5 py-0.5 bg-amber-100 text-amber-700 text-xs rounded font-medium">🔒 Ilíquido</span>
      </div>
      <div class="col-span-3">
        <label class="text-xs text-gray-500 mb-1 block">Plataforma</label>
        <select id="inv-plataforma-${id}" class="w-full px-2 py-1.5 border border-gray-300 rounded-lg text-xs focus:outline-none focus:ring-1 focus:ring-blue-500">
          <option value="">Selecciona...</option>
          ${platformOptions}
        </select>
      </div>
      <div class="col-span-2">
        <label class="text-xs text-gray-500 mb-1 block">Importe (€)</label>
        <input type="number" id="inv-importe-${id}" value="${data.importe || ''}" placeholder="5000" min="0"
          class="w-full px-2 py-1.5 border border-gray-300 rounded-lg text-xs focus:outline-none focus:ring-1 focus:ring-blue-500">
      </div>
      <div class="col-span-2">
        <label class="text-xs text-gray-500 mb-1 block">TER %</label>
        <input type="number" id="inv-ter-${id}" value="${data.ter || ''}" placeholder="0.20" step="0.01" min="0" max="5"
          class="w-full px-2 py-1.5 border border-gray-300 rounded-lg text-xs focus:outline-none focus:ring-1 focus:ring-blue-500">
      </div>
      <div class="col-span-1 flex items-end pb-1">
        <button onclick="removeInversion(${id})" class="w-full text-red-400 hover:text-red-600 text-xl leading-none">×</button>
      </div>
    </div>
    <div id="inv-nombre-wrap-${id}" class="pt-1 ${showNombre ? '' : 'hidden'}">
      <div class="flex items-center gap-2">
        <div class="flex-1 relative">
          <input type="text" id="inv-nombre-${id}" value="${data.nombre || ''}" placeholder="Busca fondo, ETF, acción…" autocomplete="off"
            oninput="onFundNameInput(${id})" onblur="hideFundSuggestions(${id})"
            class="w-full px-2 py-1.5 border border-gray-300 rounded-lg text-xs focus:outline-none focus:ring-1 focus:ring-blue-500">
          <div id="inv-sugerencias-${id}" class="hidden absolute left-0 right-0 top-full mt-0.5 bg-white border border-gray-200 rounded-xl shadow-lg z-50 max-h-52 overflow-y-auto text-xs"></div>
        </div>
        <span id="inv-isin-badge-${id}" class="hidden text-xs text-green-600 font-medium whitespace-nowrap">✓ Reconocido</span>
      </div>
    </div>
    <div class="grid grid-cols-12 gap-2 items-end pt-1.5 border-t border-gray-200">
      <div class="col-span-3">
        <label class="text-xs text-gray-500 mb-1 block">Aport. mensual (€)</label>
        <input type="number" id="inv-aportacion-${id}" value="${data.aportacion_mensual || ''}" placeholder="0" min="0"
          class="w-full px-2 py-1.5 border border-gray-300 rounded-lg text-xs focus:outline-none focus:ring-1 focus:ring-blue-500">
      </div>
      <div id="inv-isin-wrap-${id}" class="col-span-5 ${showIsin ? '' : 'hidden'}">
        <label class="text-xs text-gray-500 mb-1 block">ISIN (opcional)</label>
        <input type="text" id="inv-isin-${id}" value="${data.isin || ''}" placeholder="IE00B4L5Y983"
          oninput="onIsinInput(${id})"
          class="w-full px-2 py-1.5 border border-gray-300 rounded-lg text-xs font-mono focus:outline-none focus:ring-1 focus:ring-blue-500">
      </div>
      <div id="inv-vesting-wrap-${id}" class="col-span-5 ${showVesting ? '' : 'hidden'}">
        <label class="text-xs text-gray-500 mb-1 block">Estado del vesting</label>
        <select id="inv-vesting-${id}"
          class="w-full px-2 py-1.5 border border-gray-300 rounded-lg text-xs focus:outline-none focus:ring-1 focus:ring-blue-500">
          <option value="" ${!data.vesting ? 'selected' : ''}>Selecciona...</option>
          <option value="parcialmente_consolidado" ${data.vesting === 'parcialmente_consolidado' ? 'selected' : ''}>Parcialmente consolidado</option>
          <option value="totalmente_consolidado" ${data.vesting === 'totalmente_consolidado' ? 'selected' : ''}>Totalmente consolidado</option>
        </select>
      </div>
      <div id="inv-pension-wrap-${id}" class="col-span-9 ${showPension ? '' : 'hidden'}">
        <div class="flex flex-wrap items-center gap-3">
          <label class="flex items-center gap-1.5 cursor-pointer">
            <input type="checkbox" id="inv-empresa-check-${id}" onchange="onEmpresaCheck(${id})" ${isEmpresa ? 'checked' : ''}
              class="rounded border-gray-300">
            <span class="text-xs text-gray-600">Plan de empresa (colectivo)</span>
          </label>
          <div id="inv-empresa-aport-wrap-${id}" class="${isEmpresa ? '' : 'hidden'} flex items-center gap-1.5">
            <label class="text-xs text-gray-500 whitespace-nowrap">Aport. empresa €/mes</label>
            <input type="number" id="inv-aportacion-empresa-${id}" value="${data.aportacion_empresa || ''}" placeholder="660" min="0"
              class="w-24 px-2 py-1.5 border border-gray-300 rounded-lg text-xs focus:outline-none focus:ring-1 focus:ring-blue-500">
          </div>
        </div>
      </div>
    </div>`;
  container.appendChild(div);
  // Sync conditional fields with the actual selected tipo on first render
  onInvTipoChange(id);
}

function onInvTipoChange(id) {
  const tipo = document.getElementById(`inv-tipo-${id}`)?.value;
  const isinTypes = ['fondo_indexado', 'fondo_activo', 'etf', 'acciones', 'oro_plata'];
  const isinWrap = document.getElementById(`inv-isin-wrap-${id}`);
  const nombreWrap = document.getElementById(`inv-nombre-wrap-${id}`);
  const vestingWrap = document.getElementById(`inv-vesting-wrap-${id}`);
  const pensionWrap = document.getElementById(`inv-pension-wrap-${id}`);
  const illiquidBadge = document.getElementById(`inv-illiquid-badge-${id}`);
  if (isinWrap) isinWrap.classList.toggle('hidden', !isinTypes.includes(tipo));
  if (nombreWrap) nombreWrap.classList.toggle('hidden', !isinTypes.includes(tipo));
  if (vestingWrap) vestingWrap.classList.toggle('hidden', tipo !== 'stock_options');
  if (pensionWrap) pensionWrap.classList.toggle('hidden', tipo !== 'plan_pensiones');
  if (illiquidBadge) illiquidBadge.classList.toggle('hidden', tipo !== 'plan_pensiones');
}

function onIsinInput(id) {
  const isin = document.getElementById(`inv-isin-${id}`)?.value?.trim().toUpperCase();
  const fund = isin ? FUND_LOOKUP[isin] : null;
  const badge = document.getElementById(`inv-isin-badge-${id}`);
  if (fund) {
    const nombreEl = document.getElementById(`inv-nombre-${id}`);
    const terEl = document.getElementById(`inv-ter-${id}`);
    if (nombreEl && !nombreEl.value) nombreEl.value = fund.name;
    if (terEl && !terEl.value) terEl.value = fund.ter;
    if (badge) badge.classList.remove('hidden');
  } else {
    if (badge) badge.classList.add('hidden');
  }
}

function onFundNameInput(id) {
  const query = (document.getElementById(`inv-nombre-${id}`)?.value || '').trim();
  const dropdown = document.getElementById(`inv-sugerencias-${id}`);
  if (!dropdown) return;
  if (query.length < 2) { dropdown.classList.add('hidden'); return; }

  const q = query.toLowerCase();
  const results = FUND_SEARCH_CATALOG.filter(f =>
    f.name.toLowerCase().includes(q) ||
    (f.isin && f.isin.toLowerCase().includes(q)) ||
    f.category.toLowerCase().includes(q)
  ).slice(0, 8);

  if (!results.length) { dropdown.classList.add('hidden'); return; }

  const tagClass = { FI: 'bg-blue-100 text-blue-700', ETF: 'bg-purple-100 text-purple-700', ETC: 'bg-yellow-100 text-yellow-700', Acc: 'bg-green-100 text-green-700' };

  while (dropdown.firstChild) dropdown.removeChild(dropdown.firstChild);
  results.forEach((f, i) => {
    const row = document.createElement('div');
    row.className = 'px-3 py-2 hover:bg-blue-50 cursor-pointer border-b border-gray-100 last:border-0';
    row.addEventListener('mousedown', (e) => selectFundSuggestion(id, i, e));

    const top = document.createElement('div');
    top.className = 'flex items-center gap-2';

    const tag = document.createElement('span');
    tag.className = `px-1.5 py-0.5 rounded text-xs font-semibold ${tagClass[f.tag] || 'bg-gray-100 text-gray-600'}`;
    tag.textContent = f.tag;

    const name = document.createElement('span');
    name.className = 'font-medium text-gray-800 truncate';
    name.textContent = f.name;

    top.appendChild(tag);
    top.appendChild(name);

    const bottom = document.createElement('div');
    bottom.className = 'flex items-center gap-1 mt-0.5 text-gray-400';
    if (f.isin) {
      const isinSpan = document.createElement('span');
      isinSpan.className = 'font-mono';
      isinSpan.textContent = f.isin;
      bottom.appendChild(isinSpan);
      bottom.appendChild(document.createTextNode(' · '));
    }
    const catSpan = document.createElement('span');
    catSpan.textContent = f.category;
    bottom.appendChild(catSpan);
    if (f.ter > 0) {
      bottom.appendChild(document.createTextNode(' · '));
      const terSpan = document.createElement('span');
      terSpan.textContent = `TER ${f.ter}%`;
      bottom.appendChild(terSpan);
    }

    row.appendChild(top);
    row.appendChild(bottom);
    dropdown.appendChild(row);
  });

  dropdown._results = results;
  dropdown.classList.remove('hidden');
}

function selectFundSuggestion(id, index, event) {
  event?.preventDefault();
  const dropdown = document.getElementById(`inv-sugerencias-${id}`);
  const fund = dropdown?._results?.[index];
  if (!fund) return;
  const nombreEl = document.getElementById(`inv-nombre-${id}`);
  const isinEl = document.getElementById(`inv-isin-${id}`);
  const terEl = document.getElementById(`inv-ter-${id}`);
  const badge = document.getElementById(`inv-isin-badge-${id}`);
  if (nombreEl) nombreEl.value = fund.name;
  if (isinEl && fund.isin) isinEl.value = fund.isin;
  if (terEl && fund.ter > 0) terEl.value = fund.ter;
  if (badge && fund.isin) badge.classList.remove('hidden');
  dropdown.classList.add('hidden');
}

function hideFundSuggestions(id) {
  setTimeout(() => {
    const d = document.getElementById(`inv-sugerencias-${id}`);
    if (d) d.classList.add('hidden');
  }, 150);
}

function onEmpresaCheck(id) {
  const checked = document.getElementById(`inv-empresa-check-${id}`)?.checked;
  const wrap = document.getElementById(`inv-empresa-aport-wrap-${id}`);
  if (wrap) wrap.classList.toggle('hidden', !checked);
}

function removeInversion(id) {
  document.getElementById(`inv-row-${id}`)?.remove();
}

function collectInversiones() {
  return [...document.querySelectorAll('[id^="inv-row-"]')].map(row => {
    const id = row.id.replace('inv-row-', '');
    const tipo = document.getElementById(`inv-tipo-${id}`)?.value;
    const isEmpresa = document.getElementById(`inv-empresa-check-${id}`)?.checked || false;
    return {
      tipo,
      plataforma: document.getElementById(`inv-plataforma-${id}`)?.value,
      importe: Number(document.getElementById(`inv-importe-${id}`)?.value) || 0,
      ter: Number(document.getElementById(`inv-ter-${id}`)?.value) || 0,
      aportacion_mensual: Number(document.getElementById(`inv-aportacion-${id}`)?.value) || 0,
      isin: document.getElementById(`inv-isin-${id}`)?.value?.trim() || '',
      nombre: document.getElementById(`inv-nombre-${id}`)?.value?.trim() || '',
      vesting: document.getElementById(`inv-vesting-${id}`)?.value || '',
      tipo_pension: tipo === 'plan_pensiones' ? (isEmpresa ? 'empresa' : 'personal') : undefined,
      aportacion_empresa: (tipo === 'plan_pensiones' && isEmpresa)
        ? (Number(document.getElementById(`inv-aportacion-empresa-${id}`)?.value) || 0) : 0,
    };
  }).filter(inv => inv.importe > 0);
}

// ─── Step 3: Inmuebles ────────────────────────────────────────────────────────

let inmuebleCount = 0;

document.getElementById('add-inmueble').addEventListener('click', () => addInmueble());

function addInmueble(data) {
  data = data || {};
  inmuebleCount++;
  const id = inmuebleCount;
  const container = document.getElementById('inmuebles-container');
  const div = document.createElement('div');
  div.className = 'bg-gray-50 p-3 rounded-xl space-y-2';
  div.id = `inm-row-${id}`;

  const tipoOptions = [
    { value: 'vivienda_habitual', label: '🏠 Vivienda habitual' },
    { value: 'vivienda_secundaria', label: '🏖️ Segunda residencia' },
    { value: 'alquiler', label: '🏢 Inmueble en alquiler' },
    { value: 'local_comercial', label: '🏪 Local comercial' },
    { value: 'solar', label: '📐 Solar / terreno' },
  ].map(t => `<option value="${t.value}" ${data.tipo === t.value ? 'selected' : ''}>${t.label}</option>`).join('');

  const hasHipoteca = !!data.hipoteca_pendiente;
  const isAlquiler = data.tipo === 'alquiler' || data.tipo === 'local_comercial';

  div.innerHTML = `
    <div class="grid grid-cols-12 gap-2 items-end">
      <div class="col-span-5">
        <label class="text-xs text-gray-500 mb-1 block">Tipo</label>
        <select id="inm-tipo-${id}" onchange="onInmTipoChange(${id})"
          class="w-full text-sm border border-gray-200 rounded-lg px-2 py-1.5 bg-white">
          ${tipoOptions}
        </select>
      </div>
      <div class="col-span-4">
        <label class="text-xs text-gray-500 mb-1 block">Valor estimado (€)</label>
        <input type="number" id="inm-valor-${id}" value="${data.valor || ''}" placeholder="250000" min="0"
          class="w-full text-sm border border-gray-200 rounded-lg px-2 py-1.5">
      </div>
      <div class="col-span-2">
        <label class="text-xs text-gray-500 mb-1 block">Año compra</label>
        <input type="number" id="inm-anio-${id}" value="${data.anio_compra || ''}" placeholder="2018" min="1950" max="2030"
          class="w-full text-sm border border-gray-200 rounded-lg px-2 py-1.5">
      </div>
      <div class="col-span-1 flex justify-end">
        <button onclick="document.getElementById('inm-row-${id}').remove()"
          class="text-gray-300 hover:text-red-400 text-lg leading-none transition-colors">×</button>
      </div>
    </div>
    <div class="grid grid-cols-12 gap-2 items-end pt-1.5 border-t border-gray-200">
      <div class="col-span-4 flex items-center gap-2">
        <input type="checkbox" id="inm-hipoteca-check-${id}" onchange="onHipotecaCheck(${id})" ${hasHipoteca ? 'checked' : ''}>
        <label for="inm-hipoteca-check-${id}" class="text-xs text-gray-600 cursor-pointer">Tiene hipoteca</label>
      </div>
      <div id="inm-hipoteca-wrap-${id}" class="${hasHipoteca ? '' : 'hidden'} col-span-8 grid grid-cols-3 gap-2">
        <div>
          <label class="text-xs text-gray-500 mb-1 block">Capital pendiente (€)</label>
          <input type="number" id="inm-hipoteca-pendiente-${id}" value="${data.hipoteca_pendiente || ''}" placeholder="120000" min="0"
            class="w-full text-sm border border-gray-200 rounded-lg px-2 py-1.5">
        </div>
        <div>
          <label class="text-xs text-gray-500 mb-1 block">Cuota mensual (€)</label>
          <input type="number" id="inm-hipoteca-cuota-${id}" value="${data.hipoteca_cuota || ''}" placeholder="700" min="0"
            class="w-full text-sm border border-gray-200 rounded-lg px-2 py-1.5">
        </div>
        <div>
          <label class="text-xs text-gray-500 mb-1 block">Tipo interés (%)</label>
          <input type="number" id="inm-hipoteca-tae-${id}" value="${data.hipoteca_tae || ''}" placeholder="2.5" min="0" max="20" step="0.1"
            class="w-full text-sm border border-gray-200 rounded-lg px-2 py-1.5">
        </div>
      </div>
    </div>
    <div id="inm-alquiler-wrap-${id}" class="${isAlquiler ? '' : 'hidden'} pt-1.5 border-t border-gray-200">
      <div class="w-1/2 pr-1">
        <label class="text-xs text-gray-500 mb-1 block">Ingresos alquiler (€/mes)</label>
        <input type="number" id="inm-alquiler-renta-${id}" value="${data.alquiler_renta || ''}" placeholder="900" min="0"
          class="w-full text-sm border border-gray-200 rounded-lg px-2 py-1.5">
      </div>
    </div>`;

  container.appendChild(div);
}

function onInmTipoChange(id) {
  const tipo = document.getElementById(`inm-tipo-${id}`)?.value;
  const alquilerWrap = document.getElementById(`inm-alquiler-wrap-${id}`);
  if (alquilerWrap) alquilerWrap.classList.toggle('hidden', tipo !== 'alquiler' && tipo !== 'local_comercial');
}

function onHipotecaCheck(id) {
  const checked = document.getElementById(`inm-hipoteca-check-${id}`)?.checked;
  const wrap = document.getElementById(`inm-hipoteca-wrap-${id}`);
  if (wrap) wrap.classList.toggle('hidden', !checked);
}

function collectInmuebles() {
  return [...document.querySelectorAll('[id^="inm-row-"]')].map(row => {
    const id = row.id.replace('inm-row-', '');
    const tipo = document.getElementById(`inm-tipo-${id}`)?.value;
    const hasHipoteca = document.getElementById(`inm-hipoteca-check-${id}`)?.checked || false;
    return {
      tipo,
      valor: Number(document.getElementById(`inm-valor-${id}`)?.value) || 0,
      anio_compra: Number(document.getElementById(`inm-anio-${id}`)?.value) || null,
      hipoteca_pendiente: hasHipoteca ? (Number(document.getElementById(`inm-hipoteca-pendiente-${id}`)?.value) || 0) : 0,
      hipoteca_cuota: hasHipoteca ? (Number(document.getElementById(`inm-hipoteca-cuota-${id}`)?.value) || 0) : 0,
      hipoteca_tae: hasHipoteca ? (Number(document.getElementById(`inm-hipoteca-tae-${id}`)?.value) || 0) : 0,
      alquiler_renta: (tipo === 'alquiler' || tipo === 'local_comercial')
        ? (Number(document.getElementById(`inm-alquiler-renta-${id}`)?.value) || 0) : 0,
    };
  }).filter(inm => inm.valor > 0);
}

// ─── Step 3: PDF Parsing ───────────────────────────────────────────────────────

document.getElementById('pdf-input').addEventListener('change', async (e) => {
  const file = e.target.files[0];
  if (!file) return;
  const resultEl = document.getElementById('pdf-upload-result');
  resultEl.innerHTML = `<div class="flex items-center gap-2 text-sm text-blue-600"><span class="loader"></span> Analizando PDF...</div>`;

  try {
    const text = await parsePDF(file);
    const extracted = extractInvestmentData(text);
    if (extracted.length === 0) {
      resultEl.innerHTML = `<p class="text-xs text-yellow-700 bg-yellow-50 px-3 py-2 rounded-lg">No detectamos posiciones automáticamente. Añádelas manualmente.</p>`;
      return;
    }
    document.getElementById('inversiones-container').innerHTML = '';
    inversionCount = 0;
    extracted.forEach(inv => addInversion(inv));
    resultEl.innerHTML = `<p class="text-xs text-green-700 bg-green-50 px-3 py-2 rounded-lg">✓ Detectadas ${extracted.length} posición(es) del PDF. Revisa y ajusta si es necesario.</p>`;
  } catch (err) {
    console.error('PDF parse error:', err);
    resultEl.innerHTML = `<p class="text-xs text-red-600 bg-red-50 px-3 py-2 rounded-lg">Error al leer el PDF. Prueba con otro archivo o añade manualmente.</p>`;
  }
  e.target.value = '';
});

async function parsePDF(file) {
  const arrayBuffer = await file.arrayBuffer();
  const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;
  let text = '';
  for (let i = 1; i <= Math.min(pdf.numPages, 10); i++) {
    const page = await pdf.getPage(i);
    const content = await page.getTextContent();
    text += content.items.map(item => item.str).join(' ') + ' ';
  }
  return text;
}

function extractInvestmentData(text) {
  const lower = text.toLowerCase();
  const platformMap = [
    { keys: ['indexa capital', 'indexa'], value: 'indexa' },
    { keys: ['myinvestor', 'my investor'], value: 'myinvestor' },
    { keys: ['degiro', 'de giro'], value: 'degiro' },
    { keys: ['trade republic'], value: 'trade_republic' },
    { keys: ['urbanitae'], value: 'urbanitae' },
    { keys: ['wecity'], value: 'wecity' },
    { keys: ['bit2me'], value: 'bit2me' },
    { keys: ['coinbase'], value: 'coinbase' },
    { keys: ['finizens'], value: 'finizens' },
    { keys: ['inbestme', 'inbest me'], value: 'inbestme' },
  ];

  let detectedPlatform = '';
  for (const p of platformMap) {
    if (p.keys.some(k => lower.includes(k))) { detectedPlatform = p.value; break; }
  }

  let detectedType = 'fondo_indexado';
  if (lower.includes('bitcoin') || lower.includes('ethereum') || lower.includes('cripto')) detectedType = 'cripto';
  else if (lower.includes('plan de pensiones') || lower.includes('pensiones')) detectedType = 'plan_pensiones';
  else if (lower.includes('etf')) detectedType = 'etf';
  else if (lower.includes('vanguard') || lower.includes('msci world') || lower.includes('fondo index')) detectedType = 'fondo_indexado';
  else if (lower.includes('fondo') || lower.includes('fci')) detectedType = 'fondo_activo';
  else if (lower.includes('acciones') || lower.includes('shares')) detectedType = 'acciones';
  else if (lower.includes('depósito') || lower.includes('deposito') || lower.includes('remunerada')) detectedType = 'deposito';

  const euroPattern = /(\d{1,3}(?:[.,]\d{3})*(?:[.,]\d{1,2})?)\s*€|€\s*(\d{1,3}(?:[.,]\d{3})*(?:[.,]\d{1,2})?)/g;
  const amounts = [];
  let m;
  while ((m = euroPattern.exec(text)) !== null) {
    const raw = (m[1] || m[2]).replace(/\./g, '').replace(',', '.');
    const val = parseFloat(raw);
    if (!isNaN(val) && val >= 10 && val <= 10_000_000) amounts.push(val);
  }

  if (amounts.length === 0) return [];
  const largest = Math.max(...amounts);
  return [{ tipo: detectedType, plataforma: detectedPlatform, importe: largest, ter: 0 }];
}

// ─── Step 4: Independencia financiera ─────────────────────────────────────────

document.querySelectorAll('input[name="independencia_quiere"]').forEach(radio => {
  radio.addEventListener('change', () => toggleIndependenciaDetails(radio.value));
});

function toggleIndependenciaDetails(val) {
  const details = document.getElementById('independencia-details');
  if (val === 'si' || val === 'probablemente') {
    details.classList.remove('hidden');
  } else {
    details.classList.add('hidden');
  }
}

document.addEventListener('input', e => {
  if (e.target.id === 'independencia_renta' || e.target.id === 'independencia_plazo') {
    updateIndependenciaCalc();
  }
});

function updateIndependenciaCalc() {
  const renta = Number(document.getElementById('independencia_renta')?.value) || 0;
  const calc = document.getElementById('independencia-calc');
  if (!calc) return;
  if (renta > 0) {
    const cartera = Math.round((renta * 12) / 0.04);
    calc.textContent = `Regla del 4%: necesitas una cartera de ${cartera.toLocaleString('es-ES')} € para rentar ${renta.toLocaleString('es-ES')} €/mes.`;
    calc.classList.remove('hidden');
  } else {
    calc.classList.add('hidden');
  }
}

window.toggleBigExpenseForm = function(tipo, checked) {
  if (checked) {
    activeGastos.add(tipo);
    showBigExpenseForm(tipo);
  } else {
    activeGastos.delete(tipo);
    document.getElementById(`gasto-form-${tipo}`)?.remove();
  }
};

function showBigExpenseForm(tipo) {
  const label = labelGasto(tipo);
  const container = document.getElementById('grandes-gastos-forms');
  if (document.getElementById(`gasto-form-${tipo}`)) return;
  const div = document.createElement('div');
  div.id = `gasto-form-${tipo}`;
  div.className = 'grid grid-cols-2 gap-3 bg-white p-3 rounded-xl border border-gray-200';
  const yaAhorradoField = tipo === 'vivienda' ? `
    <div class="col-span-2">
      <label class="text-xs text-gray-500 block mb-1">¿Cuánto tienes ya ahorrado para la entrada? (€)</label>
      <input type="number" id="gasto_vivienda_ya_ahorrado" placeholder="0" min="0"
        class="w-full px-2 py-1.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-1 focus:ring-blue-500">
    </div>` : '';

  div.innerHTML = `
    <div class="col-span-2 text-xs font-semibold text-gray-600">${label}</div>
    <div>
      <label class="text-xs text-gray-500 block mb-1">Importe objetivo (€)</label>
      <input type="number" id="gasto_${tipo}_importe" placeholder="50000" min="0"
        class="w-full px-2 py-1.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-1 focus:ring-blue-500">
    </div>
    <div>
      <label class="text-xs text-gray-500 block mb-1">En cuántos años</label>
      <input type="number" id="gasto_${tipo}_plazo" placeholder="5" min="1" max="50"
        class="w-full px-2 py-1.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-1 focus:ring-blue-500">
    </div>
    ${yaAhorradoField}`;
  container.appendChild(div);
}

document.getElementById('edad_jubilacion').addEventListener('input', function() {
  document.getElementById('jubilacion-edad-display').textContent = this.value;
  updateJubilacionInfo();
});

function updateJubilacionInfo() {
  const edadJub = Number(document.getElementById('edad_jubilacion').value) || 65;
  const profile = JSON.parse(localStorage.getItem('iw_profile') || '{}');
  const edadActual = profile.step1?.edad || 0;
  const infoEl = document.getElementById('jubilacion-plazo-info');
  if (!infoEl) return;
  if (edadActual > 0) {
    const plazo = edadJub - edadActual;
    infoEl.textContent = plazo > 0
      ? `Te quedan ${plazo} años para jubilarte. El tiempo es tu mayor activo.`
      : 'La edad de jubilación debe ser superior a tu edad actual.';
  } else {
    infoEl.textContent = 'Introduce tu edad en el paso 1 para ver cuántos años faltan.';
  }
}

// ─── Step 1b: Primer análisis ─────────────────────────────────────────────────

function renderStep1Analysis() {
  const profile = JSON.parse(localStorage.getItem('iw_profile') || '{}');
  const s = profile.step1 || {};
  const edad = s.edad || 30;
  const vivienda = s.vivienda || '';
  const laboral = s.laboral || '';
  const dependientes = Number(s.dependientes) || 0;
  const ahorros = s.ahorros_liquidos || 0;
  const ccaa = s.ccaa || '';
  const tieneSeguroVida = !!s.tiene_seguro_vida;
  const tieneSeguroInvalidez = !!s.tiene_seguro_invalidez;
  const parejaIngresos = !!s.pareja_ingresos_propios;
  const yearsToRetirement = Math.max(0, 67 - edad);
  const isForalTerritory = ccaa === 'PVA' || ccaa === 'NAV';

  const cards = [];

  // Horizonte temporal (siempre)
  if (yearsToRetirement >= 30) {
    cards.push({ icon: '🚀', color: 'green', title: `${yearsToRetirement} años por delante`, text: `Con ${edad} años tienes un horizonte excepcional. El interés compuesto tiene décadas para actuar y puedes asumir más volatilidad a cambio de mayor rentabilidad esperada. El tiempo es ahora mismo tu activo más valioso.` });
  } else if (yearsToRetirement >= 20) {
    cards.push({ icon: '📈', color: 'blue', title: `${yearsToRetirement} años hasta la jubilación`, text: `Con ${edad} años tienes un horizonte sólido — suficiente para que el interés compuesto haga su trabajo y para atravesar ciclos bajistas sin necesidad de vender en mal momento.` });
  } else if (yearsToRetirement >= 10) {
    cards.push({ icon: '⏳', color: 'yellow', title: `${yearsToRetirement} años hasta la jubilación`, text: `Con ${edad} años tienes un horizonte medio. Puedes seguir creciendo, pero conviene ir equilibrando el riesgo de forma progresiva según te aproximes al objetivo.` });
  } else {
    cards.push({ icon: '🎯', color: 'orange', title: `${yearsToRetirement} años hasta la jubilación`, text: `Con ${edad} años el horizonte es más ajustado. La preservación de capital gana peso — eso no significa no invertir, sino hacerlo con criterio y siendo selectivo con el riesgo.` });
  }

  // Situación de vivienda (siempre si tiene valor)
  if (vivienda === 'alquiler') {
    const det = s.alquiler_mensual > 0
      ? `Destinas ${s.alquiler_mensual.toLocaleString('es-ES')} €/mes a alquiler — dinero que cubre una necesidad pero no genera patrimonio. `
      : 'Pagas alquiler, un coste que cubre una necesidad pero no genera patrimonio. ';
    cards.push({ icon: '🏠', color: 'orange', title: 'Vivir de alquiler', text: det + 'Es importante compensar esto construyendo activos financieros sólidos. Analizaremos también si en tu situación tendría sentido plantearse la compra.' });
  } else if (vivienda === 'hipoteca') {
    const det = s.hipoteca_capital > 0
      ? `Con ${s.hipoteca_capital.toLocaleString('es-ES')} € pendientes, tu vivienda ya es un activo real. `
      : 'Tu vivienda ya es un activo real. ';
    cards.push({ icon: '🏦', color: 'green', title: 'Propietario con hipoteca', text: det + 'En el análisis veremos si tiene sentido amortizar anticipadamente o invertir ese dinero — la respuesta depende de tu tipo de interés y horizonte.' });
  } else if (vivienda === 'propietario') {
    cards.push({ icon: '🔑', color: 'green', title: 'Propietario sin carga hipotecaria', text: 'El activo más importante ya está consolidado y libre de deuda. Eso libera toda tu capacidad de ahorro mensual para construir patrimonio financiero sin presiones adicionales.' });
  } else if (vivienda === 'familia') {
    cards.push({ icon: '👨‍👩‍👧', color: 'blue', title: 'Sin gasto de vivienda propio', text: 'Vivir con familia sin coste de vivienda es una ventaja económica real que, bien aprovechada, acelera significativamente la construcción de patrimonio.' });
  }

  // 3ª tarjeta: seguros / pareja / autonomo / dependientes / ahorros
  if (laboral === 'autonomo' || laboral === 'empresario') {
    cards.push({ icon: '💼', color: 'indigo',
      title: laboral === 'autonomo' ? 'Planificación como autónomo' : 'Planificación como empresario',
      text: laboral === 'autonomo'
        ? 'Los autónomos tienen más palancas fiscales que un asalariado. Planes de pensiones, mutualidades alternativas y gestión de gastos deducibles son especialmente relevantes en tu caso.'
        : 'Una estructura societaria bien planificada puede reducir significativamente la factura fiscal. Salario vs. dividendos y planificación de la salida son cuestiones críticas.' });
  } else if (dependientes > 0) {
    const coberturaOk = tieneSeguroVida && tieneSeguroInvalidez;
    const coberturaTxt = coberturaOk
      ? 'Bien: ya tienes seguro de vida e invalidez. El análisis lo tendrá en cuenta y no lo volverá a recomendar.'
      : !tieneSeguroVida && !tieneSeguroInvalidez
      ? 'El análisis priorizará cobertura de vida e invalidez — sin esa protección, un imprevisto afectaría directamente a quien depende de ti.'
      : tieneSeguroVida
      ? 'Tienes seguro de vida. Valora añadir invalidez — es el riesgo más infravalorado para alguien con dependientes.'
      : 'Tienes seguro de invalidez. Valora añadir cobertura de vida para tus dependientes.';
    cards.push({ icon: '👨‍👩‍👧', color: coberturaOk ? 'green' : 'pink',
      title: `${dependientes} persona${dependientes > 1 ? 's' : ''} a tu cargo`,
      text: coberturaTxt });
  } else if (parejaIngresos) {
    cards.push({ icon: '👫', color: 'blue',
      title: 'Dos nóminas en el hogar',
      text: 'Con dos fuentes de ingresos, el fondo de emergencia necesario es menor y la capacidad de inversión conjunta mayor. El análisis ajustará los meses recomendados de colchón y evaluará si os conviene declarar la renta de forma conjunta o individual.' });
  } else if (ahorros > 0) {
    const ahorrosText = ahorros < 10000
      ? `Partes con ${ahorros.toLocaleString('es-ES')} € líquidos. El punto de partida importa menos de lo que parece — lo que marca la diferencia es la consistencia mensual en las aportaciones.`
      : ahorros < 50000
      ? `Tienes ${ahorros.toLocaleString('es-ES')} € líquidos disponibles — una base sólida. El análisis verá qué parte conviene mantener como fondo y qué parte poner a trabajar.`
      : `Con ${ahorros.toLocaleString('es-ES')} € líquidos, hay margen para estructurar una entrada inteligente al mercado. Veremos si tiene sentido entrar de golpe o distribuir las aportaciones en el tiempo.`;
    cards.push({ icon: '💰', color: 'teal', title: 'Tu liquidez de partida', text: ahorrosText });
  }

  // 4ª tarjeta: seguros si no se usaron antes
  if (cards.length < 4) {
    if (!tieneSeguroVida || !tieneSeguroInvalidez) {
      const falta = !tieneSeguroVida && !tieneSeguroInvalidez ? 'seguro de vida ni de invalidez'
        : !tieneSeguroVida ? 'seguro de vida'
        : 'seguro de invalidez';
      cards.push({ icon: '🛡️', color: 'yellow',
        title: 'Protección personal: ¿cubierto?',
        text: `No has indicado que tengas ${falta}. Antes de optimizar rentabilidad, conviene tener claro qué pasa si te quedas sin ingresos de forma temporal o permanente. El análisis lo incluirá en las recomendaciones.` });
    }
  }

  const palette = {
    green:  ['bg-emerald-50',  'border-emerald-100',  'text-emerald-900',  'text-emerald-700'],
    blue:   ['bg-blue-50',     'border-blue-100',     'text-blue-900',     'text-blue-700'],
    yellow: ['bg-amber-50',    'border-amber-100',    'text-amber-900',    'text-amber-700'],
    orange: ['bg-orange-50',   'border-orange-100',   'text-orange-900',   'text-orange-700'],
    purple: ['bg-purple-50',   'border-purple-100',   'text-purple-900',   'text-purple-700'],
    indigo: ['bg-indigo-50',   'border-indigo-100',   'text-indigo-900',   'text-indigo-700'],
    pink:   ['bg-pink-50',     'border-pink-100',     'text-pink-900',     'text-pink-700'],
    teal:   ['bg-teal-50',     'border-teal-100',     'text-teal-900',     'text-teal-700'],
  };

  const cardsHtml = cards.map(card => {
    const [bg, border, titleCls, bodyCls] = palette[card.color] || palette.blue;
    return `<div class="p-4 rounded-xl border ${bg} ${border}">
      <div class="flex items-start gap-3">
        <span class="text-2xl leading-none mt-0.5 flex-shrink-0">${card.icon}</span>
        <div>
          <p class="text-sm font-semibold ${titleCls} mb-1">${card.title}</p>
          <p class="text-sm ${bodyCls} leading-relaxed">${card.text}</p>
        </div>
      </div>
    </div>`;
  }).join('');

  const bullets = [
    'Calcular cuánto puedes destinar a inversión sin comprometer tu tranquilidad',
    'Evaluar si tu fondo de emergencia cubre los meses recomendados para tu perfil',
    'Detectar si hay deudas cuyo coste supera la rentabilidad esperada de invertir',
    'Dimensionar el plan de acción en euros reales, no porcentajes abstractos',
  ].map(b => `<li class="flex items-center gap-2.5 text-sm text-gray-600">
    <span class="w-4 h-4 rounded-full bg-blue-100 flex items-center justify-center flex-shrink-0"><span class="w-1.5 h-1.5 rounded-full bg-blue-500 block"></span></span>
    ${b}
  </li>`).join('');

  const el = document.getElementById('step2-callout');
  if (!el) return;
  el.classList.remove('hidden');
  el.innerHTML = `
    <details class="rounded-xl border border-blue-200 overflow-hidden">
      <summary class="cursor-pointer px-4 py-3 bg-blue-50 text-sm font-semibold text-blue-800 flex items-center gap-2 select-none" style="list-style:none">
        📊 Tu primera imagen financiera <span class="text-xs font-normal text-blue-500">(ver análisis)</span>
      </summary>
      <div class="p-4 space-y-3">
        <div class="space-y-3 mb-4">${cardsHtml}</div>
        <div class="rounded-xl bg-gray-50 border border-gray-200 p-4">
          <p class="text-sm font-semibold text-gray-800 mb-2">¿Qué viene en el paso 2?</p>
          <p class="text-sm text-gray-500 mb-3">Para completar el análisis necesitamos tu flujo de caja mensual. Con eso podremos:</p>
          <ul class="space-y-2">${bullets}</ul>
        </div>
      </div>
    </details>`;
}

// ─── Step 2b: Radiografía financiera ──────────────────────────────────────────

function renderStep2Analysis() {
  const profile = JSON.parse(localStorage.getItem('iw_profile') || '{}');
  const s1 = profile.step1 || {};
  const s2 = profile.step2 || {};

  const ingresos = s2.ingresos || 0;
  const viviendaCoste = s2.vivienda_coste || 0;
  const ahorroMensual = s2.ahorro_mensual || 0;
  const fondoEmergencia = s2.fondo_emergencia || 0;
  const deudas = s2.deudas || 0;
  const tiposDeuda = s2.tipos_deuda || [];
  const beneficiosEmpresa = s2.beneficios_empresa || [];

  const gastosTotales = ingresos > 0 ? Math.max(0, ingresos - ahorroMensual) : viviendaCoste;
  const tasaAhorro = ingresos > 0 ? Math.round((ahorroMensual / ingresos) * 100) : 0;
  const mesesEmergencia = gastosTotales > 0 ? Math.round((fondoEmergencia / gastosTotales) * 10) / 10 : 0;
  const estabilidad = s1.estabilidad_ingresos || '';
  const parejaIngresos = !!s1.pareja_ingresos_propios;
  const mesesRecomendados = (estabilidad === 'variable' || estabilidad === 'emprendedor') ? 9 : parejaIngresos ? 3 : 6;
  const tieneDeudaCara = tiposDeuda.some(t => t === 'tarjeta_credito' || t === 'prestamo_personal' || t === 'financiacion_coche');
  const ccaa = s1.ccaa || '';
  const isForalTerritory = ccaa === 'PVA' || ccaa === 'NAV';
  const tramo2 = s2.tramo_irpf || '';
  const tramoTipos2 = { t4: 37, t5: 45, t6: 47 };
  const tipoMarginal = tramoTipos2[tramo2];

  const cards = [];

  // Card 0: Tramo IRPF (si está calculado)
  if (tipoMarginal) {
    const instrumento = isForalTerritory ? 'EPSV' : 'plan de pensiones';
    const limite = isForalTerritory ? '5.000 €/año (régimen foral)' : '1.500 €/año';
    cards.push({ icon: '💡', color: 'purple',
      title: `Tipo marginal del ${tipoMarginal}%: úsalo a tu favor`,
      text: `Cada euro aportado a un ${instrumento} te ahorra ${tipoMarginal} céntimos en la declaración. Con el límite de ${limite}, el ahorro fiscal es inmediato y garantizado — independiente de lo que haga el mercado.` });
  }

  // Card 1: Tasa de ahorro / capacidad de inversión (siempre)
  if (tasaAhorro >= 30) {
    cards.push({ icon: '🏆', color: 'green',
      title: `Tasa de ahorro del ${tasaAhorro}%`,
      text: `Estás ahorrando ${ahorroMensual.toLocaleString('es-ES')} €/mes — una disciplina financiera excelente. Con este ritmo, el interés compuesto puede hacer un trabajo muy potente. El análisis verá cómo asignar ese ahorro de forma óptima.` });
  } else if (tasaAhorro >= 20) {
    cards.push({ icon: '📈', color: 'blue',
      title: `Tasa de ahorro del ${tasaAhorro}%`,
      text: `Ahorras ${ahorroMensual.toLocaleString('es-ES')} €/mes — por encima de la media española. Tienes base sólida para construir un plan de inversión consistente sin sacrificar tu calidad de vida.` });
  } else if (tasaAhorro >= 10) {
    cards.push({ icon: '💪', color: 'yellow',
      title: `Tasa de ahorro del ${tasaAhorro}%`,
      text: `Ahorras ${ahorroMensual.toLocaleString('es-ES')} €/mes — un punto de partida razonable. El análisis buscará palancas para aumentar ese margen: pequeños ajustes de gasto o ingresos adicionales pueden tener gran impacto a largo plazo.` });
  } else if (ingresos > 0) {
    cards.push({ icon: '⚡', color: 'orange',
      title: tasaAhorro > 0 ? `Tasa de ahorro del ${tasaAhorro}%` : 'Margen de ahorro ajustado',
      text: `Con ${ahorroMensual.toLocaleString('es-ES')} €/mes de ahorro, el margen es estrecho. La prioridad será optimizar el flujo de caja antes que la rentabilidad — pequeños cambios en la estructura de gastos pueden liberar capital significativo.` });
  } else {
    cards.push({ icon: '💡', color: 'blue',
      title: 'Flujo de caja a analizar',
      text: 'Con los datos de tu situación financiera, el análisis completo determinará qué margen real tienes disponible y cómo estructurarlo de forma eficiente.' });
  }

  // Card 2: Fondo de emergencia (siempre)
  if (fondoEmergencia === 0) {
    cards.push({ icon: '🛡️', color: 'orange',
      title: 'Fondo de emergencia pendiente',
      text: `Sin colchón de liquidez, cualquier imprevisto obliga a deshacer inversiones en el peor momento. La prioridad antes de invertir es construir un fondo de ${mesesRecomendados} meses de gastos — en tu caso, unos ${(gastosTotales * mesesRecomendados).toLocaleString('es-ES')} €.` });
  } else if (mesesEmergencia >= mesesRecomendados) {
    cards.push({ icon: '🛡️', color: 'green',
      title: `Fondo de emergencia: ${mesesEmergencia} meses cubiertos`,
      text: `Con ${fondoEmergencia.toLocaleString('es-ES')} € de reserva, tienes la protección necesaria para invertir con tranquilidad. No necesitas tocar ese dinero aunque el mercado caiga — que es exactamente para lo que sirve.` });
  } else {
    const faltante = Math.round(gastosTotales * mesesRecomendados - fondoEmergencia);
    cards.push({ icon: '🛡️', color: 'yellow',
      title: `Fondo de emergencia: ${mesesEmergencia} de ${mesesRecomendados} meses`,
      text: `Tienes ${fondoEmergencia.toLocaleString('es-ES')} € de colchón — bien empezado. Para alcanzar los ${mesesRecomendados} meses recomendados para tu perfil, faltan unos ${faltante.toLocaleString('es-ES')} €. El plan priorizará completarlo antes de escalar la inversión.` });
  }

  // Card 3: Deudas si existen, si no → ratio vivienda/ingresos
  if (deudas > 0) {
    if (tieneDeudaCara) {
      cards.push({ icon: '⚠️', color: 'orange',
        title: `${deudas.toLocaleString('es-ES')} € en deuda de alto coste`,
        text: `Las tarjetas de crédito y préstamos personales suelen tener tipos del 8–25% TAE. Rentabilidad difícilmente supera esos niveles de forma consistente — amortizar esta deuda es la mejor inversión que puedes hacer ahora mismo.` });
    } else {
      cards.push({ icon: '🏦', color: 'blue',
        title: `${deudas.toLocaleString('es-ES')} € en deuda`,
        text: `Tu deuda parece estructural (hipoteca u otro préstamo de bajo coste). En estos casos no siempre conviene amortizar anticipadamente — depende del tipo de interés vs. la rentabilidad esperada. El análisis lo evaluará caso a caso.` });
    }
  } else if (ingresos > 0 && viviendaCoste > 0) {
    const ratioVivienda = Math.round((viviendaCoste / ingresos) * 100);
    if (ratioVivienda <= 25) {
      cards.push({ icon: '✅', color: 'green',
        title: `Vivienda: ${ratioVivienda}% de tus ingresos`,
        text: `Destinas ${viviendaCoste.toLocaleString('es-ES')} €/mes a vivienda — por debajo del umbral saludable del 30%. Eso libera capacidad de ahorro real y te da flexibilidad para construir patrimonio sin presión.` });
    } else if (ratioVivienda <= 35) {
      cards.push({ icon: '🏠', color: 'yellow',
        title: `Vivienda: ${ratioVivienda}% de tus ingresos`,
        text: `Destinas ${viviendaCoste.toLocaleString('es-ES')} €/mes a vivienda — en el límite recomendado. No es un problema si el resto de gastos están controlados, pero deja poco margen de maniobra ante imprevistos.` });
    } else {
      cards.push({ icon: '⚠️', color: 'orange',
        title: `Vivienda: ${ratioVivienda}% de tus ingresos`,
        text: `Destinas ${viviendaCoste.toLocaleString('es-ES')} €/mes a vivienda — por encima del 35% recomendado. Esto comprime el margen de ahorro y puede limitar tus opciones de inversión. El análisis buscará cómo optimizar el flujo restante.` });
    }
  }

  // Card 4: Beneficios empresa, o proyección patrimonio, o sin deudas y sin vivienda coste
  if (cards.length < 4) {
    if (beneficiosEmpresa.length > 0) {
      const labels = {
        plan_pensiones_empresa: 'plan de pensiones empresa',
        seguro_medico: 'seguro médico',
        ticket_restaurante: 'ticket restaurante',
        coche_empresa: 'coche de empresa',
        stock_options: 'stock options',
        seguro_vida: 'seguro de vida',
      };
      const listaBeneficios = beneficiosEmpresa.map(b => labels[b] || b).join(', ');
      cards.push({ icon: '🎁', color: 'indigo',
        title: `Beneficios en especie: ${beneficiosEmpresa.length} activo${beneficiosEmpresa.length > 1 ? 's' : ''}`,
        text: `Cuentas con ${listaBeneficios}. Estos beneficios tienen implicaciones fiscales y pueden complementar o sustituir parte de tu estrategia de inversión. El análisis los integrará en la recomendación.` });
    } else if (ahorroMensual > 0) {
      const ahorrosLiquidos = s1.ahorros_liquidos || 0;
      const en10anos = Math.round(ahorrosLiquidos * Math.pow(1.07, 10) + ahorroMensual * 12 * ((Math.pow(1.07, 10) - 1) / 0.07));
      cards.push({ icon: '🔭', color: 'teal',
        title: 'Lo que el tiempo puede hacer',
        text: `Con tus ahorros líquidos actuales y ${ahorroMensual.toLocaleString('es-ES')} €/mes de ahorro, a una rentabilidad histórica del 7% anual, en 10 años estarías cerca de los ${en10anos.toLocaleString('es-ES')} €. El paso 3 afinará esto con lo que ya tienes invertido.` });
    }
  }

  const palette = {
    green:  ['bg-emerald-50',  'border-emerald-100',  'text-emerald-900',  'text-emerald-700'],
    blue:   ['bg-blue-50',     'border-blue-100',     'text-blue-900',     'text-blue-700'],
    yellow: ['bg-amber-50',    'border-amber-100',    'text-amber-900',    'text-amber-700'],
    orange: ['bg-orange-50',   'border-orange-100',   'text-orange-900',   'text-orange-700'],
    purple: ['bg-purple-50',   'border-purple-100',   'text-purple-900',   'text-purple-700'],
    indigo: ['bg-indigo-50',   'border-indigo-100',   'text-indigo-900',   'text-indigo-700'],
    pink:   ['bg-pink-50',     'border-pink-100',     'text-pink-900',     'text-pink-700'],
    teal:   ['bg-teal-50',     'border-teal-100',     'text-teal-900',     'text-teal-700'],
  };

  const cardsHtml = cards.map(card => {
    const [bg, border, titleCls, bodyCls] = palette[card.color] || palette.blue;
    return `<div class="p-4 rounded-xl border ${bg} ${border}">
      <div class="flex items-start gap-3">
        <span class="text-2xl leading-none mt-0.5 flex-shrink-0">${card.icon}</span>
        <div>
          <p class="text-sm font-semibold ${titleCls} mb-1">${card.title}</p>
          <p class="text-sm ${bodyCls} leading-relaxed">${card.text}</p>
        </div>
      </div>
    </div>`;
  }).join('');

  const bullets = [
    'Ver qué activos ya tienes en cartera y cuánto valen hoy',
    'Detectar solapamientos, huecos o activos dormidos que no están trabajando',
    'Calcular qué porcentaje de tu patrimonio está invertido vs. en liquidez sin rentabilidad',
    'Saber si tus plataformas y productos actuales encajan con tu perfil y objetivos',
  ].map(b => `<li class="flex items-center gap-2.5 text-sm text-gray-600">
    <span class="w-4 h-4 rounded-full bg-blue-100 flex items-center justify-center flex-shrink-0"><span class="w-1.5 h-1.5 rounded-full bg-blue-500 block"></span></span>
    ${b}
  </li>`).join('');

  const el = document.getElementById('step3-callout');
  if (!el) return;
  el.classList.remove('hidden');
  el.innerHTML = `
    <details class="rounded-xl border border-blue-200 overflow-hidden">
      <summary class="cursor-pointer px-4 py-3 bg-blue-50 text-sm font-semibold text-blue-800 flex items-center gap-2 select-none" style="list-style:none">
        💊 Tu radiografía financiera <span class="text-xs font-normal text-blue-500">(ver análisis)</span>
      </summary>
      <div class="p-4 space-y-3">
        <div class="space-y-3 mb-4">${cardsHtml}</div>
        <div class="rounded-xl bg-gray-50 border border-gray-200 p-4">
          <p class="text-sm font-semibold text-gray-800 mb-2">¿Qué viene en el paso 3?</p>
          <p class="text-sm text-gray-500 mb-3">Ahora queremos saber qué tienes ya invertido. Con eso podremos:</p>
          <ul class="space-y-2">${bullets}</ul>
        </div>
      </div>
    </details>`;
}

function skipStep3() {
  document.getElementById('inversiones-container').innerHTML = '';
  document.getElementById('inmuebles-container').innerHTML = '';
  saveData(3);
  currentStep = 4;
  showStep(4);
  restoreStep(4);
}

// ─── Reset ────────────────────────────────────────────────────────────────────

document.getElementById('btn-reset').addEventListener('click', () => {
  if (!confirm('¿Borrar todos los datos y empezar de nuevo?')) return;
  localStorage.removeItem('iw_profile');
  currentStep = 1;
  showStep(1);
});

// ─── Init (refinement path — runs even when refinar-body is hidden) ───────────

showStep(1);
restoreStep(1);

// ─── Fast-track navigation ────────────────────────────────────────────────────

function fmtEur(n) {
  return (n || 0).toLocaleString('es-ES') + ' €';
}

const FAST_TRACK = [
  { id: 'edad',             type: 'number', inputId: 'q-edad',       step: 1, required: true  },
  { id: 'ahorros_liquidos', type: 'number', inputId: 'q-ahorros',    step: 1, required: true  },
  { id: 'ingresos',         type: 'number', inputId: 'q-ingresos',   step: 2, required: true  },
  { id: 'ahorro_mensual',   type: 'number', inputId: 'q-ahorro',     step: 2, required: true  },
  { id: 'ya_inviertes',     type: 'radio',  name:    'q-ya-inviertes', step: 1, required: true },
  { id: 'riesgo_1',         type: 'radio',  name:    'q-r1',         step: 5, required: true  },
  { id: 'riesgo_2',         type: 'radio',  name:    'q-r2',         step: 5, required: true  },
  { id: 'riesgo_3',         type: 'radio',  name:    'q-r3',         step: 5, required: true  },
  { id: 'riesgo_7',         type: 'radio',  name:    'q-r7',         step: 5, required: true  },
];

let currentQ = 0;

function showQuestion(n) {
  document.querySelectorAll('.q-screen').forEach(el => el.classList.add('hidden'));
  const screen = document.querySelector(`.q-screen[data-q="${n + 1}"]`);
  if (!screen) return;
  screen.classList.remove('hidden');
  document.getElementById('q-counter').textContent = `${n + 1} de ${FAST_TRACK.length}`;
  document.getElementById('q-progress-bar').style.width = `${((n + 1) / FAST_TRACK.length) * 100}%`;
  document.getElementById('q-prev').classList.toggle('hidden', n === 0);
  const input = screen.querySelector('input[inputmode="numeric"], input[type="number"]');
  if (input) setTimeout(() => input.focus(), 80);
}

function ftFormatNum(el) {
  const n = Number(el.value.replace(/\./g, '').replace(/,/g, ''));
  if (el.value !== '' && !isNaN(n)) el.value = n.toLocaleString('es-ES');
}

function ftDeformatNum(el) {
  el.value = el.value.replace(/\./g, '');
}

function getQValue(q) {
  if (q.type === 'number') {
    const raw = document.getElementById(q.inputId)?.value;
    if (raw === '' || raw === null || raw === undefined) return null;
    const v = Number(raw.replace(/\./g, '').replace(/,/g, ''));
    return isNaN(v) ? null : v;
  }
  const checked = document.querySelector(`input[name="${q.name}"]:checked`);
  return checked ? checked.value : null;
}

function showQError(q) {
  const screen = document.querySelector(`.q-screen[data-q="${currentQ + 1}"]`);
  const errEl = screen?.querySelector('[id$="-err"]');
  if (errEl) {
    errEl.classList.remove('hidden');
    setTimeout(() => errEl.classList.add('hidden'), 2500);
  }
}

function saveQAnswer(q, val) {
  const profile = JSON.parse(localStorage.getItem('iw_profile') || '{}');
  const key = `step${q.step}`;
  profile[key] = profile[key] || {};
  profile[key][q.id] = val !== null ? val : 0;
  localStorage.setItem('iw_profile', JSON.stringify(profile));
}

function nextQuestion() {
  const q = FAST_TRACK[currentQ];
  const val = getQValue(q);
  if (q.required && val === null) { showQError(q); return; }
  if (q.id === 'edad' && val !== null && (val < 18 || val > 80)) { showQError(q); return; }
  saveQAnswer(q, val);
  updateDashboard(q.id, val);
  if (q.id === 'ya_inviertes' && val === 'si') {
    currentQ++;
    ftShowPortfolioScreen();
    return;
  }
  if (currentQ < FAST_TRACK.length - 1) {
    currentQ++;
    showQuestion(currentQ);
  } else {
    completeFastTrack();
  }
}

function prevQuestion() {
  if (currentQ > 0) { currentQ--; showQuestion(currentQ); }
}

const calcRiskScore = s5 =>
  ['riesgo_1', 'riesgo_2', 'riesgo_3', 'riesgo_7'].reduce((t, k) => t + (Number(s5[k]) || 0), 0);

function completeFastTrack() {
  const profile = JSON.parse(localStorage.getItem('iw_profile') || '{}');
  const s5 = profile.step5 || {};
  const total = calcRiskScore(s5);
  const rp = total <= 3 ? 'conservador' : total <= 7 ? 'moderado' : total <= 10 ? 'dinamico' : 'agresivo';
  profile.step5 = profile.step5 || {};
  profile.step5.total = total;
  profile.riskProfile = rp;
  profile.riskScore = total;
  localStorage.setItem('iw_profile', JSON.stringify(profile));
  showRiskProfileInDash(rp, total);
  document.querySelectorAll('.q-screen').forEach(el => el.classList.add('hidden'));
  const ctaScreen = document.querySelector('.q-screen[data-q="10"]');
  if (ctaScreen) ctaScreen.classList.remove('hidden');
  document.getElementById('q-next').classList.add('hidden');
  document.getElementById('q-prev').classList.add('hidden');
  document.getElementById('q-counter').textContent = '✓ Completado';
  document.getElementById('q-progress-bar').style.width = '100%';
}

function openRefinar() {
  document.getElementById('question-panel').classList.add('hidden');
  document.getElementById('refinar-wrap').classList.remove('hidden');
  document.getElementById('refinar-details').open = true;
  [1, 2, 3, 4, 5].forEach(n => restoreStep(n));
  showStep(1);
}

// ─── Live dashboard ───────────────────────────────────────────────────────────

function addDashCard(key, emoji, label, value, sub) {
  const dash = document.getElementById('live-dashboard');
  if (!dash) return;
  document.getElementById('dash-empty')?.classList.add('hidden');
  let card = document.getElementById(`dash-${key}`);
  if (!card) {
    card = document.createElement('div');
    card.id = `dash-${key}`;
    card.className = 'dash-card bg-white rounded-xl border border-gray-100 shadow-sm p-4';
    dash.appendChild(card);
  }
  card.innerHTML = `
    <div class="flex items-center gap-2 mb-1">
      <span>${emoji}</span>
      <span class="text-xs text-gray-400 uppercase tracking-wide font-medium">${label}</span>
    </div>
    <div class="text-xl font-bold text-gray-900">${value}</div>
    <p class="text-xs text-gray-400 mt-0.5">${sub}</p>`;
}

const DASHBOARD_UPDATES = {
  edad: (val) => {
    const h = Math.max(0, 67 - val);
    const sub = h > 25 ? 'Largo plazo · máxima capacidad de riesgo'
               : h > 10 ? 'Medio plazo · equilibrio'
               : 'Corto plazo · conservadurismo';
    addDashCard('horizonte', '⏳', 'Horizonte', `~${h} años`, sub);
  },
  ahorros_liquidos: (val) => {
    const tier = val < 5000 ? 'Nivel inicial' : val < 25000 ? 'Nivel medio' : val < 100000 ? 'Nivel avanzado' : 'Alto patrimonio';
    addDashCard('patrimonio', '💼', 'Patrimonio', fmtEur(val), tier);
  },
  ahorro_mensual: (val) => {
    const profile = JSON.parse(localStorage.getItem('iw_profile') || '{}');
    const ing = profile.step2?.ingresos || 0;
    if (ing > 0) {
      const rate = Math.round((val / ing) * 100);
      const chip = rate >= 20 ? '🟢 Excelente' : rate >= 10 ? '🟡 Buen ritmo' : '🔴 Puede mejorar';
      addDashCard('ahorro', '📊', 'Tasa de ahorro', `${rate}%`, chip);
      const gastos = Math.max(0, ing - val);
      const recomendado = gastos * 3;
      const liquido = profile.step1?.ahorros_liquidos || 0;
      const sub = liquido >= recomendado
        ? `✅ Ya cubierto con tus ${fmtEur(liquido)} en líquido`
        : `Tienes ${fmtEur(liquido)} — faltan ${fmtEur(recomendado - liquido)}`;
      addDashCard('emergencia', '🛡️', 'Fondo recomendado', fmtEur(recomendado), sub);
    }
  },
  ya_inviertes: (val) => {
    if (val === 'si') {
      addDashCard('inversion', '📊', 'Inversiones', 'Ya inviertes', 'Analizaremos tu cartera actual');
    } else {
      addDashCard('inversion', '🌱', 'Inversiones', 'Empezando', 'Te recomendaremos desde cero');
    }
  },
  riesgo_7: () => {
    const profile = JSON.parse(localStorage.getItem('iw_profile') || '{}');
    const s5 = profile.step5 || {};
    const total = calcRiskScore(s5);
    const rp = total <= 3 ? 'conservador' : total <= 7 ? 'moderado' : total <= 10 ? 'dinamico' : 'agresivo';
    showRiskProfileInDash(rp, total);
  },
};

function showRiskProfileInDash(rp, score) {
  const alloc = { conservador:[20,60,20], moderado:[60,30,10], 'dinamico':[75,15,10], agresivo:[90,5,5] };
  const [eq, fi, ca] = alloc[rp] || [60,30,10];
  addDashCard('perfil', '🎯', 'Tu perfil de riesgo', rp.charAt(0).toUpperCase() + rp.slice(1), `Puntuación: ${score}`);
  const card = document.getElementById('dash-perfil');
  if (!card) return;
  card.innerHTML += `
    <div class="mt-3 pt-3 border-t border-gray-100 space-y-1 text-xs">
      <div class="flex justify-between"><span class="text-gray-400">Renta variable</span><span class="font-semibold text-gray-700">${eq}%</span></div>
      <div class="flex justify-between"><span class="text-gray-400">Renta fija</span><span class="font-semibold text-gray-700">${fi}%</span></div>
      <div class="flex justify-between"><span class="text-gray-400">Liquidez</span><span class="font-semibold text-gray-700">${ca}%</span></div>
    </div>`;
}

function updateDashboard(questionId, val) {
  const fn = DASHBOARD_UPDATES[questionId];
  if (fn) fn(val);
}

// Wire fast-track nav
document.getElementById('q-next').addEventListener('click', nextQuestion);
document.getElementById('q-prev').addEventListener('click', prevQuestion);

// Enter key advances number questions
document.addEventListener('keydown', e => {
  if (e.key !== 'Enter') return;
  const panel = document.getElementById('question-panel');
  if (!panel || panel.classList.contains('hidden')) return;
  const active = document.querySelector('.q-screen:not(.hidden)');
  if (active && active.dataset.q !== '10' && active.dataset.q !== 'portfolio-input') nextQuestion();
});

showQuestion(0);

// ── Fast-track portfolio screen ────────────────────────────────────────────
let ftPortfolio = [];
let ftSelectedFund = null;

const FT_TAG_TO_TIPO = {
  'FI': 'fondo_indexado', 'FA': 'fondo_activo', 'ETF': 'etf',
  'Stock': 'acciones', 'ETC': 'etf', 'REIT': 'etf',
};

function ftShowPortfolioScreen() {
  document.querySelectorAll('.q-screen').forEach(el => el.classList.add('hidden'));
  const scr = document.querySelector('.q-screen[data-q="portfolio-input"]');
  if (scr) scr.classList.remove('hidden');
  document.getElementById('q-next').classList.add('hidden');
  document.getElementById('q-prev').classList.add('hidden');
  document.getElementById('q-counter').textContent = '📂 Cartera actual';
  document.getElementById('q-progress-bar').style.width = '55%';
  ftRenderList();
}

function ftFundSearch() {
  const term = (document.getElementById('ft-fund-name')?.value || '').toLowerCase().trim();
  const box = document.getElementById('ft-suggestions');
  if (!box) return;
  if (term.length < 2) { box.classList.add('hidden'); box.innerHTML = ''; return; }
  const results = (FUND_SEARCH_CATALOG || []).filter(f =>
    f.name.toLowerCase().includes(term) ||
    (f.isin && f.isin.toLowerCase().includes(term)) ||
    (f.category && f.category.toLowerCase().includes(term))
  ).slice(0, 8);
  if (!results.length) { box.classList.add('hidden'); return; }
  box.innerHTML = results.map((f, i) =>
    `<div class="px-4 py-2.5 cursor-pointer hover:bg-gray-50 border-b border-gray-50 last:border-0"
         onclick="ftSelectSuggestion(${i})">
       <div class="font-medium text-gray-800 text-xs">${f.name}</div>
       <div class="text-gray-400 text-xs">${f.isin || ''} ${f.tag ? '· ' + f.tag : ''}</div>
     </div>`
  ).join('');
  box._results = results;
  box.classList.remove('hidden');
}

function ftSelectSuggestion(i) {
  const box = document.getElementById('ft-suggestions');
  const fund = box?._results?.[i];
  if (!fund) return;
  ftSelectedFund = fund;
  const nameEl = document.getElementById('ft-fund-name');
  if (nameEl) nameEl.value = fund.name;
  box.classList.add('hidden');
  document.getElementById('ft-fund-amount')?.focus();
}

function ftAddFund() {
  const nameEl = document.getElementById('ft-fund-name');
  const amtEl  = document.getElementById('ft-fund-amount');
  const name   = (nameEl?.value || '').trim();
  const importe = parseFloat(amtEl?.value || '') || 0;
  if (!name) { nameEl?.focus(); return; }
  if (importe <= 0) { amtEl?.focus(); return; }
  const f = ftSelectedFund;
  ftPortfolio.push({
    nombre:    f?.name || name,
    isin:      f?.isin || '',
    importe,
    ter:       f?.ter || 0,
    tipo:      FT_TAG_TO_TIPO[f?.tag] || f?.tipo || 'otros',
    plataforma: '',
  });
  ftSelectedFund = null;
  if (nameEl) nameEl.value = '';
  if (amtEl)  amtEl.value  = '';
  document.getElementById('ft-suggestions')?.classList.add('hidden');
  ftRenderList();
  nameEl?.focus();
}

function ftQuickAdd(tipo, name) {
  ftSelectedFund = { tipo };
  const nameEl = document.getElementById('ft-fund-name');
  if (nameEl) { nameEl.value = name; }
  document.getElementById('ft-fund-amount')?.focus();
}

function ftRemoveFund(idx) {
  ftPortfolio.splice(idx, 1);
  ftRenderList();
}

function ftRenderList() {
  const list = document.getElementById('ft-portfolio-list');
  const emptyMsg = document.getElementById('ft-empty-msg');
  if (!list) return;
  if (!ftPortfolio.length) {
    list.innerHTML = '';
    if (emptyMsg) { emptyMsg.classList.remove('hidden'); list.appendChild(emptyMsg); }
    return;
  }
  if (emptyMsg) emptyMsg.classList.add('hidden');
  list.innerHTML = ftPortfolio.map((item, i) => `
    <div class="flex items-center justify-between bg-gray-50 rounded-lg px-3 py-2 text-xs">
      <div class="min-w-0 flex-1">
        <span class="font-medium text-gray-800 truncate block">${item.nombre}</span>
        ${item.isin ? `<span class="text-gray-400">${item.isin}</span>` : ''}
      </div>
      <div class="ml-3 flex items-center gap-2 shrink-0">
        <span class="font-semibold text-gray-700">${fmtEur(item.importe)}</span>
        <button onclick="ftRemoveFund(${i})" class="text-gray-300 hover:text-red-400 transition-colors text-base leading-none">×</button>
      </div>
    </div>`
  ).join('');
}

function ftExitPortfolio(goBack = false) {
  if (goBack) currentQ = 4;
  document.getElementById('q-next').classList.remove('hidden');
  showQuestion(currentQ);
}

function ftSavePortfolio() {
  if (!ftPortfolio.length) { ftExitPortfolio(); return; }
  const profile = JSON.parse(localStorage.getItem('iw_profile') || '{}');
  profile.step3 = profile.step3 || {};
  profile.step3.inversiones = ftPortfolio;
  localStorage.setItem('iw_profile', JSON.stringify(profile));
  const total = ftPortfolio.reduce((s, x) => s + x.importe, 0);
  addDashCard('cartera', '📂', 'Cartera actual', fmtEur(total), `${ftPortfolio.length} posición${ftPortfolio.length !== 1 ? 'es' : ''}`);
  ftExitPortfolio();
}
