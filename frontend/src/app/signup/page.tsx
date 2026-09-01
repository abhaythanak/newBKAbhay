import { SignupPage } from '@/ui/pages/SignupPage';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Sign Up - DevTinder',
  description: 'Create your DevTinder account today.',
};

export default function SignupRoute() {
  return <SignupPage />;
}
