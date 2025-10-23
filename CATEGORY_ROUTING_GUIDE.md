# Category Routing System - Complete Guide

## Overview
This guide explains how the category filtering and routing system works across your plant e-commerce website.

## 🎯 How It Works

### 1. Admin Dashboard → Product Categories
When you add a product through the admin dashboard (`/admin`), you select a category from these options:

- **Indoor** → Indoor Plants
- **Outdoor** → Outdoor Plants
- **Cacti** → Cacti & Succulents
- **Pet-Friendly** → Pet-Friendly Plants
- **Low-Maintenance** → Low-Maintenance Plants
- **Bundles** → Plant Bundles
- **Pots** → Pots & Planters
- **Care-Kits** → Plant Care Kits
- **Tools** → Tools & Accessories

**Important:** These category values are case-sensitive and must match exactly!

### 2. Shop Page → Category Filtering
The shop page (`/shop`) supports URL query parameters for filtering:

#### Filter by Category
```
/shop?category=Indoor
/shop?category=Outdoor
/shop?category=Cacti
/shop?category=Pet-Friendly
/shop?category=Low-Maintenance
/shop?category=Bundles
/shop?category=Pots
/shop?category=Care-Kits
/shop?category=Tools
```

#### Filter by Size
```
/shop?size=XS
/shop?size=SM
/shop?size=MD
/shop?size=LG
/shop?size=XL
/shop?size=XXL
```

#### Filter by Difficulty (Care Level)
```
/shop?difficulty=Easy
/shop?difficulty=Moderate
/shop?difficulty=Advanced
```

#### Filter by Pet-Friendly Status
```
/shop?petFriendly=true
```

#### Combine Multiple Filters
```
/shop?category=Indoor&size=LG&difficulty=Easy
/shop?category=Pet-Friendly&petFriendly=true
```

### 3. Navigation Links

#### Header Menu
The header (`components/Header.tsx`) has dropdown menus:

**Plants Menu:**
- All Plants → `/shop`
- Indoor Plants → `/shop?category=Indoor`
- Outdoor Plants → `/shop?category=Outdoor`
- Low Maintenance → `/shop?category=Low-Maintenance`
- Pet Friendly → `/shop?category=Pet-Friendly`
- Cacti & Succulents → `/shop?category=Cacti`

**Care Tools Menu:**
- Plant Bundles → `/shop?category=Bundles`
- Pots & Planters → `/shop?category=Pots`
- Plant Care Kits → `/shop?category=Care-Kits`
- Tools & Accessories → `/shop?category=Tools`

#### Homepage Links
The homepage (`app/page.tsx`) has category cards:
- Pet-Friendly → `/shop?category=Pet-Friendly`
- Low-Maintenance → `/shop?category=Low-Maintenance`
- Cacti & Succulents → `/shop?category=Cacti`
- Plant Bundles → `/shop?category=Bundles`

## 🔄 Data Flow

```
Admin Dashboard
      ↓
  Add Product with Category "Indoor"
      ↓
  Saved to MongoDB with category: "Indoor"
      ↓
  User clicks "Indoor Plants" in header
      ↓
  Navigates to /shop?category=Indoor
      ↓
  Shop page fetches: GET /api/products?category=Indoor
      ↓
  API filters MongoDB: { category: "Indoor" }
      ↓
  Returns only Indoor plants
      ↓
  Displayed on shop page
```

## 🧪 Testing the System

### Step 1: Add a Product
1. Go to `/admin` (password: `admin123`)
2. Fill in the product form:
   - Name: "Monstera Deliciosa"
   - Category: **Indoor** (select from dropdown)
   - Price: 29.99
   - Description: "Beautiful indoor plant"
   - Image URL: (your image)
   - Sizes: SM,MD,LG
   - Stock: 10

3. Click "Add Product"

### Step 2: View in Shop
1. Go to `/shop`
2. Click the Category dropdown
3. Select "Indoor Plants"
4. You should see your Monstera displayed!

### Step 3: Test Direct Links
Click these links in the header:
- "Indoor Plants" → Should show only Indoor category
- "Outdoor Plants" → Should show only Outdoor category
- "Cacti & Succulents" → Should show only Cacti category

