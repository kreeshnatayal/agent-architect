import { NextResponse } from 'next/server';
import { MongoClient } from 'mongodb';

if (!process.env.MONGODB_URI) {
  throw new Error('Please add your Mongo URI to .env.local');
}

const uri = process.env.MONGODB_URI;
const client = new MongoClient(uri);

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { nodes, edges, name = 'Untitled Flowchart' } = body;

    await client.connect();
    const database = client.db('flowchart_db');
    const collection = database.collection('flowcharts');

    const result = await collection.insertOne({
      name,
      nodes,
      edges,
      createdAt: new Date(),
      updatedAt: new Date()
    });

    return NextResponse.json({ 
      success: true, 
      id: result.insertedId 
    });
  } catch (error) {
    console.error('Error saving flowchart:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to save flowchart' },
      { status: 500 }
    );
  } finally {
    await client.close();
  }
}

export async function GET() {
  try {
    await client.connect();
    const database = client.db('flowchart_db');
    const collection = database.collection('flowcharts');

    const flowcharts = await collection.find({})
      .sort({ createdAt: -1 })
      .toArray();

    return NextResponse.json(flowcharts);
  } catch (error) {
    console.error('Error fetching flowcharts:', error);
    return NextResponse.json(
      { error: 'Failed to fetch flowcharts' },
      { status: 500 }
    );
  } finally {
    await client.close();
  }
} 