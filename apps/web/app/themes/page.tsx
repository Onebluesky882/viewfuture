import type { Metadata } from 'next';
import { ThemesView } from '@/components/themes-view';

export const metadata: Metadata = {
  title: 'Themes — ViewFuture',
  description: 'กลุ่มเทรนด์มหภาคและหุ้นที่แม็ปอยู่ในแต่ละกลุ่ม',
};

export default function ThemesPage() {
  return <ThemesView />;
}
