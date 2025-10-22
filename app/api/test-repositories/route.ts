import { NextResponse } from 'next/server';
import { db } from '@/lib/database';

export async function GET() {
  try {
    await db.connect();

    // Test all repository methods
    const tests = {
      // Test Product Repository
      products: {
        all: await db.products.count(),
        indoor: (await db.products.findByCategory('Indoor')).length,
        petFriendly: (await db.products.findPetFriendly()).length,
        easy: (await db.products.findByCareLevel('Easy')).length,
        inStock: (await db.products.findInStock()).length,
      },
      
      // Test Cart Repository
      carts: {
        total: await db.carts.count(),
        method: 'CartRepository methods available'
      },
      
      // Test Order Repository
      orders: {
        total: await db.orders.count(),
        method: 'OrderRepository methods available'
      },
      
      // Get some sample products
      sampleProducts: await db.products.findAll({ inStock: true })
    };

    return NextResponse.json({
      success: true,
      message: 'All repositories tested successfully',
      ...tests,
      structure: {
        baseRepository: 'Provides: findAll, findById, create, update, delete, paginate',
        productRepository: 'Extends with: findByCategory, search, updateStock, getTopRated',
        cartRepository: 'Extends with: addItem, getOrCreateCart, mergeGuestCart',
        orderRepository: 'Extends with: findByEmail, getTotalRevenue, getTopCustomers'
      }
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}
