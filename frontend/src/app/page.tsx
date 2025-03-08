// src/app/page.tsx
'use client';

import { useSearchParams } from 'next/navigation';
import { ChatInterface } from '@/components/chat-interface';
import { ThemeToggle } from '@/components/theme-toggle';
import { StreamToggle } from '@/components/stream-toggle';

export default function Home() {
  const searchParams = useSearchParams();
  const isMockMode = searchParams.has('mock') || searchParams.has('s');
  
  return (
    <main className="flex min-h-screen flex-col items-center p-4 md:p-24">
      <div className="w-full max-w-3xl">
        <div className="flex justify-between items-center mb-4">
          <h1 className="text-4xl font-bold">Chat Application</h1>
          <div className="flex items-center space-x-4">
            <StreamToggle />
            <ThemeToggle />
          </div>
        </div>
        
        {isMockMode && (
          <div className="mb-4 p-2 bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-100 rounded">
            Running in mock mode. No backend connection required.
          </div>
        )}
        
        <ChatInterface mockMode={isMockMode} />
      </div>
    </main>
  );
}