import { integer, real, sqliteTable, text, uniqueIndex } from 'drizzle-orm/sqlite-core';
import { stocks } from './stocks';

export const fundamentalSnapshots = sqliteTable(
  'fundamental_snapshots',
  {
    id: integer('id').primaryKey({ autoIncrement: true }),
    stockId: integer('stock_id')
      .notNull()
      .references(() => stocks.id),
    asOfDate: text('as_of_date').notNull(),
    price: real('price'),
    peRatio: real('pe_ratio'),
    pbRatio: real('pb_ratio'),
    dividendYield: real('dividend_yield'),
    marketCap: real('market_cap'),
    eps: real('eps'),
    revenueGrowthYoy: real('revenue_growth_yoy'),
    debtToEquity: real('debt_to_equity'),
    freeCashFlowYield: real('free_cash_flow_yield'),
    fetchedAt: integer('fetched_at', { mode: 'timestamp' })
      .notNull()
      .$defaultFn(() => new Date()),
  },
  (table) => [uniqueIndex('fundamental_snapshots_stock_date_idx').on(table.stockId, table.asOfDate)]
);
