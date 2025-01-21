import mongoose from 'mongoose';

const orderSchema = new mongoose.Schema({
  orderId: {
    type: String,
    required: true,
    unique: true
  },
  productId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Product',
    required: true
  },
  customerId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Customer',
    required: true
  },
  region: {
    type: String,
    required: true
  },
  saleDate: {
    type: Date,
    required: true
  },
  quantitySold: {
    type: Number,
    required: true
  },
  unitPrice: {
    type: Number,
    required: true
  },
  discount: {
    type: Number,
    required: true
  },
  shippingCost: {
    type: Number,
    required: true
  },
  paymentMethod: {
    type: String,
    required: true
  }
}, { timestamps: true });

export const Order = mongoose.model('Order', orderSchema);