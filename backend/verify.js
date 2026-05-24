import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Product from './models/Product.js';

dotenv.config();

(async () => {
  try {
    console.log('Connecting to DB...');
    await mongoose.connect(process.env.MONGODB_URI, { 
      serverSelectionTimeoutMS: 5000,
      socketTimeoutMS: 45000 
    });
    console.log('✓ DB Connected');
    
    const count = await Product.countDocuments();
    console.log(`✓ Product count: ${count}`);
    
    if (count === 0) {
      console.log('⚠ No products! Running seed...');
      const sampleProduct = {
        productName: 'Test Buffalo Milk',
        category: 'Dairy',
        subCategory: 'Milk',
        description: 'Fresh milk for testing',
        price: 64,
        unit: 'liter',
        stock: 100,
        image: '/uploads/products/test.jpg',
        isAvailable: true,
        isFeatured: true,
        isBestSeller: true
      };
      const res = await Product.create(sampleProduct);
      console.log(`✓ Created test product: ${res.productName}`);
    } else {
      const first = await Product.findOne();
      console.log(`✓ Sample product: ${first.productName} (price: ${first.price})`);
    }
    
    await mongoose.disconnect();
    console.log('✓ Done');
    process.exit(0);
  } catch (err) {
    console.log('✗ Error:', err.message);
    process.exit(1);
  }
})();
