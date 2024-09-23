import { IntRange } from '@/types';
import { Response } from 'express';

export const custom_error = (res: Response, status: IntRange<101, 500>, message: string) => {
  return res.status(status).json({ message });
};