import { Pool } from 'pg';

import { T_Admin } from '@/types';

const {
  PG_USER: user,
  PG_HOST: host,
  PG_DATABASE: database,
  PG_PASSWORD: password
} = process.env;

const port = Number(process.env.PG_PORT ?? 5432);

export const db = new Pool({
  user,
  host,
  database,
  port,
  password
});

export default class Db {
  static async get_admin_by_username(username: string) {
    try {
      const { rows } = await db.query('SELECT * FROM admin_tbl WHERE username = $1;', [username]);

      return Db_no_data.check(rows, 'No user found') ?? rows[0] as T_Admin;
    } catch (error) {
      throw error;
    }
  }

  static async get_admin_by_refresh_token(token: string) {
    const { rows } = await db.query('SELECT * FROM admin_tbl WHERE refresh_token = $1;', [token]);
    return Db_no_data.check(rows, 'No user with the given refresh token') ?? rows[0] as T_Admin;
  }

  static async update_refresh_token_admin(id: string, token: string | null) {
    const { rows } = await db.query(`UPDATE admin_tbl SET refresh_token = $1 WHERE id = $2 RETURNING *;`, [token, id]);
    return Db_no_data.check(rows, 'Refresh token not updated');
  }
  
}

export class Db_no_data {
  message: string;
  success = false;
  constructor(message: string) {
    this.message = message;
  }

  static check(rows: any[], message: string) {
    if (rows.length < 1) return new Db_no_data(message);
  }
}