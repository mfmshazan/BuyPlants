'use client';

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useCart } from '@/context/CartContext';
import DeliveryDetailsForm, { DeliveryDetails } from '@/components/DeliveryDetailsForm';
import AuthModal from '@/components/AuthModal';

export default function CartPage() {
  const { cart, removeFromCart, updateQuantity, getTotalPrice, loading, user, login, isAuthenticated } = useCart();
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [deliveryDetails, setDeliveryDetails] = useState<DeliveryDetails | null>(null);
  const router = useRouter();

  const handleDeliverySubmit = (details: DeliveryDetails) => {
    if (!isAuthenticated) {
      setShowAuthModal(true);
      setDeliveryDetails(details);
      return;
    }

    // Store delivery details and proceed to checkout
    localStorage.setItem('deliveryDetails', JSON.stringify(details));
    router.push('/checkout');
  };

  const handleLogin = (email: string, firstName?: string, lastName?: string) => {
    login(email, firstName, lastName);
    setShowAuthModal(false);
    
    // If we have pending delivery details, proceed to checkout
    if (deliveryDetails) {
      localStorage.setItem('deliveryDetails', JSON.stringify(deliveryDetails));
      router.push('/checkout');
    }
  };

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-16 text-center">
        <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-green-600"></div>
        <p className="text-gray-600 mt-4">Loading your cart...</p>
      </div>
    );
  }

  if (cart.length === 0) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-16 text-center">
        <h1 className="text-3xl font-bold mb-4">Your cart is empty</h1>
        <p className="text-gray-600 mb-8">Add some beautiful plants to get started!</p>
        <Link
          href="/shop"
          className="inline-block bg-green-600 text-white px-8 py-3 rounded-lg hover:bg-green-700 transition"
        >
          Shop Plants
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Shopping Cart</h1>

      {/* User Info Banner */}
      {isAuthenticated && user && (
        <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-6">
          <p className="text-green-800">
            <strong>Welcome back{user.firstName ? `, ${user.firstName}` : ''}!</strong> 
            <span className="ml-2 text-sm">({user.email})</span>
          </p>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Left Side: Cart Items */}
        <div>
          <h2 className="text-2xl font-bold mb-4">Your Items</h2>
          <div className="bg-white rounded-lg shadow">
            {cart.map((item: any) => (
              <div key={`${item.id}-${item.size}`} className="flex items-center gap-4 p-6 border-b last:border-b-0">
                <div className="relative w-20 h-20 flex-shrink-0">
                  <Image
                    src={item.image}
                    alt={item.name}
                    fill
                    sizes="80px"
                    className="object-cover rounded"
                  />
                </div>

                <div className="flex-1">
                  <h3 className="font-semibold">{item.name}</h3>
                  <p className="text-gray-600 text-sm">Size: {item.size}</p>
                  <p className="text-green-600 font-bold mt-1">${item.price}</p>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => updateQuantity(item.id, item.size, item.quantity - 1)}
                    className="w-8 h-8 rounded-full border border-gray-300 hover:bg-gray-100"
                  >
                    −
                  </button>
                  <span className="w-8 text-center">{item.quantity}</span>
                  <button
                    onClick={() => updateQuantity(item.id, item.size, item.quantity + 1)}
                    className="w-8 h-8 rounded-full border border-gray-300 hover:bg-gray-100"
                  >
                    +
                  </button>
                </div>

                <div className="text-right">
                  <p className="font-bold">${(item.price * item.quantity).toFixed(2)}</p>
                  <button
                    onClick={() => removeFromCart(item.id, item.size)}
                    className="text-red-600 hover:text-red-700 text-sm mt-2"
                  >
                    Remove
                  </button>
                </div>
              </div>
            ))}

            {/* Order Summary in Cart Items */}
            <div className="p-6 bg-gray-50">
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-gray-600">Subtotal</span>
                  <span className="font-semibold">${getTotalPrice().toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Shipping</span>
                  <span className="font-semibold text-green-600">Calculated at checkout</span>
                </div>
                <div className="border-t pt-2 flex justify-between text-lg font-bold">
                  <span>Total</span>
                  <span className="text-green-600">${getTotalPrice().toFixed(2)}</span>
                </div>
              </div>
            </div>
          </div>

          <Link
            href="/shop"
            className="block w-full text-center py-3 text-green-600 hover:text-green-700 mt-4 font-semibold"
          >
            ← Continue Shopping
          </Link>
        </div>

        {/* Right Side: Delivery Details Form */}
        <div>
          <div className="bg-white rounded-lg shadow p-6 sticky top-24">
            {!isAuthenticated && (
              <div className="mb-6 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                <p className="text-yellow-800 text-sm">
                  Please{' '}
                  <button
                    onClick={() => setShowAuthModal(true)}
                    className="font-semibold underline hover:text-yellow-900"
                  >
                    login or sign up
                  </button>
                  {' '}to complete your order, or fill out the form below and you'll be prompted to authenticate.
                </p>
              </div>
            )}

            <DeliveryDetailsForm
              onSubmit={handleDeliverySubmit}
              initialData={
                user
                  ? {
                      firstName: user.firstName,
                      lastName: user.lastName,
                    }
                  : undefined
              }
            />
          </div>
        </div>
      </div>

      {/* Auth Modal */}
      <AuthModal
        isOpen={showAuthModal}
        onClose={() => setShowAuthModal(false)}
        onLogin={handleLogin}
      />
    </div>
  );
}
