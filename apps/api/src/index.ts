import { Hono } from 'hono';
import { cors } from 'hono/cors';
import { health } from './domains/health/health.route';

type Bindings = {
  DB: D1Database;
  FMP_API_KEY: string;
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

// Add new domains here: app.route('/api/<name>', <name>Router)

export default app;
