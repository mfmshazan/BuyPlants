import { NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import Product from '@/models/Product';

export async function POST() {
  try {
    await dbConnect();

    // Clear existing products
    await Product.deleteMany({});

    // Sample products data
    const products = [
      {
        name: 'Monstera Deliciosa',
        description: 'A stunning tropical plant with large, glossy leaves that develop natural holes as they mature. Perfect for adding a tropical touch to any room.',
        price: 74,
        size: 'LG',
        image: 'https://images.pexels.com/photos/7084309/pexels-photo-7084309.jpeg?auto=compress&cs=tinysrgb&w=600',
        category: 'Indoor',
        tags: ['tropical', 'large', 'statement'],
        inStock: true,
        stockQuantity: 15,
        rating: 4.4,
        reviews: 25,
        careLevel: 'Moderate',
        lightRequirement: 'Bright',
        petFriendly: false
      },
      {
        name: 'Snake Plant',
        description: 'Nearly indestructible and perfect for beginners. Thrives on neglect and purifies air naturally.',
        price: 34,
        size: 'XS',
        image: 'https://cdn.pixabay.com/photo/2020/06/30/19/24/sansevieria-5357639_1280.jpg',
        category: 'Indoor',
        tags: ['easy-care', 'air-purifying', 'beginner-friendly'],
        inStock: true,
        stockQuantity: 30,
        rating: 4.8,
        reviews: 52,
        careLevel: 'Easy',
        lightRequirement: 'Low',
        petFriendly: false
      },
      {
        name: 'Fiddle Leaf Fig',
        description: 'The iconic statement plant with large violin-shaped leaves. A favorite among interior designers.',
        price: 199,
        size: 'XXL',
        image: 'https://images.pexels.com/photos/6208086/pexels-photo-6208086.jpeg?auto=compress&cs=tinysrgb&w=600',
        category: 'Indoor',
        tags: ['statement', 'large', 'trendy'],
        inStock: true,
        stockQuantity: 8,
        rating: 4.6,
        reviews: 35,
        careLevel: 'Advanced',
        lightRequirement: 'Bright',
        petFriendly: false
      },
      {
        name: 'Peace Lily',
        description: 'Elegant white blooms and lush green foliage. Excellent air purifier and easy to care for.',
        price: 169,
        size: 'XL',
        image: 'https://images.pexels.com/photos/4503274/pexels-photo-4503274.jpeg?auto=compress&cs=tinysrgb&w=600',
        category: 'Indoor',
        tags: ['flowering', 'air-purifying', 'elegant'],
        inStock: true,
        stockQuantity: 12,
        rating: 4.7,
        reviews: 41,
        careLevel: 'Easy',
        lightRequirement: 'Medium',
        petFriendly: false
      },
      {
        name: 'Golden Pothos',
        description: 'Trailing vine with heart-shaped leaves. One of the easiest houseplants to grow.',
        price: 39,
        size: 'XS',
        image: 'https://images.pexels.com/photos/7084309/pexels-photo-7084309.jpeg?auto=compress&cs=tinysrgb&w=600',
        category: 'Indoor',
        tags: ['trailing', 'easy-care', 'air-purifying'],
        inStock: true,
        stockQuantity: 25,
        rating: 4.9,
        reviews: 67,
        careLevel: 'Easy',
        lightRequirement: 'Low',
        petFriendly: true
      },
      {
        name: 'ZZ Plant',
        description: 'Extremely drought-tolerant with glossy leaves. Perfect for low-light spaces and busy plant parents.',
        price: 139,
        size: 'XL',
        image: 'https://images.pexels.com/photos/6208087/pexels-photo-6208087.jpeg?auto=compress&cs=tinysrgb&w=600',
        category: 'Indoor',
        tags: ['low-maintenance', 'drought-tolerant', 'modern'],
        inStock: true,
        stockQuantity: 10,
        rating: 4.9,
        reviews: 43,
        careLevel: 'Easy',
        lightRequirement: 'Low',
        petFriendly: false
      },
      {
        name: 'Rubber Plant',
        description: 'Bold burgundy leaves that make a stunning statement. Easy to care for and fast-growing.',
        price: 89,
        size: 'LG',
        image: 'https://images.pexels.com/photos/3125195/pexels-photo-3125195.jpeg?auto=compress&cs=tinysrgb&w=600',
        category: 'Indoor',
        tags: ['statement', 'colorful', 'easy-care'],
        inStock: true,
        stockQuantity: 15,
        rating: 4.5,
        reviews: 29,
        careLevel: 'Easy',
        lightRequirement: 'Bright',
        petFriendly: false
      },
      {
        name: 'Calathea Pinstripe',
        description: 'Stunning patterned leaves with pink stripes. A true show-stopper for plant collectors.',
        price: 49,
        size: 'SM',
        image: 'https://cdn.pixabay.com/photo/2021/01/22/06/04/plant-5939187_1280.jpg',
        category: 'Indoor',
        tags: ['patterned', 'colorful', 'pet-safe'],
        inStock: true,
        stockQuantity: 20,
        rating: 4.3,
        reviews: 38,
        careLevel: 'Moderate',
        lightRequirement: 'Medium',
        petFriendly: true
      },
      {
        name: 'Bamboo Palm',
        description: 'Tall and elegant with feathery fronds. Excellent air purifier and pet-friendly.',
        price: 199,
        size: 'XXL',
        image: 'https://images.pexels.com/photos/7084302/pexels-photo-7084302.jpeg?auto=compress&cs=tinysrgb&w=600',
        category: 'Indoor',
        tags: ['large', 'air-purifying', 'pet-safe'],
        inStock: true,
        stockQuantity: 6,
        rating: 4.8,
        reviews: 52,
        careLevel: 'Easy',
        lightRequirement: 'Medium',
        petFriendly: true
      },
      {
        name: 'Money Tree',
        description: 'Braided trunk with lush green leaves. Believed to bring good luck and prosperity.',
        price: 169,
        size: 'XL',
        image: 'https://images.pexels.com/photos/7084310/pexels-photo-7084310.jpeg?auto=compress&cs=tinysrgb&w=600',
        category: 'Indoor',
        tags: ['braided', 'lucky', 'gift'],
        inStock: true,
        stockQuantity: 14,
        rating: 4.6,
        reviews: 53,
        careLevel: 'Easy',
        lightRequirement: 'Bright',
        petFriendly: false
      },
      {
        name: 'Spider Plant',
        description: 'Classic houseplant with cascading variegated leaves. Produces adorable baby plantlets.',
        price: 39,
        size: 'SM',
        image: 'https://images.pexels.com/photos/6208511/pexels-photo-6208511.jpeg?auto=compress&cs=tinysrgb&w=600',
        category: 'Indoor',
        tags: ['trailing', 'easy-care', 'pet-safe'],
        inStock: true,
        stockQuantity: 22,
        rating: 4.7,
        reviews: 45,
        careLevel: 'Easy',
        lightRequirement: 'Medium',
        petFriendly: true
      },
      {
        name: 'Pothos Collection',
        description: 'Bundle of three different pothos varieties. Perfect starter collection for plant lovers.',
        price: 79,
        size: 'XS',
        image: 'https://images.pexels.com/photos/7084316/pexels-photo-7084316.jpeg?auto=compress&cs=tinysrgb&w=600',
        category: 'Indoor',
        tags: ['bundle', 'collection', 'gift'],
        inStock: true,
        stockQuantity: 10,
        rating: 4.8,
        reviews: 28,
        careLevel: 'Easy',
        lightRequirement: 'Low',
        petFriendly: true
      }
    ];

    const insertedProducts = await Product.insertMany(products);

    return NextResponse.json({
      success: true,
      message: `Successfully added ${insertedProducts.length} products to MongoDB`,
      count: insertedProducts.length,
      products: insertedProducts
    }, { status: 201 });
  } catch (error: any) {
    console.error('Error seeding products:', error);
    return NextResponse.json(
      { success: false, error: error.message || 'Failed to seed products' },
      { status: 500 }
    );
  }
}

export async function GET() {
  try {
    await dbConnect();
    const count = await Product.countDocuments();
    
    return NextResponse.json({
      success: true,
      message: `Database has ${count} products`,
      count
    });
  } catch (error: any) {
    console.error('Error checking products:', error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}
