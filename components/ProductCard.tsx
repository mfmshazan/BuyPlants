'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useCart } from '@/context/CartContext';

interface Product {
  _id: string;
  name: string;
  price: number;
  originalPrice?: number;
  size: string;
  image: string;
  category: string;
  rating?: number;
  reviews?: number;
  inStock: boolean;
  badge?: string;
  careLevel?: string;
  petFriendly?: boolean;
  tags?: string[];
}

interface ProductCardProps {
  product: Product;
}

export default function ProductCard({ product }: ProductCardProps) {
  const { addToCart } = useCart();

  const handleAddToCart = () => {
    addToCart({
      id: product._id,
      name: product.name,
      price: product.price,
      image: product.image,
      size: product.size,
      quantity: 1
    });
  };

  return (
    <div className="bg-white rounded-lg overflow-hidden shadow-sm hover:shadow-lg transition group">
      <Link href={`/product/${product._id}`}>
        <div className="relative h-64 bg-gray-100">
          <Image
            src={product.image}
            alt={product.name}
            fill
            sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 25vw"
            className="object-cover group-hover:scale-105 transition"
          />
          {/* Badge */}
          {product.badge && (
            <div className="absolute top-3 left-3 bg-white px-3 py-1 rounded-full text-xs font-bold text-gray-800 shadow-md">
              {product.badge}
            </div>
          )}
          {/* Pet Friendly Icon */}
          {product.petFriendly && (
            <div className="absolute top-3 right-3 bg-green-100 p-2 rounded-full" title="Pet Friendly">
              <span className="text-lg">🐾</span>
            </div>
          )}
        </div>
      </Link>

      <div className="p-4">
        <Link href={`/product/${product._id}`}>
          <h3 className="text-lg font-semibold text-gray-900 mb-2 hover:text-green-600">
            {product.name}
          </h3>
        </Link>

        <div className="flex items-center justify-between mb-2">
          <div>
            {product.originalPrice ? (
              <div className="flex items-center gap-2">
                <span className="text-xl font-bold text-green-600">${product.price}</span>
                <span className="text-sm text-gray-500 line-through">${product.originalPrice}</span>
              </div>
            ) : (
              <span className="text-xl font-bold text-gray-900">${product.price}</span>
            )}
          </div>
          <span className="text-sm text-gray-600 uppercase font-medium">{product.size}</span>
        </div>

        {/* Care Level */}
        {product.careLevel && (
          <div className="flex items-center gap-1 mb-3">
            <span className="text-xs text-gray-500 uppercase">Care: {product.careLevel}</span>
          </div>
        )}

        {product.rating && product.reviews && (
          <div className="flex items-center mb-3 text-sm">
            <span className="text-yellow-400">★</span>
            <span className="ml-1 text-gray-700">{product.rating}</span>
            <span className="ml-2 text-gray-500">({product.reviews} reviews)</span>
          </div>
        )}

        <button
          onClick={handleAddToCart}
          disabled={!product.inStock}
          className={`w-full py-2 px-4 rounded-lg font-semibold transition ${
            product.inStock
              ? 'bg-green-600 text-white hover:bg-green-700'
              : 'bg-gray-300 text-gray-500 cursor-not-allowed'
          }`}
        >
          {product.inStock ? 'ADD TO CART' : 'OUT OF STOCK'}
        </button>
      </div>
    </div>
  );
}
