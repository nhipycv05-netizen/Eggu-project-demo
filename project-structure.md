# EGGU - Korean Egg Sandwich

## 1. Vai trò

Bạn là một **Senior Full-Stack Engineer + UI/UX Engineer** chịu trách nhiệm xây dựng toàn bộ website **EGGU - Korean Egg Sandwich**.

Mục tiêu là xây dựng một website F&B hiện đại, premium, responsive, hỗ trợ bán hàng online đơn giản và quản trị nội dung/đơn hàng.

Bạn phải ưu tiên:

1. UI/UX đẹp, hiện đại, premium.
2. Performance tốt.
3. SEO tốt.
4. Code sạch, dễ maintain.
5. Architecture đơn giản nhưng có khả năng mở rộng.
6. Không over-engineering.
7. Không tự ý thêm các tính năng ngoài scope.
8. Hoàn thành từng phase có kiểm tra trước khi chuyển phase tiếp theo.

---

# 2. Product Overview

## Brand

**EGGU**

### Full name

**EGGU - Korean Egg Sandwich**

### Product

Korean-style egg sandwich / toast / brunch / drinks.

Website có hai mục tiêu chính:

### A. Brand / Information

Cung cấp thông tin về:

* EGGU
* Brand story
* Menu
* Ingredients
* Product information
* Store
* FAQ
* News
* Contact

### B. Online Ordering

Khách hàng có thể:

```text
Home
→ Menu
→ Product
→ Add to Cart
→ Checkout
→ Nhập thông tin khách hàng
→ COD
→ Submit Order
→ Order Success
```

Website KHÔNG yêu cầu khách hàng đăng nhập.

---

# 3. Scope bắt buộc

## Public Website

Phải triển khai:

* Home
* Menu
* Product Detail
* Product customization
* Cart
* Checkout
* Order Success
* About / Brand
* Store
* FAQ
* Contact
* News
* Promotions
* Vietnamese / English

---

# 4. Những tính năng KHÔNG được triển khai

Không tự ý thêm:

* Customer registration
* Customer login
* Customer account
* Password cho customer
* Loyalty point
* Membership
* Wishlist
* Favorite
* Product review
* Rating
* Online payment
* Credit card
* VNPay
* MoMo
* ZaloPay
* Apple Pay
* Google Pay
* Franchise
* Franchise management
* Delivery partner integration
* POS integration
* AI chatbot
* Recommendation system

Hiện tại phương thức thanh toán duy nhất:

**Cash on Delivery (COD)**.

---

# 5. Tech Stack

## Frontend

Use:

* Next.js
* TypeScript
* React
* Tailwind CSS
* shadcn/ui
* Framer Motion
* React Hook Form
* Zod

## Backend

Không sử dụng NestJS.

Sử dụng:

* Next.js Server Components
* Next.js Server Actions
* Next.js Route Handlers

## Backend service

Use:

**Supabase**

Bao gồm:

* PostgreSQL
* Supabase Auth
* Supabase Storage
* Row Level Security

## Authentication

Customer:

Không authentication.

Admin:

Supabase Auth.

## Deployment

Frontend / application:

Vercel

Database:

Supabase

Storage:

Supabase Storage

---

# 6. Architecture

Sử dụng một Next.js application duy nhất.

Structure:

```text
EGGU
│
├── Public Website
│
└── Admin Dashboard
```

Public:

```text
/[locale]
```

Admin:

```text
/admin
```

Không tạo frontend project riêng cho Admin.

---

# 7. Internationalization

Chỉ hỗ trợ:

* Vietnamese: `vi`
* English: `en`

Không thêm Korean hoặc Japanese.

URL structure:

```text
/vi
/vi/menu
/vi/menu/[slug]
/vi/cart
/vi/checkout
/vi/about
/vi/store
/vi/faq
/vi/news
/vi/contact

/en
/en/menu
/en/menu/[slug]
/en/cart
/en/checkout
/en/about
/en/store
/en/faq
/en/news
/en/contact
```

Language switcher phải giữ nguyên trang hiện tại khi chuyển ngôn ngữ.

Ví dụ:

```text
/vi/menu/mr-egg
```

sang English:

```text
/en/menu/mr-egg
```

---

# 8. Public Website Structure

Đề xuất:

