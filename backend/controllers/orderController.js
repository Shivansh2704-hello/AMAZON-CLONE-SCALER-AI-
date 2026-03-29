const pool = require('../config/db');

/**
 * Place an order (supports cart-checkout AND buy-now direct checkout)
 * @route   POST /api/orders
 */
const placeOrder = async (req, res, next) => {
    const connection = await pool.getConnection();
    try {
        await connection.beginTransaction();

        const userId = req.user.id;
        const { customer_name, phone, address, payment_method, buy_now_item } = req.body;

        if (!customer_name || !address) {
            return res.status(400).json({ success: false, message: 'customer_name and address are required' });
        }

        let orderItems = [];

        if (buy_now_item) {
            // --- BUY NOW FLOW: Single item passed directly ---
            const { product_id, quantity } = buy_now_item;
            const [products] = await connection.query('SELECT id, price, stock FROM products WHERE id = ?', [product_id]);
            if (!products.length) throw { status: 404, message: 'Product not found' };
            if (products[0].stock < quantity) throw { status: 400, message: 'Insufficient stock for this item' };
            orderItems = [{ product_id, quantity, price: products[0].price }];
        } else {
            // --- CART CHECKOUT FLOW: Fetch all cart items ---
            const [carts] = await connection.query('SELECT id FROM cart WHERE user_id = ?', [userId]);
            if (!carts.length) return res.status(400).json({ success: false, message: 'Cart is empty' });
            const cartId = carts[0].id;

            const [cartItems] = await connection.query(
                `SELECT ci.product_id, ci.quantity, p.price, p.stock
                 FROM cart_items ci JOIN products p ON ci.product_id = p.id
                 WHERE ci.cart_id = ?`,
                [cartId]
            );
            if (!cartItems.length) return res.status(400).json({ success: false, message: 'Cart is empty' });

            // Final stock validation
            for (const item of cartItems) {
                if (item.stock < item.quantity) {
                    throw { status: 400, message: `Insufficient stock for product ID ${item.product_id}` };
                }
            }
            orderItems = cartItems;
        }

        // Calculate total
        const total_price = orderItems.reduce((acc, item) => acc + (item.price * item.quantity), 0);

        // Create the order record
        const [orderResult] = await connection.query(
            'INSERT INTO orders (user_id, customer_name, phone, address, payment_method, total_price) VALUES (?, ?, ?, ?, ?, ?)',
            [userId, customer_name, phone, address, payment_method || 'COD', total_price.toFixed(2)]
        );
        const orderId = orderResult.insertId;

        // Insert order items and decrement stock
        for (const item of orderItems) {
            await connection.query(
                'INSERT INTO order_items (order_id, product_id, quantity, price) VALUES (?, ?, ?, ?)',
                [orderId, item.product_id, item.quantity, item.price]
            );
            // Decrement stock atomically
            await connection.query(
                'UPDATE products SET stock = stock - ? WHERE id = ?',
                [item.quantity, item.product_id]
            );
        }

        // Clear cart if it was a regular checkout
        if (!buy_now_item) {
            const [carts] = await connection.query('SELECT id FROM cart WHERE user_id = ?', [userId]);
            if (carts.length) {
                await connection.query('DELETE FROM cart_items WHERE cart_id = ?', [carts[0].id]);
            }
        }

        await connection.commit();
        res.status(201).json({
            success: true,
            message: 'Order placed successfully!',
            data: { order_id: orderId, total_price: total_price.toFixed(2) }
        });
    } catch (err) {
        await connection.rollback();
        next(err);
    } finally {
        connection.release();
    }
};

/**
 * Get all orders for the current user
 */
const getUserOrders = async (req, res, next) => {
    try {
        const userId = req.user.id;
        const [orders] = await pool.query(
            'SELECT * FROM orders WHERE user_id = ? ORDER BY created_at DESC',
            [userId]
        );

        // Fetch items for each order
        for (let order of orders) {
            const [items] = await pool.query(
                `SELECT oi.*, p.name AS product_name, 
                        (SELECT image_url FROM product_images WHERE product_id = p.id AND is_primary = TRUE LIMIT 1) AS image_url
                 FROM order_items oi 
                 JOIN products p ON oi.product_id = p.id 
                 WHERE oi.order_id = ?`,
                [order.id]
            );
            order.items = items;
        }

        res.json({ success: true, data: orders });
    } catch (err) {
        next(err);
    }
};

/**
 * Get order detail by ID (only if it belongs to the user)
 */
const getOrderById = async (req, res, next) => {
    try {
        const { id } = req.params;
        const userId = req.user.id;

        const [orders] = await pool.query('SELECT * FROM orders WHERE id = ? AND user_id = ?', [id, userId]);
        if (!orders.length) {
            return res.status(404).json({ success: false, message: 'Order not found' });
        }

        const order = orders[0];
        const [items] = await pool.query(
            `SELECT oi.*, p.name AS product_name,
                    (SELECT image_url FROM product_images WHERE product_id = p.id AND is_primary = TRUE LIMIT 1) AS image_url
             FROM order_items oi 
             JOIN products p ON oi.product_id = p.id 
             WHERE oi.order_id = ?`,
            [id]
        );
        order.items = items;

        res.json({ success: true, data: order });
    } catch (err) {
        next(err);
    }
};

module.exports = { placeOrder, getOrderById, getUserOrders };
