// src/components/stream-toggle.tsx
'use client';

import { useState } from 'react';
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { 
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { StreamStatus, useStreamContext } from '@/context/stream-context';

export function StreamToggle() {
  const { streamMode, setStreamMode } = useStreamContext();

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <div className="flex items-center space-x-2">
            <Switch 
              id="stream-mode" 
              checked={streamMode === StreamStatus.STREAMING}
              onCheckedChange={(checked) => 
                setStreamMode(checked ? StreamStatus.STREAMING : StreamStatus.BATCH)
              }
            />
            <Label htmlFor="stream-mode" className="text-sm cursor-pointer">
              {streamMode === StreamStatus.STREAMING ? "Streaming" : "Batch"}
            </Label>
          </div>
        </TooltipTrigger>
        <TooltipContent>
          <p>Toggle between streaming and batch responses</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}