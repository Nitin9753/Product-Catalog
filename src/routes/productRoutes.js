const express = require('express');
const router = express.Router();
const productController = require('../controllers/productController');
const { checkCache } = require('../middleware/cacheMiddleware');
const { validateProduct, validateProductId } = require('../middleware/validationMiddleware');
const CACHE_KEY_PREFIX = 'product';


router.get('/', 
  (req, res, next) => {
    if (Object.keys(req.query).length > 0) {
      return checkCache(CACHE_KEY_PREFIX)(req, res, next);
    }
    return checkCache(CACHE_KEY_PREFIX)(req, res, next);
  },
  (req, res, next) => {
    if (Object.keys(req.query).length > 0) {
      return productController.filterProducts(req, res, next);
    }
    return productController.getAllProducts(req, res, next);
  }
);

router.get('/:id', 
  validateProductId, 
  checkCache(CACHE_KEY_PREFIX), 
  productController.getProductById
);

router.post('/', 
  validateProduct, 
  productController.createProduct
);

router.put('/:id', 
  validateProductId, 
  validateProduct, 
  productController.updateProduct
);

router.delete('/:id', 
  validateProductId, 
  productController.deleteProduct
);

module.exports = router; 