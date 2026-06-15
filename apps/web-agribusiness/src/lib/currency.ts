const RATES_URL = 'https://api.exchangerate-api.com/v4/latest/USD';

let _cache: { rates: Record<string, number>; fetchedAt: number } | null = null;
const TTL_MS = 60 * 60 * 1000;

export async function fetchUSDRates(): Promise<Record<string, number>> {
  if (_cache && Date.now() - _cache.fetchedAt < TTL_MS) return _cache.rates;
  const res = await fetch(RATES_URL);
  if (!res.ok) throw new Error('Failed to fetch exchange rates');
  const data = (await res.json()) as { rates: Record<string, number> };
  _cache = { rates: { ...data.rates, USD: 1 }, fetchedAt: Date.now() };
  return _cache.rates;
}

export function convertCurrency(
  amount: number,
  from: string,
  to: string,
  rates: Record<string, number>,
): number {
  if (from === to) return amount;
  const fromRate = rates[from];
  const toRate = rates[to];
  if (!fromRate || !toRate) return amount;
  return (amount / fromRate) * toRate;
}

export function fmtCurrency(amount: number, currency: string): string {
  try {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency,
      maximumFractionDigits: 0,
    }).format(amount);
  } catch {
    return `${currency} ${amount.toLocaleString()}`;
  }
}
