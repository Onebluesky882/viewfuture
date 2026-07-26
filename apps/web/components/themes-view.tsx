'use client';

import { useQuery } from '@tanstack/react-query';
import { apiFetch, type Theme } from '@/lib/api';
import { BackButton } from './back-button';

export function ThemesView() {
  const { data, isLoading, isError } = useQuery({
    queryKey: ['themes'],
    queryFn: () => apiFetch<{ themes: Theme[] }>('/api/themes'),
  });

  return (
    <main style={{ maxWidth: 1200, margin: '0 auto', padding: '48px 32px' }}>
      <BackButton />
      <h1 style={{ fontSize: 28, fontWeight: 800, color: 'var(--text)', marginBottom: 8 }}>
        Themes
      </h1>
      <p style={{ color: 'var(--text-muted)', fontSize: 14, marginBottom: 32 }}>
        กลุ่มเทรนด์มหภาคและหุ้นที่แม็ปอยู่ในแต่ละกลุ่ม
      </p>

      {isLoading && <p style={{ color: 'var(--text-muted)', fontSize: 14 }}>Loading...</p>}
      {isError && (
        <p style={{ color: 'var(--red)', fontSize: 14 }}>
          โหลดข้อมูลไม่สำเร็จ — ตรวจสอบว่า API และ D1 database ถูกตั้งค่าแล้ว
        </p>
      )}
      {data && data.themes.length === 0 && (
        <p style={{ color: 'var(--text-muted)', fontSize: 14 }}>ยังไม่มี theme ในระบบ</p>
      )}

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))', gap: 16 }}>
        {data?.themes.map((theme) => (
          <div key={theme.id} className="card" style={{ padding: 20 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8 }}>
              <span style={{ fontWeight: 700, fontSize: 15, color: 'var(--text)' }}>{theme.name}</span>
              <span className="tag tag-neutral">{theme.stockCount} stocks</span>
            </div>
            {theme.description && (
              <p style={{ color: 'var(--text-muted)', fontSize: 13 }}>{theme.description}</p>
            )}
          </div>
        ))}
      </div>
    </main>
  );
}
