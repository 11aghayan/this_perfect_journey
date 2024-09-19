import 'dotenv/config';
import express from 'express';
import cookie_parser from 'cookie-parser';
import { db_client } from './db';
const {  } = 'pg';

const app = express();

// General Middleware
app.use(express.json({ limit: '128mb' }));
app.use(cookie_parser());

async function start_server() {
  const PORT = process.env.PORT || 3201;

  try {
    await db_client.connect();
    app.listen(PORT, () => console.log(`Server is running on PORT ${PORT}`));
  } catch (error) {
    console.error(error);
    await db_client.end();
  }
} 

start_server();