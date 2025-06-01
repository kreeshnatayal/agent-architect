import { NextResponse } from 'next/server';

interface ChatRequest {
  message: string;
  uml?: string;
}

interface ChatResponse {
  response: string;
  error?: string;
}

export async function POST(request: Request): Promise<NextResponse> {
  try {
    const { message, uml }: ChatRequest = await request.json();

    if (!message) {
      return NextResponse.json(
        { error: 'Message is required' },
        { status: 400 }
      );
    }

    // Here you would typically:
    // 1. Process the message and UML (if available)
    // 2. Get a response from your AI service

    // For now, we'll return a mock response
    const response: ChatResponse = {
      response: uml 
        ? `I've analyzed your message and UML diagram:\n\nMessage: "${message}"\n\nUML Diagram:\n${uml}\n\nHere's what I found...`
        : `I've processed your message: "${message}". How can I help you further?`,
    };

    return NextResponse.json(response);
  } catch (error) {
    console.error('Error processing chat request:', error);
    return NextResponse.json(
      { error: 'Failed to process request' } as ChatResponse,
      { status: 500 }
    );
  }
} 