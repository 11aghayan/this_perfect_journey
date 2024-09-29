import { T_Admin, T_Permission } from "@/types";

import { db, db_error, Db_no_data } from ".";

export default class Admin_Methods {
  static async get_by_id(id: string) {
    try {
      const { rows } = await db.query(`
        SELECT * 
        FROM admin_tbl 
        WHERE id = $1;`, 
        [id]
      );

      return Db_no_data.check(rows, 'No admin found with the given ID') ?? rows[0] as T_Admin;
    } catch (error) {
      return db_error(error);
    }
  }

  static async get_by_username(username: string) {
    try {
      const { rows } = await db.query(`
        SELECT * 
        FROM admin_tbl 
        WHERE username = $1;`, 
        [username]
      );

      return Db_no_data.check(rows, 'No admin found with the given username') ?? rows[0] as T_Admin;
    } catch (error) {
      return db_error(error);
    }
  }

  static async get_by_refresh_token(token: string) {
    try {
      const { rows } = await db.query(`
        SELECT * 
        FROM admin_tbl 
        WHERE refresh_token = $1;`, 
        [token]
      );
      return Db_no_data.check(rows, 'No admin with the given refresh token') ?? rows[0] as T_Admin;
    } catch (error) {
      return db_error(error);
    }
  }

  static async update_refresh_token(id: string, token: string | null) {
    try {
      await db.query(`
        UPDATE admin_tbl 
        SET refresh_token = $1 
        WHERE id = $2;`, 
        [token, id]
      );
    } catch (error) {
      return db_error(error);
    }
  }
  
  static async get_all() {
    try {
      const { rows } = await db.query('SELECT * FROM admin_tbl;');
      return Db_no_data.check(rows, 'Admins not found') ?? rows as T_Admin[];
    } catch (error) {
      return db_error(error);
    }
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
      return db_error(error);
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
      return db_error(error);
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
      return db_error(error);
    }
  }

  static async change_password(id: string, hash: string) {
    try {
      await db.query(`
        UPDATE admin_tbl
        SET password_hash = $2
        WHERE id = $1;`, 
        [id, hash]
      );
    } catch (error) {
      return db_error(error);
    }
  }
}