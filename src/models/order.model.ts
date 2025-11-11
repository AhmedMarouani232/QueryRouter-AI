import mongoose from 'mongoose';
const orderSchema = new mongoose.Schema({
  customerName: String,
  date: Date,
  product: String,
  amount: Number,
});
export const Order = mongoose.model('Order', orderSchema);