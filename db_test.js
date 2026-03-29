const pool = require('./backend/config/db');

async function testConnection() {
    try {
        console.log('--- Database Diagnostic ---');
        const [rows] = await pool.query('SELECT 1 + 1 AS result');
        console.log('Connection: SUCCESS');
        
        const [tables] = await pool.query('SHOW TABLES');
        console.log('Tables found:', tables.map(t => Object.values(t)[0]));
        
        const [products] = await pool.query('SELECT COUNT(*) as count FROM products');
        console.log('Product count:', products[0].count);
        
        const [categories] = await pool.query('SELECT COUNT(*) as count FROM categories');
        console.log('Category count:', categories[0].count);
        
        process.exit(0);
    } catch (err) {
        console.error('Diagnostic error:', err.message);
        process.exit(1);
    }
}

testConnection();
