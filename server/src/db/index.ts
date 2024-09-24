import { Pool } from 'pg';

import { T_Admin, T_Permission } from '@/types';

type T_Pg_Error = {
  detail: string;
};

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

  static get admin() {
    return AdminMethods; 
  }
}

class AdminMethods {
  static async get_by_id(id: string) {
    try {
      const { rows } = await db.query(`
        SELECT * FROM admin_tbl 
        WHERE id = $1;`, 
        [id]
      );

      return Db_no_data.check(rows, 'No admin found with the given ID') ?? rows[0] as T_Admin;
    } catch (error) {
      throw error;
    }
  }

  static async get_by_username(username: string) {
    try {
      const { rows } = await db.query(`
        SELECT * FROM admin_tbl 
        WHERE username = $1;`, 
        [username]
      );

      return Db_no_data.check(rows, 'No admin found with the given username') ?? rows[0] as T_Admin;
    } catch (error) {
      throw error;
    }
  }

  static async get_by_refresh_token(token: string) {
    const { rows } = await db.query(`
      SELECT * FROM admin_tbl 
      WHERE refresh_token = $1;`, 
      [token]
    );
    return Db_no_data.check(rows, 'No admin with the given refresh token') ?? rows[0] as T_Admin;
  }

  static async update_refresh_token(id: string, token: string | null) {
    await db.query(`
      UPDATE admin_tbl 
      SET refresh_token = $1 
      WHERE id = $2;`, 
      [token, id]
    );
  }
  
  static async get_all() {
    const { rows } = await db.query('SELECT * FROM admin_tbl;');
    return Db_no_data.check(rows, 'Admins not found') ?? rows as T_Admin[];
  }
  
  static async create(username: string, password_hash: string, permission: T_Permission) {
    try {
      await db.query(`
        INSERT INTO admin_tbl (username, password_hash, permission) VALUES 
        (
          $1,
          $2,
          $3
        );`, 
        [username, password_hash, permission]
      );
    } catch (error) {
      const err = error as T_Pg_Error;
      console.error(err);
      return {
        is_error: true,
        message: err.detail
      };
    }
  }

  static async update(username: string, permission: T_Permission, id: string) {
    try {
      await db.query(`
        UPDATE admin_tbl
        SET username = $1,
            permission = $2,
            refresh_token = NULL
        WHERE id = $3;`,   
        [username, permission, id]
      );
    } catch (error) {
      const err = error as T_Pg_Error;
      console.error(err);
      return {
        is_error: true,
        message: err.detail
      };
    }
  }

  static async delete(id: string) {
    try {
      await db.query(`
        DELETE FROM admin_tbl
        WHERE id = $1;`, 
        [id]
      );
    } catch (error) {
      const err = error as T_Pg_Error;
      console.error(err);
      return {
        is_error: true,
        message: err.detail
      };
    }
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
