'use client';

import { useState } from 'react';

export default function DatabaseStructurePage() {
  const [stats, setStats] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [products, setProducts] = useState<any[]>([]);
  const [result, setResult] = useState<any>(null);

  const testDatabaseStructure = async () => {
    try {
      setLoading(true);
      
      // Test Database Manager
      const response = await fetch('/api/test-structure');
      const data = await response.json();
      
      setResult(data);
    } catch (error: any) {
      setResult({ error: error.message });
    } finally {
      setLoading(false);
    }
  };

  const getStats = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/db-stats');
      const data = await response.json();
      setStats(data);
    } catch (error: any) {
      setStats({ error: error.message });
    } finally {
      setLoading(false);
    }
  };

  const testRepositories = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/test-repositories');
      const data = await response.json();
      setProducts(data.products || []);
      setResult(data);
    } catch (error: any) {
      setResult({ error: error.message });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4">
      <div className="max-w-6xl mx-auto">
        <div className="bg-white rounded-lg shadow-lg p-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            🏗️ ORM Database Structure
          </h1>
          <p className="text-gray-600 mb-8">
            Test your structured database architecture
          </p>

          {/* Architecture Diagram */}
          <div className="bg-gradient-to-r from-blue-50 to-purple-50 border-2 border-blue-200 rounded-lg p-6 mb-8">
            <h2 className="text-xl font-bold text-gray-900 mb-4">Database Layers</h2>
            <div className="space-y-3 font-mono text-sm">
              <div className="bg-white p-3 rounded border-l-4 border-purple-500">
                <strong>Layer 5 - API Routes:</strong> /app/api/products/route.ts
              </div>
              <div className="flex justify-center">↓</div>
              <div className="bg-white p-3 rounded border-l-4 border-blue-500">
                <strong>Layer 4 - Database Manager:</strong> db.products, db.carts, db.orders
              </div>
              <div className="flex justify-center">↓</div>
              <div className="bg-white p-3 rounded border-l-4 border-green-500">
                <strong>Layer 3 - Repositories:</strong> ProductRepository, CartRepository
              </div>
              <div className="flex justify-center">↓</div>
              <div className="bg-white p-3 rounded border-l-4 border-yellow-500">
                <strong>Layer 2 - Base Repository:</strong> CRUD Operations
              </div>
              <div className="flex justify-center">↓</div>
              <div className="bg-white p-3 rounded border-l-4 border-red-500">
                <strong>Layer 1 - Models:</strong> Product, Cart, Order Schemas
              </div>
              <div className="flex justify-center">↓</div>
              <div className="bg-gray-800 text-white p-3 rounded">
                <strong>MongoDB:</strong> buyplants → products, carts, orders
              </div>
            </div>
          </div>

          {/* Test Buttons */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
            <button
              onClick={getStats}
              disabled={loading}
              className="bg-blue-600 text-white py-4 px-6 rounded-lg font-semibold hover:bg-blue-700 disabled:bg-gray-400 transition"
            >
              📊 Get Database Stats
            </button>

            <button
              onClick={testRepositories}
              disabled={loading}
              className="bg-green-600 text-white py-4 px-6 rounded-lg font-semibold hover:bg-green-700 disabled:bg-gray-400 transition"
            >
              🔧 Test Repositories
            </button>

            <button
              onClick={testDatabaseStructure}
              disabled={loading}
              className="bg-purple-600 text-white py-4 px-6 rounded-lg font-semibold hover:bg-purple-700 disabled:bg-gray-400 transition"
            >
              🏗️ Test Full Structure
            </button>
          </div>

          {/* Loading */}
          {loading && (
            <div className="text-center py-8">
              <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
              <p className="text-gray-600 mt-4">Testing database structure...</p>
            </div>
          )}

          {/* Stats Display */}
          {stats && !loading && (
            <div className="bg-green-50 border border-green-200 rounded-lg p-6 mb-4">
              <h3 className="text-green-900 font-bold mb-3">📊 Database Statistics</h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="bg-white p-4 rounded shadow">
                  <div className="text-2xl font-bold text-blue-600">{stats.products || 0}</div>
                  <div className="text-sm text-gray-600">Products</div>
                </div>
                <div className="bg-white p-4 rounded shadow">
                  <div className="text-2xl font-bold text-green-600">{stats.carts || 0}</div>
                  <div className="text-sm text-gray-600">Carts</div>
                </div>
                <div className="bg-white p-4 rounded shadow">
                  <div className="text-2xl font-bold text-purple-600">{stats.orders || 0}</div>
                  <div className="text-sm text-gray-600">Orders</div>
                </div>
                <div className="bg-white p-4 rounded shadow">
                  <div className={`text-2xl font-bold ${stats.connected ? 'text-green-600' : 'text-red-600'}`}>
                    {stats.connected ? '✓' : '✗'}
                  </div>
                  <div className="text-sm text-gray-600">Connected</div>
                </div>
              </div>
            </div>
          )}

          {/* Results Display */}
          {result && !loading && (
            <div className="bg-gray-50 border border-gray-200 rounded-lg p-6">
              <h3 className="text-gray-900 font-bold mb-3">Test Results</h3>
              <pre className="bg-white p-4 rounded border overflow-auto max-h-96 text-xs">
                {JSON.stringify(result, null, 2)}
              </pre>
            </div>
          )}

          {/* Products Display */}
          {products.length > 0 && !loading && (
            <div className="mt-6">
              <h3 className="text-gray-900 font-bold mb-3">
                Products from Repository ({products.length})
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {products.slice(0, 4).map((product: any) => (
                  <div key={product._id} className="bg-white border rounded-lg p-4">
                    <h4 className="font-semibold text-gray-900">{product.name}</h4>
                    <p className="text-sm text-gray-600">{product.category} - {product.size}</p>
                    <p className="text-lg font-bold text-green-600">${product.price}</p>
                    <p className="text-xs text-gray-500">Care: {product.careLevel}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Documentation */}
          <div className="mt-8 bg-blue-50 border border-blue-200 rounded-lg p-6">
            <h3 className="text-blue-900 font-bold mb-3">📚 How It Works</h3>
            <div className="space-y-2 text-sm text-blue-800">
              <p><strong>✅ Structured Layers:</strong> Clear separation between API → Manager → Repository → Model → Database</p>
              <p><strong>✅ Reusable Code:</strong> BaseRepository provides common operations for all entities</p>
              <p><strong>✅ Type Safety:</strong> Full TypeScript support with interfaces</p>
              <p><strong>✅ Easy Testing:</strong> Mock repositories without touching the database</p>
              <p><strong>✅ Maintainable:</strong> Changes in one layer don't affect others</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
