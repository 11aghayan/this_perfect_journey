import { Pool } from 'pg';

import Admin_Methods from './Admin_Methods';
import User_Methods from './User_Methods';
import Profile_Photo_Methods from './Profile_Photo_Methods';

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
    return Admin_Methods; 
  }

  static get user() {
    return User_Methods;
  }

  static get profile_photo() {
    return Profile_Photo_Methods;
  }
}

type T_Pg_Error = {
  detail: string;
};

export const db_error = (e: unknown) => {
  const error = e as T_Pg_Error
  console.error(error);
  return {
    is_error: true,
    message: error.detail
  };
};

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