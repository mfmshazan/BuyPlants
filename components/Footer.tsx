import Link from 'next/link';

export default function Footer() {
  return (
    <footer className="bg-gray-900 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Company Info */}
          <div>
            <h3 className="text-xl font-bold mb-4">BuyPlants</h3>
            <p className="text-gray-400">
              Your trusted source for beautiful, healthy plants delivered to your door.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-semibold mb-4">Shop</h4>
            <ul className="space-y-2">
              <li>
                <Link href="/shop" className="text-gray-400 hover:text-white">
                  All Plants
                </Link>
              </li>
              <li>
                <Link href="/shop?category=best-sellers" className="text-gray-400 hover:text-white">
                  Best Sellers
                </Link>
              </li>
              <li>
                <Link href="/shop?category=new-arrivals" className="text-gray-400 hover:text-white">
                  New Arrivals
                </Link>
              </li>
            </ul>
          </div>

          {/* Customer Service */}
          <div>
            <h4 className="font-semibold mb-4">Customer Service</h4>
            <ul className="space-y-2">
              <li>
                <Link href="/contact" className="text-gray-400 hover:text-white">
                  Contact Us
                </Link>
              </li>
              <li>
                <Link href="/shipping" className="text-gray-400 hover:text-white">
                  Shipping Info
                </Link>
              </li>
              <li>
                <Link href="/returns" className="text-gray-400 hover:text-white">
                  Returns
                </Link>
              </li>
            </ul>
          </div>

          {/* About */}
          <div>
            <h4 className="font-semibold mb-4">About</h4>
            <ul className="space-y-2">
              <li>
                <Link href="/about" className="text-gray-400 hover:text-white">
                  Our Story
                </Link>
              </li>
              <li>
                <Link href="/care-guide" className="text-gray-400 hover:text-white">
                  Plant Care Guide
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
          <p>&copy; {new Date().getFullYear()} BuyPlants. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}
