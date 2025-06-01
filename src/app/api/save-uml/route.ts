import { NextResponse } from 'next/server';
import clientPromise from '@/lib/mongodb';

export async function POST(request: Request) {
  try {
    const { uml } = await request.json();

    if (!uml) {
      return NextResponse.json(
        { error: 'UML content is required' },
        { status: 400 }
      );
    }

    // Connect to MongoDB
    const client = await clientPromise;
    const db = client.db(process.env.MONGODB_DB);

    // Save UML diagram
    const result = await db.collection('uml_diagrams').insertOne({
      uml,
      createdAt: new Date(),
      updatedAt: new Date()
    });

    return NextResponse.json({
      success: true,
      message: 'UML diagram saved successfully',
      id: result.insertedId
    });
  } catch (error) {
    console.error('Error saving UML diagram:', error);
    return NextResponse.json(
      { error: 'Failed to save UML diagram' },
      { status: 500 }
    );
  }
} 