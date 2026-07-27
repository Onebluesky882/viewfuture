import { Hono } from 'hono';
import { cors } from 'hono/cors';
import { health } from './domains/health/health.route';
import { news } from './domains/news/news.route';
import { screener } from './domains/screener/screener.route';
import { themesRoute } from './domains/themes/themes.route';
import { watchlist } from './domains/watchlist/watchlist.route';

type Bindings = {
  DB: D1Database;
  FMP_API_KEY: string;
  KIMI_API: string;
  KIMI_BASE_URL?: string;
  KIMI_MODEL?: string;
};

const app = new Hono<{ Bindings: Bindings }>();

app.use(
  '*',
  cors({
    origin: ['http://localhost:3000', 'http://localhost:3001'],
    allowHeaders: ['Content-Type', 'Authorization'],
    allowMethods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    credentials: true,
  })
);

app.route('/health', health);
app.route('/api/news', news);
app.route('/api/screener', screener);
app.route('/api/themes', themesRoute);
app.route('/api/watchlist', watchlist);

// Add new domains here: app.route('/api/<name>', <name>Router)

export default app;
