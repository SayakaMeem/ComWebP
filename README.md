# ComWebP.SHOP - Modern E-Commerce Platform

![Vite](https://img.shields.io/badge/Vite-v8.2.2-646CFF?logo=vite)
![React](https://img.shields.io/badge/React-18-61DAFB?logo=react)
![Tailwind](https://img.shields.io/badge/Tailwind-3.4.10-38BDF8?logo=tailwindcss)
![Status](https://img.shields.io/badge/Status-Live-success)

A fully responsive, bug-free e-commerce shop with dark/light theme, role-based auth, cart, orders and admin dashboard.

### 🚀 Live Links

| Environment | URL |
|---|---|
| **Production (Main)** | **https://comwebp-shop-new.vercel.app** |
| Preview Build | https://comwebp-shop-5b5mffts7-sayakameems-projects.vercel.app |
| Local Dev | http://localhost:5175 |

### ✨ Features

- ✅ Mobile-first responsive (1 col <400px, 2 col tablet, 4 col desktop)
- ✅ Light / Dark theme with `data-theme` and `localStorage`
- ✅ Hamburger ☰ menu - works on phone touch
- ✅ Customer / Admin role switch in Register modal
- ✅ Add to Cart, Buy Now, My Orders / All Orders
- ✅ Admin Dashboard - Add / Edit / Delete local products
- ✅ Search + Category filter
- ✅ No GPU glitch - stable solid colors (no backdrop-blur)
- ✅ Free Delivery banner + COD

### 🛠 Tech Stack

| Layer | Technology | Version |
|---|---|---|
| Frontend | React + Vite | 18 / 8.2.2 |
| Styling | Tailwind CSS + Custom CSS Tokens | 3.4.10 |
| State | useState + localStorage | - |
| Deployment | Vercel CLI | Latest |
| API | FakeStoreAPI + Custom API | - |
| Icons | Emoji + Custom Chip UI | - |

### 🔐 User Roles

| Role | Email | Password | Access |
|---|---|---|---|
| **Admin** | `admin@comwebp.shop` | `admin123` | Add/Edit/Delete products, View All Orders |
| Customer | Register any email | Your password | Add to Cart, Buy, View My Orders |

> All users stored in `localStorage: cwp_users`. First time on new device, only admin exists.

### 🏗 Architecture & Flowchart

```mermaid
flowchart TD
    A[User Opens comwebp-shop-new.vercel.app] --> B{Logged In?}
    B -- No --> C[Show Login / Register Modal]
    C --> D{Select Role: Customer / Admin}
    D --> E[Save to localStorage cwp_users]
    B -- Yes --> F[Load Products]
    F --> G[FakeStoreAPI + /api/products]
    G --> H[Filter by Search + Category]
    H --> I[Display Grid]
    I --> J{Action}
    J -- Add to Cart --> K[Cart Drawer 92vw on Mobile]
    J -- Admin --> L[Admin Dashboard]
    L --> M[POST / PUT / DELETE local product]
    K --> N[Buy Now]
    N --> O[Create Order in cwp_orders]
    O --> P[Show My Orders / All Orders Drawer]
    P --> Q[Theme Toggle 🌙/☀️ -> data-theme -> localStorage]


📂 Folder Structure
ComWebP/
├── client/
│   ├── src/
│   │   ├── App.jsx      # Complete shop - cart, auth, admin, orders
│   │   ├── main.jsx     # React root + index.css import
│   │   └── index.css    # Tokens: --bg #fff / #16171d, --accent #aa3bff
│   ├── index.html
│   ├── tailwind.config.js
│   ├── postcss.config.js
│   └── package.json
├── .gitignore
└── README.md


💻 Installation & Run Commands

# 1. Clone
git clone https://github.com/your-username/ComWebP.git
cd ComWebP/client

# 2. Install
npm install

# 3. Open files
notepad src\App.jsx
notepad src\index.css

# 4. Run locally (host for phone testing)
npm run dev -- --host
# Open http://localhost:5175

# 5. Build for production
npm run build

# 6. Deploy to Vercel
vercel --prod --yes

🔧 Environment Variables
Create client/.env:

Code
VITE_API_URL=http://localhost:5000

📦 API Routes
Method

Endpoint

Description

GET

/api/products

Get all local products

POST

/api/products

Add product (Admin)

PUT

/api/products/:id

Update product

DELETE

/api/products/:id

Delete product

GET

https://fakestoreapi.com/products

External products


🎨 Design Tokens

Token	Light	Dark
--bg	#fff	#16171d
--text-h	#08060d	#f3f4f6
--text	#6b6375	#9ca3af
--border	#e5e4e7	#2e303a
--code-bg	#f4f3ec	#1f2028
--accent	#aa3bff	#c084fc


🚢 Deployment
Push to main → Vercel auto-deploys if connected to GitHub
Or manual: vercel --prod --yes





