const mongoose = require('mongoose');
const Product = require('../models/Product');
require('dotenv').config();

const products = [
  {
    name: 'Smartphone',
    description: 'Latest smartphone',
    category: 'electronic',
    price: 999,
    stock: 50,
    available: true,
    imageUrl: 'https://example.com/smartphone.jpg'
  },
  {
    name: 'Laptop',
    description: 'laptop for professionals',
    category: 'electronic',
    price: 1500,
    stock: 30,
    available: true,
    imageUrl: 'https://example.com/laptop.jpg'
  },
  {
    name: 'Headphones',
    description: 'Wireless headphones',
    category: 'electronic',
    price: 199,
    stock: 100,
    available: true,
    imageUrl: 'https://example.com/wireless-headphones.jpg'
  },
  {
    name: 'Shoes',
    description: 'Running shoes',
    category: 'sports',
    price: 89,
    stock: 200,
    available: true,
    imageUrl: 'https://example.com/running-shoes.jpg'
  },
  {
    name: 'Mat',
    description: 'Mat for exercise',
    category: 'sports',
    price: 29,
    stock: 150,
    available: true,
    imageUrl: 'https://example.com/yoga-mat.jpg'
  },
  {
    name: 'Coffee',
    description: 'Coffee',
    category: 'home',
    price: 80,
    stock: 80,
    available: true,
    imageUrl: 'https://example.com/coffee-maker.jpg'
  },
  {
    name: 'Chess',
    description: 'Chess',
    category: 'Games',
    price: 100,
    stock: 120,
    available: true,
    imageUrl: 'https://example.com/games.jpg'
  },
  {
    name: 'T-shirt',
    description: 'T-shirt',
    category: 'Clothing',
    price: 20,
    stock: 300,
    available: true,
    imageUrl: 'https://example.com/t-shirt.jpg'
  },
  {
    name: 'Jeans',
    description: 'Classic blue jeans',
    category: 'clothing',
    price: 39.99,
    stock: 200,
    available: true,
    imageUrl: 'https://example.com/jeans.jpg'
  },
  {
    name: 'Novel',
    description: 'Bestselling fiction novel',
    category: 'books',
    price: 14.99,
    stock: 500,
    available: true,
    imageUrl: 'https://example.com/novel.jpg'
  }
];

const seedDatabase = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/product-catalog');
    console.log('Connected to MongoDB');
    
    await Product.deleteMany({});
    console.log('Cleared existing products');
    
    await Product.insertMany(products);
    console.log('Database seeded with sample products');
    
    await mongoose.disconnect();
    console.log('Disconnected from MongoDB');
    
    process.exit(0);
  } catch (error) {
    console.error('Error seeding database:', error);
    process.exit(1);
  }
};

seedDatabase(); 