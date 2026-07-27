import { describe, expect, it } from 'vitest';
import { screener } from './screener.route';

describe('POST /run', () => {
  it('rejects a request with a non-array tickers field', async () => {
    const req = new Request('http://localhost/run', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ tickers: 'AAPL' }),
    });
    const res = await screener.fetch(req);
    expect(res.status).toBe(400);
    const body = (await res.json()) as { error: string };
    expect(body.error).toBe('invalid_request');
  });
});

describe('GET /runs/:id/scores', () => {
  it('rejects a non-numeric id', async () => {
    const req = new Request('http://localhost/runs/not-a-number/scores');
    const res = await screener.fetch(req);
    expect(res.status).toBe(400);
  });
});
