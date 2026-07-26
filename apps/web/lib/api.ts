const API_URL = process.env.NEXT_PUBLIC_API_URL;

export async function apiFetch<T>(path: string): Promise<T> {
  if (!API_URL) {
    throw new Error('NEXT_PUBLIC_API_URL is not set');
  }
  const res = await fetch(`${API_URL}${path}`);
  if (!res.ok) {
    throw new Error(`API request failed: ${res.status} ${path}`);
  }
  return res.json() as Promise<T>;
}

export type Theme = {
  id: number;
  slug: string;
  name: string;
  description: string | null;
  stockCount: number;
};

export type WatchlistStock = {
  id: number;
  ticker: string;
  name: string;
  sector: string | null;
  exchange: string | null;
};
