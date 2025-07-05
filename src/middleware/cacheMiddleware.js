const { getRedisClient } = require('../config/redis');

// Default cache expiry (10 minutes)
const DEFAULT_EXPIRY = process.env.CACHE_EXPIRY || 600;

/**
 * Middleware to check cache before proceeding to controller
 * @param {string} keyPrefix - Prefix for the cache key
 * @returns {Function} Express middleware
 */
const checkCache = (keyPrefix) => {
  return async (req, res, next) => {
    try {
      const cacheKey = generateCacheKey(keyPrefix, req);
      
      const startTime = Date.now();
      
      const redisClient = getRedisClient();
      
      const cachedData = await redisClient.get(cacheKey);
      
      if (cachedData) {
        const endTime = Date.now();
        console.log(`Cache HIT: ${cacheKey}, Response time: ${endTime - startTime}ms`);
        
        return res.json(JSON.parse(cachedData));
      }
      
      console.log(`Cache MISS: ${cacheKey}`);
      
      req.cacheKey = cacheKey;
      next();
    } catch (error) {
      console.error('Cache middleware error:', error);
      next();
    }
  };
};

/**
 * Helper function to set data in cache
 * @param {string} key - Cache key
 * @param {Object} data - Data to cache
 * @param {number} expiry - Cache expiry in seconds
 */
const setCacheData = async (key, data, expiry = DEFAULT_EXPIRY) => {
  try {
    const redisClient = getRedisClient();
    await redisClient.setEx(key, expiry, JSON.stringify(data));
  } catch (error) {
    console.error('Error setting cache:', error);
  }
};

/**
 * Helper function to invalidate cache
 * @param {string} pattern - Cache key pattern to invalidate
 */
const invalidateCache = async (pattern) => {
  try {
    const redisClient = getRedisClient();
    
    const keys = await redisClient.keys(pattern);
    
    if (keys.length > 0) {
      await redisClient.del(keys);
      console.log(`Invalidated cache keys: ${keys.join(', ')}`);
    }
  } catch (error) {
    console.error('Error invalidating cache:', error);
  }
};

/**
 * Generate a unique cache key based on the request
 * @param {string} prefix - Key prefix
 * @param {Object} req - Express request object
 * @returns {string} Cache key
 */
const generateCacheKey = (prefix, req) => {
  if (req.params && req.params.id) {
    return `${prefix}:${req.params.id}`;
  } else if (Object.keys(req.query).length > 0) {
    const queryString = Object.entries(req.query)
      .sort(([keyA], [keyB]) => keyA.localeCompare(keyB))
      .map(([key, value]) => `${key}=${value}`)
      .join('&');
    return `${prefix}:query:${queryString}`;
  }
  
  return `${prefix}:all`;
};

module.exports = {
  checkCache,
  setCacheData,
  invalidateCache
}; 