import { NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import Order from '@/models/Order';

export async function POST(request: Request) {
  try {
    await dbConnect();

    const body = await request.json();
    const { email, items, totalPrice, shippingAddress } = body;

    // Create new order
    const order = await Order.create({
      email,
      items: items.map((item: any) => ({
        productId: item.id,
        name: item.name,
        price: item.price,
        size: item.size,
        quantity: item.quantity,
        image: item.image
      })),
      totalPrice,
      shippingAddress,
      status: 'pending',
      paymentStatus: 'pending'
    });

    return NextResponse.json({ success: true, order }, { status: 201 });
  } catch (error) {
    console.error('Error creating order:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to create order' },
      { status: 500 }
    );
  }
}

export async function GET() {
  try {
    await dbConnect();
    const orders = await Order.find({}).sort({ createdAt: -1 });
    return NextResponse.json({ success: true, orders });
  } catch (error) {
    console.error('Error fetching orders:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch orders' },
      { status: 500 }
    );
  }
}
