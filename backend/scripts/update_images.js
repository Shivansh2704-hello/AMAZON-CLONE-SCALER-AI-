const mysql = require('mysql2/promise');
const dbUrl = "mysql://root:xPqRVhSdClfNLjSouwDJMHiXXmJUGzWW@hopper.proxy.rlwy.net:59750/railway";

async function run(){ 
    const c = await mysql.createConnection(dbUrl); 
    
    const mappings = [
        { name: 'ASUS Vivobook Go 14%', url: '/images/products/asus_vivobook.png' },
        { name: 'Samsung Galaxy M35%', url: '/images/products/samsung_galaxy.png' },
        { name: 'Sony WH-1000XM4%', url: '/images/products/sony_headphones.png' },
        { name: 'Instant Pot Duo%', url: '/images/products/prestige_cooker.png' },
        { name: 'Amazon Brand - Symbol%', url: '/images/products/mens_tshirt.png' },
        { name: 'The Pragmatic Programmer%', url: '/images/products/pragmatic_programmer.png' },
        { name: 'Apple iPhone 15%', url: '/images/products/iphone_15.png' },
        { name: 'Lenovo V15 G4%', url: '/images/products/lenovo_ideapad.png' }
    ];

    for(const m of mappings){ 
        const [ps] = await c.query('SELECT id FROM products WHERE name LIKE ?', [m.name]); 
        if(ps.length > 0){ 
            const pid = ps[0].id; 
            // Delete old images and insert primary one
            await c.query('DELETE FROM product_images WHERE product_id = ?', [pid]); 
            await c.query('INSERT INTO product_images (product_id, image_url, is_primary) VALUES (?, ?, TRUE)', [pid, m.url]); 
            console.log(`Updated ${m.name} with ${m.url}`); 
        } 
    } 
    
    await c.end(); 
    process.exit(0);
} 
run().catch(e => { console.error(e); process.exit(1); });
