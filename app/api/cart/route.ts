import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import Cart from '@/models/Cart';

// GET - Get cart by session ID
export async function GET(request: NextRequest) {
  try {
    await dbConnect();

    const { searchParams } = new URL(request.url);
    const sessionId = searchParams.get('sessionId');

    if (!sessionId) {
      return NextResponse.json(
        { success: false, error: 'Session ID is required' },
        { status: 400 }
      );
    }

    let cart = await Cart.findOne({ sessionId });

    // If cart doesn't exist, create empty cart
    if (!cart) {
      cart = await Cart.create({
        sessionId,
        items: [],
        totalAmount: 0
      });
    }

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
    await dbConnect();

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

    let cart = await Cart.findOne({ sessionId });

    if (!cart) {
      // Create new cart with item
      cart = await Cart.create({
        sessionId,
        items: [{ ...item, quantity: item.quantity || 1 }],
        totalAmount: 0
      });
    } else {
      // Check if item already exists in cart
      const existingItemIndex = cart.items.findIndex(
        (i) => i.productId.toString() === item.productId.toString() && i.size === item.size
      );

      if (existingItemIndex > -1) {
        // Update quantity
        cart.items[existingItemIndex].quantity += item.quantity || 1;
      } else {
        // Add new item
        cart.items.push({ ...item, quantity: item.quantity || 1 });
      }

      await cart.save();
    }

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
    await dbConnect();

    const body = await request.json();
    const { sessionId, productId, size, quantity } = body;

    if (!sessionId || !productId || !size || quantity === undefined) {
      return NextResponse.json(
        { success: false, error: 'Session ID, product ID, size, and quantity are required' },
        { status: 400 }
      );
    }

    const cart = await Cart.findOne({ sessionId });

    if (!cart) {
      return NextResponse.json(
        { success: false, error: 'Cart not found' },
        { status: 404 }
      );
    }

    const itemIndex = cart.items.findIndex(
      (i) => i.productId.toString() === productId && i.size === size
    );

    if (itemIndex === -1) {
      return NextResponse.json(
        { success: false, error: 'Item not found in cart' },
        { status: 404 }
      );
    }

    if (quantity <= 0) {
      // Remove item if quantity is 0 or less
      cart.items.splice(itemIndex, 1);
    } else {
      // Update quantity
      cart.items[itemIndex].quantity = quantity;
    }

    await cart.save();

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
    await dbConnect();

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

    const cart = await Cart.findOne({ sessionId });

    if (!cart) {
      return NextResponse.json(
        { success: false, error: 'Cart not found' },
        { status: 404 }
      );
    }

    if (!productId) {
      // Clear entire cart
      cart.items = [];
      await cart.save();

      return NextResponse.json({
        success: true,
        message: 'Cart cleared',
        cart
      });
    }

    // Remove specific item
    const itemIndex = cart.items.findIndex(
      (i) => i.productId.toString() === productId && i.size === size
    );

    if (itemIndex === -1) {
      return NextResponse.json(
        { success: false, error: 'Item not found in cart' },
        { status: 404 }
      );
    }

    cart.items.splice(itemIndex, 1);
    await cart.save();

    return NextResponse.json({
      success: true,
      message: 'Item removed from cart',
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
