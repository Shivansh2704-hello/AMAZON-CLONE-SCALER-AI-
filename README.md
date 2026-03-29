# Amazon.in Clone

A fully functional, stylized Amazon.in clone built with React, Node.js, and MySQL. This project features a multi-step checkout process, detailed product pages, and a responsive shopping cart, all designed to mimic the authentic Amazon India experience.

## ✨ Features

- **Product Listing Grid**: A responsive grid layout showcasing products with images, ratings, and prices.
- **Advanced Search & Filtering**: Real-time search by product name and filtering by category.
- **Product Detail Page**: Comprehensive product information, including image galleries, stock status, "About this item" lists, and dynamic specifications tables.
- **Shopping Cart**: Fully functional cart with quantity controls, subtotal calculation, and Amazon-style "Free Delivery" indicators.
- **Multi-Step Checkout**: A secure, 3-step accordion checkout flow (Address -> Payment -> Review) with order placement logic.
- **No Login Required Mode**: For convenience, the application assumes a default user ("Test User") is always logged in, utilizing a pre-configured JWT token.

## 🛠️ Tech Stack

- **Frontend**: React, React Router, Lucide-react (Icons), Axios (API calls), Custom CSS (BEM-style).
- **Backend Service**: Node.js, Express, JWT (Security), REST API.
- **Production Database**: Cloud-hosted MySQL on Railway (`hopper.proxy.rlwy.net`).
- **Live Backend Endpoint**: `https://amazon-clone-scaler-ai.onrender.com`
- **Media**: Localized high-fidelity product images and AI-generated assets.

## 🚀 Setup Instructions

### Prerequisites
- Node.js (v16+)
- Railway CLI (for cloud database metrics)

### 1. Database Configuration
1. The project is currently configured to connect to the **Railway Cloud Database**. 
2. Connection variables are defined in the `backend/.env` file. 
3. Seeding logic has been executed to migrate products and categories to the cloud.

### 2. Backend Setup
```bash
cd backend
npm install
# Ensure .env is updated with Railway credentials
npm run dev
```

### 3. Frontend Setup
```bash
cd frontend
npm install
npm run dev
```

## 📝 Assumptions & Notes

- **Cloud Integration**: The database has been successfully migrated from localhost to Railway to support production accessibility. 
- **Media Assets**: All product images have been remapped to high-quality local files within the `frontend/public/images/products` directory, ensuring consistent 24/7 rendering without external dependencies.
- **Default User**: The app bypasses the login screen and automatically authenticates a "Test User" using a mock-admin-token for testing the cart and checkout features.
- **Performance Note**: Please be advised that certain application features and data retrieval operations may experience latency. This is due to the current utilization of a cloud-hosted MySQL database on a distributed service (Railway), which prioritizes global accessibility over localized response speed.
