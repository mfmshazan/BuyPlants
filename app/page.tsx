import Link from 'next/link';
import Image from 'next/image';
import ProductCard from '@/components/ProductCard';

export default function HomePage() {
  // Sample featured products
  const featuredProducts = [
    {
      _id: '1',
      name: 'Monstera Deliciosa',
      price: 74,
      size: 'LG',
      image: 'https://images.unsplash.com/photo-1614594975525-e45190c55d0b?w=500',
      category: 'Indoor',
      rating: 4.4,
      reviews: 25,
      inStock: true
    },
    {
      _id: '2',
      name: 'Snake Plant',
      price: 49,
      size: 'MD',
      image: 'https://cdn.pixabay.com/photo/2020/06/30/19/24/sansevieria-5357639_1280.jpg',
      category: 'Indoor',
      rating: 4.8,
      reviews: 52,
      inStock: true
    },
    {
      _id: '3',
      name: 'Fiddle Leaf Fig',
      price: 169,
      size: 'XL',
      image: 'https://images.unsplash.com/photo-1614594895304-fe7116ac3b58?w=500',
      category: 'Indoor',
      rating: 4.6,
      reviews: 35,
      inStock: true
    },
    {
      _id: '4',
      name: 'Peace Lily',
      price: 69,
      size: 'MD',
      image: 'https://images.unsplash.com/photo-1593691509543-c55fb32d8de5?w=500',
      category: 'Indoor',
      rating: 4.7,
      reviews: 41,
      inStock: true
    }
  ];

  return (
    <div className="bg-white">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-r from-green-50 to-green-100 py-20 px-4 md:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center">
            <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6">
              The Plant Sale is Here
            </h1>
            <p className="text-xl md:text-2xl text-gray-700 mb-8">
              Beautiful foliage. Amazing deals. Limited time only.
            </p>
            <p className="text-3xl font-bold text-green-600 mb-8">
              Save up to 25%
            </p>
            <Link 
              href="/shop" 
              className="inline-block bg-green-600 text-white px-8 py-4 rounded-lg text-lg font-semibold hover:bg-green-700 transition"
            >
              SHOP THE SALE
            </Link>
          </div>
        </div>
      </section>

      {/* Featured Products */}
      <section className="py-16 px-4 md:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-3xl font-bold text-gray-900">Best Sellers</h2>
            <Link href="/shop" className="text-green-600 hover:text-green-700 font-semibold">
              SHOP ALL →
            </Link>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {featuredProducts.map((product) => (
              <ProductCard key={product._id} product={product} />
            ))}
          </div>
        </div>
      </section>

      {/* Categories Section */}
      <section className="py-16 px-4 md:px-8 bg-gray-50">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">
            More Ways to Find Your Perfect Plant
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { name: 'Pet-Friendly', href: '/shop?category=pet-friendly' },
              { name: 'Low-Maintenance', href: '/shop?category=low-maintenance' },
              { name: 'Cacti & Succulents', href: '/shop?category=cacti' },
              { name: 'Gift Shop', href: '/shop?category=gifts' }
            ].map((category) => (
              <Link
                key={category.name}
                href={category.href}
                className="bg-white rounded-lg p-6 text-center hover:shadow-lg transition"
              >
                <h3 className="text-xl font-semibold text-gray-900">{category.name}</h3>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Trust Badges */}
      <section className="py-16 px-4 md:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
            <div>
              <div className="text-4xl mb-4">🚚</div>
              <h3 className="text-xl font-semibold mb-2">Fast Delivery</h3>
              <p className="text-gray-600">Plants delivered fresh to your door</p>
            </div>
            <div>
              <div className="text-4xl mb-4">🌱</div>
              <h3 className="text-xl font-semibold mb-2">Quality Guaranteed</h3>
              <p className="text-gray-600">Healthy plants or your money back</p>
            </div>
            <div>
              <div className="text-4xl mb-4">💚</div>
              <h3 className="text-xl font-semibold mb-2">Plant Care Support</h3>
              <p className="text-gray-600">Expert advice when you need it</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
