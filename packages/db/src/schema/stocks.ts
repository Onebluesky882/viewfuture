import { integer, sqliteTable, text } from 'drizzle-orm/sqlite-core';

export const stocks = sqliteTable('stocks', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  ticker: text('ticker').notNull().unique(),
  name: text('name').notNull(),
  exchange: text('exchange'),
  sector: text('sector'),
  industry: text('industry'),
  currency: text('currency').notNull().default('USD'),
  isActive: integer('is_active', { mode: 'boolean' }).notNull().default(true),
  createdAt: integer('created_at', { mode: 'timestamp' })
    .notNull()
    .$defaultFn(() => new Date()),
});
