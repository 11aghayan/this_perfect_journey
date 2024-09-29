import { db, db_error, Db_no_data } from ".";

export default class Profile_Photo_Methods {
  static async get(user_id: string) {
    try {
      const { rows } = await db.query(`
        SELECT file 
        FROM profile_photo_tbl
        WHERE user_id = $1;`, 
        [user_id]
      );

      return Db_no_data.check(rows, 'No photo found') ?? rows[0].file as  string;
    } catch (error) {
      return db_error(error);
    }
  }

  static async add(user_id: string, file: string) {
    try {
      await db.query(`
        INSERT INTO profile_photo_tbl(user_id, file) VALUES
        ($1, $2);`, 
        [user_id, file]
      );
    } catch (error) {
      return db_error(error);
    }
  }
}