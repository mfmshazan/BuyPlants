import { NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import Product from '@/models/Product';

export async function GET(request: Request) {
  try {
    await dbConnect();
    
    const { searchParams } = new URL(request.url);
    const category = searchParams.get('category');
    const size = searchParams.get('size');
    const difficulty = searchParams.get('difficulty');
    const petFriendly = searchParams.get('petFriendly');
    
    let filter: any = { inStock: true };
    
    if (category && category !== 'all') {
      filter.category = category;
    }
    
    if (size && size !== 'all') {
      filter.size = { $regex: size, $options: 'i' };
    }
    
    if (difficulty && difficulty !== 'all') {
      filter.careLevel = difficulty;
    }
    
    if (petFriendly === 'true') {
      filter.petFriendly = true;
    }
    
    const products = await Product.find(filter).sort({ createdAt: -1 });
    
    return NextResponse.json({ 
      success: true, 
      count: products.length,
      products 
    });
  } catch (error) {
    console.error('Error fetching products:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch products' },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    await dbConnect();
    const body = await request.json();
    const product = await Product.create(body);
    return NextResponse.json({ success: true, product }, { status: 201 });
  } catch (error) {
    console.error('Error creating product:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to create product' },
      { status: 500 }
    );
  }
}
