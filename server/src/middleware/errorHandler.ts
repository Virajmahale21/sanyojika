import { Request, Response, NextFunction } from 'express';

export const errorHandler = (err: any, req: Request, res: Response, next: NextFunction): void => {
  console.error('[System Exception]:', err);

  const statusCode = err.statusCode || 500;
  const message =
    err.message ||
    'The requested operation could not be completed due to an internal server condition. Please review the details and try again.';

  res.status(statusCode).json({
    success: false,
    message,
    errors: err.errors || null,
  });
};