```text
app/
│
├── [locale]/
│   │
│   ├── layout.tsx
│   ├── page.tsx
│   │
│   ├── menu/
│   │   ├── page.tsx
│   │   └── [slug]/
│   │       └── page.tsx
│   │
│   ├── cart/
│   │   └── page.tsx
│   │
│   ├── checkout/
│   │   └── page.tsx
│   │
│   ├── order-success/
│   │   └── page.tsx
│   │
│   ├── about/
│   │   └── page.tsx
│   │
│   ├── store/
│   │   └── page.tsx
│   │
│   ├── faq/
│   │   └── page.tsx
│   │
│   ├── news/
│   │   ├── page.tsx
│   │   └── [slug]/
│   │
│   └── contact/
│       └── page.tsx
```

---

# 9. Home Page

Home phải có cảm giác:

**Modern Korean F&B / Premium / Minimal / Appetizing**

Không copy nguyên giao diện EGGDROP.

Chỉ tham khảo concept và information architecture.

## Sections

### Hero

Hero phải gây ấn tượng ngay khi mở website.

Bao gồm:

* Large product image/video
* EGGU logo
* Headline
* Short description
* CTA `Order Now`
* CTA `Explore Menu`

Ví dụ:

```text
EGGU

Korean Egg Sandwich

Made fresh.
Made better.

[ Order Now ]
[ Explore Menu ]
```

Không bắt buộc phải dùng đúng text trên nếu có copy tốt hơn.

---

### Featured Products

Hiển thị:

* Best sellers
* New products
* Featured products

CTA:

`View Full Menu`

---

### Brand Story

Giới thiệu ngắn về EGGU.

CTA:

`Discover EGGU`

---

### Ingredients

Show:

* Fresh eggs
* Premium bread
* Fresh ingredients
* Signature sauce

Thiết kế bằng hình ảnh + typography đẹp.

---

### Promotion

Hiển thị promotion hiện tại.

---

### Store

Hiển thị:

* Store image
* Address
* Opening hours
* CTA Google Maps

---

### News

Hiển thị một số news mới nhất.

---

### CTA

Cuối homepage:

```text
Ready for your next egg sandwich?

[ Order Now ]
```

---

# 10. Menu Page

URL:

```text
/[locale]/menu
```

Menu category:

* All
* Sandwich
* Toast
* Bagel
* Brunch
* Side
* Drinks
* Coffee
* Combo

Category phải được quản lý từ database.

Product card:

* Image
* Name
* Description
* Price
* New badge
* Best Seller badge
* Add to Cart

Responsive:

Desktop:

```text
4 columns
```

Tablet:

```text
2-3 columns
```

Mobile:

```text
2 columns
```

Tùy design thực tế.

---

# 11. Product Detail

URL:

```text
/[locale]/menu/[slug]
```

Hiển thị:

* Product gallery
* Product name
* Price
* Description
* Ingredients
* Nutrition
* Allergy information
* Quantity
* Product options
* Add to Cart

Nếu sản phẩm có option:

```text
Extra Cheese       +10,000
Extra Bacon        +15,000
Extra Avocado      +15,000
```

Cho phép:

* Add option
* Remove option
* Quantity
* Note

Giá phải tự động cập nhật.

---

# 12. Cart

Customer không cần login.

Cart phải lưu bằng:

```text
localStorage
```

Có thể sử dụng Zustand hoặc React Context.

Cart:

* Product
* Quantity
* Options
* Note
* Unit price
* Subtotal
* Delivery fee
* Total

Actions:

* Increase
* Decrease
* Remove
* Continue shopping
* Checkout

Nếu refresh browser:

Cart vẫn phải tồn tại.

---

# 13. Checkout

Không yêu cầu login.

Customer nhập:

### Required

* Full name
* Phone number
* Delivery address

### Optional

* Email
* Note

Payment:

```text
Cash on Delivery
```

Không hiển thị bất kỳ online payment method nào.

---

# 14. Checkout Validation

Sử dụng:

**Zod + React Hook Form**

Validation:

### Name

Required.

### Phone

Required.

Validate số điện thoại hợp lệ.

### Address

Required.

### Email

Optional nhưng nếu nhập phải validate format.

### Cart

Không cho submit nếu:

```text
cart.length === 0
```

---

# 15. Create Order

Order phải được tạo thông qua:

**Server Action hoặc Route Handler**

Không cho client tự do insert order trực tiếp vào Supabase.

Flow:

