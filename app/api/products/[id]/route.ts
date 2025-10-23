import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/database';

// DELETE - Delete a product by ID
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await db.connect();

    const { id: productId } = await params;

    // Use repository to delete product
    const deleted = await db.products.deleteById(productId);

    if (!deleted) {
      return NextResponse.json(
        { success: false, error: 'Product not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      message: 'Product deleted successfully'
    });
  } catch (error: any) {
    console.error('Error deleting product:', error);
    return NextResponse.json(
      { success: false, error: error.message || 'Failed to delete product' },
      { status: 500 }
    );
  }
}

// GET - Get a single product by ID
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await db.connect();

    const { id: productId } = await params;

    // Use repository to find product
    const product = await db.products.findById(productId);

    if (!product) {
      return NextResponse.json(
        { success: false, error: 'Product not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      product
    });
  } catch (error: any) {
    console.error('Error fetching product:', error);
    return NextResponse.json(
      { success: false, error: error.message || 'Failed to fetch product' },
      { status: 500 }
    );
  }
}

// PUT - Update a product by ID
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await db.connect();

    const { id: productId } = await params;
    const body = await request.json();

    // Use repository to update product
    const updatedProduct = await db.products.updateById(productId, body);

    if (!updatedProduct) {
      return NextResponse.json(
        { success: false, error: 'Product not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      message: 'Product updated successfully',
      product: updatedProduct
    });
  } catch (error: any) {
    console.error('Error updating product:', error);
    return NextResponse.json(
      { success: false, error: error.message || 'Failed to update product' },
      { status: 500 }
    );
  }
}
