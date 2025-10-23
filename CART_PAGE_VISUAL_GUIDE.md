# Cart Page Layout - Visual Guide

## Page Structure

```
┌─────────────────────────────────────────────────────────────────────┐
│                           HEADER                                     │
│  BuyPlants  [Plants▼] [Care Tools▼] [Gifts▼] [Learn▼]  [Login] 🛒 │
└─────────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────────┐
│                        Shopping Cart                                 │
└─────────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────────┐
│  Welcome back, John! (john@example.com)                             │
└─────────────────────────────────────────────────────────────────────┘

┌──────────────────────────────────┬──────────────────────────────────┐
│       YOUR ITEMS (LEFT)          │   DELIVERY DETAILS (RIGHT)       │
├──────────────────────────────────┼──────────────────────────────────┤
│                                  │                                  │
│ ┌──────────────────────────────┐ │ ┌──────────────────────────────┐ │
│ │  [IMG] Snake Plant      $45  │ │ │  Delivery Details            │ │
│ │        Size: Medium          │ │ │                              │ │
│ │        [-] 1 [+]      Remove │ │ │  First Name: [__John______]  │ │
│ └──────────────────────────────┘ │ │  Last Name:  [__Doe_______]  │ │
│                                  │ │                              │ │
│ ┌──────────────────────────────┐ │ │  Delivery Method:            │ │
│ │  [IMG] Peace Lily       $35  │ │ │  [Standard (Free)      ▼]    │ │
│ │        Size: Large           │ │ │                              │ │
│ │        [-] 2 [+]      Remove │ │ │  Address:                    │ │
│ └──────────────────────────────┘ │ │  [____________________]      │ │
│                                  │ │  [____________________]      │ │
│ ┌──────────────────────────────┐ │ │                              │ │
│ │ ────────────────────────────  │ │ │  City:        Postal Code:   │ │
│ │  Subtotal:           $115.00 │ │ │  [_New York_] [__10001___]   │ │
│ │  Shipping:    At checkout    │ │ │                              │ │
│ │  ═══════════════════════════  │ │ │  Phone Number:               │ │
│ │  Total:              $115.00 │ │ │  [_+1 (555) 123-4567_]       │ │
│ └──────────────────────────────┘ │ │                              │ │
│                                  │ │  [Proceed to Payment]        │ │
│  ← Continue Shopping             │ │                              │ │
│                                  │ │  * Required fields           │ │
└──────────────────────────────────┴──────────────────────────────────┘
```

## Authentication Modal (Popup)

```
┌─────────────────────────────────────────────┐
│                                          [×] │
│   Welcome Back!                             │
│   Login to continue your purchase           │
│                                             │
│   Email Address                             │
│   [_you@example.com________________]        │
│                                             │
│   Password                                  │
│   [_••••••••_______________________]        │
│                                             │
│   [        Login        ]                   │
│                                             │
│   Don't have an account? Sign Up            │
│                                             │
│   ┌─────────────────────────────────────┐   │
│   │ Demo Mode: Simplified auth          │   │
│   │ for demonstration only              │   │
│   └─────────────────────────────────────┘   │
└─────────────────────────────────────────────┘
```

## Form Fields Breakdown

### Left Side: Cart Items
```
┌─────────────────────────────────────┐
│ [Product Image]  Product Name  $XX  │
│                  Size: XX           │
│                  Price: $XX         │
│                  [-] Qty [+] Remove │
└─────────────────────────────────────┘

Order Summary Section:
- Subtotal
- Shipping (calculated at checkout)
- Total (bold, green)
```

### Right Side: Delivery Form
```
1. First Name*      [Text Input]
2. Last Name*       [Text Input]
3. Delivery Method* [Dropdown]
   - Standard (3-5 days) - Free
   - Express (1-2 days) - $15
   - Same Day - $25
   - Store Pickup - Free
4. Address*         [Textarea]
5. City*            [Text Input]
6. Postal Code      [Text Input] (optional)
7. Phone Number*    [Tel Input]

[Proceed to Payment Button]
```

## Responsive Behavior

### Desktop (> 1024px)
```
┌────────────────┬────────────────┐
│   Cart Items   │ Delivery Form  │
│   (50% width)  │  (50% width)   │
│                │  (sticky)      │
└────────────────┴────────────────┘
```

