import { T_Sex, T_User } from "@/types";

import { db, db_error, Db_no_data } from ".";

export default class User_Methods {
  static async is_email_in_db(email: string) {
    try {
      const { rows } = await db.query(`
        SELECT COUNT(*) 
        FROM user_tbl
        WHERE email = $1;`, 
        [email]
      );

      return rows[0].count > 0;
      
    } catch (error) {
      return db_error(error);
    }
  }

  static async get_by_email(email: string) {
    try {
      const { rows } = await db.query(`
        SELECT * 
        FROM user_tbl
        WHERE email = $1;
        `, 
        [email]
      );

      return Db_no_data.check(rows, 'Wrong credentials') ?? rows[0] as T_User;
    } catch (error) {
      return db_error(error);
    }
  }

  static async get_by_id(id: string) {
    try {
      const { rows } = await db.query(`
        SELECT *
        FROM user_tbl
        WHERE id = $1;`, 
        [id]
      );

      return Db_no_data.check(rows, 'No user found with the given ID') ?? rows[0] as T_User; 
    } catch (error) {
      return db_error(error);
    }
  }

  static async update_refresh_token(id: string, token: string | null) {
    try {
      await db.query(`
        UPDATE user_tbl 
        SET refresh_token = $1 
        WHERE id = $2;`, 
        [token, id]
      );
    } catch (error) {
      return db_error(error);
    }
  }

  static async get_by_refresh_token(token: string) {
    try {
      const { rows } = await db.query(`
        SELECT *
        FROM user_tbl
        WHERE refresh_token = $1;`, 
        [token]
      );

      return Db_no_data.check(rows, 'Wrong credentials') ?? rows[0] as T_User;
    } catch (error) {
      return db_error(error);
    }
  }

  static async register(
    { email, name, verified, password_hash = null, sex = null, birthday = null, nationality = null }:
    {
      email: string; 
      name: string; 
      password_hash: string | null; 
      verified: boolean; 
      sex: T_Sex | null; 
      birthday: string | null;
      nationality: string | null
    }
    ) {
    try {
      const { rows } = await db.query(`
        INSERT INTO user_tbl(email, name, password_hash, verified, birthday, sex, nationality) VALUES
        ($1, $2, $3, $4, $5, $6, $7)
        RETURNING *;`, 
        [email, name, password_hash, verified, birthday, sex, nationality]
      );
      
      return rows[0] as T_User;
    } catch (error) {
      return db_error(error);
    }
  }

  static async delete_by_id(id: string) {
    try {
      await db.query(`
        DELETE FROM user_tbl
        WHERE id = $1;`, 
        [id]
      );
    } catch (error) {
      return db_error(error);
    }
  }

  static async verify(email: string) {
    try {
      await db.query(`
        UPDATE user_tbl
        SET verified = TRUE
        WHERE email = $1;`, 
        [email]
      );
    } catch (error) {
      return db_error(error);
    }
  }

  static async update_password(email: string, password_hash: string) {
    try {
      await db.query(`
        UPDATE user_tbl
        SET password_hash = $2
        WHERE email = $1;`, 
        [email, password_hash]
      );
    } catch (error) {
      return db_error(error);
    }
  }

  static async update_info({ id, name, birthday = null, nationality = null, sex = null }: { 
    id: string, 
    name: string, 
    sex: T_Sex | null, 
    birthday: string | null, 
    nationality: string | null 
  }) {
    try {
      await db.query(`
        UPDATE user_tbl
        SET name = $1,
            birthday = $2,
            nationality = $3,
            sex = $4
        WHERE id = $5;`, 
        [name, birthday, nationality, sex, id]
      );
    } catch (error) {
      return db_error(error);
    }
  }

  static async change_password(id: string, password_hash: string) {
    try {
      await db.query(`
        UPDATE user_tbl
        SET password_hash = $1
        WHERE id = $2;`, 
        [password_hash, id]
      );
    } catch (error) {
      return db_error(error);
    }
  }
}