#!/usr/bin/env node
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Product from './models/Product.js';
import User from './models/User.js';
import bcryptjs from 'bcryptjs';

dotenv.config();

const products = [
  {
    productName: 'Buffalo Milk',
    category: 'Dairy',
    subCategory: 'Milk',
    description: 'Pure and fresh buffalo milk delivered daily. Rich in calcium and nutrients.',
    price: 64,
    unit: 'liter',
    stock: 500,
    image: '/uploads/products/buffalo_milk.jpg',
    isAvailable: true,
    isFeatured: true,
    isBestSeller: true
  },
  {
    productName: 'Fresh Cow Milk',
    category: 'Dairy',
    subCategory: 'Milk',
    description: 'Pure and fresh cow milk delivered daily from local farms.',
    price: 54,
    unit: 'liter',
    stock: 500,
    image: '/uploads/products/cow_milk.jpg',
    isAvailable: true,
    isFeatured: true,
    isBestSeller: true
  },
  {
    productName: 'Buffalo Desi Ghee',
    category: 'Dairy',
    subCategory: 'Ghee',
    description: 'Pure desi buffalo ghee made from buffalo milk using traditional bilona method.',
    price: 740,
    unit: 'kg',
    stock: 100,
    image: '/uploads/products/desi_ghee.jpg',
    isAvailable: true,
    isFeatured: true,
    isBestSeller: true
  },
  {
    productName: 'Cow Desi Ghee',
    category: 'Dairy',
    subCategory: 'Ghee',
    description: 'Pure desi cow ghee made from cow milk using traditional method.',
    price: 760,
    unit: 'kg',
    stock: 100,
    image: '/uploads/products/desi_ghee.jpg',
    isAvailable: true,
    isFeatured: true,
    isBestSeller: true
  },
  {
    productName: 'Fresh Paneer',
    category: 'Dairy',
    subCategory: 'Paneer',
    description: 'Soft and fresh paneer made from pure buffalo milk.',
    price: 300,
    unit: 'kg',
    stock: 150,
    image: '/uploads/products/fresh_paneer.jpg',
    isAvailable: true,
    isFeatured: true,
    isBestSeller: true
  },
  {
    productName: 'Special Milk Cake',
    category: 'Sweets',
    subCategory: 'Milk Cake',
    description: 'Our signature milk cake made with fresh mawa and premium ingredients.',
    price: 360,
    unit: 'kg',
    stock: 80,
    image: '/uploads/products/milk_cake.jpg',
    isAvailable: true,
    isFeatured: true,
    isBestSeller: true
  },
  {
    productName: 'Spongy Rasgulla',
    category: 'Sweets',
    subCategory: 'Rasgulla',
    description: 'Soft and spongy rasgullas soaked in light sugar syrup. Classic Bengali sweet.',
    price: 260,
    unit: 'kg',
    stock: 120,
    image: '/uploads/products/rasgulla.jpg',
    isAvailable: true,
    isFeatured: true,
    isBestSeller: true
  },
  {
    productName: 'Rasmalai',
    category: 'Sweets',
    subCategory: 'Rasmalai',
    description: 'Creamy Bengali rasmalai with soft chhena patties soaked in saffron-flavored milk.',
    price: 360,
    unit: 'kg',
    stock: 80,
    image: '/uploads/products/rasmalai.jpg',
    isAvailable: true,
    isFeatured: true,
    isBestSeller: true
  },
  {
    productName: 'Mawa Barfi',
    category: 'Sweets',
    subCategory: 'Barfi',
    description: 'Rich and creamy mawa barfi made with fresh khoya.',
    price: 400,
    unit: 'kg',
    stock: 100,
    image: '/uploads/products/barfi.jpg',
    isAvailable: true,
    isFeatured: true,
    isBestSeller: true
  },
  {
    productName: 'Motichoor Laddu',
    category: 'Sweets',
    subCategory: 'Laddu',
    description: 'Premium motichoor laddu made in pure desi ghee with finest boondi.',
    price: 360,
    unit: 'kg',
    stock: 100,
    image: '/uploads/products/laddu.jpg',
    isAvailable: true,
    isFeatured: true,
    isBestSeller: true
  }
];

(async () => {
  try {
    console.log('🔄 Setting up database...');
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✅ Connected to MongoDB');

    // Check existing products
    const count = await Product.countDocuments();
    console.log(`📊 Found ${count} existing products`);

    // Clear and reseed
    console.log('🧹 Clearing old data...');
    await Product.deleteMany({});
    await User.deleteMany({});

    // Insert products
    console.log('⚙️  Seeding products...');
    const seededProducts = await Product.insertMany(products);
    console.log(`✅ Seeded ${seededProducts.length} products`);

    // Create admin
    const salt = await bcryptjs.genSalt(10);
    const hashedPwd = await bcryptjs.hash('Sumittt', salt);
    const admin = await User.create({
      name: 'Admin',
      email: 'b231169@skit.ac.in',
      password: hashedPwd,
      phone: '9876543210',
      role: 'admin'
    });
    console.log(`✅ Created admin user: ${admin.email}`);

    // Verify
    const finalCount = await Product.countDocuments();
    console.log(`\n📈 Final status: ${finalCount} products in database`);
    console.log('✨ Setup complete! Restart your servers to see products.');

    process.exit(0);
  } catch (err) {
    console.error('❌ Error:', err.message);
    process.exit(1);
  }
})();
