// app/components/providers.tsx
'use client';

import React from 'react';
import { StreamProvider } from '@/context/stream-context';

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <StreamProvider>
      {children}
    </StreamProvider>
  );
}