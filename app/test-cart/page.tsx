'use client';

import { useState, useEffect } from 'react';
import { useCart } from '@/context/CartContext';

export default function CartTestPage() {
  const { cart, loading, syncCart } = useCart();
  const [sessionId, setSessionId] = useState('');
  const [testResult, setTestResult] = useState<any>(null);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const id = localStorage.getItem('cartSessionId') || '';
      setSessionId(id);
    }
  }, []);

  const testGetCart = async () => {
    try {
      const response = await fetch(`/api/cart?sessionId=${sessionId}`);
      const data = await response.json();
      setTestResult({ operation: 'GET Cart', ...data });
    } catch (error: any) {
      setTestResult({ operation: 'GET Cart', error: error.message });
    }
  };

  const testAddItem = async () => {
    try {
      const response = await fetch('/api/cart', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          sessionId,
          item: {
            productId: '68f91b8ce4e10885c8e47566',
            name: 'Test Monstera',
            price: 74,
            image: 'https://via.placeholder.com/150',
            size: 'LG',
            quantity: 1
          }
        })
      });
      const data = await response.json();
      setTestResult({ operation: 'ADD Item', ...data });
      await syncCart();
    } catch (error: any) {
      setTestResult({ operation: 'ADD Item', error: error.message });
    }
  };

  const testUpdateQuantity = async () => {
    if (cart.length === 0) {
      setTestResult({ operation: 'UPDATE Quantity', error: 'Cart is empty. Add an item first.' });
      return;
    }

    try {
      const firstItem = cart[0];
      const response = await fetch('/api/cart', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          sessionId,
          productId: firstItem.id,
          size: firstItem.size,
          quantity: firstItem.quantity + 1
        })
      });
      const data = await response.json();
      setTestResult({ operation: 'UPDATE Quantity', ...data });
      await syncCart();
    } catch (error: any) {
      setTestResult({ operation: 'UPDATE Quantity', error: error.message });
    }
  };

  const testRemoveItem = async () => {
    if (cart.length === 0) {
      setTestResult({ operation: 'REMOVE Item', error: 'Cart is empty. Add an item first.' });
      return;
    }

    try {
      const firstItem = cart[0];
      const response = await fetch(
        `/api/cart?sessionId=${sessionId}&productId=${firstItem.id}&size=${firstItem.size}`,
        { method: 'DELETE' }
      );
      const data = await response.json();
      setTestResult({ operation: 'REMOVE Item', ...data });
      await syncCart();
    } catch (error: any) {
      setTestResult({ operation: 'REMOVE Item', error: error.message });
    }
  };

  const testClearCart = async () => {
    try {
      const response = await fetch(`/api/cart?sessionId=${sessionId}`, {
        method: 'DELETE'
      });
      const data = await response.json();
      setTestResult({ operation: 'CLEAR Cart', ...data });
      await syncCart();
    } catch (error: any) {
      setTestResult({ operation: 'CLEAR Cart', error: error.message });
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white rounded-lg shadow-lg p-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Cart API Test</h1>
          <p className="text-gray-600 mb-8">Test MongoDB cart integration</p>

          {/* Session Info */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
            <h3 className="font-semibold text-blue-900 mb-2">Session Info</h3>
            <p className="text-sm text-blue-700">
              <strong>Session ID:</strong> {sessionId || 'Not initialized'}
            </p>
            <p className="text-sm text-blue-700 mt-1">
              <strong>Cart Items:</strong> {cart.length}
            </p>
            <p className="text-sm text-blue-700 mt-1">
              <strong>Total:</strong> ${cart.reduce((sum, item) => sum + item.price * item.quantity, 0).toFixed(2)}
            </p>
          </div>

          {/* Current Cart */}
          <div className="mb-6">
            <h3 className="font-semibold text-gray-900 mb-3">Current Cart Items</h3>
            {loading ? (
              <p className="text-gray-500">Loading cart...</p>
            ) : cart.length === 0 ? (
              <p className="text-gray-500">Cart is empty</p>
            ) : (
              <div className="bg-gray-50 rounded-lg p-4 space-y-2">
                {cart.map((item, index) => (
                  <div key={index} className="flex justify-between items-center text-sm">
                    <span className="font-medium">{item.name}</span>
                    <span className="text-gray-600">
                      {item.size} × {item.quantity} = ${(item.price * item.quantity).toFixed(2)}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Test Buttons */}
          <div className="grid grid-cols-2 gap-4 mb-6">
            <button
              onClick={testGetCart}
              className="bg-blue-600 text-white py-3 px-6 rounded-lg font-semibold hover:bg-blue-700 transition"
            >
              GET Cart
            </button>

            <button
              onClick={testAddItem}
              className="bg-green-600 text-white py-3 px-6 rounded-lg font-semibold hover:bg-green-700 transition"
            >
              ADD Test Item
            </button>

            <button
              onClick={testUpdateQuantity}
              disabled={cart.length === 0}
              className="bg-yellow-600 text-white py-3 px-6 rounded-lg font-semibold hover:bg-yellow-700 transition disabled:bg-gray-400 disabled:cursor-not-allowed"
            >
              UPDATE Quantity
            </button>

            <button
              onClick={testRemoveItem}
              disabled={cart.length === 0}
              className="bg-orange-600 text-white py-3 px-6 rounded-lg font-semibold hover:bg-orange-700 transition disabled:bg-gray-400 disabled:cursor-not-allowed"
            >
              REMOVE First Item
            </button>

            <button
              onClick={testClearCart}
              className="col-span-2 bg-red-600 text-white py-3 px-6 rounded-lg font-semibold hover:bg-red-700 transition"
            >
              CLEAR Cart
            </button>

            <button
              onClick={syncCart}
              className="col-span-2 bg-purple-600 text-white py-3 px-6 rounded-lg font-semibold hover:bg-purple-700 transition"
            >
              SYNC Cart from MongoDB
            </button>
          </div>

          {/* Test Results */}
          {testResult && (
            <div className={`rounded-lg p-4 ${testResult.success ? 'bg-green-50 border border-green-200' : 'bg-red-50 border border-red-200'}`}>
              <h3 className={`font-semibold mb-2 ${testResult.success ? 'text-green-900' : 'text-red-900'}`}>
                {testResult.operation} - {testResult.success ? '✅ Success' : '❌ Error'}
              </h3>
              <pre className="text-xs bg-white p-4 rounded border overflow-auto max-h-96">
                {JSON.stringify(testResult, null, 2)}
              </pre>
            </div>
          )}

          {/* Instructions */}
          <div className="bg-gray-50 border border-gray-200 rounded-lg p-4 mt-6">
            <h3 className="font-semibold text-gray-900 mb-2">📋 Instructions</h3>
            <ol className="list-decimal list-inside text-gray-700 space-y-1 text-sm">
              <li>Make sure MongoDB is running</li>
              <li>Click "GET Cart" to fetch your cart from MongoDB</li>
              <li>Click "ADD Test Item" to add a test product</li>
              <li>Click "UPDATE Quantity" to increase quantity</li>
              <li>Click "REMOVE First Item" to remove an item</li>
              <li>Click "CLEAR Cart" to empty the cart</li>
              <li>Visit <a href="/cart" className="text-blue-600 underline">/cart</a> to see the actual cart page</li>
            </ol>
          </div>
        </div>
      </div>
    </div>
  );
}
