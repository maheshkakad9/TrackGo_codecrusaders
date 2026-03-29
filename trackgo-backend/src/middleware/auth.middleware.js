const jwt = require('jsonwebtoken');

module.exports = (req, res, next) => {
  let token = req.headers.authorization;

  if (!token) return res.status(401).json({ message: 'No token' });

  // Support Authorization header formats:
  // 1) Bearer <token>
  // 2) raw token (legacy usage)
  if (token.startsWith('Bearer ')) {
    token = token.slice(7).trim();
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (err) {
    console.error('Authentication failed:', err.message);
    res.status(401).json({ message: 'Invalid token' });
  }
};