import { Client } from 'pg';

const {
  PG_USER: user,
  PG_HOST: host,
  PG_DATABASE: database,
  PG_PASSWORD: password
} = process.env;

const port = Number(process.env.PG_PORT ?? 5432);

export const db = new Client({
  user,
  host,
  database,
  port,
  password
});
