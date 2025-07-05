const { body, param, validationResult } = require('express-validator');

const validateProduct = [
  body('name')
    .notEmpty().withMessage('Product name is required')
    .isString().withMessage('Product name must be a string')
    .trim(),
  
  body('description')
    .notEmpty().withMessage('Product description is required')
    .isString().withMessage('Product description must be a string')
    .trim(),
  
  body('category')
    .notEmpty().withMessage('Product category is required')
    .isString().withMessage('Product category must be a string')
    .trim(),
  
  body('price')
    .notEmpty().withMessage('Product price is required')
    .isNumeric().withMessage('Product price must be a number')
    .custom(value => value >= 0).withMessage('Product price must be non-negative'),
  
  body('stock')
    .notEmpty().withMessage('Product stock is required')
    .isInt().withMessage('Product stock must be an integer')
    .custom(value => value >= 0).withMessage('Product stock must be non-negative'),
  
  body('available')
    .optional()
    .isBoolean().withMessage('Product availability must be a boolean'),
  
  body('imageUrl')
    .optional()
    .isURL().withMessage('Product image URL must be a valid URL')
    .trim(),
  
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    next();
  }
];

const validateProductId = [
  param('id')
    .notEmpty().withMessage('Product ID is required')
    .isMongoId().withMessage('Invalid product ID format'),
  
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    next();
  }
];

module.exports = {
  validateProduct,
  validateProductId
}; 