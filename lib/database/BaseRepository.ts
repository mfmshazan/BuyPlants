import mongoose, { Model, Document, FilterQuery, UpdateQuery } from 'mongoose';

/**
 * Base Repository Pattern for MongoDB ORM
 * Provides common CRUD operations for all entities
 */
export abstract class BaseRepository<T extends Document> {
  protected model: Model<T>;

  constructor(model: Model<T>) {
    this.model = model;
  }

  /**
   * Find all documents with optional filters
   */
  async findAll(filter: FilterQuery<T> = {}): Promise<T[]> {
    try {
      return await this.model.find(filter).exec();
    } catch (error) {
      throw new Error(`Error finding documents: ${error}`);
    }
  }

  /**
   * Find a single document by ID
   */
  async findById(id: string): Promise<T | null> {
    try {
      return await this.model.findById(id).exec();
    } catch (error) {
      throw new Error(`Error finding document by ID: ${error}`);
    }
  }

  /**
   * Find a single document by filter
   */
  async findOne(filter: FilterQuery<T>): Promise<T | null> {
    try {
      return await this.model.findOne(filter).exec();
    } catch (error) {
      throw new Error(`Error finding document: ${error}`);
    }
  }

  /**
   * Create a new document
   */
  async create(data: Partial<T>): Promise<T> {
    try {
      const document = new this.model(data);
      return await document.save();
    } catch (error) {
      throw new Error(`Error creating document: ${error}`);
    }
  }

  /**
   * Create multiple documents
   */
  async createMany(data: Partial<T>[]): Promise<any[]> {
    try {
      return await this.model.insertMany(data as any);
    } catch (error) {
      throw new Error(`Error creating documents: ${error}`);
    }
  }

  /**
   * Update a document by ID
   */
  async updateById(id: string, update: UpdateQuery<T>): Promise<T | null> {
    try {
      return await this.model.findByIdAndUpdate(id, update, { new: true }).exec();
    } catch (error) {
      throw new Error(`Error updating document: ${error}`);
    }
  }

  /**
   * Update a single document by filter
   */
  async updateOne(filter: FilterQuery<T>, update: UpdateQuery<T>): Promise<T | null> {
    try {
      return await this.model.findOneAndUpdate(filter, update, { new: true }).exec();
    } catch (error) {
      throw new Error(`Error updating document: ${error}`);
    }
  }

  /**
   * Update multiple documents
   */
  async updateMany(filter: FilterQuery<T>, update: UpdateQuery<T>): Promise<{ modifiedCount: number }> {
    try {
      const result = await this.model.updateMany(filter, update).exec();
      return { modifiedCount: result.modifiedCount };
    } catch (error) {
      throw new Error(`Error updating documents: ${error}`);
    }
  }

  /**
   * Delete a document by ID
   */
  async deleteById(id: string): Promise<boolean> {
    try {
      const result = await this.model.findByIdAndDelete(id).exec();
      return !!result;
    } catch (error) {
      throw new Error(`Error deleting document: ${error}`);
    }
  }

  /**
   * Delete a single document by filter
   */
  async deleteOne(filter: FilterQuery<T>): Promise<boolean> {
    try {
      const result = await this.model.findOneAndDelete(filter).exec();
      return !!result;
    } catch (error) {
      throw new Error(`Error deleting document: ${error}`);
    }
  }

  /**
   * Delete multiple documents
   */
  async deleteMany(filter: FilterQuery<T>): Promise<{ deletedCount: number }> {
    try {
      const result = await this.model.deleteMany(filter).exec();
      return { deletedCount: result.deletedCount || 0 };
    } catch (error) {
      throw new Error(`Error deleting documents: ${error}`);
    }
  }

  /**
   * Count documents
   */
  async count(filter: FilterQuery<T> = {}): Promise<number> {
    try {
      return await this.model.countDocuments(filter).exec();
    } catch (error) {
      throw new Error(`Error counting documents: ${error}`);
    }
  }

  /**
   * Check if document exists
   */
  async exists(filter: FilterQuery<T>): Promise<boolean> {
    try {
      const count = await this.model.countDocuments(filter).limit(1).exec();
      return count > 0;
    } catch (error) {
      throw new Error(`Error checking existence: ${error}`);
    }
  }

  /**
   * Paginate results
   */
  async paginate(
    filter: FilterQuery<T> = {},
    page: number = 1,
    limit: number = 10
  ): Promise<{ data: T[]; total: number; page: number; totalPages: number }> {
    try {
      const skip = (page - 1) * limit;
      const [data, total] = await Promise.all([
        this.model.find(filter).skip(skip).limit(limit).exec(),
        this.model.countDocuments(filter).exec()
      ]);

      return {
        data,
        total,
        page,
        totalPages: Math.ceil(total / limit)
      };
    } catch (error) {
      throw new Error(`Error paginating documents: ${error}`);
    }
  }
}
