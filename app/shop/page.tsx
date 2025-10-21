'use client';

import { useState } from 'react';
import ProductCard from '@/components/ProductCard';

export default function ShopPage() {
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedSize, setSelectedSize] = useState('all');
  const [selectedDifficulty, setSelectedDifficulty] = useState('all');
  const [selectedPetFriendly, setSelectedPetFriendly] = useState('all');

  // Sample products - In production, fetch from MongoDB API
  const products = [
    {
      _id: '1',
      name: 'Monstera Deliciosa',
      price: 74,
      size: 'LG',
      image: 'https://images.pexels.com/photos/7084309/pexels-photo-7084309.jpeg?auto=compress&cs=tinysrgb&w=600',
      category: 'Indoor',
      rating: 4.4,
      reviews: 25,
      inStock: true,
      badge: '25% OFF',
      difficulty: 'Moderate',
      petFriendly: false,
      potColors: ['Stone', 'Clay', 'Slate']
    },
    {
      _id: '2',
      name: 'Snake Plant',
      price: 34,
      originalPrice: 39,
      size: 'XS',
      image: 'https://cdn.pixabay.com/photo/2020/06/30/19/24/sansevieria-5357639_1280.jpg',
      category: 'Indoor',
      rating: 4.8,
      reviews: 52,
      inStock: true,
      badge: '15% OFF',
      difficulty: 'Easy',
      petFriendly: false,
      potColors: ['Taupe', 'Charcoal']
    },
    {
      _id: '3',
      name: 'Fiddle Leaf Fig',
      price: 199,
      size: 'XXL',
      image: 'https://images.pexels.com/photos/6208086/pexels-photo-6208086.jpeg?auto=compress&cs=tinysrgb&w=600',
      category: 'Indoor',
      rating: 4.6,
      reviews: 35,
      inStock: true,
      difficulty: 'Advanced',
      petFriendly: false,
      potColors: ['Clay', 'Stone', 'Clay']
    },
    {
      _id: '4',
      name: 'Peace Lily',
      price: 169,
      size: 'XL',
      image: 'https://images.pexels.com/photos/4503274/pexels-photo-4503274.jpeg?auto=compress&cs=tinysrgb&w=600',
      category: 'Indoor',
      rating: 4.7,
      reviews: 41,
      inStock: true,
      difficulty: 'Easy',
      petFriendly: false,
      potColors: ['Clay', 'Stone', 'Clay']
    },
    {
      _id: '5',
      name: 'Golden Pothos',
      price: 39,
      size: 'XS',
      image: 'https://images.pexels.com/photos/7084309/pexels-photo-7084309.jpeg?auto=compress&cs=tinysrgb&w=600',
      category: 'Indoor',
      rating: 4.9,
      reviews: 67,
      inStock: true,
      badge: 'MOST GIFTED',
      difficulty: 'Easy',
      petFriendly: true,
      potColors: ['Taupe', 'Charcoal']
    },
    {
      _id: '6',
      name: 'ZZ Plant',
      price: 139,
      size: 'XL',
      image: 'https://images.pexels.com/photos/6208087/pexels-photo-6208087.jpeg?auto=compress&cs=tinysrgb&w=600',
      category: 'Indoor',
      rating: 4.9,
      reviews: 43,
      inStock: true,
      badge: 'LOW-MAINTENANCE',
      difficulty: 'Easy',
      petFriendly: false,
      potColors: ['Clay', 'Stone']
    },
    {
      _id: '7',
      name: 'Rubber Plant',
      price: 89,
      size: 'LG',
      image: 'https://images.pexels.com/photos/3125195/pexels-photo-3125195.jpeg?auto=compress&cs=tinysrgb&w=600',
      category: 'Indoor',
      rating: 4.5,
      reviews: 29,
      inStock: true,
      difficulty: 'Easy',
      petFriendly: false,
      potColors: ['Stone', 'Clay', 'Slate']
    },
    {
      _id: '8',
      name: 'Calathea Pinstripe',
      price: 49,
      size: 'SM',
      image: 'https://cdn.pixabay.com/photo/2021/01/22/06/04/plant-5939187_1280.jpg',
      category: 'Indoor',
      rating: 4.3,
      reviews: 38,
      inStock: true,
      difficulty: 'Moderate',
      petFriendly: true,
      potColors: ['Clay']
    },
    {
      _id: '9',
      name: 'Bamboo Palm',
      price: 199,
      size: 'XXL',
      image: 'https://images.pexels.com/photos/7084302/pexels-photo-7084302.jpeg?auto=compress&cs=tinysrgb&w=600',
      category: 'Indoor',
      rating: 4.8,
      reviews: 52,
      inStock: true,
      badge: 'BESTSELLER',
      difficulty: 'Easy',
      petFriendly: true,
      potColors: ['Clay', 'Stone', 'Clay']
    },
    {
      _id: '10',
      name: 'Money Tree',
      price: 169,
      size: 'XL',
      image: 'https://images.pexels.com/photos/7084310/pexels-photo-7084310.jpeg?auto=compress&cs=tinysrgb&w=600',
      category: 'Indoor',
      rating: 4.6,
      reviews: 53,
      inStock: true,
      badge: 'MOST GIFTED',
      difficulty: 'Easy',
      petFriendly: false,
      potColors: ['Stone', 'Clay']
    },
    {
      _id: '11',
      name: 'Spider Plant',
      price: 39,
      originalPrice: 49,
      size: 'SM',
      image: 'https://images.pexels.com/photos/6208511/pexels-photo-6208511.jpeg?auto=compress&cs=tinysrgb&w=600',
      category: 'Indoor',
      rating: 4.7,
      reviews: 45,
      inStock: true,
      badge: '20% OFF',
      difficulty: 'Easy',
      petFriendly: true,
      potColors: ['Clay', 'White']
    },
    {
      _id: '12',
      name: 'Pothos Collection',
      price: 79,
      size: 'XS, BUNDLES',
      image: 'https://images.pexels.com/photos/7084316/pexels-photo-7084316.jpeg?auto=compress&cs=tinysrgb&w=600',
      category: 'Bundles',
      rating: 4.8,
      reviews: 28,
      inStock: true,
      difficulty: 'Easy',
      petFriendly: true,
      potColors: ['Taupe', 'Charcoal']
    }
  ];

  const filteredProducts = products.filter(product => {
    if (selectedCategory !== 'all' && product.category !== selectedCategory) return false;
    if (selectedSize !== 'all' && !product.size.includes(selectedSize)) return false;
    if (selectedDifficulty !== 'all' && product.difficulty !== selectedDifficulty) return false;
    if (selectedPetFriendly === 'true' && !product.petFriendly) return false;
    return true;
  });

  const categories = [
    { id: 'all', name: 'All Plants' },
    { id: 'Indoor', name: 'Indoor' },
    { id: 'Bundles', name: 'Bundles' },
    { id: 'best-sellers', name: 'Best Sellers' },
    { id: 'new-arrivals', name: 'New Arrivals' },
  ];

  const sizes = [
    { id: 'all', name: 'All Sizes' },
    { id: 'XS', name: 'XS' },
    { id: 'SM', name: 'SM' },
    { id: 'MD', name: 'MD' },
    { id: 'LG', name: 'LG' },
    { id: 'XL', name: 'XL' },
    { id: 'XXL', name: 'XXL' },
  ];

  const difficulties = [
    { id: 'all', name: 'All Levels' },
    { id: 'Easy', name: 'Easy' },
    { id: 'Moderate', name: 'Moderate' },
    { id: 'Advanced', name: 'Advanced' },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <h1 className="text-4xl font-bold mb-4">Shop All Plants</h1>
      <p className="text-gray-600 mb-8">Discover our complete collection of indoor plants, bundles, and more</p>

      {/* Filters Section */}
      <div className="mb-8 bg-gray-50 p-6 rounded-lg">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Category Filter */}
          <div>
            <label className="block text-sm font-semibold mb-2 text-gray-700">Category</label>
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-green-500 focus:border-transparent"
            >
              {categories.map((cat) => (
                <option key={cat.id} value={cat.id}>{cat.name}</option>
              ))}
            </select>
          </div>

          {/* Size Filter */}
          <div>
            <label className="block text-sm font-semibold mb-2 text-gray-700">Plant Size</label>
            <select
              value={selectedSize}
              onChange={(e) => setSelectedSize(e.target.value)}
              className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-green-500 focus:border-transparent"
            >
              {sizes.map((size) => (
                <option key={size.id} value={size.id}>{size.name}</option>
              ))}
            </select>
          </div>

          {/* Difficulty Filter */}
          <div>
            <label className="block text-sm font-semibold mb-2 text-gray-700">Difficulty</label>
            <select
              value={selectedDifficulty}
              onChange={(e) => setSelectedDifficulty(e.target.value)}
              className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-green-500 focus:border-transparent"
            >
              {difficulties.map((diff) => (
                <option key={diff.id} value={diff.id}>{diff.name}</option>
              ))}
            </select>
          </div>

          {/* Pet Friendly Filter */}
          <div>
            <label className="block text-sm font-semibold mb-2 text-gray-700">Pet Friendly</label>
            <select
              value={selectedPetFriendly}
              onChange={(e) => setSelectedPetFriendly(e.target.value)}
              className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-green-500 focus:border-transparent"
            >
              <option value="all">All Plants</option>
              <option value="true">Pet Friendly Only</option>
            </select>
          </div>
        </div>

        {/* Clear Filters Button */}
        {(selectedCategory !== 'all' || selectedSize !== 'all' || selectedDifficulty !== 'all' || selectedPetFriendly !== 'all') && (
          <button
            onClick={() => {
              setSelectedCategory('all');
              setSelectedSize('all');
              setSelectedDifficulty('all');
              setSelectedPetFriendly('all');
            }}
            className="mt-4 text-green-600 hover:text-green-700 font-semibold"
          >
            Clear All Filters
          </button>
        )}
      </div>

      {/* Results Count */}
      <p className="text-gray-600 mb-4">
        Showing {filteredProducts.length} {filteredProducts.length === 1 ? 'plant' : 'plants'}
      </p>

      {/* Products Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {filteredProducts.map((product) => (
          <ProductCard key={product._id} product={product} />
        ))}
      </div>

      {filteredProducts.length === 0 && (
        <div className="text-center py-16">
          <p className="text-gray-600 text-lg mb-4">No plants found matching your filters</p>
          <button
            onClick={() => {
              setSelectedCategory('all');
              setSelectedSize('all');
              setSelectedDifficulty('all');
              setSelectedPetFriendly('all');
            }}
            className="bg-green-600 text-white px-6 py-2 rounded-lg hover:bg-green-700"
          >
            Clear Filters
          </button>
        </div>
      )}
    </div>
  );
}
