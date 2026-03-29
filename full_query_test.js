const pool = require('./backend/config/db');

async function testFullQuery() {
    try {
        console.log('Testing full product query with JOIN and subquery...');
        const sql = `
            SELECT p.id, p.name, p.description, p.price, p.stock, p.rating, p.num_reviews,
                   c.name AS category,
                   (SELECT image_url FROM product_images WHERE product_id = p.id AND is_primary = TRUE LIMIT 1) AS image_url
            FROM products p
            JOIN categories c ON p.category_id = c.id
            WHERE 1=1
        `;
        const [rows] = await pool.query(sql);
        console.log('Full Query: SUCCESS', rows.length);
        if (rows.length > 0) {
            console.log('Sample Row:', JSON.stringify(rows[0], null, 2));
        }

        process.exit(0);
    } catch (err) {
        console.error('FULL QUERY FAILURE:', err.message);
        process.exit(1);
    }
}

testFullQuery();
