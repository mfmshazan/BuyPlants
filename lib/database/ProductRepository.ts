import Product, { IProduct } from '@/models/Product';
import { BaseRepository } from './BaseRepository';
import { FilterQuery } from 'mongoose';

/**
 * Product Repository - Handles all product-related database operations
 */
export class ProductRepository extends BaseRepository<IProduct> {
  constructor() {
    super(Product);
  }

  /**
   * Find products by category
   */
  async findByCategory(category: string): Promise<IProduct[]> {
    return this.findAll({ category });
  }

  /**
   * Find products by size
   */
  async findBySize(size: string): Promise<IProduct[]> {
    return this.findAll({ size });
  }

  /**
   * Find products by care level
   */
  async findByCareLevel(careLevel: string): Promise<IProduct[]> {
    return this.findAll({ careLevel });
  }

  /**
   * Find pet-friendly products
   */
  async findPetFriendly(petFriendly: boolean = true): Promise<IProduct[]> {
    return this.findAll({ petFriendly });
  }

  /**
   * Find products in stock
   */
  async findInStock(): Promise<IProduct[]> {
    return this.findAll({ inStock: true, stockQuantity: { $gt: 0 } });
  }

  /**
   * Find products with advanced filtering
   */
  async findWithFilters(filters: {
    category?: string;
    size?: string;
    careLevel?: string;
    petFriendly?: boolean;
    minPrice?: number;
    maxPrice?: number;
    inStock?: boolean;
  }): Promise<IProduct[]> {
    const query: FilterQuery<IProduct> = {};

    if (filters.category) query.category = filters.category;
    if (filters.size) query.size = filters.size;
    if (filters.careLevel) query.careLevel = filters.careLevel;
    if (filters.petFriendly !== undefined) query.petFriendly = filters.petFriendly;
    if (filters.inStock !== undefined) query.inStock = filters.inStock;
    
    if (filters.minPrice !== undefined || filters.maxPrice !== undefined) {
      query.price = {};
      if (filters.minPrice !== undefined) query.price.$gte = filters.minPrice;
      if (filters.maxPrice !== undefined) query.price.$lte = filters.maxPrice;
    }

    return this.findAll(query);
  }

  /**
   * Search products by name or description
   */
  async search(searchTerm: string): Promise<IProduct[]> {
    return this.findAll({
      $or: [
        { name: { $regex: searchTerm, $options: 'i' } },
        { description: { $regex: searchTerm, $options: 'i' } },
        { tags: { $in: [new RegExp(searchTerm, 'i')] } }
      ]
    });
  }

  /**
   * Update stock quantity
   */
  async updateStock(productId: string, quantity: number): Promise<IProduct | null> {
    const product = await this.findById(productId);
    if (!product) return null;

    const newQuantity = product.stockQuantity + quantity;
    const inStock = newQuantity > 0;

    return this.updateById(productId, {
      stockQuantity: newQuantity,
      inStock
    });
  }

  /**
   * Decrease stock (for purchases)
   */
  async decreaseStock(productId: string, quantity: number): Promise<IProduct | null> {
    return this.updateStock(productId, -quantity);
  }

  /**
   * Increase stock (for restocking)
   */
  async increaseStock(productId: string, quantity: number): Promise<IProduct | null> {
    return this.updateStock(productId, quantity);
  }

  /**
   * Get top-rated products
   */
  async getTopRated(limit: number = 10): Promise<IProduct[]> {
    try {
      return await this.model
        .find({ inStock: true })
        .sort({ rating: -1 })
        .limit(limit)
        .exec();
    } catch (error) {
      throw new Error(`Error getting top-rated products: ${error}`);
    }
  }

  /**
   * Get featured products
   */
  async getFeatured(limit: number = 8): Promise<IProduct[]> {
    try {
      return await this.model
        .find({ inStock: true })
        .sort({ reviews: -1, rating: -1 })
        .limit(limit)
        .exec();
    } catch (error) {
      throw new Error(`Error getting featured products: ${error}`);
    }
  }

  /**
   * Get products by price range with pagination
   */
  async findByPriceRange(
    minPrice: number,
    maxPrice: number,
    page: number = 1,
    limit: number = 20
  ) {
    return this.paginate(
      { price: { $gte: minPrice, $lte: maxPrice } },
      page,
      limit
    );
  }
}

// Export singleton instance
export const productRepository = new ProductRepository();
