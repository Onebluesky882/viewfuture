'use client';

import { useQuery } from '@tanstack/react-query';
import { apiFetch, type WatchlistStock } from '@/lib/api';
import { BackButton } from './back-button';

export function WatchlistView() {
  const { data, isLoading, isError } = useQuery({
    queryKey: ['watchlist'],
    queryFn: () => apiFetch<{ stocks: WatchlistStock[] }>('/api/watchlist'),
  });

  return (
    <main style={{ maxWidth: 1200, margin: '0 auto', padding: '48px 32px' }}>
      <BackButton />
      <h1 style={{ fontSize: 28, fontWeight: 800, color: 'var(--text)', marginBottom: 8 }}>
        Watchlist
      </h1>
      <p style={{ color: 'var(--text-muted)', fontSize: 14, marginBottom: 32 }}>
        หุ้นที่ติดตามอยู่ พร้อมคะแนนและ signal ล่าสุด
      </p>

      {isLoading && <p style={{ color: 'var(--text-muted)', fontSize: 14 }}>Loading...</p>}
      {isError && (
        <p style={{ color: 'var(--red)', fontSize: 14 }}>
          โหลดข้อมูลไม่สำเร็จ — ตรวจสอบว่า API และ D1 database ถูกตั้งค่าแล้ว
        </p>
      )}
      {data && data.stocks.length === 0 && (
        <p style={{ color: 'var(--text-muted)', fontSize: 14 }}>ยังไม่มีหุ้นในระบบ</p>
      )}

      {data && data.stocks.length > 0 && (
        <div className="card" style={{ overflow: 'hidden' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ borderBottom: '1px solid var(--border)' }}>
                {['Ticker', 'Name', 'Sector', 'Exchange'].map((h) => (
                  <th
                    key={h}
                    style={{
                      textAlign: 'left',
                      padding: '12px 16px',
                      fontSize: 11,
                      textTransform: 'uppercase',
                      letterSpacing: '0.05em',
                      color: 'var(--text-muted)',
                    }}
                  >
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {data.stocks.map((stock) => (
                <tr key={stock.id} style={{ borderBottom: '1px solid var(--border-subtle)' }}>
                  <td style={{ padding: '12px 16px', fontWeight: 700, color: 'var(--accent)' }}>
                    {stock.ticker}
                  </td>
                  <td style={{ padding: '12px 16px', color: 'var(--text)' }}>{stock.name}</td>
                  <td style={{ padding: '12px 16px', color: 'var(--text-muted)' }}>
                    {stock.sector ?? '—'}
                  </td>
                  <td style={{ padding: '12px 16px', color: 'var(--text-muted)' }}>
                    {stock.exchange ?? '—'}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </main>
  );
}
