const path = require('path');
const fs = require('fs');
const sqlite3 = require('sqlite3').verbose();
const { promisify } = require('util');

const dbPath = path.join(__dirname, '../data/app.db');
const db = new sqlite3.Database(dbPath);

const runAsync = promisify(db.run).bind(db);
const getAsync = promisify(db.get).bind(db);

const seedProducts = [
  {
    name: 'iPhone 16 Pro Max',
    category: 'Electronics',
    short_desc: 'Latest flagship smartphone with A18 Pro chip',
    long_desc: '6.9-inch Super Retina XDR display, triple 48MP camera system, titanium frame, up to 33 hours battery life.',
    price: 1199.99,
    image_url: 'https://www.mobileana.com/wp-content/uploads/2025/06/Apple-iPhone-17-Pro-Max-Cosmic-Orange.webp'
  },
  {
    name: 'MacBook Air M3',
    category: 'Electronics',
    short_desc: 'Ultra-thin laptop with Apple Silicon',
    long_desc: '13.6-inch Liquid Retina display, M3 chip with 8-core CPU, 16GB unified memory, 512GB SSD storage.',
    price: 1299.00,
    image_url: 'https://www.macworld.com/wp-content/uploads/2024/08/m3-macbook-air-overhead-2.jpg?quality=50&strip=all'
  },
  {
    name: 'Samsung 55" QLED TV',
    category: 'Electronics',
    short_desc: '4K Quantum HDR Smart TV',
    long_desc: '55-inch QLED panel, Quantum Processor 4K, 100% Color Volume, Ambient Mode+, Bixby/Alexa/Google Assistant.',
    price: 799.99,
    image_url: 'https://www.thebrick.com/cdn/shop/files/shopify-image_190e3cff-179b-40f6-a86f-2379a4457fd4_1500x.jpg?v=1721229566'
  },
  {
    name: 'Nike Air Jordan 1',
    category: 'Footwear',
    short_desc: 'Iconic high-top basketball sneakers',
    long_desc: 'Premium leather upper, Nike Air cushioning, classic Chicago colorway, rubber outsole for traction.',
    price: 170.00,
    image_url: 'https://static.nike.com/a/images/f_auto,cs_srgb/w_1920,c_limit/89c121fc-3d07-4de0-aef6-bcc9c2764a2c/air-jordan-1-2022-lost-and-found-chicago-the-inspiration-behind-the-design.jpg'
  },
  {
    name: 'Levi\'s 501 Original Fit',
    category: 'Clothing',
    short_desc: 'Timeless straight-leg jeans',
    long_desc: '100% cotton denim, classic 5-pocket styling, button fly, shrink-to-fit raw denim option available.',
    price: 98.00,
    image_url: 'https://images-cdn.ubuy.co.in/653cf74fffd9961a24721217-levi-s-men-s-501-original-fit-jeans.jpg'
  },
  {
    name: 'Ray-Ban Wayfarer Sunglasses',
    category: 'Accessories',
    short_desc: 'Classic polarized sunglasses',
    long_desc: 'Acetate frame, crystal lenses with polarization, UV400 protection, timeless square shape.',
    price: 165.00,
    image_url: 'https://images2.ray-ban.com//cdn-record-files-pi/868d2d00-4e4d-4486-b0a3-ae75017482e7/f6db637b-8bf6-402b-bd0d-ae7501888961/0RB0840S__901_31__P21__shad__qt.png?impolicy=RB_Product_clone&width=700&bgc=%23f2f2f2'
  },
  {
    name: 'Sony WH-1000XM5',
    category: 'Electronics',
    short_desc: 'Industry-leading noise canceling headphones',
    long_desc: 'ANC with 8 microphones, 30-hour battery, LDAC Hi-Res Audio, touch controls, multipoint connection.',
    price: 399.99,
    image_url: 'https://jo-cell.com/cdn/shop/files/111295_original_local_1200x1050_v3_converted.webp?v=1742372713&width=1200'
  },
  {
    name: 'Dyson V15 Detect',
    category: 'Home Appliances',
    short_desc: 'Cordless vacuum with laser dust detection',
    long_desc: '230AW suction power, piezo sensor for dust counting, auto-adjusting power, 60 min runtime.',
    price: 749.99,
    image_url: 'https://dyson-h.assetsadobe2.com/is/image/content/dam/dyson/leap-petite-global/products/floorcare/sticks/v15-detect/pdp/gallery/Dyson-V15-Direct-HeroWithNasties-Core-LB.jpg?$responsive$&cropPathE=desktop&fit=stretch,1&wid=1040'
  },
  {
    name: 'KitchenAid Stand Mixer',
    category: 'Home Appliances',
    short_desc: '5.5-quart tilt-head mixer',
    long_desc: '325-watt motor, 10 speeds, includes dough hook, flat beater, wire whip, pouring shield.',
    price: 379.99,
    image_url: 'https://m.media-amazon.com/images/I/71KiX7LRTML.jpg'
  },
  {
    name: 'Canon EOS R6 Mark II',
    category: 'Electronics',
    short_desc: 'Full-frame mirrorless camera',
    long_desc: '24.2MP sensor, 40fps burst shooting, 4K 60p video, advanced subject detection AF.',
    price: 2499.00,
    image_url: 'https://m.media-amazon.com/images/I/61JQs+UNEdL.jpg'
  },
  {
    name: 'YETI Rambler Tumbler',
    category: 'Accessories',
    short_desc: '30oz stainless steel insulated tumbler',
    long_desc: 'Double-wall vacuum insulation, No Sweat Design, dishwasher safe, fits car cup holders.',
    price: 38.00,
    image_url: 'https://www.yeti.com/on/demandware.static/-/Sites-siteCatalog_Yeti_US/default/dw858ffac3/200380-Category-Header-Tumblers-Social-1200x6300.jpg'
  },
  {
    name: 'Apple Watch Ultra 2',
    category: 'Electronics',
    short_desc: 'Rugged GPS smartwatch for adventure',
    long_desc: '49mm titanium case, dual-frequency GPS, dive computer, up to 36hr battery, Action button.',
    price: 799.00,
    image_url: 'https://www.jiomart.com/images/product/original/494226900/apple-watch-ultra-2-gps-cellular-49mm-titanium-case-with-blue-ocean-band-digital-o494226900-p604564115-1-202511252055.jpeg?im=Resize=(420,420)'
  }
];

async function seedDatabase() {
  console.log('🌱 Starting database seeding...');
  
  try {
    const schemaSQL = fs.readFileSync(path.join(__dirname, 'migrations/001_create_tables.sql'), 'utf8');
    await runAsync(schemaSQL);

    let insertedCount = 0;
    for (const product of seedProducts) {
      const result = await runAsync(
        `INSERT OR IGNORE INTO products 
         (name, category, short_desc, long_desc, price, image_url) 
         VALUES (?, ?, ?, ?, ?, ?)`,
        [
          product.name,
          product.category,
          product.short_desc,
          product.long_desc,
          product.price,
          product.image_url
        ]
      );
      // Note: sqlite3 run() called with promisify resolves to 'this' so no changes count is directly available.
      insertedCount++; // We count all since IGNORE skips duplicates silently.
    }

    const totalRow = await getAsync('SELECT COUNT(*) as count FROM products');
    console.log(`✅ Seeding complete! Inserted ${insertedCount} products. Total: ${totalRow.count}`);
    
  } catch (error) {
    console.error('❌ Seeding failed:', error.message);
    process.exit(1);
  } finally {
    db.close();
  }
}

seedDatabase();
