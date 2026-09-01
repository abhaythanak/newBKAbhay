import { RequestsPage } from '@/ui/pages/RequestsPage';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Requests - DevTinder',
  description: 'View your DevTinder connection requests.',
};

export default function RequestsRoute() {
  return <RequestsPage />;
}
