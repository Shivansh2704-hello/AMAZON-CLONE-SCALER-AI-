const pool = require('./backend/config/db');
const fs = require('fs');

async function getProducts() {
    try {
        const [rows] = await pool.query('SELECT id, name FROM products');
        fs.writeFileSync('products_list.json', JSON.stringify(rows, null, 2));
        console.log('Product list written to products_list.json');
        process.exit(0);
    } catch (err) {
        console.error(err);
        process.exit(1);
    }
}

getProducts();
