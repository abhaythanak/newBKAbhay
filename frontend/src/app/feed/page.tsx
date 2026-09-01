import { FeedPage } from '@/ui/pages/FeedPage';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Feed - DevTinder',
  description: 'View your DevTinder feed and connect with others.',
};

export default function FeedRoute() {
  return <FeedPage />;
}
