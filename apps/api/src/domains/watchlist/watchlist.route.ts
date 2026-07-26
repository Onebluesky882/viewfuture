import { asc, createDb, eq, stocks } from '@viewfuture/db';
import { Hono } from 'hono';

type Bindings = {
  DB: D1Database;
};

const watchlist = new Hono<{ Bindings: Bindings }>();

watchlist.get('/', async (c) => {
  const db = createDb(c.env.DB);
  const rows = await db
    .select({
      id: stocks.id,
      ticker: stocks.ticker,
      name: stocks.name,
      sector: stocks.sector,
      exchange: stocks.exchange,
    })
    .from(stocks)
    .where(eq(stocks.isActive, true))
    .orderBy(asc(stocks.ticker));

  return c.json({ stocks: rows });
});

export { watchlist };
