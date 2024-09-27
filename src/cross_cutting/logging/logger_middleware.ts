import { Request, Response, NextFunction } from 'express';
import logger from './logger';

export const loggerMiddleware = (req: Request, res: Response, next: NextFunction): void => {
  const start = Date.now();
  res.on('finish', () => {
    const duration = Date.now() - start;
    // console.log(req.body);
    // console.log(req.headers);
    const origin = req.headers.origin || 'unknown origin';
    const message = `Origin: ${origin} - ${req.method} ${req.originalUrl} ${res.statusCode} ${duration}ms`;
    
    if (res.statusCode >= 400) {
      logger.error(message);
    } else {
      logger.info(message);
    }
  });
  next();
};