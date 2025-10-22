'use client';

import { useState } from 'react';

export default function SeedPage() {
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);

  const handleSeed = async () => {
    try {
      setLoading(true);
      setError(null);
      setResult(null);

      const response = await fetch('/api/products/seed', {
        method: 'POST'
      });
      const data = await response.json();

      if (data.success) {
        setResult(data);
      } else {
        setError(data.error || 'Failed to seed database');
      }
    } catch (err: any) {
      console.error('Error seeding database:', err);
      setError(err.message || 'Failed to connect to server');
    } finally {
      setLoading(false);
    }
  };

  const checkProducts = async () => {
    try {
      setLoading(true);
      setError(null);
      setResult(null);

      const response = await fetch('/api/products/seed');
      const data = await response.json();

      if (data.success) {
        setResult(data);
      } else {
        setError(data.error || 'Failed to check products');
      }
    } catch (err: any) {
      console.error('Error checking products:', err);
      setError(err.message || 'Failed to connect to server');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4">
      <div className="max-w-2xl mx-auto">
        <div className="bg-white rounded-lg shadow-lg p-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Database Seeder</h1>
          <p className="text-gray-600 mb-8">
            Seed the MongoDB database with sample plant products
          </p>

          <div className="space-y-4 mb-8">
            <button
              onClick={handleSeed}
              disabled={loading}
              className="w-full bg-green-600 text-white py-3 px-6 rounded-lg font-semibold hover:bg-green-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition"
            >
              {loading ? 'Processing...' : 'Seed Database with Products'}
            </button>

            <button
              onClick={checkProducts}
              disabled={loading}
              className="w-full bg-blue-600 text-white py-3 px-6 rounded-lg font-semibold hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition"
            >
              {loading ? 'Checking...' : 'Check Product Count'}
            </button>
          </div>

          {/* Success Result */}
          {result && (
            <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-4">
              <h3 className="text-green-800 font-semibold mb-2">✅ Success</h3>
              <p className="text-green-700">{result.message}</p>
              {result.count !== undefined && (
                <p className="text-green-600 mt-2">Products: {result.count}</p>
              )}
              {result.products && (
                <details className="mt-4">
                  <summary className="cursor-pointer text-green-700 font-medium">
                    View Products
                  </summary>
                  <pre className="mt-2 text-xs bg-white p-4 rounded border overflow-auto max-h-64">
                    {JSON.stringify(result.products, null, 2)}
                  </pre>
                </details>
              )}
            </div>
          )}

          {/* Error Result */}
          {error && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4">
              <h3 className="text-red-800 font-semibold mb-2">❌ Error</h3>
              <p className="text-red-700">{error}</p>
              <div className="mt-4 text-sm text-red-600">
                <p className="font-semibold">Troubleshooting:</p>
                <ul className="list-disc list-inside mt-2 space-y-1">
                  <li>Make sure MongoDB is running (run: <code className="bg-red-100 px-1 rounded">mongod</code>)</li>
                  <li>Check if .env.local has MONGODB_URI set</li>
                  <li>Verify connection string: mongodb://localhost:27017/buyplants</li>
                </ul>
              </div>
            </div>
          )}

          {/* Instructions */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mt-8">
            <h3 className="text-blue-800 font-semibold mb-2">📋 Instructions</h3>
            <ol className="list-decimal list-inside text-blue-700 space-y-2 text-sm">
              <li>Make sure MongoDB is installed and running</li>
              <li>Run <code className="bg-blue-100 px-1 rounded">mongod</code> in a terminal</li>
              <li>Click "Seed Database with Products" to add sample plants</li>
              <li>Visit the <a href="/shop" className="underline font-semibold">/shop</a> page to see products</li>
            </ol>
          </div>
        </div>
      </div>
    </div>
  );
}
