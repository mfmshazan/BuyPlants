# ORM-Structured Database Architecture

## 🎯 Overview

Your MongoDB database has been restructured following **Object-Relational Mapping (ORM) patterns** with:
- ✅ **Repository Pattern** - Centralized data access logic
- ✅ **Separation of Concerns** - Clean architecture layers
- ✅ **Type Safety** - Full TypeScript support
- ✅ **Reusable Code** - DRY principles throughout
- ✅ **Testable** - Easy to mock and unit test

---

## 📁 New Architecture Structure

```
lib/database/
├── BaseRepository.ts          # Generic CRUD operations for all entities
├── ProductRepository.ts       # Product-specific data access
├── CartRepository.ts          # Cart-specific data access
├── OrderRepository.ts         # Order-specific data access
└── index.ts                   # Unified Database Manager

models/
├── Product.ts                 # Product schema (extends Document)
├── Cart.ts                    # Cart schema (extends Document)
└── Order.ts                   # Order schema (extends Document)

app/api/
├── products/route.ts          # Uses db.products repository
├── cart/route.ts              # Uses db.carts repository
└── orders/route.ts            # Uses db.orders repository
```

---

## 🏗️ Architecture Layers

### 1. **Base Repository Layer**
```typescript
// lib/database/BaseRepository.ts
export abstract class BaseRepository<T extends Document> {
  findAll(filter?)          // Find all documents
  findById(id)              // Find by ID
  findOne(filter)           // Find single document
  create(data)              // Create new document
  createMany(data[])        // Bulk create
  updateById(id, update)    // Update by ID
  updateOne(filter, update) // Update single
  updateMany(filter, update)// Bulk update
  deleteById(id)            // Delete by ID
  deleteOne(filter)         // Delete single
  deleteMany(filter)        // Bulk delete
  count(filter)             // Count documents
  exists(filter)            // Check existence
  paginate(filter, page, limit) // Paginated results
}
```

### 2. **Specific Repository Layer**
```typescript
// lib/database/ProductRepository.ts
export class ProductRepository extends BaseRepository<IProduct> {
  // Product-specific methods
  findByCategory(category)
  findBySize(size)
  findByCareLevel(careLevel)
  findPetFriendly(petFriendly)
  findInStock()
  findWithFilters({...})
  search(searchTerm)
  updateStock(productId, quantity)
  decreaseStock(productId, quantity)
  increaseStock(productId, quantity)
  getTopRated(limit)
  getFeatured(limit)
  findByPriceRange(min, max, page, limit)
}
```

### 3. **Database Manager Layer**
```typescript
// lib/database/index.ts
export class DatabaseManager {
  public products = productRepository
  public carts = cartRepository
  public orders = orderRepository
  
  connect()                 // Initialize connection
  isConnected()             // Check connection status
  disconnect()              // Close connections
  seedDatabase()            // Seed sample data
  getStats()                // Get database statistics
}

// Singleton instance
export const db = DatabaseManager.getInstance();
```

### 4. **API Layer**
```typescript
// app/api/products/route.ts
import { db } from '@/lib/database';

export async function GET(request) {
  await db.connect();
  const products = await db.products.findAll();
  return NextResponse.json({ products });
}
```

---

## 🔧 Usage Examples

### Product Operations

```typescript
import { db } from '@/lib/database';

// Initialize connection
await db.connect();

// Find all products
const allProducts = await db.products.findAll();

// Find products by category
const indoorPlants = await db.products.findByCategory('Indoor');

// Advanced filtering
const filteredProducts = await db.products.findWithFilters({
  category: 'Indoor',
  petFriendly: true,
  careLevel: 'Easy',
  minPrice: 20,
  maxPrice: 100
});

// Search products
const searchResults = await db.products.search('monstera');

// Get featured products
const featured = await db.products.getFeatured(8);

// Get top-rated products
const topRated = await db.products.getTopRated(10);

// Update stock
await db.products.decreaseStock(productId, 2); // After purchase
await db.products.increaseStock(productId, 10); // After restocking

// Pagination
const { data, total, page, totalPages } = await db.products.paginate(
  { category: 'Indoor' },
  1, // page
  20  // limit
);
```

