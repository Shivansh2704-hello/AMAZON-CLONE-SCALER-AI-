-- ============================================
-- Amazon.in Clone — Complete Database Schema
-- Run this file to reset and recreate everything
-- ============================================

DROP DATABASE IF EXISTS amazon_clone;
CREATE DATABASE amazon_clone;
USE amazon_clone;

-- 1. Users
CREATE TABLE users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    phone VARCHAR(20),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- 2. Categories
CREATE TABLE categories (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 3. Products
CREATE TABLE products (
    id INT AUTO_INCREMENT PRIMARY KEY,
    category_id INT NOT NULL,
    name VARCHAR(500) NOT NULL,
    description TEXT,
    specifications JSON,
    price DECIMAL(10, 2) NOT NULL,
    original_price DECIMAL(10, 2),
    stock INT NOT NULL DEFAULT 0,
    rating DECIMAL(2, 1) DEFAULT 0,
    num_reviews INT DEFAULT 0,
    brand VARCHAR(255),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (category_id) REFERENCES categories(id) ON DELETE CASCADE
);

-- 4. Product Images
CREATE TABLE product_images (
    id INT AUTO_INCREMENT PRIMARY KEY,
    product_id INT NOT NULL,
    image_url VARCHAR(1000) NOT NULL,
    is_primary BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE
);

-- 5. Cart (tied to user)
CREATE TABLE cart (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    UNIQUE KEY unique_user_cart (user_id)
);

-- 6. Cart Items
CREATE TABLE cart_items (
    id INT AUTO_INCREMENT PRIMARY KEY,
    cart_id INT NOT NULL,
    product_id INT NOT NULL,
    quantity INT NOT NULL DEFAULT 1,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (cart_id) REFERENCES cart(id) ON DELETE CASCADE,
    FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE,
    UNIQUE KEY unique_cart_product (cart_id, product_id)
);

-- 7. Orders
CREATE TABLE orders (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    customer_name VARCHAR(255) NOT NULL,
    phone VARCHAR(20),
    address TEXT NOT NULL,
    payment_method ENUM('COD','UPI','CARD','NET_BANKING') DEFAULT 'COD',
    total_price DECIMAL(10, 2) NOT NULL,
    delivery_charge DECIMAL(10, 2) DEFAULT 0.00,
    status ENUM('PLACED','SHIPPED','DELIVERED','CANCELLED') DEFAULT 'PLACED',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- 8. Order Items
CREATE TABLE order_items (
    id INT AUTO_INCREMENT PRIMARY KEY,
    order_id INT NOT NULL,
    product_id INT NOT NULL,
    quantity INT NOT NULL,
    price DECIMAL(10, 2) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (order_id) REFERENCES orders(id) ON DELETE CASCADE,
    FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE
);

-- =====================
-- SEED DATA
-- =====================

INSERT INTO categories (name) VALUES 
('Electronics'), ('Laptops & Computers'), ('Clothing'), ('Home & Kitchen'), ('Books'), ('Mobiles');

-- Products (Indian market, INR prices)
INSERT INTO products (category_id, name, description, specifications, price, original_price, stock, rating, num_reviews, brand) VALUES 
(
  2,
  'ASUS Vivobook Go 14, AMD Ryzen 5 7520U, 16GB RAM, 512GB SSD, FHD, 14", 60Hz, Windows 11, M365 Basic (1Year), Mixed Black',
  'Slim and lightweight laptop powered by AMD Ryzen 5 7520U processor. Features a 14-inch FHD display with 60Hz refresh rate, perfect for everyday computing, work and entertainment.',
  '{"Processor": "AMD Ryzen 5 7520U", "RAM": "16GB LPDDR5", "Storage": "512GB M.2 PCIe SSD", "Display": "14 inch FHD (1920x1080)", "OS": "Windows 11 Home", "Weight": "1.38 kg", "Battery": "42WHrs"}',
  43490.00, 52990.00, 45, 4.5, 33, 'ASUS'
),
(
  6,
  'Samsung Galaxy M35 5G (Thunder Grey, 8GB RAM, 128GB Storage)',
  'Experience blazing fast 5G connectivity with the Samsung Galaxy M35. Features a 6.6-inch Super AMOLED display, 50MP triple camera setup, and a massive 6000mAh battery for all-day usage.',
  '{"Processor": "Exynos 1380", "RAM": "8GB", "Storage": "128GB", "Display": "6.6 inch Super AMOLED 120Hz", "Camera": "50MP + 8MP + 5MP", "Battery": "6000mAh", "OS": "Android 14"}',
  18999.00, 24999.00, 80, 4.3, 1842, 'Samsung'
),
(
  1,
  'Sony WH-1000XM4 Industry Leading Wireless Noise Cancelling Headphones, Black',
  'Industry-leading noise cancellation with Dual Noise Sensor technology. Exceptional audio quality with Edge-AI, powered by Sony HD Noise Cancelling Processor QN1. Up to 30-hour battery life.',
  '{"Driver Size": "40mm", "Frequency Response": "4Hz-40,000Hz", "Battery": "Up to 30 Hours", "Connection": "Bluetooth 5.0", "Weight": "254g", "Foldable": "Yes"}',
  24990.00, 29990.00, 50, 4.8, 1205, 'Sony'
),
(
  4,
  'Instant Pot Duo 7-in-1 Electric Pressure Cooker, 5.7L, 1000W',
  'The Instant Pot Duo is a 7-in-1 multi-use programmable Pressure Cooker, Slow Cooker, Rice Cooker, Steamer, Sauté Pan, Yogurt Maker and Food Warmer. Cooks up to 70% faster than traditional cookware.',
  '{"Capacity": "5.7 Litre", "Wattage": "1000W", "Functions": "7-in-1", "Material": "Stainless Steel", "Dishwasher Safe": "Yes"}',
  8999.00, 12999.00, 100, 4.7, 4532, 'Instant Pot'
),
(
  3,
  'Amazon Brand - Symbol Men''s Regular Fit Polo T-Shirt',
  'Classic polo t-shirt made from 100% combed cotton. Features a 3-button placket, ribbed collar and cuffs. Available in multiple colors. Machine washable, perfect for casual and office wear.',
  '{"Material": "100% Combed Cotton", "Fit": "Regular Fit", "Collar": "Polo/Ribbed", "Care": "Machine Wash"}',
  499.00, 999.00, 200, 4.2, 3102, 'Amazon Brand Symbol'
),
(
  5,
  'The Pragmatic Programmer: Your Journey to Mastery, 20th Anniversary Edition',
  'The Pragmatic Programmer is one of those rare tech books you will read, re-read, and read again over the years. Whether you are a new coder, an experienced programmer, or a manager responsible for software projects, this book has something for you.',
  '{"Pages": "352", "Publisher": "Addison-Wesley", "Language": "English", "Edition": "20th Anniversary", "ISBN": "978-0135957059"}',
  3199.00, 3999.00, 80, 4.9, 2189, 'Addison-Wesley'
),
(
  6,
  'Apple iPhone 15 (128 GB) - Black',
  'iPhone 15 features a durable color-infused glass and aluminum design. It has a 6.1-inch Super Retina XDR display, Advanced dual-camera system with 48MP Main camera and Cinematic mode.',
  '{"Storage": "128GB", "Display": "6.1 inch Super Retina XDR", "Camera": "48MP + 12MP Dual", "Chip": "A16 Bionic", "Battery": "Up to 20 hours", "OS": "iOS 17"}',
  69999.00, 79900.00, 30, 4.7, 8921, 'Apple'
),
(
  2,
  'Lenovo V15 G4 AMD Athlon Silver 7120U Laptop (8GB/512GB SSD/Windows 11)',
  'Reliable business laptop powered by AMD Athlon Silver processor. Features a 15.6-inch FHD display, 8GB RAM, and 512GB SSD for smooth everyday performance.',
  '{"Processor": "AMD Athlon Silver 7120U", "RAM": "8GB LPDDR5", "Storage": "512GB SSD", "Display": "15.6 inch FHD IPS", "OS": "Windows 11 Home", "Weight": "1.65kg"}',
  37999.00, 47999.00, 35, 4.0, 325, 'Lenovo'
);

-- Product Images
INSERT INTO product_images (product_id, image_url, is_primary) VALUES 
(1, 'https://m.media-amazon.com/images/I/71Ni81ZLNgL._SL1500_.jpg', TRUE),
(1, 'https://m.media-amazon.com/images/I/61D3FkHBvRL._SL1500_.jpg', FALSE),
(2, 'https://m.media-amazon.com/images/I/71f4MoHqNHL._SL1500_.jpg', TRUE),
(2, 'https://m.media-amazon.com/images/I/81KCFHaRJcL._SL1500_.jpg', FALSE),
(3, 'https://m.media-amazon.com/images/I/71o8Q5XJS5L._SL1500_.jpg', TRUE),
(3, 'https://m.media-amazon.com/images/I/81a1EVdgkFL._SL1500_.jpg', FALSE),
(4, 'https://m.media-amazon.com/images/I/71WtwEvIGQL._SL1500_.jpg', TRUE),
(5, 'https://m.media-amazon.com/images/I/61Fwz1+8O4L._SL1500_.jpg', TRUE),
(6, 'https://m.media-amazon.com/images/I/51W1sBPO7tL._SX380_BO1,204,203,200_.jpg', TRUE),
(7, 'https://m.media-amazon.com/images/I/61bK6PMOC3L._SL1500_.jpg', TRUE),
(7, 'https://m.media-amazon.com/images/I/71ZBpvpOlPL._SL1500_.jpg', FALSE),
(8, 'https://m.media-amazon.com/images/I/81hOeV1PtoL._SL1500_.jpg', TRUE);