### Tablet (768px - 1024px)
```
┌────────────────┬───────────────┐
│   Cart Items   │ Delivery Form │
│   (55% width)  │  (45% width)  │
└────────────────┴───────────────┘
```

### Mobile (< 768px)
```
┌────────────────────────┐
│    Cart Items          │
│    (full width)        │
└────────────────────────┘
┌────────────────────────┐
│    Delivery Form       │
│    (full width)        │
└────────────────────────┘
```

## User Flows

### Flow 1: Guest to Authenticated
```
1. User at /shop
   ↓
2. Add items to cart
   ↓
3. Navigate to /cart
   ↓
4. See: Cart Items (left) + Form (right)
   ↓
5. Fill delivery form
   ↓
6. Click "Proceed to Payment"
   ↓
7. Auth Modal appears ← (not logged in)
   ↓
8. Complete login/signup
   ↓
9. Auto-redirect to /checkout
```

### Flow 2: Authenticated User
```
1. User clicks "Login" in header
   ↓
2. Complete authentication
   ↓
3. Add items to cart
   ↓
4. Navigate to /cart
   ↓
5. See welcome banner: "Welcome back, [Name]!"
   ↓
6. Form pre-filled: First Name, Last Name
   ↓
7. Complete remaining fields
   ↓
8. Click "Proceed to Payment"
   ↓
9. Direct redirect to /checkout
```

### Flow 3: Quick Checkout
```
1. User already logged in
   ↓
2. Has saved delivery details
   ↓
3. Navigate to /cart
   ↓
4. Form auto-filled from profile
   ↓
5. Review and edit if needed
   ↓
6. Click "Proceed to Payment"
   ↓
7. Instant redirect to /checkout
```

## Color Scheme

```
Primary (Green):    #10B981 (Buttons, Links, Success)
Secondary (Gray):   #6B7280 (Text, Borders)
Error (Red):        #EF4444 (Validation errors)
Warning (Yellow):   #F59E0B (Auth prompts)
Success (Green):    #10B981 (Confirmations)
Background:         #FFFFFF (Cards)
Page Background:    #F9FAFB (Light gray)
```

## Interactive Elements

### Buttons
```
Primary:   [Proceed to Payment]  ← Green, full-width
Secondary: [Continue Shopping]   ← Text link, green
Danger:    [Remove]              ← Red text
Quantity:  [-] [+]               ← Circle buttons
```

### Form States
```
Normal:    Border: gray-300
Focus:     Border: green-500, Ring: green
Error:     Border: red-500, Text: red below
Success:   Border: green-500
```

## Validation Messages

### Display Location
```
[Input Field]
↓ (Error appears here in red)
```

### Examples
```
First Name:  [_____________]
             ❌ First name is required

Phone:       [_abc123______]
             ❌ Please enter a valid phone number
```

## Data Flow

```
User Input → Form State → Validation → localStorage
                ↓
           Proceed Click
                ↓
        Auth Check (CartContext)
                ↓
         ┌──────┴──────┐
         │             │
   Not Auth       Authenticated
         │             │
    Show Modal    Save & Redirect
         │             │
    After Auth ────────┘
         │
    /checkout page
         │
    Read delivery details
    from localStorage
```

## Component Tree

```
CartPage
├── User Banner (conditional)
├── Left Column
│   ├── Cart Items List
│   │   ├── CartItem (repeated)
│   │   │   ├── Image
│   │   │   ├── Name, Size, Price
│   │   │   ├── Quantity Controls
│   │   │   └── Remove Button
│   │   └── Order Summary
│   └── Continue Shopping Link
├── Right Column
│   ├── Auth Prompt (if not logged in)
│   └── DeliveryDetailsForm
│       ├── Name Fields
│       ├── Delivery Method Dropdown
│       ├── Address Textarea
│       ├── City & Postal Code
│       ├── Phone Number
│       └── Submit Button
└── AuthModal (conditional)
    ├── Close Button
    ├── Mode Toggle (Login/Signup)
    ├── Email Input
    ├── Name Inputs (signup only)
    ├── Password Input
    └── Submit Button
```

---

**Page URL**: `http://localhost:3000/cart`  
**Status**: ✅ Fully Functional  
**Mobile Responsive**: ✅ Yes  
**Accessibility**: ✅ Form labels, error messages  
**Browser Support**: ✅ Modern browsers
