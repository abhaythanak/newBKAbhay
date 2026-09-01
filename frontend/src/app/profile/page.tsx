import { ProfilePage } from '@/ui/pages/ProfilePage';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Profile - DevTinder',
  description: 'View and edit your DevTinder profile.',
};

export default function ProfileRoute() {
  return <ProfilePage />;
}
