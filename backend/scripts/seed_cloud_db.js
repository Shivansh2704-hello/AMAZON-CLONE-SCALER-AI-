const mysql = require('mysql2/promise');
const fs = require('fs');
const path = require('path');
require('dotenv').config({ path: path.resolve(__dirname, '../.env') });

/**
 * seed_cloud_db.js
 * Usage: node scripts/seed_cloud_db.js <EXTERNAL_DATABASE_URL>
 */

async function seed() {
    const dbUrl = process.argv[2] || process.env.DATABASE_URL;

    if (!dbUrl) {
        console.error('❌ Error: Please provide the External Database URL as an argument or in .env as DATABASE_URL');
        process.exit(1);
    }

    console.log('🚀 Connecting to cloud database...');
    
    let connection;
    try {
        connection = await mysql.createConnection(dbUrl);
        console.log('✅ Connected successfully!');
        
        await connection.query('SET FOREIGN_KEY_CHECKS = 0');

        const sqlPath = path.resolve(__dirname, '../database.sql');
        const sql = fs.readFileSync(sqlPath, 'utf8');

        // Split queries by semicolon, filtering out empty strings and comments
        const queries = sql
            .split(';')
            .map(q => q.trim())
            .filter(q => q.length > 0);

        console.log(`📦 Found ${queries.length} queries. Starting execution...`);

        for (let i = 0; i < queries.length; i++) {
            let query = queries[i];
            console.log(`Executing query ${i+1}: ${query.substring(0, 50)}...`);
            
            try {
                await connection.query(query);
                console.log(`  [${i + 1}/${queries.length}] ✅ Success`);
            } catch (err) {
                console.error(`  [${i + 1}/${queries.length}] ❌ Failed: ${err.message}`);
                console.error(`     Query: ${query.substring(0, 100)}...`);
            }
        }

        console.log('\n✨ Database seeding complete!');
    } catch (err) {
        console.error('💥 Connection/Execution Error:', err.message);
    } finally {
        if (connection) await connection.end();
    }
}

seed();
