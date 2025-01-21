import mongoose from 'mongoose';

const customerSchema = new mongoose.Schema({
  customerId: {
    type: String,
    required: true,
    unique: true
  },
  name: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true
  },
  address: {
    type: String,
    required: true
  }
}, { timestamps: true });

export const Customer = mongoose.model('Customer', customerSchema);