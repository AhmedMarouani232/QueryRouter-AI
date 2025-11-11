import mongoose from 'mongoose';
import { Order } from '../models/order.model';
import {connectDB} from "./database"

export async function initDB() {
  await connectDB();
  await Order.deleteMany({}); 
  await Order.insertMany([
    { customerName: 'John Smith', product: 'Laptop', date: new Date('2025-10-15'), amount: 1200 },
    { customerName: 'John Smith', product: 'Phone', date: new Date('2025-10-20'), amount: 800 },
    { customerName: 'Sarah Johnson', product: 'Tablet', date: new Date('2025-10-25'), amount: 500 },
  ]);
}

export async function queryDatabase(criteria: Record<string, any>): Promise<any[]> {
  await connectDB();
  // Handle dateRange specially (e.g., 'last month' -> calculate dates)
  if (criteria.dateRange) {
    const now = new Date();
    let startDate: Date;
    switch (criteria.dateRange) {
      case 'last month':
        startDate = new Date(now.getFullYear(), now.getMonth() - 1, 1);
        break;
      case 'last week':
        startDate = new Date(now.setDate(now.getDate() - 7));
        break;
      default:
        startDate = new Date(0); // All time
    }
    criteria.date = { $gte: startDate };
    delete criteria.dateRange;
  }
  const results = await Order.find(criteria);
  return results.map(doc => doc.toObject());
}