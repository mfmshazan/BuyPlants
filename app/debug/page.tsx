'use client';

import { useEffect, useState } from 'react';

export default function DebugPage() {
  const [allProducts, setAllProducts] = useState<any[]>([]);
  const [indoorProducts, setIndoorProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch all products
        const allRes = await fetch('/api/products');
        const allData = await allRes.json();
        setAllProducts(allData.products || []);

        // Fetch Indoor products
        const indoorRes = await fetch('/api/products?category=Indoor');
        const indoorData = await indoorRes.json();
        setIndoorProducts(indoorData.products || []);

        setLoading(false);
      } catch (error) {
        console.error('Error:', error);
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) return <div className="p-8">Loading...</div>;

  return (
    <div className="max-w-7xl mx-auto p-8">
      <h1 className="text-3xl font-bold mb-8">Debug: Product Categories</h1>

      <div className="mb-8 p-4 bg-blue-50 border border-blue-200 rounded">
        <h2 className="text-xl font-bold mb-4">📊 Summary</h2>
        <p className="mb-2"><strong>Total Products:</strong> {allProducts.length}</p>
        <p><strong>Indoor Products (filtered):</strong> {indoorProducts.length}</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* All Products */}
        <div className="border rounded-lg p-4">
          <h2 className="text-xl font-bold mb-4 bg-gray-100 p-3 rounded">
            All Products ({allProducts.length})
          </h2>
          <div className="space-y-2">
            {allProducts.map((product, index) => (
              <div key={index} className="p-3 bg-white border rounded">
                <p className="font-semibold text-sm">{product.name}</p>
                <p className="text-xs text-gray-600">
                  <span className="font-medium">Category:</span>{' '}
                  <span className="bg-yellow-100 px-2 py-1 rounded">
                    "{product.category}"
                  </span>
                </p>
                <p className="text-xs text-gray-600">
                  <span className="font-medium">Price:</span> ${product.price}
                </p>
                {product.size && (
                  <p className="text-xs text-gray-600">
                    <span className="font-medium">Size:</span> {product.size}
                  </p>
                )}
              </div>
            ))}
            {allProducts.length === 0 && (
              <p className="text-gray-500 text-center py-8">
                No products found. Add some via /admin
              </p>
            )}
          </div>
        </div>

        {/* Indoor Products Only */}
        <div className="border rounded-lg p-4">
          <h2 className="text-xl font-bold mb-4 bg-green-100 p-3 rounded">
            Indoor Products Only ({indoorProducts.length})
          </h2>
          <div className="space-y-2">
            {indoorProducts.map((product, index) => (
              <div key={index} className="p-3 bg-white border rounded">
                <p className="font-semibold text-sm">{product.name}</p>
                <p className="text-xs text-gray-600">
                  <span className="font-medium">Category:</span>{' '}
                  <span className="bg-green-100 px-2 py-1 rounded">
                    "{product.category}"
                  </span>
                </p>
                <p className="text-xs text-gray-600">
                  <span className="font-medium">Price:</span> ${product.price}
                </p>
              </div>
            ))}
            {indoorProducts.length === 0 && (
              <p className="text-gray-500 text-center py-8">
                No Indoor products found
              </p>
            )}
          </div>
        </div>
      </div>

      {/* Test Links */}
      <div className="mt-8 p-4 bg-gray-50 border rounded">
        <h3 className="font-bold mb-3">🔗 Test These Links:</h3>
        <div className="space-y-2">
          <a
            href="/shop"
            className="block text-blue-600 hover:underline"
          >
            /shop (All products)
          </a>
          <a
            href="/shop?category=Indoor"
            className="block text-blue-600 hover:underline"
          >
            /shop?category=Indoor
          </a>
          <a
            href="/shop?category=Outdoor"
            className="block text-blue-600 hover:underline"
          >
            /shop?category=Outdoor
          </a>
          <a
            href="/admin"
            className="block text-blue-600 hover:underline"
          >
            /admin (Add products)
          </a>
        </div>
      </div>

      {/* Category Analysis */}
      {allProducts.length > 0 && (
        <div className="mt-8 p-4 bg-yellow-50 border border-yellow-200 rounded">
          <h3 className="font-bold mb-3">⚠️ Category Analysis:</h3>
          <div className="space-y-1 text-sm">
            {allProducts.map((product, index) => {
              const isIndoor = product.category === 'Indoor';
              const categoryMatch = product.category?.toLowerCase() === 'indoor';
              
              return (
                <div key={index} className={`p-2 rounded ${!isIndoor ? 'bg-red-50' : 'bg-green-50'}`}>
                  <span className="font-medium">{product.name}:</span>
                  <br />
                  <span className="text-xs">
                    Category value: "{product.category}" | 
                    Exact match "Indoor": {isIndoor ? '✅' : '❌'} |
                    Lowercase match "indoor": {categoryMatch ? '✅' : '❌'}
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
