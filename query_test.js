const pool = require('./backend/config/db');

async function testQuery() {
    try {
        console.log('Testing general query...');
        const [rows] = await pool.query('SELECT * FROM products LIMIT 1');
        console.log('General: SUCCESS', rows.length);

        console.log('Testing REGEXP query with search term "book"...');
        const search = 'book';
        const pattern = `(^|[[:punct:][:space:]])${search}`;
        const sql = 'SELECT id FROM products WHERE name REGEXP ? OR description REGEXP ?';
        const [results] = await pool.query(sql, [pattern, pattern]);
        console.log('REGEXP: SUCCESS', results.length);

        process.exit(0);
    } catch (err) {
        console.error('QUERY FAILURE:', err.message);
        process.exit(1);
    }
}

testQuery();
