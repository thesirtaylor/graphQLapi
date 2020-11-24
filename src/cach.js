const NodeCache = require("node-cache");

module.exports = {
  Cache: ttlSeconds => {
    return new NodeCache({
      stdTTL: ttlSeconds,
      checkperiod: ttlSeconds * 0.2,
      useClones: false
    });

  }
};