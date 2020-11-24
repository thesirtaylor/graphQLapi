const jwt = require("jsonwebtoken");

module.exports = {
  getUser: token => {
    if (token) {
      try {
        return jwt.verify(token, process.env.JWT_SECRET);
      } catch (error) {
        throw new Error(`Session Invalid`);
      }
    }
  }
};
