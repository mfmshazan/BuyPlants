import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/database';

// GET - Fetch orders
export async function GET(request: NextRequest) {
  try {
    await db.connect();

    const { searchParams } = new URL(request.url);
    const email = searchParams.get('email');
    const userId = searchParams.get('userId');
    const status = searchParams.get('status');
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '20');

    let orders;

    if (email) {
      orders = await db.orders.findByEmail(email);
    } else if (userId) {
      orders = await db.orders.findByUserId(userId);
    } else if (status) {
      orders = await db.orders.findByStatus(status as any);
    } else {
      // Get recent orders with pagination
      const result = await db.orders.getRecentOrders(page, limit);
      return NextResponse.json({
        success: true,
        ...result
      });
    }

    return NextResponse.json({
      success: true,
      count: orders.length,
      orders
    });
  } catch (error: any) {
    console.error('Error fetching orders:', error);
    return NextResponse.json(
      { success: false, error: error.message || 'Failed to fetch orders' },
      { status: 500 }
    );
  }
}

// POST - Create a new order
export async function POST(request: NextRequest) {
  try {
    await db.connect();

    const body = await request.json();

    // Validate required fields
    const required = ['email', 'items', 'totalPrice', 'shippingAddress'];
    const missing = required.filter(field => !body[field]);

    if (missing.length > 0) {
      return NextResponse.json(
        { success: false, error: `Missing required fields: ${missing.join(', ')}` },
        { status: 400 }
      );
    }

    // Set default values
    const orderData = {
      ...body,
      status: body.status || 'pending',
      paymentStatus: body.paymentStatus || 'pending'
    };

    // Create order using repository
    const order = await db.orders.create(orderData);

    // Optionally update product stock
    for (const item of body.items) {
      await db.products.decreaseStock(item.productId, item.quantity);
    }

    return NextResponse.json({
      success: true,
      message: 'Order created successfully',
      order
    }, { status: 201 });
  } catch (error: any) {
    console.error('Error creating order:', error);
    return NextResponse.json(
      { success: false, error: error.message || 'Failed to create order' },
      { status: 500 }
    );
  }
}

// PUT - Update order
export async function PUT(request: NextRequest) {
  try {
    await db.connect();

    const body = await request.json();
    const { orderId, status, paymentStatus, trackingNumber, deliveryDate } = body;

    if (!orderId) {
      return NextResponse.json(
        { success: false, error: 'Order ID is required' },
        { status: 400 }
      );
    }

    let order;

    if (trackingNumber) {
      order = await db.orders.addTrackingInfo(orderId, trackingNumber, deliveryDate);
    } else if (status === 'delivered') {
      order = await db.orders.markAsDelivered(orderId);
    } else if (status === 'cancelled') {
      order = await db.orders.cancelOrder(orderId);
    } else if (status) {
      order = await db.orders.updateStatus(orderId, status);
    } else if (paymentStatus) {
      order = await db.orders.updatePaymentStatus(orderId, paymentStatus);
    } else {
      return NextResponse.json(
        { success: false, error: 'No update fields provided' },
        { status: 400 }
      );
    }

    if (!order) {
      return NextResponse.json(
        { success: false, error: 'Order not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      message: 'Order updated successfully',
      order
    });
  } catch (error: any) {
    console.error('Error updating order:', error);
    return NextResponse.json(
      { success: false, error: error.message || 'Failed to update order' },
      { status: 500 }
    );
  }
}
