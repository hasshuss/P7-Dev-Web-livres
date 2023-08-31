const rateLimit = require("express-rate-limit");

function createRateLimiter(nbRequest) {
  return rateLimit({
    windowMs: 15 * 60 * 1000,
    max: nbRequest,            
    message: "Trop de requêtes envoyées depuis cette adresse IP. Veuillez réessayer plus tard."
  });
}

const limiter100 = createRateLimiter(100);
const limiter50 = createRateLimiter(50);

module.exports = {
    createRateLimiter,
    limiter100,
    limiter50
  };