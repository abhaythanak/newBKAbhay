import Link from 'next/link';
import { ArrowRight, Flame } from 'lucide-react';

export default function Home() {
  return (
    <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center relative overflow-hidden bg-[#0a0a0a]">
      {/* Background Orbs */}
      <div className="absolute top-[20%] left-[20%] w-[40vw] h-[40vw] bg-pink-600/20 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-[20%] right-[20%] w-[40vw] h-[40vw] bg-rose-600/20 rounded-full blur-[120px] pointer-events-none" />
      
      <div className="relative z-10 text-center max-w-3xl px-4">
        <div className="flex justify-center mb-6">
          <div className="bg-gradient-to-tr from-pink-500 to-rose-500 p-4 rounded-3xl shadow-[0_0_40px_rgba(236,72,153,0.4)]">
            <Flame className="w-12 h-12 text-white" />
          </div>
        </div>
        
        <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight text-white mb-6">
          Swipe Right on <br className="hidden md:block" />
          <span className="bg-clip-text text-transparent bg-gradient-to-r from-pink-500 to-rose-500">
            Great Code
          </span>
        </h1>
        
        <p className="text-lg md:text-xl text-neutral-400 mb-10 max-w-2xl mx-auto leading-relaxed">
          The premium matchmaking platform for developers. Find your next pair programming partner, co-founder, or mentor with just a swipe.
        </p>
        
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <Link
            href="/signup"
            className="w-full sm:w-auto px-8 py-4 bg-gradient-to-r from-pink-500 to-rose-500 text-white rounded-full font-semibold text-lg hover:shadow-[0_0_30px_rgba(236,72,153,0.5)] transition-all flex items-center justify-center gap-2"
          >
            Create Account
            <ArrowRight className="w-5 h-5" />
          </Link>
          <Link
            href="/login"
            className="w-full sm:w-auto px-8 py-4 bg-white/5 border border-white/10 text-white rounded-full font-semibold text-lg hover:bg-white/10 transition-all flex items-center justify-center"
          >
            Sign In
          </Link>
        </div>
      </div>
    </div>
  );
}
