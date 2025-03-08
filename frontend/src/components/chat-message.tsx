// src/components/chat-message.tsx
import React from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { cn } from "@/lib/utils";

type ChatRole = "user" | "assistant" | "system";

interface ChatMessageProps {
  role: ChatRole;
  content: string;
  isLoading?: boolean;
}

export function ChatMessage({ role, content, isLoading = false }: ChatMessageProps) {
  return (
    <div
      className={cn(
        "flex gap-3 mb-4",
        role === "user" ? "justify-end" : "justify-start"
      )}
    >
      {role === "assistant" && (
        <Avatar>
          <AvatarFallback>AI</AvatarFallback>
          <AvatarImage src="/bot-avatar.png" />
        </Avatar>
      )}
      
      <div
        className={cn(
          "rounded-lg px-4 py-3 max-w-[80%]",
          role === "user"
            ? "bg-primary text-primary-foreground"
            : "bg-muted",
          isLoading && "opacity-50"
        )}
      >
        {isLoading ? (
          <div className="flex items-center space-x-2">
            <div className="h-2 w-2 animate-bounce rounded-full bg-current"></div>
            <div className="h-2 w-2 animate-bounce rounded-full bg-current delay-75"></div>
            <div className="h-2 w-2 animate-bounce rounded-full bg-current delay-150"></div>
          </div>
        ) : (
          <div className="whitespace-pre-wrap">{content}</div>
        )}
      </div>
      
      {role === "user" && (
        <Avatar>
          <AvatarFallback>You</AvatarFallback>
          <AvatarImage src="/user-avatar.png" />
        </Avatar>
      )}
    </div>
  );
}