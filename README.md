# Product Catalog API with Caching

A RESTful API for Product Catalog

## Features

- RESTful API for product management
- Redis caching layer for optimized performance
- MongoDB database for data storage
- Performance monitoring for cache hits/misses
- Comprehensive validation and error handling

## API Endpoints

- `GET /products`: Fetch a list of all products
- `GET /products/{id}`: Fetch detailed information for a specific product
- `GET /products?category={category}&price_min={min}&price_max={max}`: Filter products by category and price range
- `POST /products`: Add a new product (invalidates related caches)
- `PUT /products/{id}`: Update product details (invalidates cache for this specific product)
- `DELETE /products/{id}`: Delete a product (invalidates cache for this product)

## Caching Strategy

- Uses Redis to cache product data
- Caches individual product details and filtered product listings
- Implements cache expiration (10-minute expiry for product listings)
- Invalidates cache when data is modified

## Installation

1. Clone the repository
2. Install dependencies:
   ```bash
   npm install
   ```
3. Create a `.env` file with the following variables:
   ```
   PORT=3000
   MONGODB_URI=mongodb://localhost:27017/product-catalog
   REDIS_URL=redis://localhost:6379
   CACHE_EXPIRY=600 seconds (10min)
   ```

## Usage

1. Start MongoDB and Redis servers
2. Seed the database (optional):
   ```bash
   npm run seed
   ```
3. Start the server:
   ```bash
   npm start
   ```
   For development with auto-reload:
   ```bash
   npm run dev
   ```

## Testing

Run the tests:
```bash
npm test
```

## Performance Monitoring

The API logs performance metrics for each request, including:
- Response time
- Cache hits/misses
- Database query time

## Project Structure

```
src/
  ├── config/         # Configuration files
  ├── controllers/    # Request handlers
  ├── middleware/     # Middleware functions
  ├── models/         # Database models
  ├── routes/         # API routes
  ├── tests/          # Test files
  ├── utils/          # Utility functions
  └── index.js        # Application entry point
``` 