### Cart Operations

```typescript
import { db } from '@/lib/database';

await db.connect();

// Get or create cart
const cart = await db.carts.getOrCreateCart(sessionId);

// Add item to cart
await db.carts.addItem(sessionId, {
  productId: '123',
  name: 'Monstera',
  price: 74,
  image: 'url',
  size: 'LG',
  quantity: 1
});

// Update quantity
await db.carts.updateItemQuantity(sessionId, productId, size, 3);

// Remove item
await db.carts.removeItem(sessionId, productId, size);

// Clear cart
await db.carts.clearCart(sessionId);

// Get cart totals
const itemCount = await db.carts.getItemCount(sessionId);
const total = await db.carts.getCartTotal(sessionId);

// Merge guest cart after login
await db.carts.mergeGuestCartToUser(sessionId, userId);

// Get abandoned carts (older than 7 days)
const abandoned = await db.carts.getAbandonedCarts(7);

// Cleanup old empty carts
const cleaned = await db.carts.cleanupEmptyCarts(30);
```

### Order Operations

```typescript
import { db } from '@/lib/database';

await db.connect();

// Create order
const order = await db.orders.create({
  email: 'customer@example.com',
  items: [...],
  totalPrice: 187,
  shippingAddress: {...},
  status: 'pending',
  paymentStatus: 'pending'
});

// Find orders
const userOrders = await db.orders.findByUserId(userId);
const emailOrders = await db.orders.findByEmail('customer@example.com');
const pendingOrders = await db.orders.findPendingOrders();

// Update order status
await db.orders.updateStatus(orderId, 'processing');
await db.orders.updatePaymentStatus(orderId, 'paid');

// Add tracking info
await db.orders.addTrackingInfo(orderId, 'TRACK123', new Date());

// Mark as delivered
await db.orders.markAsDelivered(orderId);

// Cancel order
await db.orders.cancelOrder(orderId);

// Get statistics
const revenue = await db.orders.getTotalRevenue(startDate, endDate);
const stats = await db.orders.getOrderStats(startDate, endDate);
const topCustomers = await db.orders.getTopCustomers(10);
const bestSelling = await db.orders.getBestSellingProducts(10);

// Pagination
const { data, total, page, totalPages } = await db.orders.getRecentOrders(1, 20);
```

---

## 🧪 API Testing

### Products API

```http
# Get all products
GET http://localhost:3000/api/products

# Filter by category
GET http://localhost:3000/api/products?category=Indoor

# Multiple filters
GET http://localhost:3000/api/products?category=Indoor&petFriendly=true&difficulty=Easy

# Price range
GET http://localhost:3000/api/products?minPrice=20&maxPrice=100

# Search
GET http://localhost:3000/api/products?search=monstera

# Create product
POST http://localhost:3000/api/products
Content-Type: application/json

{
  "name": "New Plant",
  "description": "Description",
  "price": 50,
  "size": "MD",
  "image": "url",
  "category": "Indoor",
  "tags": ["new"],
  "inStock": true,
  "stockQuantity": 10,
  "careLevel": "Easy",
  "petFriendly": false
}
```

### Cart API

```http
# Get cart
GET http://localhost:3000/api/cart?sessionId=session_123

# Add to cart
POST http://localhost:3000/api/cart
Content-Type: application/json

{
  "sessionId": "session_123",
  "item": {
    "productId": "68f91b8ce4e10885c8e47566",
    "name": "Monstera",
    "price": 74,
    "image": "url",
    "size": "LG",
    "quantity": 1
  }
}

# Update quantity
PUT http://localhost:3000/api/cart
Content-Type: application/json

{
  "sessionId": "session_123",
  "productId": "68f91b8ce4e10885c8e47566",
  "size": "LG",
  "quantity": 3
}

# Remove item
DELETE http://localhost:3000/api/cart?sessionId=session_123&productId=68f91b8ce4e10885c8e47566&size=LG

# Clear cart
DELETE http://localhost:3000/api/cart?sessionId=session_123
```

