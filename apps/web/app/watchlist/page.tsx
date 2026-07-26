import type { Metadata } from 'next';
import { WatchlistView } from '@/components/watchlist-view';

export const metadata: Metadata = {
  title: 'Watchlist — ViewFuture',
  description: 'หุ้นที่ติดตามอยู่ พร้อมคะแนนและ signal ล่าสุด',
};

export default function WatchlistPage() {
  return <WatchlistView />;
}
