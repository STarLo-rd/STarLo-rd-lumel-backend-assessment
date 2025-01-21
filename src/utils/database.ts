import mongoose from 'mongoose';

export async function connectDB() {
  try {
    await mongoose.connect('mongodb://localhost:27017/sales_data');
    console.log('Connected to MongoDB');
  } catch (error) {
    console.error('MongoDB connection error:', error);
    process.exit(1);
  }
}