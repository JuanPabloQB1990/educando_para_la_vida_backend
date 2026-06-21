import { Request, Response, NextFunction } from 'express';
import { ZodError, ZodSchema } from 'zod';
import { AppError } from '../error/AppError';

export const validate =
  (schema: ZodSchema, source: 'body' | 'query' | 'params' = 'body') =>
  (req: Request, _res: Response, next: NextFunction) => {
    try {

      const parsed = schema.parse(req[source]);

      req.validated = req.validated ?? {};
      req.validated[source] = parsed;
      next();

    } catch (error) {

      if (error instanceof ZodError) {
        return next(
          new AppError(
            400,
            error.issues.map(i => i.message).join(', ')
          )
        );
      }

      next(error);
    }
  };