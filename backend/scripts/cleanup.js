const mysql = require('mysql2/promise');
const dbUrl = "mysql://root:xPqRVhSdClfNLjSouwDJMHiXXmJUGzWW@hopper.proxy.rlwy.net:59750/railway";

async function run(){ 
    const c = await mysql.createConnection(dbUrl); 
    await c.query('SET FOREIGN_KEY_CHECKS = 0'); 
    const [ts] = await c.query('SHOW TABLES'); 
    for(const t of ts){ 
        const name = Object.values(t)[0]; 
        await c.query('DROP TABLE ' + name); 
        console.log('Dropped ' + name); 
    } 
    await c.query('SET FOREIGN_KEY_CHECKS = 1'); 
    await c.end(); 
    process.exit(0);
} 
run().catch(e => { console.error(e); process.exit(1); });
