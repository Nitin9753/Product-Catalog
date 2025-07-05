const Product = require('../models/Product');
const { setCacheData, invalidateCache } = require('../middleware/cacheMiddleware');

const CACHE_KEY_PREFIX = 'product';

const getAllProducts = async (req, res) => {
  try {
    const startTime = Date.now();
    
    const products = await Product.find();
    
    const responseTime = Date.now() - startTime;
    console.log(`DB Query time: ${responseTime}ms`);
    
    if (req.cacheKey) {
      await setCacheData(req.cacheKey, products);
    }
    
    res.json(products);
  } catch (error) {
    console.error('Error fetching products:', error);
    res.status(500).json({ message: 'Error fetching products', error: error.message });
  }
};

const getProductById = async (req, res) => {
  try {
    const { id } = req.params;
    
    const startTime = Date.now();
    
    const product = await Product.findById(id);
    
    const responseTime = Date.now() - startTime;
    console.log(`DB Query time: ${responseTime}ms`);
    
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }
    
    if (req.cacheKey) {
      await setCacheData(req.cacheKey, product);
    }
    
    res.json(product);
  } catch (error) {
    console.error('Error fetching product:', error);
    res.status(500).json({ message: 'Error fetching product', error: error.message });
  }
};

const filterProducts = async (req, res) => {
  try {
    const { category, price_min, price_max, available } = req.query;
    
    const filter = {};
    
    if (category) {
      filter.category = category;
    }
    
    if (price_min !== undefined || price_max !== undefined) {
      filter.price = {};
      if (price_min !== undefined) {
        filter.price.$gte = Number(price_min);
      }
      if (price_max !== undefined) {
        filter.price.$lte = Number(price_max);
      }
    }
    
    if (available !== undefined) {
      filter.available = available === 'true';
    }
    
    const startTime = Date.now();
    
    const products = await Product.find(filter);
    
    const responseTime = Date.now() - startTime;
    console.log(`DB Query time: ${responseTime}ms`);
    
    if (req.cacheKey) {
      await setCacheData(req.cacheKey, products);
    }
    
    res.json(products);
  } catch (error) {
    console.error('Error filtering products:', error);
    res.status(500).json({ message: 'Error filtering products', error: error.message });
  }
};

const createProduct = async (req, res) => {
  try {
    const productData = req.body;
    const newProduct = await Product.create(productData);
    await invalidateCache(`${CACHE_KEY_PREFIX}:all`);
    await invalidateCache(`${CACHE_KEY_PREFIX}:query:*`);
    res.status(201).json(newProduct);
  } catch (error) {
    console.error('Error creating product:', error);
    res.status(400).json({ message: 'Error creating product', error: error.message });
  }
};

const updateProduct = async (req, res) => {
  try {
    const { id } = req.params;
    const updateData = req.body;
    
    const oldProduct = await Product.findById(id);
    
    if (!oldProduct) {
      return res.status(404).json({ message: 'Product not found' });
    }
    
    const updatedProduct = await Product.findByIdAndUpdate(
      id,
      updateData,
      { new: true, runValidators: true }
    );
    
    await invalidateCache(`${CACHE_KEY_PREFIX}:${id}`);
    
    await invalidateCache(`${CACHE_KEY_PREFIX}:all`);
    
    await invalidateCache(`${CACHE_KEY_PREFIX}:query:*`);
    
    res.json(updatedProduct);
  } catch (error) {
    console.error('Error updating product:', error);
    res.status(400).json({ message: 'Error updating product', error: error.message });
  }
};

const deleteProduct = async (req, res) => {
  try {
    const { id } = req.params;
    
    const product = await Product.findById(id);
    
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }
    
    await Product.findByIdAndDelete(id);
    
    await invalidateCache(`${CACHE_KEY_PREFIX}:${id}`);
    
    await invalidateCache(`${CACHE_KEY_PREFIX}:all`);
    
    await invalidateCache(`${CACHE_KEY_PREFIX}:query:*`);
    
    
    res.status(200).json({ message: 'Product deleted successfully' });
  } catch (error) {
    console.error('Error deleting product:', error);
    res.status(500).json({ message: 'Error deleting product', error: error.message });
  }
};

module.exports = {
  getAllProducts,
  getProductById,
  filterProducts,
  createProduct,
  updateProduct,
  deleteProduct
}; 