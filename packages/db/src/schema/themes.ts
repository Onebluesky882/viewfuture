import { integer, primaryKey, real, sqliteTable, text } from 'drizzle-orm/sqlite-core';
import { stocks } from './stocks';

export const themes = sqliteTable('themes', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  slug: text('slug').notNull().unique(),
  name: text('name').notNull(),
  description: text('description'),
  createdAt: integer('created_at', { mode: 'timestamp' })
    .notNull()
    .$defaultFn(() => new Date()),
});

export const themeStocks = sqliteTable(
  'theme_stocks',
  {
    themeId: integer('theme_id')
      .notNull()
      .references(() => themes.id),
    stockId: integer('stock_id')
      .notNull()
      .references(() => stocks.id),
    relevance: real('relevance').notNull().default(1),
  },
  (table) => [primaryKey({ columns: [table.themeId, table.stockId] })]
);
