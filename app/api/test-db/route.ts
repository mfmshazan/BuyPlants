import { NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import mongoose from 'mongoose';

export async function GET() {
  try {
    await dbConnect();
    
    const connection = mongoose.connection;
    const isConnected = connection.readyState === 1;
    
    return NextResponse.json({
      success: true,
      connected: isConnected,
      status: connection.readyState,
      host: connection.host || 'Not connected',
      database: connection.name || 'Not connected',
      statusMessage: getStatusMessage(connection.readyState)
    });
  } catch (error: any) {
    return NextResponse.json(
      {
        success: false,
        connected: false,
        error: error.message || 'Failed to connect to database'
      },
      { status: 500 }
    );
  }
}

function getStatusMessage(readyState: number): string {
  switch (readyState) {
    case 0:
      return 'Disconnected';
    case 1:
      return 'Connected';
    case 2:
      return 'Connecting';
    case 3:
      return 'Disconnecting';
    default:
      return 'Unknown';
  }
}
