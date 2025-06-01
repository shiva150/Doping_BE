const jwt = require('jsonwebtoken');

module.exports = function(req, res, next) {
  // Get token from header
  // Check Authorization header first, then fallback to x-auth-token for compatibility
  const authHeader = req.header('Authorization');
  let token;

  if (authHeader && authHeader.startsWith('Bearer ')) {
    // Extract token from "Bearer TOKEN"
    token = authHeader.split(' ')[1];
  } else {
    // Fallback to x-auth-token header
    token = req.header('x-auth-token');
  }

  // Check if not token
  if (!token) {
    return res.status(401).json({ msg: 'No token, authorization denied' });
  }

  // Verify token
  try {
    // Ensure you have JWT_SECRET in your .env file
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    req.user = decoded.user;
    next();
  } catch (err) {
    res.status(401).json({ msg: 'Token is not valid' });
  }
}; 