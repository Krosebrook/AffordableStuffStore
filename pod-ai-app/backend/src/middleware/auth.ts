import { Request, Response, NextFunction } from 'express';

export const authenticate = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const token = req.headers.authorization?.split(' ')[1];

    if (!token) {
      return res.status(401).json({ error: 'No token provided' });
    }

    // TODO: Verify JWT token
    // const decoded = jwt.verify(token, process.env.JWT_SECRET);
    // req.user = decoded;

    next();
  } catch (error) {
    res.status(401).json({ error: 'Invalid token' });
  }
};

export const authorize = (...roles: string[]) => {
  return (req: Request, res: Response, next: NextFunction) => {
    // TODO: Check user role
    // if (!roles.includes(req.user.role)) {
    //   return res.status(403).json({ error: 'Insufficient permissions' });
    // }
    next();
  };
};
