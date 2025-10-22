import Cart, { ICart, ICartItem } from '@/models/Cart';
import { BaseRepository } from './BaseRepository';

/**
 * Cart Repository - Handles all cart-related database operations
 */
export class CartRepository extends BaseRepository<ICart> {
  constructor() {
    super(Cart);
  }

  /**
   * Find cart by session ID
   */
  async findBySessionId(sessionId: string): Promise<ICart | null> {
    return this.findOne({ sessionId });
  }

  /**
   * Find cart by user ID (for authenticated users)
   */
  async findByUserId(userId: string): Promise<ICart | null> {
    return this.findOne({ userId });
  }

  /**
   * Create or get cart for session
   */
  async getOrCreateCart(sessionId: string, userId?: string): Promise<ICart> {
    let cart = await this.findBySessionId(sessionId);
    
    if (!cart) {
      cart = await this.create({
        sessionId,
        userId,
        items: [],
        totalAmount: 0
      } as Partial<ICart>);
    }
    
    return cart;
  }

  /**
   * Add item to cart
   */
  async addItem(sessionId: string, item: ICartItem): Promise<ICart> {
    const cart = await this.getOrCreateCart(sessionId);
    
    // Check if item already exists
    const existingItemIndex = cart.items.findIndex(
      (i) => i.productId.toString() === item.productId.toString() && i.size === item.size
    );

    if (existingItemIndex > -1) {
      // Update quantity
      cart.items[existingItemIndex].quantity += item.quantity;
    } else {
      // Add new item
      cart.items.push(item);
    }

    return await cart.save();
  }

  /**
   * Update item quantity
   */
  async updateItemQuantity(
    sessionId: string,
    productId: string,
    size: string,
    quantity: number
  ): Promise<ICart | null> {
    const cart = await this.findBySessionId(sessionId);
    if (!cart) return null;

    const itemIndex = cart.items.findIndex(
      (i) => i.productId.toString() === productId && i.size === size
    );

    if (itemIndex === -1) return null;

    if (quantity <= 0) {
      // Remove item if quantity is 0 or less
      cart.items.splice(itemIndex, 1);
    } else {
      // Update quantity
      cart.items[itemIndex].quantity = quantity;
    }

    return await cart.save();
  }

  /**
   * Remove item from cart
   */
  async removeItem(sessionId: string, productId: string, size: string): Promise<ICart | null> {
    const cart = await this.findBySessionId(sessionId);
    if (!cart) return null;

    cart.items = cart.items.filter(
      (i) => !(i.productId.toString() === productId && i.size === size)
    );

    return await cart.save();
  }

  /**
   * Clear cart
   */
  async clearCart(sessionId: string): Promise<ICart | null> {
    const cart = await this.findBySessionId(sessionId);
    if (!cart) return null;

    cart.items = [];
    return await cart.save();
  }

  /**
   * Get cart item count
   */
  async getItemCount(sessionId: string): Promise<number> {
    const cart = await this.findBySessionId(sessionId);
    if (!cart) return 0;

    return cart.items.reduce((total, item) => total + item.quantity, 0);
  }

  /**
   * Get cart total
   */
  async getCartTotal(sessionId: string): Promise<number> {
    const cart = await this.findBySessionId(sessionId);
    if (!cart) return 0;

    return cart.totalAmount;
  }

  /**
   * Merge guest cart with user cart (after login)
   */
  async mergeGuestCartToUser(sessionId: string, userId: string): Promise<ICart> {
    const guestCart = await this.findBySessionId(sessionId);
    const userCart = await this.findByUserId(userId);

    if (!guestCart || guestCart.items.length === 0) {
      // No guest cart or empty, return user cart or create new
      return userCart || await this.create({ userId, sessionId, items: [], totalAmount: 0 } as Partial<ICart>);
    }

    if (!userCart) {
      // No user cart, convert guest cart
      guestCart.userId = userId;
      return await guestCart.save();
    }

    // Merge items
    for (const item of guestCart.items) {
      const existingIndex = userCart.items.findIndex(
        (i) => i.productId.toString() === item.productId.toString() && i.size === item.size
      );

      if (existingIndex > -1) {
        userCart.items[existingIndex].quantity += item.quantity;
      } else {
        userCart.items.push(item);
      }
    }

    // Delete guest cart
    await this.deleteOne({ sessionId });

    return await userCart.save();
  }

  /**
   * Get abandoned carts (carts not updated in X days)
   */
  async getAbandonedCarts(daysOld: number = 7): Promise<ICart[]> {
    const cutoffDate = new Date();
    cutoffDate.setDate(cutoffDate.getDate() - daysOld);

    return this.findAll({
      updatedAt: { $lt: cutoffDate },
      items: { $ne: [] } // Not empty
    });
  }

  /**
   * Clean up old empty carts
   */
  async cleanupEmptyCarts(daysOld: number = 30): Promise<number> {
    const cutoffDate = new Date();
    cutoffDate.setDate(cutoffDate.getDate() - daysOld);

    const result = await this.deleteMany({
      updatedAt: { $lt: cutoffDate },
      items: { $size: 0 }
    });

    return result.deletedCount;
  }
}

// Export singleton instance
export const cartRepository = new CartRepository();