```text
Client
 ↓
Checkout Form
 ↓
Zod Validation
 ↓
Server Action
 ↓
Validate cart/product
 ↓
Calculate price server-side
 ↓
Create order
 ↓
Create order_items
 ↓
Return order number
 ↓
Order Success
```

QUAN TRỌNG:

Không tin:

* price từ client
* subtotal từ client
* total từ client

Server phải lấy product data từ Supabase và tự tính lại giá.

---

# 16. Order Database

Create:

```text
orders
order_items
```

## orders

Fields:

```text
id
order_number

customer_name
phone
email
address
note

subtotal
delivery_fee
total

payment_method
payment_status
order_status

created_at
updated_at
```

Payment:

```text
payment_method = COD
payment_status = UNPAID
```

Order status:

```text
NEW
CONFIRMED
PREPARING
SHIPPING
COMPLETED
CANCELLED
```

---

# 17. order_items

Fields:

```text
id
order_id
product_id

product_name
quantity
unit_price
subtotal

options
note
```

IMPORTANT:

Store snapshot values:

```text
product_name
unit_price
options
```

Không phụ thuộc vào current product data.

Nếu product price thay đổi sau này, old order vẫn phải giữ giá cũ.

---

# 18. Order Success

Sau khi tạo order:

```text
/[locale]/order-success?order=ORD-XXXX
```

Hiển thị:

```text
Order Confirmed

Thank you for your order.

Order #ORD-20260822-001

Payment:
Cash on Delivery

Total:
185,000 VND

We will contact you to confirm your order.

[ Back to Home ]
[ Continue Shopping ]
```

Không yêu cầu login để xem trang success.

---

# 19. Store Page

URL:

```text
/[locale]/store
```

Thông tin:

* Store name
* Address
* Phone
* Opening hours
* Google Maps
* Store images

Nếu database chỉ có một store thì vẫn thiết kế database hỗ trợ nhiều store trong tương lai.

---

# 20. About Page

Sections:

* Brand Story
* EGGU Philosophy
* Ingredients
* Quality
* Korean inspiration
* Product philosophy
* Store atmosphere

Thiết kế storytelling.

Không làm trang text-heavy.

---

# 21. FAQ

Accordion.

Các nhóm:

* Ordering
* Delivery
* Payment
* Products
* Store
* General

Tất cả FAQ phải hỗ trợ:

```text
question_vi
question_en
answer_vi
answer_en
```

---

# 22. News

News list:

* Thumbnail
* Title
* Summary
* Date

News detail:

* Hero image
* Title
* Date
* Content

Hỗ trợ VI/EN.

---

# 23. Contact

Hiển thị:

* Address
* Phone
* Email
* Opening hours
* Social media
* Google Maps

Có thể có contact form nếu cần.

---

# 24. Admin

Admin URL:

```text
/admin
```

Nếu chưa login:

```text
/admin
 ↓
/admin/login
```

Admin authentication sử dụng:

**Supabase Auth**

Customer không có authentication.

---

# 25. Admin Layout

Desktop:

```text
┌───────────────────────────────────────────┐
│ EGGU Admin                    Admin ▼     │
├───────────────┬───────────────────────────┤
│ Dashboard     │                           │
│               │       Page Content        │
│ Orders        │                           │
│ Products      │                           │
│ Categories    │                           │
│ Stores        │                           │
│ Promotions    │                           │
│ Content       │                           │
│   FAQ         │                           │
│   News        │                           │
│ Settings      │                           │
│               │                           │
│ Logout        │                           │
└───────────────┴───────────────────────────┘
```

Admin phải có:

* Sidebar
* Header
* Breadcrumb
* Page title
* Search
* Filters
* Tables
* Pagination
* Modal / Drawer
* Toast notification
* Loading state
* Empty state
* Error state

---

# 26. Admin Dashboard

Hiển thị:

* Today's orders
* Today's revenue
* New orders
* Preparing orders
* Shipping orders
* Completed orders
* Best selling products

Dashboard không cần analytics quá phức tạp ở MVP.

---

# 27. Admin Orders

URL:

```text
/admin/orders
```

Features:

* Order list
* Search by order number
* Search by customer name
* Search by phone
* Filter by status
* Filter by date
* View order detail
* Update order status
* Update payment status
* Cancel order

Order status:

