import dbConnect from '../mongodb';
import { productRepository } from './ProductRepository';
import { cartRepository } from './CartRepository';
import { orderRepository } from './OrderRepository';

/**
 * Unified Database Manager - ORM Pattern
 * Provides centralized access to all repositories
 */
export class DatabaseManager {
  private static instance: DatabaseManager;
  
  // Repositories
  public products = productRepository;
  public carts = cartRepository;
  public orders = orderRepository;

  private constructor() {
    // Private constructor for singleton
  }

  /**
   * Get singleton instance
   */
  public static getInstance(): DatabaseManager {
    if (!DatabaseManager.instance) {
      DatabaseManager.instance = new DatabaseManager();
    }
    return DatabaseManager.instance;
  }

  /**
   * Initialize database connection
   */
  public async connect() {
    try {
      await dbConnect();
      console.log('🗄️  Database Manager initialized');
      return true;
    } catch (error) {
      console.error('❌ Database Manager initialization failed:', error);
      throw error;
    }
  }

  /**
   * Get connection status
   */
  public isConnected(): boolean {
    const mongoose = require('mongoose');
    return mongoose.connection.readyState === 1;
  }

  /**
   * Close all database connections
   */
  public async disconnect() {
    const mongoose = require('mongoose');
    await mongoose.disconnect();
    console.log('🔌 Database disconnected');
  }

  /**
   * Seed database with sample data
   */
  public async seedDatabase() {
    try {
      await this.connect();

      // Clear existing data
      await this.products.deleteMany({});
      await this.carts.deleteMany({});
      await this.orders.deleteMany({});

      // Seed products
      const sampleProducts = [
        {
          name: 'Monstera Deliciosa',
          description: 'A stunning tropical plant with large, glossy leaves that develop natural holes as they mature.',
          price: 74,
          size: 'LG',
          image: 'https://images.pexels.com/photos/7084309/pexels-photo-7084309.jpeg?auto=compress&cs=tinysrgb&w=600',
          category: 'Indoor',
          tags: ['tropical', 'large', 'statement'],
          inStock: true,
          stockQuantity: 15,
          rating: 4.4,
          reviews: 25,
          careLevel: 'Moderate' as const,
          lightRequirement: 'Bright' as const,
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
          careLevel: 'Easy' as const,
          lightRequirement: 'Low' as const,
          petFriendly: false
        },
        // Add more products as needed
      ];

      const products = await this.products.createMany(sampleProducts);
      console.log(`✅ Seeded ${products.length} products`);

      return {
        success: true,
        productsCount: products.length
      };
    } catch (error) {
      console.error('Error seeding database:', error);
      throw error;
    }
  }

  /**
   * Get database statistics
   */
  public async getStats() {
    await this.connect();

    const [productsCount, cartsCount, ordersCount] = await Promise.all([
      this.products.count(),
      this.carts.count(),
      this.orders.count()
    ]);

    return {
      products: productsCount,
      carts: cartsCount,
      orders: ordersCount,
      connected: this.isConnected()
    };
  }
}

// Export singleton instance
export const db = DatabaseManager.getInstance();

// Export individual repositories for convenience
export { productRepository, cartRepository, orderRepository };
