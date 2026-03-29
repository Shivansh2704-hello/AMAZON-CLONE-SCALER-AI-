const mysql = require('mysql2/promise');
const path = require('path');

// dotenv v17+ requires explicit config path
require('dotenv').config({ path: path.resolve(__dirname, '../.env') });

const pool = mysql.createPool({
    host: process.env.DB_HOST || 'localhost',
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || '',
    database: process.env.DB_NAME || 'amazon_clone',
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
});

module.exports = pool;
