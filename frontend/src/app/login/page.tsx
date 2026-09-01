import { LoginPage } from '@/ui/pages/LoginPage';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Login - DevTinder',
  description: 'Sign in to DevTinder to find your next connection.',
};

export default function LoginRoute() {
  return <LoginPage />;
}
