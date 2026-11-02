import jwt from 'jsonwebtoken';

const JWT_TTL = '7d';

export function signToken(payload) {
  const secret = process.env.JWT_SECRET;
  if (!secret) {
    throw new Error('JWT_SECRET is required');
  }
  return jwt.sign(payload, secret, { expiresIn: JWT_TTL });
}

export function verifyToken(token) {
  const secret = process.env.JWT_SECRET;
  if (!secret) {
    throw new Error('JWT_SECRET is required');
  }
  return jwt.verify(token, secret);
}

export function authRequired(req, res, next) {
  const header = req.headers.authorization || '';
  const [, token] = header.split(' ');

  if (!token) {
    return res.status(401).json({ error: 'Missing token' });
  }

  try {
    const payload = verifyToken(token);
    req.user = payload;
    next();
  } catch (error) {
    return res.status(401).json({ error: 'Invalid token' });
  }
}

export function staffRequired(req, res, next) {
  if (!req.user || req.user.role !== 'staff') {
    return res.status(403).json({ error: 'Staff role required' });
  }
  return next();
}
