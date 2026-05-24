#!/usr/bin/env node
/**
 * Comprehensive Diagnostic & Setup Script
 * Checks DB connection, product count, seeds if needed
 */

import mongoose from 'mongoose';
import dotenv from 'dotenv';
import bcryptjs from 'bcryptjs';
import Product from './models/Product.js';
import User from './models/User.js';

dotenv.config();

const products = [
  { productName: 'Buffalo Milk', category: 'Dairy', subCategory: 'Milk', description: 'Pure and fresh buffalo milk', price: 64, unit: 'liter', stock: 500, image: '/uploads/products/buffalo_milk.jpg', isAvailable: true, isFeatured: true, isBestSeller: true },
  { productName: 'Fresh Cow Milk', category: 'Dairy', subCategory: 'Milk', description: 'Fresh cow milk from farms', price: 54, unit: 'liter', stock: 500, image: '/uploads/products/cow_milk.jpg', isAvailable: true, isFeatured: true, isBestSeller: true },
  { productName: 'Buffalo Desi Ghee', category: 'Dairy', subCategory: 'Ghee', description: 'Pure desi ghee', price: 740, unit: 'kg', stock: 100, image: '/uploads/products/desi_ghee.jpg', isAvailable: true, isFeatured: true, isBestSeller: true },
  { productName: 'Fresh Paneer', category: 'Dairy', subCategory: 'Paneer', description: 'Soft fresh paneer', price: 300, unit: 'kg', stock: 150, image: '/uploads/products/fresh_paneer.jpg', isAvailable: true, isFeatured: true, isBestSeller: true },
  { productName: 'Fresh Curd', category: 'Dairy', subCategory: 'Curd', description: 'Thick creamy curd', price: 92, unit: 'kg', stock: 200, image: '/uploads/products/fresh_curd.jpg', isAvailable: true, isFeatured: true, isBestSeller: true },
  { productName: 'Special Milk Cake', category: 'Sweets', subCategory: 'Milk Cake', description: 'Milk cake with mawa', price: 360, unit: 'kg', stock: 80, image: '/uploads/products/milk_cake.jpg', isAvailable: true, isFeatured: true, isBestSeller: true },
  { productName: 'Spongy Rasgulla', category: 'Sweets', subCategory: 'Rasgulla', description: 'Bengali rasgulla in syrup', price: 260, unit: 'kg', stock: 120, image: '/uploads/products/rasgulla.jpg', isAvailable: true, isFeatured: true, isBestSeller: true },
  { productName: 'Rasmalai', category: 'Sweets', subCategory: 'Rasmalai', description: 'Creamy rasmalai', price: 360, unit: 'kg', stock: 80, image: '/uploads/products/rasmalai.jpg', isAvailable: true, isFeatured: true, isBestSeller: true },
  { productName: 'Mawa Barfi', category: 'Sweets', subCategory: 'Barfi', description: 'Rich mawa barfi', price: 400, unit: 'kg', stock: 100, image: '/uploads/products/barfi.jpg', isAvailable: true, isFeatured: true, isBestSeller: true },
  { productName: 'Motichoor Laddu', category: 'Sweets', subCategory: 'Laddu', description: 'Premium motichoor', price: 360, unit: 'kg', stock: 100, image: '/uploads/products/laddu.jpg', isAvailable: true, isFeatured: true, isBestSeller: true }
];

async function main() {
  console.log('\n🔍 DIAGNOSTIC & SETUP\n' + '='.repeat(50));
  
  try {
    console.log('Step 1️⃣  Connecting to MongoDB...');
    await mongoose.connect(process.env.MONGODB_URI, { 
      serverSelectionTimeoutMS: 10000,
      socketTimeoutMS: 45000 
    });
    console.log('✅ MongoDB connected!\n');
    
    console.log('Step 2️⃣  Checking existing data...');
    const productCount = await Product.countDocuments();
    const userCount = await User.countDocuments();
    console.log(`   Products: ${productCount}`);
    console.log(`   Users: ${userCount}\n`);
    
    if (productCount === 0 || userCount === 0) {
      console.log('Step 3️⃣  Clearing old data...');
      await Product.deleteMany({});
      await User.deleteMany({});
      console.log('✅ Cleared\n');
      
      console.log('Step 4️⃣  Seeding products...');
      const inserted = await Product.insertMany(products);
      console.log(`✅ Seeded ${inserted.length} products\n`);
      
      console.log('Step 5️⃣  Creating admin user...');
      const salt = await bcryptjs.genSalt(10);
      const hash = await bcryptjs.hash('Sumittt', salt);
      const admin = await User.create({
        name: 'Admin',
        email: 'b231169@skit.ac.in',
        password: hash,
        phone: '9876543210',
        role: 'admin'
      });
      console.log(`✅ Admin created: ${admin.email}\n`);
    }
    
    const finalProducts = await Product.countDocuments();
    console.log('Step 6️⃣  Final verification...');
    console.log(`✅ Total products: ${finalProducts}\n`);
    
    console.log('📋 SETUP COMPLETE!');
    console.log('💡 Next steps:');
    console.log('   1. Backend: npm run dev   (port 5002)');
    console.log('   2. Frontend: npm run dev  (port 5177)');
    console.log('   3. Visit: http://localhost:5177\n');
    
    process.exit(0);
  } catch (err) {
    console.error('\n❌ ERROR:', err.message);
    console.log('\n⚠️  Troubleshooting:');
    console.log('   - Check MONGODB_URI in .env');
    console.log('   - Verify MongoDB Atlas connection');
    console.log('   - Check network connectivity\n');
    process.exit(1);
  }
}

main();
