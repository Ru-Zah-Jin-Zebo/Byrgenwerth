// src/lib/api.ts
interface Message {
	role: "user" | "assistant" | "system";
	content: string;
  }
  
  // Non-streaming API call
  export async function fetchChatResponse(
	messages: Message[],
	signal?: AbortSignal
  ): Promise<string> {
	try {
	  const response = await fetch("http://localhost:8000/api/chat", {
		method: "POST",
		headers: {
		  "Content-Type": "application/json",
		},
		body: JSON.stringify({ messages }),
		signal,
	  });
  
	  if (!response.ok) {
		throw new Error(`HTTP error! status: ${response.status}`);
	  }
  
	  const data = await response.json();
	  return data.response;
	} catch (error) {
	  console.error("Error in fetchChatResponse:", error);
	  throw error;
	}
  }
  
  // Streaming API call
  export async function streamChatResponse(
	messages: Message[],
	signal: AbortSignal,
	onChunk: (chunk: string) => void
  ): Promise<void> {
	try {
	  const response = await fetch("http://localhost:8000/api/chat/stream", {
		method: "POST",
		headers: {
		  "Content-Type": "application/json",
		},
		body: JSON.stringify({ messages }),
		signal,
	  });
  
	  if (!response.ok) {
		throw new Error(`HTTP error! status: ${response.status}`);
	  }
  
	  if (!response.body) {
		throw new Error("ReadableStream not supported");
	  }
  
	  const reader = response.body.getReader();
	  const decoder = new TextDecoder();
  
	  let done = false;
	  while (!done) {
		const { value, done: doneReading } = await reader.read();
		done = doneReading;
		
		if (value) {
		  const chunkText = decoder.decode(value);
		  onChunk(chunkText);
		}
	  }
	} catch (error) {
	  console.error("Error in streamChatResponse:", error);
	  throw error;
	}
  }