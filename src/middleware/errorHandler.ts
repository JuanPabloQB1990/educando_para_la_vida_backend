import type { Request, Response, NextFunction, RequestHandler } from 'express';

export const errorHandler = (err: any, req: Request, res: Response, next: NextFunction) => {
  const statusCode = err?.statusCode || 500;
  const message = err?.message || 'Internal Server Error';

  res.status(statusCode).json({
    success: false,
    data: null,
    error: {
      statusCode,
      message,
    },
  });
};

export const asyncHandler = (fn: RequestHandler) => {
  return (req: Request, res: Response, next: NextFunction) => {
    Promise.resolve(fn(req, res, next)).catch(next);
  };
};
