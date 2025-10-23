import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/database';

// GET - Fetch all products with optional filters
export async function GET(request: NextRequest) {
  try {
    await db.connect();

    const { searchParams } = new URL(request.url);
    
    // Build filter object
    const filters: any = {};
    
    const category = searchParams.get('category');
    const size = searchParams.get('size');
    const difficulty = searchParams.get('difficulty');
    const petFriendly = searchParams.get('petFriendly');
    const minPrice = searchParams.get('minPrice');
    const maxPrice = searchParams.get('maxPrice');
    const search = searchParams.get('search');

    console.log('🔍 API Query Params:', { category, size, difficulty, petFriendly });

    if (category && category !== 'all') filters.category = category;
    if (size && size !== 'all') filters.size = size;
    if (difficulty && difficulty !== 'all') filters.careLevel = difficulty;
    if (petFriendly === 'true') filters.petFriendly = true;
    if (minPrice) filters.minPrice = parseFloat(minPrice);
    if (maxPrice) filters.maxPrice = parseFloat(maxPrice);

    console.log('🎯 Filters being used:', filters);

    // Use repository methods
    let products;
    if (search) {
      products = await db.products.search(search);
    } else if (Object.keys(filters).length > 0) {
      products = await db.products.findWithFilters(filters);
    } else {
      products = await db.products.findAll({ inStock: true });
    }

    console.log(`📦 Found ${products.length} products`);
    if (products.length > 0) {
      console.log('📋 Product categories:', products.map(p => ({ name: p.name, category: p.category })));
    }

    return NextResponse.json({
      success: true,
      count: products.length,
      products
    });
  } catch (error: any) {
    console.error('Error fetching products:', error);
    return NextResponse.json(
      { success: false, error: error.message || 'Failed to fetch products' },
      { status: 500 }
    );
  }
}

// POST - Create a new product
export async function POST(request: NextRequest) {
  try {
    await db.connect();

    const body = await request.json();

    // Validate required fields
    if (!body.name || !body.description || !body.price || !body.size || !body.image) {
      return NextResponse.json(
        { success: false, error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Use repository to create product
    const product = await db.products.create(body);

    return NextResponse.json({
      success: true,
      message: 'Product created successfully',
      product
    }, { status: 201 });
  } catch (error: any) {
    console.error('Error creating product:', error);
    return NextResponse.json(
      { success: false, error: error.message || 'Failed to create product' },
      { status: 500 }
    );
  }
}
