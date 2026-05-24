import dotenv from 'dotenv';
import mongoose from 'mongoose';
import Product from '../models/Product.js';

dotenv.config();

const main = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    const count = await Product.countDocuments();
    const first = await Product.findOne().select('productName isAvailable');
    console.log('products_count:', count);
    if (first) console.log('sample:', first.productName, 'isAvailable:', first.isAvailable);
    await mongoose.disconnect();
    process.exit(0);
  } catch (err) {
    console.error('error:', err.message || err);
    process.exit(1);
  }
};

main();