```text
NEW
CONFIRMED
PREPARING
SHIPPING
COMPLETED
CANCELLED
```

Payment:

```text
COD
```

---

# 28. Admin Products

URL:

```text
/admin/products
```

CRUD:

* Create
* Read
* Update
* Delete

Fields:

```text
name_vi
name_en

description_vi
description_en

price

category

image

ingredients_vi
ingredients_en

nutrition
allergy_info_vi
allergy_info_en

is_new
is_best_seller
is_active
sort_order
```

---

# 29. Admin Product Options

Ví dụ:

```text
Extra Cheese
Extra Bacon
Extra Avocado
```

Fields:

```text
product_id
name_vi
name_en
price
is_active
sort_order
```

---

# 30. Admin Categories

CRUD:

```text
name_vi
name_en
slug
image
sort_order
is_active
```

---

# 31. Admin Stores

CRUD:

```text
name_vi
name_en
address_vi
address_en
phone
latitude
longitude
opening_hours
is_active
```

---

# 32. Admin Promotions

CRUD:

```text
title_vi
title_en
description_vi
description_en
image
start_at
end_at
is_active
```

Do not implement complex coupon system unless explicitly requested.

---

# 33. Admin Content

## FAQ

CRUD:

```text
question_vi
question_en
answer_vi
answer_en
category
sort_order
is_active
```

## News

CRUD:

```text
title_vi
title_en
slug
summary_vi
summary_en
content_vi
content_en
thumbnail
published_at
status
```

Status:

```text
DRAFT
PUBLISHED
```

---

# 34. Supabase Storage

Create buckets:

```text
products
categories
stores
news
banners
brand
```

Use Supabase Storage for images.

Do not store binary images directly in PostgreSQL.

---

# 35. Supabase RLS

Must implement RLS.

Public:

```text
SELECT:
products
categories
stores
published_news
faq
promotions
```

Admin:

```text
SELECT
INSERT
UPDATE
DELETE
```

Customers must NOT have direct permission to:

```text
UPDATE orders
DELETE orders
UPDATE products
DELETE products
```

Order creation must go through server-side logic.

---

# 36. Database Schema

Create migrations for:

```text
categories
products
product_options
stores
orders
order_items
promotions
faqs
news
```

Use foreign keys.

Use indexes for:

```text
products.category_id
products.slug
orders.order_number
orders.phone
orders.order_status
orders.created_at
news.slug
```

Use unique constraints where appropriate.

---

# 37. UI/UX Direction

Design language:

**Premium Korean F&B**

Keywords:

* Minimal
* Premium
* Warm
* Modern
* Editorial
* Food-focused
* Clean typography
* Large imagery
* Smooth animation

Do not make it look like:

* Generic SaaS
* Generic Bootstrap website
* Generic restaurant template

---

# 38. Color System

Do not blindly copy EGGDROP.

Create EGGU brand system.

Suggested direction:

* Cream / off-white
* Egg yellow
* Warm brown
* Charcoal
* White

Use CSS variables.

Example:

```text
--background
--foreground
--primary
--secondary
--muted
--accent
--border
```

Do not scatter hardcoded colors throughout components.

---

# 39. Typography

Use a modern sans-serif font.

Need:

* Strong heading hierarchy
* Large editorial headings
* Good mobile readability
* Korean-inspired visual feeling without requiring Korean language

Use `next/font`.

Avoid loading unnecessary fonts.

---

# 40. Animation

Use Framer Motion selectively.

Animations:

* Hero entrance
* Product card reveal
* Scroll reveal
* Image hover
* Page transition if appropriate
* Cart feedback
* Add-to-cart animation
* Mobile menu

Do NOT over-animate.

Performance is more important than animation.

Respect:

```text
prefers-reduced-motion
```

---

# 41. Responsive

Must support:

* Desktop
* Tablet
* Mobile

Prioritize mobile ordering experience.

Checkout must be especially easy to use on mobile.

---

# 42. SEO

Implement:

* Metadata
* Title
* Description
* OpenGraph
* Twitter card
* Canonical URL
* Sitemap
* robots.txt
* Structured data where appropriate

Product pages should have SEO metadata.

News pages should have SEO metadata.

Both VI and EN must have correct alternate/hreflang handling.

---

# 43. Performance

Must use:

* Next.js Image
* Server Components wherever possible
* Dynamic import where useful
* Lazy loading
* Proper image sizes
* WebP/AVIF where appropriate
* Avoid unnecessary client components

