require('dotenv').config();
const mongoose = require('mongoose');
const Product = require('../models/Product');

const products = [
  { name: 'Wireless Mouse', sku: 'ELEC-MS-101', category: 'Electronics', price: 899, quantity: 25, reorderLevel: 10, supplier: 'Logitech India' },
  { name: 'Bluetooth Speaker', sku: 'ELEC-SP-204', category: 'Electronics', price: 2499, quantity: 8, reorderLevel: 10, supplier: 'boAt' },
  { name: 'Laptop 14 inch', sku: 'ELEC-LP-330', category: 'Electronics', price: 54999, quantity: 6, reorderLevel: 5, supplier: 'Lenovo India' },
  { name: 'USB-C Fast Charger', sku: 'ELEC-CH-415', category: 'Electronics', price: 1299, quantity: 40, reorderLevel: 15, supplier: 'Mi India' },
  { name: 'Cotton T-Shirt', sku: 'APRL-TS-512', category: 'Apparel', price: 499, quantity: 60, reorderLevel: 20, supplier: 'Urban Threads' },
  { name: 'Denim Jeans', sku: 'APRL-JN-538', category: 'Apparel', price: 1799, quantity: 18, reorderLevel: 20, supplier: 'Blue Denim Co' },
  { name: 'Study Table', sku: 'FURN-TB-812', category: 'Furniture', price: 3999, quantity: 2, reorderLevel: 4, supplier: 'IKEA India' },
  { name: 'Office Chair', sku: 'FURN-CH-827', category: 'Furniture', price: 6499, quantity: 9, reorderLevel: 5, supplier: 'Godrej Interio' },
  { name: 'Spiral Notebook A4', sku: 'STNY-NB-702', category: 'Stationery', price: 85, quantity: 120, reorderLevel: 50, supplier: 'Classmate' },
  { name: 'Highlighter Set', sku: 'STNY-HL-719', category: 'Stationery', price: 150, quantity: 12, reorderLevel: 15, supplier: 'Camlin' },
  { name: 'Basmati Rice 5kg', sku: 'GROC-RC-901', category: 'Grocery', price: 749, quantity: 30, reorderLevel: 10, supplier: 'India Gate' },
  { name: 'Olive Oil 1L', sku: 'GROC-OL-915', category: 'Grocery', price: 899, quantity: 20, reorderLevel: 15, supplier: 'Figaro' }
];

const seed = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    await Product.deleteMany({});
    await Product.insertMany(products);
    console.log(`${products.length} products inserted`);
  } catch (err) {
    console.error('Seeding failed:', err.message);
    process.exitCode = 1;
  } finally {
    await mongoose.disconnect();
  }
};

seed();
