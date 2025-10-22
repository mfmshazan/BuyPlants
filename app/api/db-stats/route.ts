import { NextResponse } from 'next/server';
import { db } from '@/lib/database';

export async function GET() {
  try {
    const stats = await db.getStats();
    
    return NextResponse.json({
      success: true,
      ...stats,
      message: 'Database statistics retrieved successfully',
      structure: {
        collections: ['products', 'carts', 'orders'],
        repositories: ['ProductRepository', 'CartRepository', 'OrderRepository'],
        manager: 'DatabaseManager (Singleton)',
        pattern: 'Repository Pattern with ORM'
      }
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}