Do not make the entire application `"use client"`.

Only interactive components should be client components.

---

# 44. Accessibility

Implement:

* Semantic HTML
* Keyboard navigation
* Focus states
* Alt text
* Proper labels
* ARIA only where needed
* Good color contrast
* Form error messages

---

# 45. Error / Loading / Empty States

Every important page needs:

### Loading

Skeleton.

### Empty

Example:

```text
Your cart is empty.

[ Browse Menu ]
```

### Error

User-friendly error message.

Do not expose raw database errors.

---

# 46. Cart Architecture

Use:

**Zustand + localStorage**

Cart item:

```typescript
{
  productId: string;
  name: string;
  price: number;
  image: string;
  quantity: number;
  options: {
    id: string;
    name: string;
    price: number;
  }[];
  note?: string;
}
```

But server must NEVER trust these values during order creation.

---

# 47. Order Number

Generate human-readable order numbers.

Example:

```text
EGGU-20260822-0001
```

Format:

```text
EGGU-YYYYMMDD-XXXX
```

Order number must be unique.

---

# 48. API / Server Actions

Keep API surface small.

Possible:

```text
createOrder
getProducts
getProduct
getCategories
getStores
getPublishedNews
getFaqs
```

Admin:

```text
createProduct
updateProduct
deleteProduct

createCategory
updateCategory
deleteCategory

updateOrderStatus

createStore
updateStore
deleteStore

createNews
updateNews
deleteNews

createFaq
updateFaq
deleteFaq
```

Use Server Actions where appropriate.

Do not create unnecessary REST endpoints.

---

# 49. Project Structure

Use a clean structure similar to:

```text
src/
├── app/
│   ├── [locale]/
│   └── admin/
│
├── components/
│   ├── ui/
│   ├── layout/
│   ├── home/
│   ├── menu/
│   ├── product/
│   ├── cart/
│   ├── checkout/
│   └── admin/
│
├── features/
│   ├── products/
│   ├── cart/
│   ├── orders/
│   ├── stores/
│   ├── faq/
│   └── news/
│
├── lib/
│   ├── supabase/
│   ├── validations/
│   ├── utils/
│   └── constants/
│
├── hooks/
│
├── stores/
│
├── types/
│
├── i18n/
│
└── styles/
```

Do not create excessive abstractions.

---

# 50. Environment Variables

Create:

```text
.env.local
```

Required:

```text
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
```

If server-side secret is required, use the appropriate server-only environment variable.

NEVER expose:

```text
SUPABASE_SERVICE_ROLE_KEY
```

to client-side code.

Never commit `.env.local`.

Create:

```text
.env.example
```

---

# 51. Development Process

DO NOT attempt to implement everything in one giant step.

Implement in phases.

## Phase 0 — Planning

Before coding:

1. Analyze requirements.
2. Create architecture.
3. Create database ERD.
4. Create route map.
5. Create component map.
6. Create implementation checklist.

Then begin development.

---

# Phase 1 — Project Setup

Implement:

* Next.js
* TypeScript
* Tailwind
* shadcn/ui
* Supabase
* next-intl
* ESLint
* Prettier
* Husky if appropriate
* Git configuration

Create:

```text
.env.example
README.md
```

Verify:

```bash
npm run dev
npm run build
npm run lint
```

---

# Phase 2 — Supabase

Create:

* Database schema
* Migrations
* RLS
* Storage buckets
* Seed data

Seed sample:

Categories:

```text
Sandwich
Toast
Bagel
Brunch
Side
Drinks
Coffee
Combo
```

Products:

Create realistic demo products.

Do not leave the website completely empty.

---

# Phase 3 — Design System

Build:

* Header
* Footer
* Button
* Container
* Typography
* Badge
* Card
* Modal
* Drawer
* Input
* Select
* Checkbox
* Toast
* Skeleton

Create reusable design tokens.

---

# Phase 4 — Public Website

Implement:

1. Home
2. Menu
3. Product detail
4. About
5. Store
6. FAQ
7. News
8. Contact

Ensure:

* VI
* EN
* responsive
* SEO

---

# Phase 5 — Ordering

Implement:

1. Product customization
2. Cart
3. Zustand
4. localStorage
5. Checkout
6. Zod validation
7. Server-side price calculation
8. Create order
9. COD
10. Order success

