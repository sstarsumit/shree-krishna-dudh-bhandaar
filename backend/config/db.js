import mongoose from 'mongoose';

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGODB_URI, {
      serverSelectionTimeoutMS: 5000, // fail fast if DB unreachable
      socketTimeoutMS: 45000
    });
    console.log(`MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error(`MongoDB connection error: ${error.message}`);
    // Don't exit the process here so the server can start for debugging
    // The app should handle DB unavailability in route handlers instead.
  }
};

// Graceful shutdown for development/production
const gracefulShutdown = async () => {
  try {
    await mongoose.disconnect();
    console.log('MongoDB disconnected through app termination');
    process.exit(0);
  } catch (err) {
    console.error('Error during MongoDB disconnect', err);
    process.exit(1);
  }
};

process.on('SIGINT', gracefulShutdown);
process.on('SIGTERM', gracefulShutdown);

export default connectDB;