### Orders API

```http
# Get orders by email
GET http://localhost:3000/api/orders?email=customer@example.com

# Get orders by status
GET http://localhost:3000/api/orders?status=pending

# Get recent orders (paginated)
GET http://localhost:3000/api/orders?page=1&limit=20

# Create order
POST http://localhost:3000/api/orders
Content-Type: application/json

{
  "email": "customer@example.com",
  "items": [
    {
      "productId": "68f91b8ce4e10885c8e47566",
      "name": "Monstera",
      "price": 74,
      "size": "LG",
      "quantity": 2
    }
  ],
  "totalPrice": 148,
  "shippingAddress": {
    "fullName": "John Doe",
    "address": "123 Main St",
    "city": "New York",
    "state": "NY",
    "zipCode": "10001",
    "phone": "555-0123"
  }
}

# Update order status
PUT http://localhost:3000/api/orders
Content-Type: application/json

{
  "orderId": "670abc123456789",
  "status": "shipped",
  "trackingNumber": "TRACK123"
}
```

---

## 📊 Database Manager Usage

```typescript
import { db } from '@/lib/database';

// Connect to database
await db.connect();

// Check connection status
const isConnected = db.isConnected();

// Get database statistics
const stats = await db.getStats();
// Returns: { products: 12, carts: 5, orders: 3, connected: true }

// Seed database with sample data
const result = await db.seedDatabase();
// Returns: { success: true, productsCount: 12 }

// Disconnect (when shutting down)
await db.disconnect();
```

---

## ✨ Benefits of This Architecture

### 1. **Separation of Concerns**
- Models define data structure
- Repositories handle data access
- Services handle business logic
- APIs handle HTTP requests

### 2. **Reusability**
- Base repository provides common CRUD for all entities
- Specific repositories extend with custom methods
- No code duplication

### 3. **Testability**
- Easy to mock repositories
- Unit test business logic separately
- Integration test database operations

### 4. **Maintainability**
- Changes in one layer don't affect others
- Easy to add new features
- Clear code organization

### 5. **Type Safety**
- Full TypeScript support
- Interfaces for all entities
- Compile-time error checking

---

## 🚀 Advanced Features

### Pagination
```typescript
const result = await db.products.paginate(
  { category: 'Indoor' },
  2, // page 2
  10  // 10 items per page
);
// Returns: { data: [...], total: 50, page: 2, totalPages: 5 }
```

### Complex Queries
```typescript
const products = await db.products.findWithFilters({
  category: 'Indoor',
  careLevel: 'Easy',
  petFriendly: true,
  minPrice: 20,
  maxPrice: 100,
  inStock: true
});
```

### Aggregations
```typescript
const revenue = await db.orders.getTotalRevenue(startDate, endDate);
const stats = await db.orders.getOrderStats();
const topCustomers = await db.orders.getTopCustomers(10);
const bestSellers = await db.orders.getBestSellingProducts(10);
```

---

## 📝 Summary

Your database is now structured as a proper ORM with:

✅ **Base Repository** - Generic CRUD operations  
✅ **Specific Repositories** - Custom methods per entity  
✅ **Database Manager** - Centralized access point  
✅ **Type Safety** - Full TypeScript support  
✅ **Clean APIs** - Using repositories instead of direct models  
✅ **Easy Testing** - Mockable repositories  
✅ **Maintainable** - Clear separation of concerns  

**Usage:**
```typescript
import { db } from '@/lib/database';

await db.connect();
const products = await db.products.findAll();
const cart = await db.carts.getOrCreateCart(sessionId);
const order = await db.orders.create(orderData);
```

Your code is now production-ready with enterprise-level architecture! 🎉
