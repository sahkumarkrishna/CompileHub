import jwt from 'jsonwebtoken';

export default function authMiddleware(req, res, next) {
  const token = req.header('Authorization')?.replace('Bearer ', '');
  const JWT_SECRET = process.env.JWT_SECRET || 'compilehub_secret_key_2024';
  
  console.log('Auth middleware - Token exists:', !!token);

  if (!token) {
    return res.status(401).json({ message: 'No token, authorization denied' });
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.id = decoded.userId || decoded.id;
    next();
  } catch (err) {
    console.log('Auth middleware - Token verification failed:', err.message);
    res.status(401).json({ message: 'Token is not valid' });
  }
}