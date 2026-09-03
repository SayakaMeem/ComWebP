# 🛍️ ComWebP.SHOP — Full-Stack E-Commerce Platform | .NET 8 + React + SQLite

> A complete, production-ready, attractive e-commerce platform built on D: Drive. FakeStoreAPI + Local SQLite DB + Role-Based Auth + Cart + Buying History. Built by SayakaMeem.

**Live Frontend:** http://localhost:5174 | **Backend API:** http://localhost:5000 | **Swagger:** http://localhost:5000/swagger | **GitHub:** https://github.com/SayakaMeem/ComWebP

### OVERVIEW
ComWebP.SHOP is a modern full-stack e-commerce web app. It solves the problem of expensive image hosting by using free FakeStoreAPI for product images, and also allows admin to add real products to local SQLite database D:/app.db. The UI has Summer Mega Sale 70% OFF hero, search bar, category filters, best seller badges, free delivery/COD/returns strip, and fully working cart and purchase history. The project is built 100% on D: drive because C: drive had low space, using TEMP=D:\temp trick.

### FEATURES — ALL IN ONE
1. Attractive UI: Dark header ComWebP.SHOP logo, search input (Search iPhone, jacket, saree, watch...), purple-pink hero gradient, Shop Collection button, 4.8/5 rated badge.
2. Product System: Combines FakeStoreAPI products and Local DB products (local shows as "Local DB" and "BEST SELLER"). Image, title, category, rating, price, stock.
3. Search & Filter: Real-time search, category filters All, Local, Men's Clothing, Jewelery, Electronics, Women's Clothing.
4. Authentication with Roles: Single modal for Login/Register. Register allows choosing Customer or Admin role. Login checks from localStorage users list. Session saved in localStorage cwp_user. Default admin is admin@comwebp.shop / admin123. Customer can register with any email.
5. Admin Power: Only admin sees Admin Panel "Manage D:/ app.db". Admin can Add product (name, price, stock, description) via POST to /api/products, Edit local product via PUT, Delete via DELETE. Admin cannot edit FakeStore products. Admin sees purchaser list.
6. Cart System: Add to Cart, quantity increase, remove, cart drawer slide, total calculation, cart count in header, data saved in localStorage cart.
7. Purchase & History: Confirm Purchase creates order object {id, user email, role, items, total, date}. Orders saved in localStorage cwp_orders. Customer clicks My Orders to see own buying history. Admin clicks All Orders to see all purchaser orders with buyer email, total, items list, timestamp.
8. Security: Public cannot see admin panel, cannot add product, cannot checkout without login — forces login modal.

### TECH STACK — SINGLE LIST
Backend: .NET 8 Web API, C#, Entity Framework Core 8, SQLite, Swagger/OpenAPI, CORS enabled. Frontend: React 18, Vite, JSX, Modern CSS, LocalStorage for auth/cart/orders. Database: SQLite file app.db at D:/GitProjects/ComWebP/app.db and D:/app.db. External API: https://fakestoreapi.com/products for free product data. Tools: D:\dotnet SDK, D:\dotnet-tools, D:\temp for TEMP/TMP, npm, Git, VS Code.

### ARCHITECTURE
Browser (React Vite 5174) -> Fetch FakeStoreAPI + Fetch Local API http://localhost:5000/api/products -> .NET API -> EF Core -> SQLite app.db. Auth and orders handled 100% on frontend localStorage for fast demo, no JWT needed for this version. CORS allows 5174 to talk to 5000.

### PROJECT STRUCTURE — SINGLE VIEW
ComWebP/ -> src/API/Program.cs, Controllers/ProductsController.cs, Core/Entities/Product.cs, Infrastructure/AppDbContext.cs, app.db, client/src/App.jsx (contains all UI + auth + cart + orders logic), client/src/App.css (header, hero, filters, grid, card, cart-drawer, admin, modal-bg, modal, role-chip, order-card), client/package.json, .gitignore, README.md (this file).

### HOW TO RUN — COMPLETE STEPS IN ONE PLACE — D: DRIVE ONLY
Prerequisites: Create folder D:\temp, install .NET 8 SDK to D:\dotnet, Node.js installed, repo cloned to D:\GitProjects\ComWebP.
Step 1 Backend: Open CMD, run set TEMP=D:\temp & set TMP=D:\temp & set PATH=D:\dotnet;D:\dotnet-tools;%PATH% then cd /d D:\GitProjects\ComWebP then dotnet run --project src\API --urls http://localhost:5000. You should see Now listening on http://localhost:5000 and Swagger.
Step 2 Frontend: Open second CMD, run set TEMP=D:\temp & set TMP=D:\temp then cd /d D:\GitProjects\ComWebP\client then npm install (first time) then npm run dev -- --port 5174. You should see Vite ready at http://localhost:5174.
Step 3 Open Chrome http://localhost:5174. Test register as customer test@gmail.com / 1234 / Customer -> Add to cart -> Confirm Purchase -> My Orders -> See history. Logout. Login as admin@comwebp.shop / admin123 -> See admin panel -> Add iPhone 16 price 1500 stock 5 -> Edit to 1400 -> Delete -> Click All Orders to see purchaser list.

### DEFAULT ACCOUNTS
Admin: admin@comwebp.shop / admin123 (can Add/Edit/Delete + view all orders). Customer: Create via Register -> Role Customer (can only shop + view own orders). No Angular used in this project, only React.

### API ENDPOINTS
GET http://localhost:5000/api/products - get local products. POST http://localhost:5000/api/products body {name, description, price, stock, imageUrl} - add. PUT http://localhost:5000/api/products/{id} - update. DELETE http://localhost:5000/api/products/{id} - delete. External: GET https://fakestoreapi.com/products - free products.

### DATABASE
SQLite file app.db. Table Products: Id, Name, Description, Price, Stock, ImageUrl. EF Core auto migrates. Location D:/app.db and D:/GitProjects/ComWebP/app.db.

