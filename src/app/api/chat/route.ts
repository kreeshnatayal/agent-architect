import { NextResponse } from 'next/server';

interface ChatRequest {
  message: string;
  uml?: string;
}

interface ChatResponse {
  response: string;
  error?: string;
}

const LYZR_API_KEY = 'sk-default-S07yMhrN5vZuvqEojVskHxY9S8C9TQWh';
const LYZR_AGENT_ID = '683c8ebb9bef0c4bbc19723f';
const LYZR_SESSION_ID = '683c8ebb9bef0c4bbc19723f-eiz4tvj7lrp';

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
        user_id: 'mehulj4751@gmail.com',
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