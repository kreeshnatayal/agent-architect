import { NextResponse } from 'next/server';

interface ChatRequest {
  message: string;
  uml?: string;
}

interface ChatResponse {
  response: string;
  error?: string;
}

const LYZR_API_KEY = 'sk-default-efJlWrM2zBnfadNhcqx97S3dd45Pyk4B';
const LYZR_AGENT_ID = '683ca3483b7c57f1745cf7f0';
const LYZR_SESSION_ID = '683ca3483b7c57f1745cf7f0-vugolvc9kgr';

export async function POST(request: Request): Promise<NextResponse> {
  try {
    const { message, uml }: ChatRequest = await request.json();

    if (!message) {
      return NextResponse.json(
        { error: 'Message is required' },
        { status: 400 }
      );
    }

    // Prepare the message for Lyzr AI
    const fullMessage = uml
      ? `${message}\n\nUML:\n${uml}`
      : message;

    // Call Lyzr AI API
    const response = await fetch('https://agent-prod.studio.lyzr.ai/v3/inference/chat/', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': LYZR_API_KEY,
      },
      body: JSON.stringify({
        user_id: 'ktayal0903@gmail.com',
        agent_id: LYZR_AGENT_ID,
        session_id: LYZR_SESSION_ID,
        message: fullMessage,
      }),
    });

    if (!response.ok) {
      throw new Error('Failed to get response from Lyzr AI');
    }

    const data = await response.json();
    
    return NextResponse.json({
      response: data.response || 'Sorry, I could not process your request.',
    });
  } catch (error) {
    console.error('Error processing chat request:', error);
    return NextResponse.json(
      { error: 'Failed to process request' } as ChatResponse,
      { status: 500 }
    );
  }
} 
