import { describe, expect, it } from 'vitest';
import { news } from './news.route';

describe('POST /translate', () => {
  it('rejects a request missing required fields', async () => {
    const req = new Request('http://localhost/translate', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ themeId: 1 }),
    });
    const res = await news.fetch(req);
    expect(res.status).toBe(400);
    const body = (await res.json()) as { error: string };
    expect(body.error).toBe('invalid_request');
  });
});

describe('POST /:id/publish', () => {
  it('rejects a non-numeric id', async () => {
    const req = new Request('http://localhost/not-a-number/publish', { method: 'POST' });
    const res = await news.fetch(req);
    expect(res.status).toBe(400);
  });
});
