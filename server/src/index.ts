import 'module-alias/register';
import 'dotenv/config';
import express from 'express';
import cookie_parser from 'cookie-parser';
import { db } from '@/db';
import cors from '@/middleware/cors';
import credentials from '@/middleware/credentials';

const app = express();

// General Middleware
app.use(express.json({ limit: '128mb' }));
app.use(cookie_parser());
app.use(credentials);
app.use(cors);

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
