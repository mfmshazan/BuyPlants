# BuyPlants - Plant E-Commerce Website

A modern e-commerce website for selling plants, built with Next.js 14+, TypeScript, MongoDB, and Tailwind CSS. Inspired by Bloomscape.

## Features

✅ **Product Catalog**
- Browse beautiful plants with images and details
- Filter by categories (Best Sellers, New Arrivals, Low Maintenance, Pet Friendly, etc.)
- Product ratings and reviews display

✅ **Shopping Cart**
- Add/remove items from cart
- Update quantities
- Persistent cart (stored in localStorage)
- Real-time cart updates

✅ **Checkout & Delivery**
- Complete delivery address form
- Order summary
- Order placement with MongoDB storage
- Order success confirmation

✅ **Responsive Design**
- Mobile-first approach
- Beautiful UI with Tailwind CSS
- Smooth transitions and hover effects

## Tech Stack

- **Framework:** Next.js 14+ (App Router)
- **Language:** TypeScript
- **Styling:** Tailwind CSS
- **Database:** MongoDB with Mongoose
- **State Management:** React Context API
- **Authentication:** bcryptjs, jsonwebtoken (ready for implementation)

## Getting Started

### Prerequisites

- Node.js 18+ installed
- MongoDB installed locally or MongoDB Atlas account

### Installation

1. **Clone the repository**
   ```bash
   git clone <your-repo-url>
   cd BuyPlants
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   
   Copy `.env.example` to `.env.local`:
   ```bash
   copy .env.example .env.local
   ```

   Update the MongoDB connection string in `.env.local`:
   ```env
   MONGODB_URI=mongodb://localhost:27017/buyplants
   # Or use MongoDB Atlas:
   # MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/buyplants
   ```

4. **Run MongoDB locally** (if not using Atlas)
   ```bash
   mongod
   ```

5. **Run the development server**
   ```bash
   npm run dev
   ```

6. **Open your browser**
   
   Navigate to [http://localhost:3000](http://localhost:3000)

## Project Structure

```
BuyPlants/
├── app/                      # Next.js App Router
│   ├── api/                 # API routes
│   │   ├── orders/         # Order endpoints
│   │   └── products/       # Product endpoints
│   ├── cart/               # Shopping cart page
│   ├── checkout/           # Checkout page
│   ├── shop/               # Shop/catalog page
│   ├── order-success/      # Order confirmation page
│   ├── layout.tsx          # Root layout
│   ├── page.tsx            # Homepage
│   └── globals.css         # Global styles
├── components/              # React components
│   ├── Header.tsx          # Site header with cart
│   ├── Footer.tsx          # Site footer
│   └── ProductCard.tsx     # Product display card
├── context/                 # React contexts
│   └── CartContext.tsx     # Shopping cart state
├── lib/                     # Utilities
│   └── mongodb.ts          # MongoDB connection
├── models/                  # Mongoose models
│   ├── Product.ts          # Product schema
│   └── Order.ts            # Order schema
└── public/                  # Static files
```

## API Routes

### Products
- `GET /api/products` - Fetch all products
- `POST /api/products` - Create a new product

### Orders
- `GET /api/orders` - Fetch all orders
- `POST /api/orders` - Create a new order

## Adding Sample Products

You can add products through the API or directly in MongoDB. Example product:

```javascript
{
  name: "Monstera Deliciosa",
  description: "A beautiful tropical plant with large, glossy leaves.",
  price: 74,
  size: "LG",
  image: "https://example.com/monstera.jpg",
  category: "Indoor",
  tags: ["tropical", "large"],
  inStock: true,
  stockQuantity: 15,
  rating: 4.4,
  reviews: 25,
  careLevel: "Moderate",
  lightRequirement: "Bright",
  petFriendly: false
}
```

## Customization

### Colors
Update colors in `tailwind.config.ts` to match your brand.

### Logo
Replace "BuyPlants" text in `components/Header.tsx` with your logo component.

### Images
- Use your own plant images
- Update placeholder images in components
- Consider using a CDN for production

## Deployment

### Vercel (Recommended)

1. Push your code to GitHub
2. Import project in [Vercel](https://vercel.com)
3. Add environment variables
4. Deploy!

### Other Platforms

The app can be deployed to any platform that supports Next.js:
- Netlify
- Railway
- DigitalOcean
- AWS

## Future Enhancements

- [ ] User authentication and accounts
- [ ] Admin dashboard for managing products
- [ ] Product search functionality
- [ ] Advanced filtering (price, size, care level)
- [ ] Payment integration (Stripe/PayPal)
- [ ] Order tracking
- [ ] Reviews and ratings system
- [ ] Wishlist functionality
- [ ] Email notifications
- [ ] Product recommendations

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

This project is licensed under the MIT License.

## Support

For support, email your-email@example.com or open an issue in the repository.

---

Built with ❤️ using Next.js and MongoDB
