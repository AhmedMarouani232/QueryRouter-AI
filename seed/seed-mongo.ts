import {Order} from "../src/models/order.model"
Order.create([
  { customerName: "John Smith", date: new Date("2025-10-15"), product: "Laptop", amount: 1200 },
  // Add more...
]);