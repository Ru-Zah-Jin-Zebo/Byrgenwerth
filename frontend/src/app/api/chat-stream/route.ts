// src/app/api/chat-stream/route.ts
import { NextRequest } from 'next/server';

export async function POST(req: NextRequest) {
  try {
    const { messages } = await req.json();
    
    // Create a sample response to stream
    const sampleResponse = "This is a streamed response from the backend API. Replace with your actual LLM integration. This demonstrates how the UI can handle chunked responses and display them in real time, creating a more interactive experience for the user.";
    
    // Create a simple streaming response
    const stream = new ReadableStream({
      async start(controller) {
        // Split the response into chunks and send with delays to simulate streaming
        const chunks = sampleResponse.split(" ");
        for (const chunk of chunks) {
          // Add words one by one with small delays
          controller.enqueue(new TextEncoder().encode(chunk + " "));
          await new Promise(resolve => setTimeout(resolve, 100));
        }
        controller.close();
      },
    });

    return new Response(stream, {
      headers: {
        'Content-Type': 'text/plain',
        'Cache-Control': 'no-cache',
      },
    });
  } catch (error) {
    console.error('Error in chat-stream API route:', error);
    return new Response(
      JSON.stringify({ error: 'Internal server error' }),
      {
        status: 500,
        headers: {
          'Content-Type': 'application/json',
        },
      }
    );
  }
}