### Step 4: Test URL Parameters
Manually type in browser:
```
http://localhost:3000/shop?category=Indoor
```
Should show only Indoor plants!

## 🐛 Troubleshooting

### Products Not Showing Up

**Problem:** Added a product with category "Indoor" but it doesn't show when clicking "Indoor Plants"

**Solution:** Check these:
1. ✅ Category in admin must be exactly "Indoor" (capital I)
2. ✅ Product must have `inStock: true` or `stockQuantity > 0`
3. ✅ MongoDB connection is working
4. ✅ Check browser console for API errors

### Wrong Category Link

**Problem:** Link shows wrong products

**Solution:** 
- Header links use: `/shop?category=Indoor` (capital I)
- Admin categories use: "Indoor" (capital I)
- They must match exactly!

### No Products After Filter

**Problem:** Filter returns empty list

**Solution:**
1. Check if you have any products in that category
2. Go to `/admin` → "Manage Products" tab
3. Verify products exist with the correct category spelling
4. Try "All Plants" to see all products

## 📝 API Details

### GET /api/products
Fetches products with optional filters:

**Query Parameters:**
- `category` - Filter by category (e.g., "Indoor", "Outdoor")
- `size` - Filter by size (e.g., "SM", "MD", "LG")
- `difficulty` - Filter by care level (e.g., "Easy", "Moderate")
- `petFriendly` - Filter pet-friendly (value: "true")

**Example Request:**
```
GET /api/products?category=Indoor&size=LG
```

**Example Response:**
```json
{
  "success": true,
  "count": 5,
  "products": [
    {
      "_id": "...",
      "name": "Monstera Deliciosa",
      "category": "Indoor",
      "size": "LG",
      "price": 29.99,
      ...
    }
  ]
}
```

## 🎨 UI Features

### URL Sync
- Changing filters updates the URL automatically
- URL parameters are preserved when navigating
- Shareable URLs with filters applied

### Filter Dropdowns
- Category dropdown shows all available categories
- Size dropdown shows all size options
- Difficulty dropdown shows care level options
- Pet-friendly toggle

### Clear Filters Button
- Appears when any filter is active
- One-click to reset all filters
- Returns to "All Plants" view

## 🚀 Complete Workflow Example

1. **Add Product via Admin:**
   ```
   Name: "Snake Plant"
   Category: "Indoor"
   Size: "SM,MD"
   Price: 19.99
   ```

2. **Product Saved to MongoDB:**
   ```json
   {
     "name": "Snake Plant",
     "category": "Indoor",
     "size": "SM,MD",
     "price": 19.99,
     ...
   }
   ```

3. **User Navigation:**
   - User clicks "Indoor Plants" in header
   - Browser navigates to: `/shop?category=Indoor`
   - Shop page detects `category=Indoor` parameter

4. **API Call:**
   ```
   GET /api/products?category=Indoor
   ```

5. **Database Query:**
   ```javascript
   db.products.find({ category: "Indoor", inStock: true })
   ```

6. **Result:**
   - Snake Plant is displayed
   - Only Indoor category products shown
   - Filter dropdown shows "Indoor Plants" selected

## 📊 Category Mapping Reference

| Admin Value | Shop Filter | Header Link | Homepage Link |
|-------------|------------|-------------|---------------|
| Indoor | Indoor Plants | ✓ | - |
| Outdoor | Outdoor Plants | ✓ | - |
| Cacti | Cacti & Succulents | ✓ | ✓ |
| Pet-Friendly | Pet-Friendly | ✓ | ✓ |
| Low-Maintenance | Low-Maintenance | ✓ | ✓ |
| Bundles | Plant Bundles | ✓ | ✓ |
| Pots | Pots & Planters | ✓ | - |
| Care-Kits | Plant Care Kits | ✓ | - |
| Tools | Tools & Accessories | ✓ | - |

## ✅ Summary

- ✅ Category system uses exact case-sensitive matching
- ✅ Admin categories: "Indoor", "Outdoor", "Cacti", etc.
- ✅ Shop URLs: `/shop?category=Indoor`
- ✅ All navigation links updated to match
- ✅ URL parameters sync with filter dropdowns
- ✅ Server-side filtering via MongoDB queries
- ✅ Real-time URL updates as filters change

Your category routing system is now fully functional! 🎉
