import {
  asc,
  createDb,
  desc,
  eq,
  fundamentalSnapshots,
  screeningRuns,
  stockScores,
  stocks,
} from '@viewfuture/db';
import { Hono } from 'hono';
import { z } from 'zod';
import { fetchFundamentals } from './fmp.client';
import { computeScoresForRun, type PeerSnapshot } from './scoring';

type Bindings = {
  DB: D1Database;
  FMP_API_KEY: string;
};

const screener = new Hono<{ Bindings: Bindings }>();

const runRequestSchema = z.object({
  tickers: z.array(z.string().min(1)).optional(),
});

screener.post('/run', async (c) => {
  const parsed = runRequestSchema.safeParse(await c.req.json().catch(() => ({})));
  if (!parsed.success) {
    return c.json({ error: 'invalid_request', details: parsed.error.flatten() }, 400);
  }

  const db = createDb(c.env.DB);
  const activeStocks = await db
    .select()
    .from(stocks)
    .where(eq(stocks.isActive, true))
    .orderBy(asc(stocks.ticker));

  const targets = parsed.data.tickers
    ? activeStocks.filter((s) => parsed.data.tickers?.includes(s.ticker))
    : activeStocks;

  if (targets.length === 0) {
    return c.json({ error: 'no_stocks_to_score' }, 400);
  }

  const asOfDate = new Date().toISOString().slice(0, 10);

  const fetched = await Promise.allSettled(
    targets.map(async (stock) => ({
      stock,
      fundamentals: await fetchFundamentals(stock.ticker, c.env.FMP_API_KEY),
    }))
  );

  const peerSnapshots: PeerSnapshot[] = [];

  for (const result of fetched) {
    if (result.status !== 'fulfilled' || !result.value.fundamentals) continue;
    const { stock, fundamentals } = result.value;

    const [snapshot] = await db
      .insert(fundamentalSnapshots)
      .values({
        stockId: stock.id,
        asOfDate,
        price: fundamentals.price,
        peRatio: fundamentals.peRatio,
        pbRatio: fundamentals.pbRatio,
        dividendYield: fundamentals.dividendYield,
        marketCap: fundamentals.marketCap,
        eps: fundamentals.eps,
        revenueGrowthYoy: fundamentals.revenueGrowthYoy,
        debtToEquity: fundamentals.debtToEquity,
        freeCashFlowYield: fundamentals.freeCashFlowYield,
      })
      .onConflictDoUpdate({
        target: [fundamentalSnapshots.stockId, fundamentalSnapshots.asOfDate],
        set: {
          price: fundamentals.price,
          peRatio: fundamentals.peRatio,
          pbRatio: fundamentals.pbRatio,
          dividendYield: fundamentals.dividendYield,
          marketCap: fundamentals.marketCap,
          eps: fundamentals.eps,
          revenueGrowthYoy: fundamentals.revenueGrowthYoy,
          debtToEquity: fundamentals.debtToEquity,
          freeCashFlowYield: fundamentals.freeCashFlowYield,
        },
      })
      .returning();

    peerSnapshots.push({
      stockId: stock.id,
      sector: stock.sector,
      peRatio: snapshot.peRatio,
      pbRatio: snapshot.pbRatio,
      dividendYield: snapshot.dividendYield,
      revenueGrowthYoy: snapshot.revenueGrowthYoy,
      debtToEquity: snapshot.debtToEquity,
      freeCashFlowYield: snapshot.freeCashFlowYield,
    });
  }

  if (peerSnapshots.length === 0) {
    return c.json({ error: 'no_fundamentals_fetched' }, 502);
  }

  const scores = computeScoresForRun(peerSnapshots);

  const [run] = await db.insert(screeningRuns).values({ peerGroupBy: 'sector' }).returning();

  const insertedScores = await db
    .insert(stockScores)
    .values(
      scores.map((score) => ({
        runId: run.id,
        stockId: score.stockId,
        valuationPercentile: score.valuationPercentile,
        fundamentalScore: score.fundamentalScore,
        dividendScore: score.dividendScore,
        compositeScore: score.compositeScore,
        rank: score.rank,
      }))
    )
    .returning();

  return c.json({ run, scores: insertedScores }, 201);
});

screener.get('/runs', async (c) => {
  const db = createDb(c.env.DB);
  const runs = await db.select().from(screeningRuns).orderBy(desc(screeningRuns.runAt)).limit(20);
  return c.json({ runs });
});

screener.get('/runs/:id/scores', async (c) => {
  const id = Number(c.req.param('id'));
  if (!Number.isInteger(id) || id <= 0) {
    return c.json({ error: 'invalid_id' }, 400);
  }

  const db = createDb(c.env.DB);
  const rows = await db
    .select({
      rank: stockScores.rank,
      compositeScore: stockScores.compositeScore,
      valuationPercentile: stockScores.valuationPercentile,
      fundamentalScore: stockScores.fundamentalScore,
      dividendScore: stockScores.dividendScore,
      ticker: stocks.ticker,
      name: stocks.name,
      sector: stocks.sector,
    })
    .from(stockScores)
    .innerJoin(stocks, eq(stockScores.stockId, stocks.id))
    .where(eq(stockScores.runId, id))
    .orderBy(asc(stockScores.rank));

  return c.json({ scores: rows });
});

export { screener };
