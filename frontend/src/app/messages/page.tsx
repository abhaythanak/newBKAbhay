import { MessagesPage } from '@/ui/pages/MessagesPage';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Messages - DevTinder',
  description: 'View your DevTinder matches and messages.',
};

export default function MessagesRoute() {
  return <MessagesPage />;
}
