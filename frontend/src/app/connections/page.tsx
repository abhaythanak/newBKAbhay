import { ConnectionsPage } from '@/ui/pages/ConnectionsPage';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Connections - DevTinder',
  description: 'View your DevTinder connections.',
};

export default function ConnectionsRoute() {
  return <ConnectionsPage />;
}
