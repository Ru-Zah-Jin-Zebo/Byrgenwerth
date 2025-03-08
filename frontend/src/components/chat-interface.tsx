// src/components/chat-interface.tsx
'use client';

import React, { useState, FormEvent, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { ChatMessage } from "@/components/chat-message";
import { Send, RefreshCw } from "lucide-react";
import { fetchChatResponse, streamChatResponse } from "@/lib/api"; // Import the API functions
import { useStreamContext, StreamStatus } from "@/context/stream-context";

interface Message {
  role: "user" | "assistant" | "system";
  content: string;
}

interface ChatInterfaceProps {
  mockMode?: boolean;
}

export function ChatInterface({ mockMode = false }: ChatInterfaceProps) {
  const { streamMode } = useStreamContext();
  const [messages, setMessages] = useState<Message[]>([
    {
      role: "system",
      content: "Welcome to the chat! How can I help you today?",
    },
  ]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [streamedResponse, setStreamedResponse] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Scroll to bottom when messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, streamedResponse]);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    
    if (!input.trim()) return;
    
    const userMessage: Message = { role: "user", content: input };
    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setIsLoading(true);
    setStreamedResponse("");

    try {
      if (mockMode) {
        // Use mock API with artificial delay
        setTimeout(() => {
          const response = mockChatResponse(input);
          setMessages((prev) => [
            ...prev,
            { role: "assistant", content: response },
          ]);
          setIsLoading(false);
        }, 1000);
      } else {
        const allMessages = [...messages, userMessage];
        const controller = new AbortController();
        
        // Check if streaming mode is enabled from the context
        if (streamMode === StreamStatus.STREAMING) {
          let accumulatedResponse = ""; // Track the full response as it streams
          
          try {
            await streamChatResponse(
              allMessages,
              controller.signal,
              (chunk) => {
                accumulatedResponse += chunk; // Add each chunk to our accumulated response
                setStreamedResponse(accumulatedResponse); // Update with the full text so far
              }
            );
            
            // When stream completes, add the accumulated response to messages
            setMessages((prev) => [
              ...prev,
              { role: "assistant", content: accumulatedResponse },
            ]);
            
            // Clear the streamed response AFTER adding to messages
            setTimeout(() => {
              setStreamedResponse("");
            }, 100);
          } catch (error) {
            console.error("Error with streaming:", error);
            
            // Fallback to non-streaming API
            try {
              const response = await fetchChatResponse(allMessages, controller.signal);
              setMessages((prev) => [
                ...prev,
                { role: "assistant", content: response },
              ]);
            } catch (fallbackError) {
              throw fallbackError; // Re-throw to be caught by the outer catch block
            }
          }
        } else {
          // Use batch (non-streaming) API
          const response = await fetchChatResponse(allMessages, controller.signal);
          setMessages((prev) => [
            ...prev,
            { role: "assistant", content: response },
          ]);
        }
      }
    } catch (error) {
      console.error("Error fetching response:", error);
      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content: "Sorry, there was an error connecting to the backend. Please try again later.",
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleReset = () => {
    setMessages([
      {
        role: "system",
        content: "Welcome to the chat! How can I help you today?",
      },
    ]);
  };

  // Mock function for responses
  function mockChatResponse(userInput: string): string {
    const responses = [
      `I understand you're saying: "${userInput}". Let me think about that.`,
      `That's an interesting point about "${userInput}". I'd like to add some thoughts.`,
      `Thanks for sharing your thoughts on "${userInput}". Here's my perspective...`,
      `I've processed your message about "${userInput}" and here's what I think.`,
      `I appreciate your question about "${userInput}". Let me provide some insights.`,
    ];
    
    return responses[Math.floor(Math.random() * responses.length)];
  }

  return (
    <Card className="w-full h-[calc(100vh-200px)]">
      <CardHeader className="px-4 py-3 border-b">
        <div className="flex items-center justify-between">
          <CardTitle>Chat Assistant</CardTitle>
          <Button variant="outline" size="icon" onClick={handleReset}>
            <RefreshCw className="h-4 w-4" />
          </Button>
        </div>
      </CardHeader>
      
      <CardContent className="p-4 overflow-y-auto flex-1">
        <div className="space-y-4">
          {messages.map((message, index) => (
            message.role !== "system" && (
              <ChatMessage
                key={index}
                role={message.role}
                content={message.content}
              />
            )
          ))}
          
          {streamedResponse && (
            <ChatMessage
              role="assistant"
              content={streamedResponse}
              isLoading={false}
            />
          )}
          
          {isLoading && !streamedResponse && (
            <ChatMessage
              role="assistant"
              content=""
              isLoading={true}
            />
          )}
          
          <div ref={messagesEndRef} />
        </div>
      </CardContent>

      <CardFooter className="p-4 border-t">
        <form onSubmit={handleSubmit} className="flex w-full gap-2">
          <Input
            placeholder="Type your message..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
            disabled={isLoading}
            className="flex-1"
          />
          <Button type="submit" disabled={isLoading || !input.trim()}>
            <Send className="h-4 w-4 mr-2" />
            Send
          </Button>
        </form>
      </CardFooter>
    </Card>
  );
}