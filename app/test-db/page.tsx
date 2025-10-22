'use client';

import { useState } from 'react';

export default function DatabaseTestPage() {
  const [result, setResult] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  const testConnection = async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/test-db');
      const data = await response.json();
      setResult(data);
    } catch (error) {
      setResult({ success: false, error: 'Failed to fetch' });
    }
    setLoading(false);
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-16">
      <div className="bg-white rounded-lg shadow-lg p-8">
        <h1 className="text-3xl font-bold mb-6">MongoDB Connection Test</h1>
        
        <button
          onClick={testConnection}
          disabled={loading}
          className="bg-green-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-green-700 disabled:bg-gray-400 mb-6"
        >
          {loading ? 'Testing...' : 'Test Database Connection'}
        </button>

        {result && (
          <div className="mt-6">
            <div className={`p-6 rounded-lg ${result.success ? 'bg-green-50 border border-green-200' : 'bg-red-50 border border-red-200'}`}>
              <h2 className="text-xl font-bold mb-4 flex items-center">
                {result.success ? (
                  <>
                    <span className="text-2xl mr-2">✅</span>
                    Connection Successful
                  </>
                ) : (
                  <>
                    <span className="text-2xl mr-2">❌</span>
                    Connection Failed
                  </>
                )}
              </h2>
              
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="font-semibold">Status:</span>
                  <span className={result.connected ? 'text-green-600' : 'text-red-600'}>
                    {result.connected ? 'Connected' : 'Disconnected'}
                  </span>
                </div>
                
                {result.statusMessage && (
                  <div className="flex justify-between">
                    <span className="font-semibold">State:</span>
                    <span>{result.statusMessage}</span>
                  </div>
                )}
                
                {result.host && (
                  <div className="flex justify-between">
                    <span className="font-semibold">Host:</span>
                    <span className="text-sm">{result.host}</span>
                  </div>
                )}
                
                {result.database && (
                  <div className="flex justify-between">
                    <span className="font-semibold">Database:</span>
                    <span className="font-mono">{result.database}</span>
                  </div>
                )}
                
                {result.error && (
                  <div className="mt-4 p-4 bg-red-100 rounded text-red-800">
                    <span className="font-semibold">Error:</span>
                    <p className="mt-1">{result.error}</p>
                  </div>
                )}
              </div>
            </div>

            <div className="mt-6 p-4 bg-gray-100 rounded">
              <h3 className="font-semibold mb-2">Raw Response:</h3>
              <pre className="text-xs overflow-auto">{JSON.stringify(result, null, 2)}</pre>
            </div>
          </div>
        )}

        <div className="mt-8 p-4 bg-blue-50 rounded-lg border border-blue-200">
          <h3 className="font-semibold mb-2 text-blue-900">💡 Connection Details</h3>
          <p className="text-sm text-gray-700 mb-2">
            Your MongoDB connection string is configured in <code className="bg-blue-100 px-2 py-1 rounded">.env.local</code>
          </p>
          <p className="text-sm text-gray-700">
            Current: <code className="bg-blue-100 px-2 py-1 rounded text-xs">
              {process.env.NEXT_PUBLIC_API_URL || 'Not set'}
            </code>
          </p>
        </div>
      </div>
    </div>
  );
}
