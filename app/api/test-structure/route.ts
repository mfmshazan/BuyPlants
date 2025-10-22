import { NextResponse } from 'next/server';
import { db } from '@/lib/database';

export async function GET() {
  try {
    await db.connect();

    // Demonstrate the full ORM structure
    const demonstration = {
      layer1_Models: {
        description: 'Data schemas defined in /models',
        files: ['Product.ts', 'Cart.ts', 'Order.ts'],
        purpose: 'Define structure and validation'
      },
      
      layer2_BaseRepository: {
        description: 'Generic CRUD operations in /lib/database/BaseRepository.ts',
        methods: [
          'findAll(filter)',
          'findById(id)',
          'findOne(filter)',
          'create(data)',
          'createMany(data[])',
          'updateById(id, update)',
          'deleteById(id)',
          'count(filter)',
          'exists(filter)',
          'paginate(filter, page, limit)'
        ],
        purpose: 'Reusable operations for all entities'
      },
      
      layer3_SpecificRepositories: {
        ProductRepository: {
          file: '/lib/database/ProductRepository.ts',
          methods: [
            'findByCategory(category)',
            'findBySize(size)',
            'findByCareLevel(level)',
            'findPetFriendly(bool)',
            'search(term)',
            'updateStock(id, qty)',
            'getTopRated(limit)',
            'getFeatured(limit)'
          ],
          exampleCount: await db.products.count()
        },
        CartRepository: {
          file: '/lib/database/CartRepository.ts',
          methods: [
            'getOrCreateCart(sessionId)',
            'addItem(sessionId, item)',
            'updateItemQuantity(...)',
            'removeItem(...)',
            'clearCart(sessionId)',
            'mergeGuestCartToUser(...)',
            'cleanupEmptyCarts(days)'
          ],
          exampleCount: await db.carts.count()
        },
        OrderRepository: {
          file: '/lib/database/OrderRepository.ts',
          methods: [
            'findByEmail(email)',
            'findByStatus(status)',
            'updateStatus(id, status)',
            'getTotalRevenue(start, end)',
            'getTopCustomers(limit)',
            'getBestSellingProducts(limit)'
          ],
          exampleCount: await db.orders.count()
        }
      },
      
      layer4_DatabaseManager: {
        description: 'Unified access point in /lib/database/index.ts',
        singleton: true,
        properties: {
          'db.products': 'ProductRepository instance',
          'db.carts': 'CartRepository instance',
          'db.orders': 'OrderRepository instance'
        },
        methods: {
          'db.connect()': 'Initialize database connection',
          'db.isConnected()': 'Check connection status',
          'db.getStats()': 'Get collection counts',
          'db.seedDatabase()': 'Populate sample data'
        },
        usage: 'import { db } from "@/lib/database"'
      },
      
      layer5_APIRoutes: {
        description: 'HTTP endpoints that use Database Manager',
        routes: {
          '/api/products': 'Uses db.products repository',
          '/api/cart': 'Uses db.carts repository',
          '/api/orders': 'Uses db.orders repository'
        },
        example: {
          before: 'await Product.find({ category: "Indoor" })',
          after: 'await db.products.findByCategory("Indoor")'
        }
      },
      
      mongoDBCollections: {
        database: 'buyplants',
        collections: [
          {
            name: 'products',
            count: await db.products.count(),
            managedBy: 'ProductRepository'
          },
          {
            name: 'carts',
            count: await db.carts.count(),
            managedBy: 'CartRepository'
          },
          {
            name: 'orders',
            count: await db.orders.count(),
            managedBy: 'OrderRepository'
          }
        ]
      },
      
      benefits: {
        separation: 'Clear layers: API → Manager → Repository → Model → Database',
        reusability: 'BaseRepository eliminates code duplication',
        typeSafety: 'Full TypeScript support with interfaces',
        testability: 'Easy to mock repositories for unit tests',
        maintainability: 'Changes isolated to specific layers',
        scalability: 'Easy to add new entities and methods'
      },
      
      liveExample: {
        description: 'Fetch pet-friendly plants using ORM',
        code: 'await db.products.findPetFriendly(true)',
        result: await db.products.findPetFriendly(true)
      }
    };

    return NextResponse.json({
      success: true,
      message: 'ORM Database Structure Demonstration',
      isConnected: db.isConnected(),
      ...demonstration
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}
