import { integer, sqliteTable, text } from 'drizzle-orm/sqlite-core';
import { themes } from './themes';

export const newsEvents = sqliteTable('news_events', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  themeId: integer('theme_id')
    .notNull()
    .references(() => themes.id),
  slug: text('slug').notNull().unique(),
  title: text('title').notNull(),
  body: text('body').notNull(),
  sourceUrl: text('source_url').notNull(),
  model: text('model').notNull().default('kimi'),
  status: text('status', { enum: ['draft', 'published'] })
    .notNull()
    .default('draft'),
  createdAt: integer('created_at', { mode: 'timestamp' })
    .notNull()
    .$defaultFn(() => new Date()),
  publishedAt: integer('published_at', { mode: 'timestamp' }),
});
