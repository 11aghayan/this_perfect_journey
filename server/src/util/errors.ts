import { Response } from 'express';

import { IntRange } from '@/types';

export const custom_error = (res: Response, status: IntRange<200, 501>, message?: string) => {
  if (!message) return res.sendStatus(status);
  return res.status(status).json({ message });
};

export const server_error = (res: Response) => {
  return res.sendStatus(500);
};