import Link from 'next/link';

export default function OrderSuccessPage() {
  return (
    <div className="max-w-2xl mx-auto px-4 py-16 text-center">
      <div className="bg-white rounded-lg shadow-lg p-8">
        <div className="text-green-600 text-6xl mb-4">✓</div>
        <h1 className="text-3xl font-bold mb-4">Order Placed Successfully!</h1>
        <p className="text-gray-600 mb-2">
          Thank you for your purchase! We&apos;ve received your order and will send you a confirmation email shortly.
        </p>
        <p className="text-gray-600 mb-8">
          Your plants will be carefully packaged and delivered to your address.
        </p>

        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link
            href="/shop"
            className="bg-green-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-green-700 transition"
          >
            Continue Shopping
          </Link>
          <Link
            href="/"
            className="bg-gray-100 text-gray-700 px-8 py-3 rounded-lg font-semibold hover:bg-gray-200 transition"
          >
            Back to Home
          </Link>
        </div>
      </div>
    </div>
  );
}
