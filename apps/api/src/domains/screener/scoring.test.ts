import { describe, expect, it } from 'vitest';
import { computeScoresForRun, type PeerSnapshot, type StockScoreResult } from './scoring';

function snapshot(overrides: Partial<PeerSnapshot> & { stockId: number }): PeerSnapshot {
  return {
    sector: 'Technology',
    peRatio: null,
    pbRatio: null,
    dividendYield: null,
    revenueGrowthYoy: null,
    debtToEquity: null,
    freeCashFlowYield: null,
    ...overrides,
  };
}

function findByStockId(results: StockScoreResult[], stockId: number): StockScoreResult {
  const result = results.find((r) => r.stockId === stockId);
  if (!result) throw new Error(`no result for stockId ${stockId}`);
  return result;
}

describe('computeScoresForRun', () => {
  it('ranks the cheaper stock higher on valuation within the same peer group', () => {
    const cheap = snapshot({ stockId: 1, peRatio: 10, pbRatio: 1 });
    const expensive = snapshot({ stockId: 2, peRatio: 30, pbRatio: 5 });

    const results = computeScoresForRun([cheap, expensive]);
    const cheapResult = findByStockId(results, 1);
    const expensiveResult = findByStockId(results, 2);

    expect(cheapResult.valuationPercentile).not.toBeNull();
    expect(expensiveResult.valuationPercentile).not.toBeNull();
    expect(cheapResult.valuationPercentile as number).toBeGreaterThan(
      expensiveResult.valuationPercentile as number
    );
    expect(cheapResult.rank).toBe(1);
  });

  it('only compares stocks within the same sector', () => {
    const techCheap = snapshot({ stockId: 1, sector: 'Technology', peRatio: 10 });
    const techExpensive = snapshot({ stockId: 2, sector: 'Technology', peRatio: 40 });
    const energyOnly = snapshot({ stockId: 3, sector: 'Energy', peRatio: 100 });

    const results = computeScoresForRun([techCheap, techExpensive, energyOnly]);
    const energyResult = findByStockId(results, 3);

    // Sole member of its peer group: no peer to compare against, so it lands at the midpoint.
    expect(energyResult.valuationPercentile).toBe(50);
  });

  it('assigns dense, gapless global ranks ordered by composite score', () => {
    const snapshots = [
      snapshot({ stockId: 1, peRatio: 10, revenueGrowthYoy: 0.2, dividendYield: 0.03 }),
      snapshot({ stockId: 2, peRatio: 20, revenueGrowthYoy: 0.1, dividendYield: 0.02 }),
      snapshot({ stockId: 3, peRatio: 30, revenueGrowthYoy: 0.05, dividendYield: 0.01 }),
    ];

    const results = computeScoresForRun(snapshots);
    const ranks = results.map((r) => r.rank).sort((a, b) => a - b);
    expect(ranks).toEqual([1, 2, 3]);

    for (let i = 1; i < results.length; i++) {
      const prev = results[i - 1];
      const curr = results[i];
      expect(prev.compositeScore).toBeGreaterThanOrEqual(curr.compositeScore);
    }
  });

  it('returns null sub-scores when no relevant data is present', () => {
    const [result] = computeScoresForRun([snapshot({ stockId: 1 })]);
    expect(result.valuationPercentile).toBeNull();
    expect(result.fundamentalScore).toBeNull();
    expect(result.dividendScore).toBeNull();
    expect(result.compositeScore).toBe(0);
  });
});
