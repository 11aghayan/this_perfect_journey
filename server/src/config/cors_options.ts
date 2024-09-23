import cors_raw from 'cors';

export const allowed_origins = [
  'http://localhost:3000',
  'http://localhost:3001'
];

export const cors_config = cors_raw({
  origin: [allowed_origins[0], allowed_origins[1]],
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true
});