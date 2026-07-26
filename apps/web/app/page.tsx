export default function DashboardPage() {
  return (
    <main style={{ maxWidth: 1200, margin: '0 auto', padding: '48px 32px' }}>
      <h1 style={{ fontSize: 28, fontWeight: 800, color: 'var(--text)', marginBottom: 8 }}>
        Dashboard
      </h1>
      <p style={{ color: 'var(--text-muted)', fontSize: 14 }}>
        Screener results, theme tags, and watchlist scoring will render here.
      </p>
    </main>
  );
}
