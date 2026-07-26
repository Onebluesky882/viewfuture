import { createDb, eq, newsEvents } from '@viewfuture/db';
import { Hono } from 'hono';
import { z } from 'zod';

type Bindings = {
  DB: D1Database;
  KIMI_API: string;
  KIMI_BASE_URL?: string;
  KIMI_MODEL?: string;
};

const news = new Hono<{ Bindings: Bindings }>();

const translateRequestSchema = z.object({
  themeId: z.number().int().positive(),
  slug: z.string().min(1),
  sourceTitle: z.string().min(1),
  sourceBody: z.string().min(1),
  sourceUrl: z.string().url(),
  targetLanguage: z.string().min(2).default('th'),
});

news.post('/translate', async (c) => {
  const parsed = translateRequestSchema.safeParse(await c.req.json());
  if (!parsed.success) {
    return c.json({ error: 'invalid_request', details: parsed.error.flatten() }, 400);
  }
  const { themeId, slug, sourceTitle, sourceBody, sourceUrl, targetLanguage } = parsed.data;

  const baseUrl = c.env.KIMI_BASE_URL ?? 'https://api.moonshot.ai/v1';
  const model = c.env.KIMI_MODEL ?? 'kimi-latest';

  const completion = await fetch(`${baseUrl}/chat/completions`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${c.env.KIMI_API}`,
    },
    body: JSON.stringify({
      model,
      temperature: 0.2,
      messages: [
        {
          role: 'system',
          content:
            'You translate financial news articles faithfully into the target language. Translate only — do not add analysis, predictions, opinions, or investment recommendations that are not in the source text.',
        },
        {
          role: 'user',
          content: `Translate the following article into ${targetLanguage}. Return only the translated body text.\n\nTitle: ${sourceTitle}\n\nBody:\n${sourceBody}`,
        },
      ],
    }),
  });

  if (!completion.ok) {
    return c.json({ error: 'kimi_request_failed', status: completion.status }, 502);
  }

  const result = (await completion.json()) as {
    choices?: { message: { content: string } }[];
  };
  const translatedBody = result.choices?.[0]?.message.content;
  if (!translatedBody) {
    return c.json({ error: 'kimi_empty_response' }, 502);
  }

  const db = createDb(c.env.DB);
  const [inserted] = await db
    .insert(newsEvents)
    .values({
      themeId,
      slug,
      title: sourceTitle,
      body: translatedBody,
      sourceUrl,
      model,
      status: 'draft',
    })
    .returning();

  return c.json({ news: inserted }, 201);
});

news.get('/', async (c) => {
  const db = createDb(c.env.DB);
  const rows = await db.select().from(newsEvents).where(eq(newsEvents.status, 'published'));
  return c.json({ news: rows });
});

news.post('/:id/publish', async (c) => {
  const id = Number(c.req.param('id'));
  if (!Number.isInteger(id) || id <= 0) {
    return c.json({ error: 'invalid_id' }, 400);
  }

  const db = createDb(c.env.DB);
  const [updated] = await db
    .update(newsEvents)
    .set({ status: 'published', publishedAt: new Date() })
    .where(eq(newsEvents.id, id))
    .returning();

  if (!updated) {
    return c.json({ error: 'not_found' }, 404);
  }
  return c.json({ news: updated });
});

export { news };
