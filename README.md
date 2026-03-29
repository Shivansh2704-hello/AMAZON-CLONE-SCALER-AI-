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
- **Backend**: Node.js, Express, MySQL (Database), JWT (Security).
- **Styling**: Pure CSS was used to replace non-functional Tailwind classes, ensuring a high-fidelity recreation of the Amazon design system.

## 🚀 Setup Instructions

### Prerequisites
- Node.js (v16+)
- MySQL Server

### 1. Database Configuration
1. Create a database named `amazon_clone`.
2. Seed the database with the provided sample data (see `backend/config/seed.sql` if available, or use the automatic seeding logic in the backend).

### 2. Backend Setup
```bash
cd backend
npm install
# Create a .env file with the following:
# DB_HOST=localhost
# DB_USER=root
# DB_PASSWORD=your_password
# DB_NAME=amazon_clone
# JWT_SECRET=your_jwt_secret
npm run dev
```

### 3. Frontend Setup
```bash
cd frontend
npm install
npm run dev
```

## 📝 Assumptions & Notes

- **Default User**: The app bypasses the login screen and automatically authenticates a "Test User" using a mock-admin-token. This allows immediate access to the cart and checkout features as per project requirements.
- **Sample Data**: The product database is assumed to be pre-populated with diverse categories (Electronics, Clothing, Home & Kitchen, etc.) to showcase filtering.
- **CSS Architecture**: BEM (Block Element Modifier) methodology was adopted for the custom CSS to ensure maintainability and eliminate dependencies on external utility frameworks.
