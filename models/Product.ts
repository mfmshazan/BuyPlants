import mongoose, { Document } from 'mongoose';

export interface IProduct extends Document {
  name: string;
  description: string;
  price: number;
  size: string;
  image: string;
  images?: string[];
  category: string;
  tags: string[];
  inStock: boolean;
  stockQuantity: number;
  rating?: number;
  reviews?: number;
  careLevel?: 'Easy' | 'Moderate' | 'Advanced';
  lightRequirement?: 'Low' | 'Medium' | 'Bright';
  petFriendly?: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const ProductSchema = new mongoose.Schema<IProduct>(
  {
    name: {
      type: String,
      required: [true, 'Product name is required'],
      trim: true,
    },
    description: {
      type: String,
      required: [true, 'Product description is required'],
    },
    price: {
      type: Number,
      required: [true, 'Product price is required'],
      min: [0, 'Price cannot be negative'],
    },
    size: {
      type: String,
      required: true,
      // Flexible to support single sizes (SM, MD, LG) or comma-separated (SM,MD,LG)
    },
    image: {
      type: String,
      required: [true, 'Product image is required'],
    },
    images: [String],
    category: {
      type: String,
      required: true,
    },
    tags: [String],
    inStock: {
      type: Boolean,
      default: true,
    },
    stockQuantity: {
      type: Number,
      default: 0,
      min: 0,
    },
    rating: Number,
    reviews: Number,
    careLevel: {
      type: String,
      enum: ['Easy', 'Moderate', 'Advanced'],
    },
    lightRequirement: {
      type: String,
      enum: ['Low', 'Medium', 'Bright'],
    },
    petFriendly: Boolean,
  },
  {
    timestamps: true,
  }
);

export default mongoose.models.Product || mongoose.model<IProduct>('Product', ProductSchema);
