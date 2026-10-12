// Typical prices, so visitors get a feel for cost before they ask.
//
// These are NOT Poonam's prices. They are the low and high full-fee
// (non-subsidised) prices published by several Australian training providers
// for each course, rounded, as checked on the date below. Government-funded,
// concession and international-student prices are left out. Sources for every
// range are listed in PRICING.md.
//
// Once Poonam agrees fees with her partner RTO(s), set `fees` on the course in
// courses.js: the site then shows that fee instead of the typical range.

export const pricesCheckedOn = 'October 2026';

// [low, high] in AUD. `rpl` is only set where providers publish an RPL price.
export const typicalPrices = {
  CHC33021: { study: [3000, 12450], rpl: [1400, 2500], note: 'Most private providers charge $3,000–$7,000; university and TAFE full fees are higher.' },
  CHC43121: { study: [3000, 9300] },
  CHC43015: { study: [4200, 10650], rpl: [2000, 2550] },
  CHC52025: { study: [6500, 22850], rpl: [3500, 4000], note: 'Private providers charge about $6,500–$9,000; Victorian TAFE full fees are about $20,000 or more.' },
  CHC62015: { study: [5000, 6000] },
  CHC51015: { study: [4200, 13300] },
  CHC30125: { study: [3000, 3400], rpl: [2000, 2700], note: 'Based mostly on prices for the previous version of this qualification (CHC30121).' },
  CHC40225: { study: [3250, 5900] },
  CHC50125: { study: [3300, 7500], rpl: [2100, 2700] },
  CHC50225: { study: [3500, 7900], note: 'Based mostly on prices for the previous version of this qualification (CHC50221).' },
  TAE40122: { study: [2800, 7850], rpl: [1800, 3950] },
  BSB41419: { study: [2500, 4800], rpl: [1100, 2750] },
  BSB50420: { study: [3500, 9000], rpl: [1750, 2750] },
  CPC50220: { study: [6500, 38400], rpl: [2550, 5500], note: 'Private and online providers charge about $6,500–$16,500; Victorian TAFE full fees are about $20,000–$38,000.' },
  HLTAID009: { study: [45, 100] },
  HLTAID011: { study: [95, 190] },
};

export const money = (n) => `$${n.toLocaleString('en-AU')}`;

const rangeText = ([lo, hi]) => (lo === hi ? money(lo) : `${money(lo)}–${money(hi)}`);

// Lowest typical price across study and RPL, used for "from $X".
export const priceFrom = (c) => {
  const p = typicalPrices[c.code];
  if (!p) return null;
  return Math.min(p.study?.[0] ?? Infinity, p.rpl?.[0] ?? Infinity);
};

// Short label for cards: the study price range, or a prompt to ask.
export const priceRange = (c) => {
  if (c.fees) return c.fees;
  const p = typicalPrices[c.code];
  return p?.study ? rangeText(p.study) : 'Ask for a quote';
};

// Both ranges, for course pages and the compare table.
export const priceDetail = (c) => {
  const p = typicalPrices[c.code];
  if (!p) return null;
  return {
    study: p.study ? rangeText(p.study) : null,
    rpl: p.rpl ? rangeText(p.rpl) : null,
    note: p.note ?? '',
  };
};