Test carefully.

---

# Phase 6 — Admin

Implement:

1. Admin login
2. Admin layout
3. Dashboard
4. Orders
5. Products
6. Categories
7. Product options
8. Stores
9. Promotions
10. FAQ
11. News
12. Settings

---

# Phase 7 — Security

Review:

* Supabase RLS
* Admin authorization
* Server Actions
* Input validation
* XSS
* SQL injection
* File upload validation
* File size limits
* Image MIME validation
* Rate limiting where appropriate
* Secret exposure

---

# Phase 8 — SEO / Performance

Verify:

* Metadata
* Sitemap
* robots.txt
* OpenGraph
* Canonical
* hreflang
* Image optimization
* Lighthouse
* Core Web Vitals

---

# Phase 9 — Final QA

Test:

## Public

* [ ] Home
* [ ] VI
* [ ] EN
* [ ] Menu
* [ ] Product
* [ ] Add to cart
* [ ] Cart persistence
* [ ] Checkout
* [ ] Validation
* [ ] COD
* [ ] Order creation
* [ ] Order success
* [ ] About
* [ ] Store
* [ ] FAQ
* [ ] News
* [ ] Contact

## Admin

* [ ] Login
* [ ] Logout
* [ ] Dashboard
* [ ] Orders
* [ ] Order status
* [ ] Products CRUD
* [ ] Categories CRUD
* [ ] Options CRUD
* [ ] Stores CRUD
* [ ] FAQ CRUD
* [ ] News CRUD
* [ ] Promotions CRUD

## Responsive

Test:

* [ ] iPhone
* [ ] Android
* [ ] Tablet
* [ ] Desktop

---

# 52. Important Engineering Rules

1. Do not over-engineer.
2. Do not introduce NestJS.
3. Do not introduce Prisma unless there is a demonstrated need.
4. Do not introduce Redux.
5. Use Zustand only for client cart state.
6. Use Server Components by default.
7. Use Client Components only when interaction requires them.
8. Never trust price data from the browser.
9. Never expose Supabase service role key.
10. Use RLS.
11. Validate all user input.
12. Optimize images.
13. Do not duplicate components unnecessarily.
14. Do not hardcode product data into UI.
15. Product/category/content data must come from Supabase.
16. Use database migrations.
17. Do not manually modify production database without migration.
18. Do not create unnecessary APIs.
19. Keep business logic server-side.
20. Keep UI components reusable.
21. Do not implement features outside this specification without asking first.

---

# 53. Definition of Done

A feature is considered complete only when:

* UI implemented
* Responsive
* Loading state
* Empty state
* Error state
* Validation
* Database integration
* Security/RLS where applicable
* VI/EN
* SEO where applicable
* Tested
* No TypeScript errors
* No ESLint errors
* Production build succeeds

Commands must pass:

```bash
npm run lint
npm run build
```

---

# 54. First Task

DO NOT immediately implement the entire website.

Start with **Phase 0**.

First provide:

## A. Final Architecture

Explain:

* Next.js architecture
* Supabase architecture
* Public/Admin separation
* Authentication
* Data flow
* Order flow

## B. Database ERD

Provide all tables:

```text
categories
products
product_options
stores
orders
order_items
promotions
faqs
news
```

Show:

* fields
* types
* relationships
* indexes
* constraints

## C. Route Map

Provide:

```text
Public routes
Admin routes
```

## D. Component Architecture

Show:

```text
components/
features/
lib/
hooks/
stores/
types/
```

## E. Implementation Roadmap

Break implementation into small phases.

Each phase must be independently testable.

After showing the plan, **start implementing Phase 1 only**.

Do not implement later phases until Phase 1 is verified.

---

# 55. Final Goal

The final product should feel like a real premium F&B brand website:

**EGGU**

### Korean Egg Sandwich

It should be:

* visually impressive
* fast
* mobile-first
* SEO-friendly
* bilingual VI/EN
* easy to order
* COD only
* no customer login
* easy for admin to manage
* easy to maintain
* ready for future expansion

The website should prioritize the customer's path:

```text
DISCOVER
    ↓
EXPLORE
    ↓
CHOOSE
    ↓
ORDER
    ↓
CONFIRM
```

while keeping the technical architecture simple:

```text
Next.js
   +
Supabase
   +
Vercel
```

Do not add unnecessary infrastructure.
