// Middleware to monitor API performance
const performanceMonitor = (req, res, next) => {
  const startTime = Date.now();
  
  const originalEnd = res.end;
  
  res.end = function(...args) {
    const responseTime = Date.now() - startTime;
    
    console.log({
      method: req.method,
      url: req.originalUrl,
      statusCode: res.statusCode,
      responseTime: `${responseTime}ms`,
      cacheHit: req.cacheHit ? 'Yes' : 'No'
    });
    
    return originalEnd.apply(this, args);
  };
  
  next();
};

module.exports = performanceMonitor; 