import { integer, real, sqliteTable, text, uniqueIndex } from 'drizzle-orm/sqlite-core';
import { stocks } from './stocks';
import { themes } from './themes';

export const screeningRuns = sqliteTable('screening_runs', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  runAt: integer('run_at', { mode: 'timestamp' })
    .notNull()
    .$defaultFn(() => new Date()),
  peerGroupBy: text('peer_group_by').notNull().default('sector'),
  notes: text('notes'),
});

export const stockScores = sqliteTable(
  'stock_scores',
  {
    id: integer('id').primaryKey({ autoIncrement: true }),
    runId: integer('run_id')
      .notNull()
      .references(() => screeningRuns.id),
    stockId: integer('stock_id')
      .notNull()
      .references(() => stocks.id),
    themeId: integer('theme_id').references(() => themes.id),
    valuationPercentile: real('valuation_percentile'),
    fundamentalScore: real('fundamental_score'),
    dividendScore: real('dividend_score'),
    entrySignalScore: real('entry_signal_score'),
    compositeScore: real('composite_score').notNull(),
    rank: integer('rank'),
  },
  (table) => [uniqueIndex('stock_scores_run_stock_idx').on(table.runId, table.stockId)]
);
