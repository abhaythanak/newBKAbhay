import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Feed - DevTinder',
  description: 'View your DevTinder feed and connect with others.',
};

export default function FeedRoute() {
  return (
    <div className="min-h-[calc(100vh-4rem)] flex flex-col items-center justify-center p-8 text-center">
      <h1 className="text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-pink-500 to-rose-500 mb-4">
        Your Developer Feed
      </h1>
      <p className="text-neutral-400 max-w-lg">
        This is a placeholder for your feed. In the future, this page will show potential developer connections. You have successfully authenticated!
      </p>
    </div>
  );
}
