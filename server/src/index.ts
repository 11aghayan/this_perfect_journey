import 'dotenv/config';
import module_alias from 'module-alias';
module_alias.addAlias('@', __dirname);


import express from 'express';
import cookie_parser from 'cookie-parser';

import '@/namespace';
import { db } from '@/db';
import cors from '@/middleware/cors';
import credentials from '@/middleware/credentials';
import not_found_controller from '@/controllers/not_found_controller';
import auth_router_admin from '@/routes/auth_routes.admin';

const app = express();

// Middleware
app.use(express.json({ limit: '128mb' }));
app.use(cookie_parser());
app.use(credentials);
app.use(cors);

// Routes
app.use('/v1/auth/admin', auth_router_admin);
app.use(not_found_controller);

async function start_server() {
  const PORT = process.env.PORT || 3201;

  try {
    app.listen(PORT, () => console.log(`Server is running on PORT ${PORT}`));
  } catch (error) {
    console.error('Error starting server: ' + error);
  }

  process.on('SIGINT', async () => {
    console.log('Gracefully shutting down');
    await db.end();
    process.exit(0);
  });

  process.on('SIGTERM', async () => {
    console.log('Gracefully shutting down');
    await db.end();
    process.exit(0);
  });
}

start_server();
