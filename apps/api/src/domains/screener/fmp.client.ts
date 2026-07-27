export type FmpFundamentals = {
  price: number | null;
  peRatio: number | null;
  pbRatio: number | null;
  dividendYield: number | null;
  marketCap: number | null;
  eps: number | null;
  revenueGrowthYoy: number | null;
  debtToEquity: number | null;
  freeCashFlowYield: number | null;
};

const FMP_BASE_URL = 'https://financialmodelingprep.com/stable';

/**
 * Field names below are best-effort from FMP's public docs — not yet confirmed
 * against a live response (no FMP_API_KEY provisioned yet). Re-verify field
 * casing once a real key is available: see PIPELINE.md Next Session Plan.
 */
export async function fetchFundamentals(
  ticker: string,
  apiKey: string
): Promise<FmpFundamentals | null> {
  const [quote, ratios, keyMetrics, growth] = await Promise.all([
    fetchJsonArray(`${FMP_BASE_URL}/quote?symbol=${ticker}&apikey=${apiKey}`),
    fetchJsonArray(`${FMP_BASE_URL}/ratios-ttm?symbol=${ticker}&apikey=${apiKey}`),
    fetchJsonArray(`${FMP_BASE_URL}/key-metrics-ttm?symbol=${ticker}&apikey=${apiKey}`),
    fetchJsonArray(`${FMP_BASE_URL}/financial-growth?symbol=${ticker}&apikey=${apiKey}&limit=1`),
  ]);

  const q = quote?.[0];
  const r = ratios?.[0];
  const km = keyMetrics?.[0];
  const g = growth?.[0];

  if (!q && !r && !km) return null;

  return {
    price: numberOrNull(q?.price),
    peRatio: numberOrNull(r?.priceToEarningsRatioTTM ?? q?.pe),
    pbRatio: numberOrNull(r?.priceToBookRatioTTM),
    dividendYield: numberOrNull(r?.dividendYieldTTM),
    marketCap: numberOrNull(km?.marketCapTTM ?? q?.marketCap),
    eps: numberOrNull(q?.eps),
    revenueGrowthYoy: numberOrNull(g?.revenueGrowth),
    debtToEquity: numberOrNull(r?.debtToEquityRatioTTM),
    freeCashFlowYield: numberOrNull(km?.freeCashFlowYieldTTM),
  };
}

function numberOrNull(value: unknown): number | null {
  return typeof value === 'number' ? value : null;
}

async function fetchJsonArray(url: string): Promise<Record<string, unknown>[] | null> {
  const res = await fetch(url);
  if (!res.ok) return null;
  const body = await res.json();
  return Array.isArray(body) ? (body as Record<string, unknown>[]) : null;
}
