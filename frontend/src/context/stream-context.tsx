// src/context/stream-context.tsx
'use client';

import { createContext, useContext, useState, ReactNode } from 'react';

export enum StreamStatus {
  STREAMING = 'streaming',
  BATCH = 'batch'
}

interface StreamContextType {
  streamMode: StreamStatus;
  setStreamMode: (mode: StreamStatus) => void;
}

const StreamContext = createContext<StreamContextType | undefined>(undefined);

export function StreamProvider({ children }: { children: ReactNode }) {
  const [streamMode, setStreamMode] = useState<StreamStatus>(StreamStatus.STREAMING);

  return (
    <StreamContext.Provider value={{ streamMode, setStreamMode }}>
      {children}
    </StreamContext.Provider>
  );
}

export function useStreamContext() {
  const context = useContext(StreamContext);
  if (context === undefined) {
    throw new Error('useStreamContext must be used within a StreamProvider');
  }
  return context;
}