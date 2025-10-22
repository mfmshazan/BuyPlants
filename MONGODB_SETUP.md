# MongoDB Setup & Integration Guide

## ✅ What We've Done

Your plant e-commerce website is now fully connected to MongoDB! Here's what has been implemented:

### 1. Database Models
- **Product Model** (`/models/Product.ts`): Complete schema with careLevel, petFriendly, tags, ratings, etc.
- **Order Model** (`/models/Order.ts`): For storing customer orders

### 2. API Endpoints
- **GET /api/products** - Fetch all products with optional filters (category, size, difficulty, petFriendly)
- **POST /api/products** - Create new products
- **POST /api/products/seed** - Seed database with 12 sample plants
- **GET /api/products/seed** - Check product count
- **POST /api/orders** - Create new orders

### 3. Updated Pages
- **Shop Page** (`/app/shop/page.tsx`) - Now fetches products from MongoDB API with loading/error states
- **Seed Page** (`/app/seed/page.tsx`) - UI to seed database with one click
- **Test DB Page** (`/app/test-db/page.tsx`) - Test MongoDB connection

---

## 🚀 Quick Start Guide

### Step 1: Install MongoDB

#### Option A: MongoDB Community Server (Recommended)
1. Download from: https://www.mongodb.com/try/download/community
2. Choose **Windows** platform
3. Install with default settings
4. MongoDB will install to: `C:\Program Files\MongoDB\Server\7.0\bin`

#### Option B: MongoDB via Chocolatey (If you have Chocolatey)
```powershell
choco install mongodb
```

### Step 2: Start MongoDB Server

Open a **new PowerShell terminal** and run:

```powershell
# Navigate to MongoDB bin directory
cd "C:\Program Files\MongoDB\Server\7.0\bin"

# Start MongoDB
.\mongod.exe
```

**Keep this terminal running!** MongoDB needs to stay active.

You should see: `Waiting for connections on port 27017`

### Step 3: Seed the Database

1. Make sure your Next.js dev server is running:
   ```powershell
   npm run dev
   ```

2. Open your browser and go to:
   ```
   http://localhost:3000/seed
   ```

3. Click **"Seed Database with Products"**
   - This will add 12 sample plant products to MongoDB
   - You'll see a success message with the count

### Step 4: View Your Products

Go to the shop page:
```
http://localhost:3000/shop
```

You should now see products loaded from MongoDB! 🎉

---

## 📊 Sample Products Included

The seed data includes:
1. Monstera Deliciosa ($74)
2. Snake Plant ($34)
3. Fiddle Leaf Fig ($199)
4. Peace Lily ($169)
5. Golden Pothos ($39)
6. ZZ Plant ($139)
7. Rubber Plant ($89)
8. Calathea Pinstripe ($49)
9. Bamboo Palm ($199)
10. Money Tree ($169)
11. Spider Plant ($39)
12. Pothos Collection ($79)

Each product includes:
- Images
- Size (XS, SM, MD, LG, XL, XXL)
- Care level (Easy, Moderate, Advanced)
- Pet-friendly status
- Ratings and reviews
- Stock quantity

---

## 🔧 Testing the Connection

### Test MongoDB Connection
Visit: `http://localhost:3000/test-db`

Click **"Test Connection"** to verify MongoDB is connected.

### Check Product Count
Visit: `http://localhost:3000/seed`

Click **"Check Product Count"** to see how many products are in your database.

---

## 🎨 Features Now Working

### 1. **Dynamic Product Fetching**
- Shop page fetches real data from MongoDB
- Loading spinner while fetching
- Error handling if MongoDB is down

### 2. **Advanced Filtering**
Filters are applied server-side via API:
- Category (Indoor, Bundles)
- Size (XS, SM, MD, LG, XL, XXL)
- Care Level (Easy, Moderate, Advanced)
- Pet-Friendly (Yes/No)

### 3. **Shopping Cart**
- Add products to cart
- Persisted in localStorage
- Works with MongoDB products

### 4. **Checkout & Orders**
- Complete checkout flow
- Orders saved to MongoDB
- Delivery address collection

---

## 📁 Key Files

### API Routes
```
/app/api/products/route.ts       - Get/Create products
/app/api/products/seed/route.ts  - Seed database
/app/api/orders/route.ts         - Create orders
/app/api/test-db/route.ts        - Test connection
```

### Frontend Pages
```
/app/shop/page.tsx       - Product catalog (fetches from API)
/app/cart/page.tsx       - Shopping cart
/app/checkout/page.tsx   - Checkout form
/app/seed/page.tsx       - Seed database UI
/app/test-db/page.tsx    - Connection test UI
```

### Database
```
/lib/mongodb.ts     - MongoDB connection with caching
/models/Product.ts  - Product schema
/models/Order.ts    - Order schema
```

---

## 🐛 Troubleshooting

### Problem: "Failed to connect to server"

**Solutions:**
1. Make sure MongoDB is running:
   ```powershell
   cd "C:\Program Files\MongoDB\Server\7.0\bin"
   .\mongod.exe
   ```

2. Check if port 27017 is available:
   ```powershell
   netstat -ano | findstr :27017
   ```

3. Verify `.env.local` has:
   ```
   MONGODB_URI=mongodb://localhost:27017/buyplants
   ```

### Problem: "mongod is not recognized"

**Solution:** Add MongoDB to your PATH:
1. Search "Environment Variables" in Windows
2. Edit "Path" under System Variables
3. Add: `C:\Program Files\MongoDB\Server\7.0\bin`
4. Restart your terminal

### Problem: Products not showing on shop page

**Solutions:**
1. Seed the database first at `/seed`
2. Check browser console for errors (F12)
3. Verify MongoDB is running
4. Test connection at `/test-db`

---

## 🎯 Next Steps

### Add More Products
You can add products via the API:

```javascript
const response = await fetch('/api/products', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    name: 'Bird of Paradise',
    description: 'Tropical plant with stunning orange flowers',
    price: 89,
    size: 'LG',
    category: 'Indoor',
    careLevel: 'Moderate',
    petFriendly: false,
    inStock: true,
    stockQuantity: 10,
    rating: 4.7,
    reviews: 33
  })
});
```

### View MongoDB Data Directly
Install MongoDB Compass (GUI):
- Download: https://www.mongodb.com/try/download/compass
- Connect to: `mongodb://localhost:27017`
- Database: `buyplants`
- Collections: `products`, `orders`

### Production Deployment
For production, use MongoDB Atlas (free tier):
1. Sign up at https://www.mongodb.com/cloud/atlas
2. Create a free cluster
3. Get connection string
4. Update `MONGODB_URI` in production environment

---

## ✨ Summary

Your plant website now has:
- ✅ MongoDB integration with connection caching
- ✅ Product and Order models
- ✅ RESTful API endpoints
- ✅ Database seeding functionality
- ✅ Dynamic product fetching with filters
- ✅ Shopping cart and checkout
- ✅ Error handling and loading states

**To use it:**
1. Install MongoDB
2. Run `mongod` in a terminal
3. Visit `/seed` to add products
4. Browse products at `/shop`
5. Add to cart and checkout!

Enjoy your MongoDB-powered plant store! 🌱
