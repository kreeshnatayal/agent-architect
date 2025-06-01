import { NextResponse } from 'next/server';
import clientPromise from '@/lib/mongodb';
import { MongoClient } from 'mongodb';

interface UMLDocument {
  uml: string;
  createdAt: Date;
}

export async function GET(): Promise<NextResponse> {
  try {
    const client: MongoClient = await clientPromise;
    const db = client.db(process.env.MONGODB_DB);

    // Get the latest UML diagram
    const latestUML = await db.collection<UMLDocument>('uml_diagrams')
      .find()
      .sort({ createdAt: -1 })
      .limit(1)
      .toArray();

    if (!latestUML.length) {
      return NextResponse.json(
        { error: 'No UML diagrams found' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      uml: latestUML[0].uml,
      createdAt: latestUML[0].createdAt
    });
  } catch (error) {
    console.error('Error retrieving UML diagram:', error);
    return NextResponse.json(
      { error: 'Failed to retrieve UML diagram' },
      { status: 500 }
    );
  }
} 