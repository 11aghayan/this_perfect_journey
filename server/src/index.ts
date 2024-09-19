import 'module-alias/register';
import 'dotenv/config';
import express from 'express';
import cookie_parser from 'cookie-parser';
import { db } from '@/db';

const app = express();

// General Middleware
app.use(express.json({ limit: '128mb' }));
app.use(cookie_parser());

async function start_server() {
  const PORT = process.env.PORT || 3201;

  try {
    await db.connect();
    app.listen(PORT, () => console.log(`Server is running on PORT ${PORT}`));
  } catch (error) {
    console.error(error);
    await db.end();
  }
}

start_server();
