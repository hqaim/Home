import { NextRequest, NextResponse } from 'next/server';
import { chatCompletion } from '@/lib/model-router';

export const runtime = 'edge';

export async function POST(req: NextRequest) {
  try {
    const { messages, useSearch } = await req.json();

    if (!messages) {
      return NextResponse.json({ error: 'No messages provided' }, { status: 400 });
    }

    const response = await chatCompletion(messages, useSearch);

    return new NextResponse(response.body, {
      headers: {
        'Content-Type': 'text/event-stream',
        'Cache-Control': 'no-cache',
        'Connection': 'keep-alive',
      },
    });

  } catch (error: any) {
    console.error("API Route Error:", error);
    return NextResponse.json(
      { error: error.message || 'Internal HQAIM Error' },
      { status: 500 }
    );
  }
}
