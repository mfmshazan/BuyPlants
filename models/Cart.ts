import mongoose, { Schema, Document, Model } from 'mongoose';

export interface ICartItem {
  productId: mongoose.Types.ObjectId | string;
  name: string;
  price: number;
  image: string;
  size: string;
  quantity: number;
}

export interface ICart extends Document {
  userId?: string; // For future authentication
  sessionId: string; // For guest users
  items: ICartItem[];
  totalAmount: number;
  createdAt: Date;
  updatedAt: Date;
}

const CartItemSchema = new Schema<ICartItem>({
  productId: {
    type: Schema.Types.ObjectId,
    ref: 'Product',
    required: true
  },
  name: {
    type: String,
    required: true
  },
  price: {
    type: Number,
    required: true
  },
  image: {
    type: String,
    required: true
  },
  size: {
    type: String,
    required: true
  },
  quantity: {
    type: Number,
    required: true,
    min: 1,
    default: 1
  }
});

const CartSchema = new Schema<ICart>({
  userId: {
    type: String,
    required: false
  },
  sessionId: {
    type: String,
    required: true,
    index: true
  },
  items: [CartItemSchema],
  totalAmount: {
    type: Number,
    required: true,
    default: 0
  }
}, {
  timestamps: true
});

// Calculate total amount before saving
CartSchema.pre('save', function(next) {
  this.totalAmount = this.items.reduce((total, item) => {
    return total + (item.price * item.quantity);
  }, 0);
  next();
});

const Cart: Model<ICart> = mongoose.models.Cart || mongoose.model<ICart>('Cart', CartSchema);

export default Cart;
