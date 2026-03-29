const pool = require('../config/db');

// @desc    Get all products with optional search & category filter
// @route   GET /api/products
const getProducts = async (req, res, next) => {
    try {
        const { search, category } = req.query;

        // Build dynamic SQL query based on query params
        let sql = `
            SELECT p.id, p.name, p.description, p.price, p.stock, p.rating, p.num_reviews,
                   c.name AS category,
                   (SELECT image_url FROM product_images WHERE product_id = p.id AND is_primary = TRUE LIMIT 1) AS image_url
            FROM products p
            JOIN categories c ON p.category_id = c.id
            WHERE 1=1
        `;
        const params = [];

        if (search) {
            // Use REGEXP with start-of-word boundary to avoid matching "Vivobook" when searching for "book"
            // Matches term starting at beginning of string OR after a punctuation/space
            const pattern = `(^|[[:punct:][:space:]])${search}`;
            sql += ' AND (p.name REGEXP ? OR p.description REGEXP ?)';
            params.push(pattern, pattern);
        }
        if (category) {
            sql += ' AND c.id = ?';
            params.push(category);
        }

        const [rows] = await pool.query(sql, params);
        res.json({ success: true, data: rows });
    } catch (err) {
        next(err);
    }
};

// @desc    Get single product with all images
// @route   GET /api/products/:id
const getProductById = async (req, res, next) => {
    try {
        const { id } = req.params;

        // Get product details
        const [products] = await pool.query(
            `SELECT p.*, c.name AS category
             FROM products p
             JOIN categories c ON p.category_id = c.id
             WHERE p.id = ?`,
            [id]
        );

        if (!products.length) {
            return res.status(404).json({ success: false, message: 'Product not found', data: null });
        }

        // Get all images for carousel
        const [images] = await pool.query(
            'SELECT image_url, is_primary FROM product_images WHERE product_id = ?',
            [id]
        );

        const product = { ...products[0], images };
        res.json({ success: true, data: product });
    } catch (err) {
        next(err);
    }
};

// @desc    Get all categories
// @route   GET /api/products/categories
const getCategories = async (req, res, next) => {
    try {
        const [rows] = await pool.query('SELECT * FROM categories');
        res.json({ success: true, data: rows });
    } catch (err) {
        next(err);
    }
};

module.exports = { getProducts, getProductById, getCategories };
