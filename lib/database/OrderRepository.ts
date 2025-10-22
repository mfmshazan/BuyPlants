import Order, { IOrder } from '@/models/Order';
import { BaseRepository } from './BaseRepository';

/**
 * Order Repository - Handles all order-related database operations
 */
export class OrderRepository extends BaseRepository<IOrder> {
  constructor() {
    super(Order);
  }

  /**
   * Find orders by user ID
   */
  async findByUserId(userId: string): Promise<IOrder[]> {
    return this.findAll({ userId });
  }

  /**
   * Find orders by email
   */
  async findByEmail(email: string): Promise<IOrder[]> {
    return this.findAll({ email });
  }

  /**
   * Find orders by status
   */
  async findByStatus(status: IOrder['status']): Promise<IOrder[]> {
    return this.findAll({ status });
  }

  /**
   * Find orders by payment status
   */
  async findByPaymentStatus(paymentStatus: IOrder['paymentStatus']): Promise<IOrder[]> {
    return this.findAll({ paymentStatus });
  }

  /**
   * Find pending orders
   */
  async findPendingOrders(): Promise<IOrder[]> {
    return this.findAll({ status: 'pending' });
  }

  /**
   * Find orders requiring fulfillment
   */
  async findOrdersToFulfill(): Promise<IOrder[]> {
    return this.findAll({
      status: { $in: ['pending', 'processing'] },
      paymentStatus: 'paid'
    });
  }

  /**
   * Update order status
   */
  async updateStatus(orderId: string, status: IOrder['status']): Promise<IOrder | null> {
    return this.updateById(orderId, { status });
  }

  /**
   * Update payment status
   */
  async updatePaymentStatus(
    orderId: string,
    paymentStatus: IOrder['paymentStatus']
  ): Promise<IOrder | null> {
    return this.updateById(orderId, { paymentStatus });
  }

  /**
   * Add tracking information
   */
  async addTrackingInfo(
    orderId: string,
    trackingNumber: string,
    deliveryDate?: Date
  ): Promise<IOrder | null> {
    const update: any = { 
      trackingNumber,
      status: 'shipped'
    };
    
    if (deliveryDate) {
      update.deliveryDate = deliveryDate;
    }

    return this.updateById(orderId, update);
  }

  /**
   * Mark order as delivered
   */
  async markAsDelivered(orderId: string): Promise<IOrder | null> {
    return this.updateById(orderId, { 
      status: 'delivered',
      deliveryDate: new Date()
    });
  }

  /**
   * Cancel order
   */
  async cancelOrder(orderId: string): Promise<IOrder | null> {
    const order = await this.findById(orderId);
    if (!order) return null;

    // Only allow cancellation if not shipped
    if (order.status === 'shipped' || order.status === 'delivered') {
      throw new Error('Cannot cancel order that has been shipped or delivered');
    }

    return this.updateById(orderId, { status: 'cancelled' });
  }

  /**
   * Get orders in date range
   */
  async findByDateRange(startDate: Date, endDate: Date): Promise<IOrder[]> {
    return this.findAll({
      createdAt: {
        $gte: startDate,
        $lte: endDate
      }
    });
  }

  /**
   * Get total revenue
   */
  async getTotalRevenue(startDate?: Date, endDate?: Date): Promise<number> {
    try {
      const matchStage: any = {
        status: { $ne: 'cancelled' },
        paymentStatus: 'paid'
      };

      if (startDate || endDate) {
        matchStage.createdAt = {};
        if (startDate) matchStage.createdAt.$gte = startDate;
        if (endDate) matchStage.createdAt.$lte = endDate;
      }

      const result = await this.model.aggregate([
        { $match: matchStage },
        {
          $group: {
            _id: null,
            total: { $sum: '$totalPrice' }
          }
        }
      ]);

      return result[0]?.total || 0;
    } catch (error) {
      throw new Error(`Error calculating revenue: ${error}`);
    }
  }

  /**
   * Get order statistics
   */
  async getOrderStats(startDate?: Date, endDate?: Date) {
    try {
      const matchStage: any = {};

      if (startDate || endDate) {
        matchStage.createdAt = {};
        if (startDate) matchStage.createdAt.$gte = startDate;
        if (endDate) matchStage.createdAt.$lte = endDate;
      }

      const stats = await this.model.aggregate([
        { $match: matchStage },
        {
          $group: {
            _id: '$status',
            count: { $sum: 1 },
            totalRevenue: { $sum: '$totalPrice' }
          }
        }
      ]);

      return stats;
    } catch (error) {
      throw new Error(`Error getting order stats: ${error}`);
    }
  }

  /**
   * Get top customers
   */
  async getTopCustomers(limit: number = 10) {
    try {
      return await this.model.aggregate([
        {
          $match: {
            status: { $ne: 'cancelled' },
            paymentStatus: 'paid'
          }
        },
        {
          $group: {
            _id: '$email',
            totalOrders: { $sum: 1 },
            totalSpent: { $sum: '$totalPrice' }
          }
        },
        { $sort: { totalSpent: -1 } },
        { $limit: limit }
      ]);
    } catch (error) {
      throw new Error(`Error getting top customers: ${error}`);
    }
  }

  /**
   * Get best-selling products
   */
  async getBestSellingProducts(limit: number = 10) {
    try {
      return await this.model.aggregate([
        {
          $match: {
            status: { $ne: 'cancelled' },
            paymentStatus: 'paid'
          }
        },
        { $unwind: '$items' },
        {
          $group: {
            _id: '$items.productId',
            productName: { $first: '$items.name' },
            totalQuantity: { $sum: '$items.quantity' },
            totalRevenue: { $sum: { $multiply: ['$items.price', '$items.quantity'] } }
          }
        },
        { $sort: { totalQuantity: -1 } },
        { $limit: limit }
      ]);
    } catch (error) {
      throw new Error(`Error getting best-selling products: ${error}`);
    }
  }

  /**
   * Get recent orders with pagination
   */
  async getRecentOrders(page: number = 1, limit: number = 20) {
    try {
      const skip = (page - 1) * limit;
      const [orders, total] = await Promise.all([
        this.model.find().sort({ createdAt: -1 }).skip(skip).limit(limit).exec(),
        this.model.countDocuments().exec()
      ]);

      return {
        data: orders,
        total,
        page,
        totalPages: Math.ceil(total / limit)
      };
    } catch (error) {
      throw new Error(`Error getting recent orders: ${error}`);
    }
  }
}

// Export singleton instance
export const orderRepository = new OrderRepository();
