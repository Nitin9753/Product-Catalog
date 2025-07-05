const request = require('supertest');
const mongoose = require('mongoose');
const { createClient } = require('redis');
const { app } = require('../index');
const Product = require('../models/Product');
const { connectRedis } = require('../config/redis');

process.env.NODE_ENV = 'test';

let redisClient;
const testProduct = {
  name: 'Test Product',
  description: 'Product for testing',
  category: 'test',
  price: 9.99,
  stock: 10,
  available: true
};

beforeAll(async () => {
  await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/product-catalog-test');
  
  // Initialize Redis using the application's connection method
  redisClient = await connectRedis();
  
  await redisClient.flushAll();
});

afterAll(async () => {
  await redisClient.quit();
  await mongoose.connection.close();
});

beforeEach(async () => {
  await Product.deleteMany({});
  
  await redisClient.flushAll();
});

describe('Product API', () => {
  describe('POST /products', () => {
    it('should create a new product', async () => {
      const response = await request(app)
        .post('/products')
        .send(testProduct);
      
      expect(response.status).toBe(201);
      expect(response.body).toHaveProperty('_id');
      expect(response.body.name).toBe(testProduct.name);
    });
    
    it('should return validation error for invalid product', async () => {
      const response = await request(app)
        .post('/products')
        .send({ name: 'Invalid Product' }); 
      
      expect(response.status).toBe(400);
      expect(response.body).toHaveProperty('errors');
    });
  });
  
  describe('GET /products', () => {
    it('should return all products', async () => {
      await Product.create(testProduct);
      
      const response1 = await request(app).get('/products');
      expect(response1.status).toBe(200);
      expect(response1.body).toHaveLength(1);
      
      const response2 = await request(app).get('/products');
      expect(response2.status).toBe(200);
      expect(response2.body).toHaveLength(1);
    });
  });
  
  describe('GET /products/:id', () => {
    it('should return a product by ID', async () => {
      const product = await Product.create(testProduct);
      
      const response1 = await request(app).get(`/products/${product._id}`);
      expect(response1.status).toBe(200);
      expect(response1.body.name).toBe(testProduct.name);

      const response2 = await request(app).get(`/products/${product._id}`);
      expect(response2.status).toBe(200);
      expect(response2.body.name).toBe(testProduct.name);
    });
    
    it('should return 404 for non-existent product', async () => {
      const nonExistentId = new mongoose.Types.ObjectId();
      const response = await request(app).get(`/products/${nonExistentId}`);
      expect(response.status).toBe(404);
    });
  });
  
  describe('GET /products with query parameters', () => {
    beforeEach(async () => {
      await Product.create([
        {
          name: 'Phone',
          description: 'smartphone',
          category: 'electronic',
          price: 199.99,
          stock: 50,
          available: true
        },
        {
          name: 'Phone2',
          description: 'smartphone',
          category: 'electronic',
          price: 899.99,
          stock: 20,
          available: true
        },
        {
          name: 'Shoes',
          description: 'Running Shoes',
          category: 'sports',
          price: 79.99,
          stock: 100,
          available: true
        }
      ]);
    });
    
    it('should filter products by category', async () => {
      const response = await request(app).get('/products?category=electronic');
      expect(response.status).toBe(200);
      expect(response.body).toHaveLength(2);
      expect(response.body[0].category).toBe('electronic');
      expect(response.body[1].category).toBe('electronic');
    });
    
    it('should filter products by price range', async () => {
      const response = await request(app).get('/products?price_min=100&price_max=500');
      expect(response.status).toBe(200);
      expect(response.body).toHaveLength(1);
      expect(response.body[0].name).toBe('Phone');
    });
    
    it('should filter products by category and price', async () => {
      const response = await request(app).get('/products?category=electronic&price_min=500');
      expect(response.status).toBe(200);
      expect(response.body).toHaveLength(1);
      expect(response.body[0].name).toBe('Phone2');
    });
  });
  
  describe('PUT /products/:id', () => {
    it('should update a product', async () => {
      const product = await Product.create(testProduct);
      
      const response = await request(app)
        .put(`/products/${product._id}`)
        .send({
          name: 'Updated Product',
          description: 'Updated description',
          category: 'test',
          price: 19.99,
          stock: 20,
          available: true
        });
      
      expect(response.status).toBe(200);
      expect(response.body.name).toBe('Updated Product');
      expect(response.body.price).toBe(19.99);
      
      const cachedProduct = await redisClient.get(`product:${product._id}`);
      expect(cachedProduct).toBeNull();
    });
  });
  
  describe('DELETE /products/:id', () => {
    it('should delete a product', async () => {
      const product = await Product.create(testProduct);
      
      const response = await request(app).delete(`/products/${product._id}`);
      expect(response.status).toBe(200);
      
      const deletedProduct = await Product.findById(product._id);
      expect(deletedProduct).toBeNull();
      
      const cachedProduct = await redisClient.get(`product:${product._id}`);
      expect(cachedProduct).toBeNull();
    });
  });
}); 