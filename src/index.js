const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
require('dotenv').config();

const productRoutes = require('./routes/productRoutes');
const { connectRedis } = require('./config/redis');

const app = express();
const PORT = process.env.PORT || 3000;

let server;

app.use(express.json());
app.use(cors());
app.use(helmet());
app.use(morgan('dev'));
app.use(require('./utils/performanceMonitor'));

app.use('/products', productRoutes);

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({
    success: false,
    message: 'Internal Server Error',
    error: process.env.NODE_ENV === 'development' ? err.message : undefined
  });
});

if (process.env.NODE_ENV !== 'test') {
  mongoose
    .connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/product-catalog')
    .then(() => {
      console.log('Connected to MongoDB');
      connectRedis().then(() => {
        console.log('Connected to Redis');
        
        server = app.listen(PORT, () => {
          console.log(`Server running on port ${PORT}`);
        });
      }).catch(err => {
        console.error('Redis connection error:', err);
      });
    })
    .catch((err) => {
      console.error('MongoDB connection error:', err);
    });
}

module.exports = { app, server }; 