import { NextFunction, Request, Response } from "express";
import { allowed_origins } from "@/config/cors_options";

export default function credentials (req: Request, res: Response, next: NextFunction) {
  const { origin } = req.headers;
  
  if (origin && allowed_origins.includes(origin)) {
    res.header('Access-Control-Allow-Credentials', 'true');
  }
  next();
}