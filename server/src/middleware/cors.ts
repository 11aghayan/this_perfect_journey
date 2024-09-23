import { Request, Response, NextFunction } from "express";
import { cors_config, allowed_origins } from '@/config/cors_options';

export default function cors(req: Request, res: Response, next: NextFunction) {
  const origin = req.get('origin');

  if (origin && allowed_origins.includes(origin)) {
    cors_config(req, res, next);
  } else {
    next();
  }
}