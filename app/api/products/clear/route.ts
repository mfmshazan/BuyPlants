import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/database';

// DELETE - Clear all products from database
export async function DELETE(request: NextRequest) {
  try {
    await db.connect();

    // Delete all products
    const result = await db.products.deleteMany({});

    return NextResponse.json({
      success: true,
      message: 'All products deleted successfully',
      deletedCount: result.deletedCount
    });
  } catch (error: any) {
    console.error('Error clearing products:', error);
    return NextResponse.json(
      { success: false, error: error.message || 'Failed to clear products' },
      { status: 500 }
    );
  }
}
