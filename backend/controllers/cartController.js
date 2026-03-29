const pool = require('../config/db');

/**
 * Helper: get or create a cart for this user
 */
const getOrCreateCart = async (userId) => {
    let [carts] = await pool.query('SELECT id FROM cart WHERE user_id = ?', [userId]);
    if (carts.length === 0) {
        const [result] = await pool.query('INSERT INTO cart (user_id) VALUES (?)', [userId]);
        return result.insertId;
    }
    return carts[0].id;
};

// @desc    Get cart items for the authenticated user
// @route   GET /api/cart
const getCart = async (req, res, next) => {
    try {
        const userId = req.user.id;
        const cartId = await getOrCreateCart(userId);

        const [items] = await pool.query(
            `SELECT ci.id, ci.quantity, p.id AS product_id, p.name, p.price, p.stock,
                    (SELECT image_url FROM product_images WHERE product_id = p.id AND is_primary = TRUE LIMIT 1) AS image_url
             FROM cart_items ci
             JOIN products p ON ci.product_id = p.id
             WHERE ci.cart_id = ?`,
            [cartId]
        );

        // Calculate totals
        const subtotal = items.reduce((acc, item) => acc + (item.price * item.quantity), 0);
        res.json({ success: true, data: { items, subtotal: subtotal.toFixed(2) } });
    } catch (err) {
        next(err);
    }
};

// @desc    Add item to cart (with stock validation)
// @route   POST /api/cart
const addToCart = async (req, res, next) => {
    try {
        const userId = req.user.id;
        const { product_id, quantity = 1 } = req.body;

        if (!product_id) {
            return res.status(400).json({ success: false, message: 'product_id is required', data: null });
        }

        // Validate product & stock
        const [products] = await pool.query('SELECT id, stock FROM products WHERE id = ?', [product_id]);
        if (!products.length) {
            return res.status(404).json({ success: false, message: 'Product not found', data: null });
        }
        if (products[0].stock < quantity) {
            return res.status(400).json({ success: false, message: 'Insufficient stock', data: null });
        }

        const cartId = await getOrCreateCart(userId);

        // Use ON DUPLICATE KEY to update quantity if item already in cart
        await pool.query(
            `INSERT INTO cart_items (cart_id, product_id, quantity)
             VALUES (?, ?, ?)
             ON DUPLICATE KEY UPDATE quantity = quantity + VALUES(quantity)`,
            [cartId, product_id, quantity]
        );

        res.json({ success: true, message: 'Item added to cart', data: null });
    } catch (err) {
        next(err);
    }
};

// @desc    Update quantity of a cart item
// @route   PUT /api/cart/item/:itemId
const updateCartItem = async (req, res, next) => {
    try {
        const { itemId } = req.params;
        const { quantity } = req.body;

        if (!quantity || quantity < 1) {
            return res.status(400).json({ success: false, message: 'Quantity must be at least 1', data: null });
        }

        // Check stock before updating
        const [items] = await pool.query(
            `SELECT ci.id, p.stock FROM cart_items ci JOIN products p ON ci.product_id = p.id WHERE ci.id = ?`,
            [itemId]
        );
        if (!items.length) {
            return res.status(404).json({ success: false, message: 'Cart item not found', data: null });
        }
        if (items[0].stock < quantity) {
            return res.status(400).json({ success: false, message: 'Requested quantity exceeds stock', data: null });
        }

        await pool.query('UPDATE cart_items SET quantity = ? WHERE id = ?', [quantity, itemId]);
        res.json({ success: true, message: 'Cart updated', data: null });
    } catch (err) {
        next(err);
    }
};

// @desc    Remove a cart item
// @route   DELETE /api/cart/item/:itemId
const removeCartItem = async (req, res, next) => {
    try {
        const { itemId } = req.params;
        await pool.query('DELETE FROM cart_items WHERE id = ?', [itemId]);
        res.json({ success: true, message: 'Item removed', data: null });
    } catch (err) {
        next(err);
    }
};

module.exports = { getCart, addToCart, updateCartItem, removeCartItem };
