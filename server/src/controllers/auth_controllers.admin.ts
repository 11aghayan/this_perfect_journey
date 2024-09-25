import bcrypt from 'bcrypt';
import jwt, { JwtPayload, VerifyErrors } from 'jsonwebtoken';

import type { T_Controller } from "@/types";
import { custom_error, server_error } from "@/util/errors";
import Db, { Db_no_data } from "@/db";

const REFRESH_TOKEN_SECRET = process.env.REFRESH_TOKEN_SECRET;
const ACCESS_TOKEN_SECRET = process.env.ACCESS_TOKEN_SECRET;

export const login: T_Controller = async (req, res) => {
  const { username, password } = req.body;
  
  try {
    const admin = await Db.admin.get_by_username(username);

    if (admin instanceof Db_no_data) return custom_error(res, 401, 'Wrong Credentials');
    if ('is_error' in admin) return custom_error(res, 500, admin.message);

    const is_password_correct = await bcrypt.compare(password, admin.password_hash);
    if (!is_password_correct) return custom_error(res, 401, 'Wrong Credentials');
    
    const access_token = jwt.sign(
      { id: admin.id }, 
      ACCESS_TOKEN_SECRET,
      { expiresIn: '30m' }
    );
    
    const refresh_token = jwt.sign(
      { id: admin.id }, 
      REFRESH_TOKEN_SECRET,
      { expiresIn: '1d' }
    );
    
    await Db.admin.update_refresh_token(admin.id, refresh_token);
    
    const max_age = 24 * 60 * 60 * 1000; //1 day
    
    res.cookie('jwt', refresh_token, { httpOnly: true, sameSite: 'none', maxAge: max_age, secure: true });;
    return res.status(200).json({ access_token, role: admin.role });
    
  } catch (error) {
    console.error('Error in admin login: ' + error);
    return server_error(res);
  }
};

export const logout: T_Controller = async (req, res) => {
  const { cookies } = req;
  
  if (!cookies.jwt) return res.sendStatus(204);
  const refresh_token = cookies.jwt;

  try {
    const admin = await Db.admin.get_by_refresh_token(refresh_token); 
    if ('is_error' in admin) return custom_error(res, 500, admin.message); 
    
    if (admin instanceof Db_no_data) {
      res.clearCookie('jwt', { httpOnly: true, secure: true, sameSite: 'none' });

      return res.sendStatus(204);
    }
    
    await Db.admin.update_refresh_token(admin.id, null);
    
    res.clearCookie('jwt', { httpOnly: true, sameSite: 'none', secure: true });

    return res.sendStatus(204);
  } catch (error) {
    console.error('Error in admin logout: ' + error);
    return server_error(res);
  }
};

export const refresh_token: T_Controller = async (req, res) => {
  const cookies = req.cookies;
  
  if (!cookies.jwt) return custom_error(res, 401);
  const refresh_token = cookies.jwt;
   try {
    const admin = await Db.admin.get_by_refresh_token(refresh_token);

    if (admin instanceof Db_no_data) return custom_error(res, 403);
    if ('is_error' in admin) return custom_error(res, 500, admin.message);

    const handle_verification = (err: VerifyErrors | null, decoded: JwtPayload | string | undefined) => {
      if (err || admin.id !== (decoded as JwtPayload)?.id) return custom_error(res, 403);
      const jwtPayload = decoded as JwtPayload;
      
      const access_token = jwt.sign(
        { jwt_id: jwtPayload.id},
        ACCESS_TOKEN_SECRET,
        { expiresIn: '30m' }
      );

      return res.json({ access_token, role: admin.role });
    };

    jwt.verify(
      refresh_token,
      REFRESH_TOKEN_SECRET,
      handle_verification
    );
  } catch (error) {
    console.error('Error in admin refresh token: ' + error);
    return server_error(res);
  }
};

