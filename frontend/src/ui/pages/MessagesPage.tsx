'use client';

import { useState } from 'react';
import { Search } from 'lucide-react';

export const MessagesPage = () => {
  const [activeTab, setActiveTab] = useState<'matches' | 'messages'>('messages');

  return (
    <div className="flex h-[calc(100vh-4rem)] w-full bg-black">
      
      {/* Sidebar */}
      <div className="w-full md:w-96 border-r border-neutral-800 flex flex-col h-full bg-neutral-950">
        <div className="p-4 border-b border-neutral-800">
          <div className="flex items-center gap-4 mb-4">
            <button 
              onClick={() => setActiveTab('messages')}
              className={`pb-2 text-sm font-semibold transition-colors ${activeTab === 'messages' ? 'text-white border-b-2 border-pink-500' : 'text-neutral-500'}`}
            >
              Messages
            </button>
            <button 
              onClick={() => setActiveTab('matches')}
              className={`pb-2 text-sm font-semibold transition-colors ${activeTab === 'matches' ? 'text-white border-b-2 border-pink-500' : 'text-neutral-500'}`}
            >
              Matches
            </button>
          </div>
          
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-500" />
            <input 
              type="text" 
              placeholder="Search matches" 
              className="w-full bg-neutral-900 border-none rounded-full py-2 pl-10 pr-4 text-sm text-white focus:ring-1 focus:ring-pink-500 outline-none"
            />
          </div>
        </div>

        <div className="flex-1 overflow-y-auto">
          {/* Empty state stub */}
          <div className="flex flex-col items-center justify-center h-full text-center p-8">
            <div className="w-20 h-20 bg-neutral-900 rounded-full flex items-center justify-center mb-4">
              <span className="text-3xl">👋</span>
            </div>
            <h3 className="text-lg font-bold text-white mb-2">No messages yet</h3>
            <p className="text-sm text-neutral-500">
              When you match with other developers, your conversations will appear here.
              <br/><br/>
              <span className="text-pink-500 opacity-80 text-xs uppercase tracking-wider font-semibold">Real-time chat backend coming soon!</span>
            </p>
          </div>
        </div>
      </div>

      {/* Main Chat Area (Hidden on small screens when viewing list) */}
      <div className="hidden md:flex flex-1 flex-col items-center justify-center bg-black">
        <div className="text-center p-8 max-w-md">
          <div className="w-32 h-32 bg-neutral-900 rounded-full flex items-center justify-center mx-auto mb-6">
            <span className="text-5xl">💬</span>
          </div>
          <h2 className="text-2xl font-bold text-white mb-3">Your Messages</h2>
          <p className="text-neutral-500">
            Select a match to start chatting. Share your code, discuss projects, and connect!
          </p>
        </div>
      </div>
      
    </div>
  );
};
