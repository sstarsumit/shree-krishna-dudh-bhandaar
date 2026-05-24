import dotenv from 'dotenv';
import mongoose from 'mongoose';
import User from '../models/User.js';

dotenv.config();

const uri = process.env.MONGODB_URI;
if (!uri) {
  console.error('MONGODB_URI not set in backend/.env');
  process.exit(1);
}

const main = async () => {
  try {
    await mongoose.connect(uri, {
      useNewUrlParser: true,
      useUnifiedTopology: true
    });

    const admin = await User.findOne({ role: 'admin' }).select('-password');
    if (!admin) {
      console.error('No admin user found');
      await mongoose.disconnect();
      process.exit(1);
    }

    console.log('admin_id:', admin._id.toString());
    console.log('admin_email:', admin.email);

    await mongoose.disconnect();
    process.exit(0);
  } catch (err) {
    console.error('Error fetching admin:', err.message || err);
    process.exit(1);
  }
};

main();
