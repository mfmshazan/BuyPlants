import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/database';

// GET - Get cart by session ID
export async function GET(request: NextRequest) {
  try {
    await db.connect();

    const { searchParams } = new URL(request.url);
    const sessionId = searchParams.get('sessionId');

    if (!sessionId) {
      return NextResponse.json(
        { success: false, error: 'Session ID is required' },
        { status: 400 }
      );
    }

    // Use repository to get or create cart
    const cart = await db.carts.getOrCreateCart(sessionId);

    return NextResponse.json({
      success: true,
      cart
    });
  } catch (error: any) {
    console.error('Error fetching cart:', error);
    return NextResponse.json(
      { success: false, error: error.message || 'Failed to fetch cart' },
      { status: 500 }
    );
  }
}

// POST - Add item to cart
export async function POST(request: NextRequest) {
  try {
    await db.connect();

    const body = await request.json();
    const { sessionId, item } = body;

    if (!sessionId || !item) {
      return NextResponse.json(
        { success: false, error: 'Session ID and item are required' },
        { status: 400 }
      );
    }

    // Validate item structure
    if (!item.productId || !item.name || !item.price || !item.image || !item.size) {
      return NextResponse.json(
        { success: false, error: 'Invalid item data' },
        { status: 400 }
      );
    }

    // Use repository to add item
    const cart = await db.carts.addItem(sessionId, {
      ...item,
      quantity: item.quantity || 1
    });

    return NextResponse.json({
      success: true,
      message: 'Item added to cart',
      cart
    }, { status: 201 });
  } catch (error: any) {
    console.error('Error adding to cart:', error);
    return NextResponse.json(
      { success: false, error: error.message || 'Failed to add item to cart' },
      { status: 500 }
    );
  }
}

// PUT - Update cart item quantity
export async function PUT(request: NextRequest) {
  try {
    await db.connect();

    const body = await request.json();
    const { sessionId, productId, size, quantity } = body;

    if (!sessionId || !productId || !size || quantity === undefined) {
      return NextResponse.json(
        { success: false, error: 'Session ID, product ID, size, and quantity are required' },
        { status: 400 }
      );
    }

    // Use repository to update quantity
    const cart = await db.carts.updateItemQuantity(sessionId, productId, size, quantity);

    if (!cart) {
      return NextResponse.json(
        { success: false, error: 'Cart or item not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      message: 'Cart updated',
      cart
    });
  } catch (error: any) {
    console.error('Error updating cart:', error);
    return NextResponse.json(
      { success: false, error: error.message || 'Failed to update cart' },
      { status: 500 }
    );
  }
}

// DELETE - Remove item from cart or clear cart
export async function DELETE(request: NextRequest) {
  try {
    await db.connect();

    const { searchParams } = new URL(request.url);
    const sessionId = searchParams.get('sessionId');
    const productId = searchParams.get('productId');
    const size = searchParams.get('size');

    if (!sessionId) {
      return NextResponse.json(
        { success: false, error: 'Session ID is required' },
        { status: 400 }
      );
    }

    let cart;
    if (!productId) {
      // Clear entire cart
      cart = await db.carts.clearCart(sessionId);
    } else {
      // Remove specific item
      if (!size) {
        return NextResponse.json(
          { success: false, error: 'Size is required to remove specific item' },
          { status: 400 }
        );
      }
      cart = await db.carts.removeItem(sessionId, productId, size);
    }

    if (!cart) {
      return NextResponse.json(
        { success: false, error: 'Cart not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      message: productId ? 'Item removed from cart' : 'Cart cleared',
      cart
    });
  } catch (error: any) {
    console.error('Error deleting from cart:', error);
    return NextResponse.json(
      { success: false, error: error.message || 'Failed to delete from cart' },
      { status: 500 }
    );
  }
}
