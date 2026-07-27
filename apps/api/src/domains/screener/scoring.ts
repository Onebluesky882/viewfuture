export type PeerSnapshot = {
  stockId: number;
  sector: string | null;
  peRatio: number | null;
  pbRatio: number | null;
  dividendYield: number | null;
  revenueGrowthYoy: number | null;
  debtToEquity: number | null;
  freeCashFlowYield: number | null;
};

export type StockScoreResult = {
  stockId: number;
  valuationPercentile: number | null;
  fundamentalScore: number | null;
  dividendScore: number | null;
  compositeScore: number;
  rank: number;
};

export const SCORE_WEIGHTS = {
  valuation: 0.4,
  fundamental: 0.4,
  dividend: 0.2,
};

/** 0-100: share of `values` that `value` is greater than or equal to (ties split). */
function percentileRank(values: number[], value: number): number {
  if (values.length === 0) return 50;
  const below = values.filter((v) => v < value).length;
  const equal = values.filter((v) => v === value).length;
  return ((below + equal / 2) / values.length) * 100;
}

/** Percentile rank where a *lower* raw value is better (e.g. PE, debt/equity). */
function inversePercentileRank(values: number[], value: number): number {
  return 100 - percentileRank(values, value);
}

function average(values: (number | null)[]): number | null {
  const present = values.filter((v): v is number => v !== null);
  if (present.length === 0) return null;
  return present.reduce((sum, v) => sum + v, 0) / present.length;
}

function groupBySector(snapshots: PeerSnapshot[]): Map<string, PeerSnapshot[]> {
  const groups = new Map<string, PeerSnapshot[]>();
  for (const snapshot of snapshots) {
    const key = snapshot.sector ?? 'unknown';
    const group = groups.get(key);
    if (group) {
      group.push(snapshot);
    } else {
      groups.set(key, [snapshot]);
    }
  }
  return groups;
}

/**
 * Peer-group (sector) percentile scoring: each stock is ranked only against
 * stocks sharing its sector, then composite-scored and globally ranked.
 */
export function computeScoresForRun(snapshots: PeerSnapshot[]): StockScoreResult[] {
  const groups = groupBySector(snapshots);
  const unranked: Omit<StockScoreResult, 'rank'>[] = [];

  for (const peers of groups.values()) {
    const peValues = peers.map((p) => p.peRatio).filter((v): v is number => v !== null);
    const pbValues = peers.map((p) => p.pbRatio).filter((v): v is number => v !== null);
    const growthValues = peers
      .map((p) => p.revenueGrowthYoy)
      .filter((v): v is number => v !== null);
    const debtValues = peers.map((p) => p.debtToEquity).filter((v): v is number => v !== null);
    const fcfYieldValues = peers
      .map((p) => p.freeCashFlowYield)
      .filter((v): v is number => v !== null);
    const dividendValues = peers.map((p) => p.dividendYield).filter((v): v is number => v !== null);

    for (const peer of peers) {
      const valuationPercentile = average([
        peer.peRatio === null ? null : inversePercentileRank(peValues, peer.peRatio),
        peer.pbRatio === null ? null : inversePercentileRank(pbValues, peer.pbRatio),
      ]);

      const fundamentalScore = average([
        peer.revenueGrowthYoy === null ? null : percentileRank(growthValues, peer.revenueGrowthYoy),
        peer.debtToEquity === null ? null : inversePercentileRank(debtValues, peer.debtToEquity),
        peer.freeCashFlowYield === null
          ? null
          : percentileRank(fcfYieldValues, peer.freeCashFlowYield),
      ]);

      const dividendScore =
        peer.dividendYield === null ? null : percentileRank(dividendValues, peer.dividendYield);

      const compositeScore =
        (valuationPercentile ?? 0) * SCORE_WEIGHTS.valuation +
        (fundamentalScore ?? 0) * SCORE_WEIGHTS.fundamental +
        (dividendScore ?? 0) * SCORE_WEIGHTS.dividend;

      unranked.push({
        stockId: peer.stockId,
        valuationPercentile,
        fundamentalScore,
        dividendScore,
        compositeScore,
      });
    }
  }

  return unranked
    .sort((a, b) => b.compositeScore - a.compositeScore)
    .map((result, index) => ({ ...result, rank: index + 1 }));
}
