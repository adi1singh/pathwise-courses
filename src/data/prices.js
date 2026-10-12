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
export const typicalPrices = {};

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
