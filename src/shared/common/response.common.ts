import { Response } from 'express';

export function successResponse(res: Response, message: string) {
  return res.status(200).json({
    status: true,
    message,
  });
}
