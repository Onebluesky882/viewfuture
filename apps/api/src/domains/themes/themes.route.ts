import { createDb, eq, sql, themeStocks, themes } from '@viewfuture/db';
import { Hono } from 'hono';

type Bindings = {
  DB: D1Database;
};

const themesRoute = new Hono<{ Bindings: Bindings }>();

themesRoute.get('/', async (c) => {
  const db = createDb(c.env.DB);
  const rows = await db
    .select({
      id: themes.id,
      slug: themes.slug,
      name: themes.name,
      description: themes.description,
      stockCount: sql<number>`count(${themeStocks.stockId})`,
    })
    .from(themes)
    .leftJoin(themeStocks, eq(themes.id, themeStocks.themeId))
    .groupBy(themes.id);

  return c.json({ themes: rows });
});

export { themesRoute };
