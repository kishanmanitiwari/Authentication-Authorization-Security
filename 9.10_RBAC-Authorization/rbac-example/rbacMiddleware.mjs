// rbacMiddleware.js

import jwt from "jwt-simple";

// Sample database of users and their roles
const users = {
  'admin@example.com': { password: 'admin123', role: 'admin' },
  'user@example.com': { password: 'user123', role: 'user' }
};

const secret = 'your_jwt_secret'; // Replace with a strong secret for JWT

// Middleware to authenticate users based on JWT token
function authenticate(req, res, next) {
  const token = req.cookies.token;

  if (!token) {
    return res.status(401).send('Unauthorized: No token provided');
  }

  try {
    const decoded = jwt.decode(token, secret);
    req.user = users[decoded.email]; // Attach user details to request object
    next();
  } catch (error) {
    return res.status(401).send('Unauthorized: Invalid token');
  }
}

// Middleware to authorize based on role and permission
function authorize(role, permission) {
  return function(req, res, next) {
    const { user } = req;

    if (!user || user.role !== role) {
      return res.status(403).send('Forbidden: Access denied');
    }

    // Check permissions based on role
    if (role === 'admin' || (role === 'user' && permission === 'read_own')) {
      next(); // User has permission, proceed to next middleware or route handler
    } else {
      return res.status(403).send('Forbidden: Access denied');
    }
  };
}

export { authenticate, authorize };