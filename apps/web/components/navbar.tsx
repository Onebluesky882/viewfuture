'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

const NAV_LINKS = [
  { href: '/', label: 'Dashboard' },
  { href: '/watchlist', label: 'Watchlist' },
  { href: '/themes', label: 'Themes' },
];

export function Navbar() {
  const pathname = usePathname();
  const isActive = (href: string) => (href === '/' ? pathname === '/' : pathname.startsWith(href));

  return (
    <nav
      style={{
        position: 'sticky',
        top: 0,
        zIndex: 50,
        background: 'rgba(8,8,8,0.92)',
        backdropFilter: 'blur(20px)',
        WebkitBackdropFilter: 'blur(20px)',
        borderBottom: '1px solid rgba(255,255,255,0.06)',
        height: 64,
        display: 'flex',
        alignItems: 'center',
        padding: '0 32px',
      }}
    >
      <div
        style={{
          maxWidth: 1200,
          margin: '0 auto',
          width: '100%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
        }}
      >
        <Link
          href="/"
          style={{ display: 'flex', alignItems: 'center', gap: 10, textDecoration: 'none' }}
        >
          <div
            style={{
              width: 32,
              height: 32,
              borderRadius: 8,
              background: 'linear-gradient(135deg, var(--accent) 0%, #006644 100%)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: '0 0 14px var(--accent-glow)',
            }}
          >
            <svg
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="#000"
              strokeWidth="2.5"
              strokeLinecap="round"
              role="img"
              aria-label="ViewFuture logo"
            >
              <circle cx="12" cy="12" r="3" />
              <path d="M12 2v4M12 18v4M4.9 4.9l2.8 2.8M16.3 16.3l2.8 2.8M2 12h4M18 12h4M4.9 19.1l2.8-2.8M16.3 7.7l2.8-2.8" />
            </svg>
          </div>
          <span style={{ fontWeight: 800, fontSize: 14, letterSpacing: '-0.04em', color: '#fff' }}>
            ViewFuture
          </span>
        </Link>

        <div style={{ display: 'flex', alignItems: 'center', gap: 0 }}>
          {NAV_LINKS.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              style={{
                position: 'relative',
                fontSize: 13,
                fontWeight: isActive(l.href) ? 600 : 400,
                color: isActive(l.href) ? '#fff' : 'var(--text-muted)',
                textDecoration: 'none',
                padding: '6px 14px',
                borderRadius: 6,
                letterSpacing: '0.01em',
              }}
            >
              {l.label}
            </Link>
          ))}
        </div>
      </div>
    </nav>
  );
}
