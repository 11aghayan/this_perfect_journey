import bcrypt from 'bcrypt';
import jwt, { JwtPayload, VerifyErrors } from 'jsonwebtoken';

import type { T_Controller } from "@/types";
import { custom_error, server_error } from "@/util/errors";
import Db, { Db_no_data } from "@/db";

export const login: T_Controller = async (req, res) => {
  const { username, password } = req.body;
  
  try {
    const admin = await Db.get_admin_by_username(username);

    if (admin instanceof Db_no_data) {
      return custom_error(res, 401, 'Wrong Credentials');
    }

    const is_password_correct = await bcrypt.compare(password, admin.password_hash);
    if (!is_password_correct) return custom_error(res, 401, 'Wrong Credentials');
    
    const access_token = jwt.sign(
      { username: admin.username }, 
      process.env.ACCESS_TOKEN_SECRET,
      { expiresIn: '30m' }
    );
    
    const refresh_token = jwt.sign(
      { username: admin.username }, 
      process.env.REFRESH_TOKEN_SECRET,
      { expiresIn: '1d' }
    );
    
    const update_response = await Db.update_refresh_token_admin(admin.id, refresh_token);
    
    if (update_response instanceof Db_no_data) return res.status(400).json({ message: update_response.message });
    
    const max_age = 24 * 60 * 60 * 1000; //1 day
    
    res.cookie('jwt', refresh_token, { httpOnly: true, sameSite: 'none', maxAge: max_age, secure: true });;
    return res.status(200).json({ access_token });
    
  } catch (error) {
    console.error('Error in admin login');
    return server_error(res);
  }
};

export const logout: T_Controller = async (req, res) => {
  const { cookies } = req;
  
  if (!cookies.jwt) return res.sendStatus(204);
  const refresh_token = cookies.jwt;

  try {
    const admin = await Db.get_admin_by_refresh_token(refresh_token);  
    
    if (admin instanceof Db_no_data) {
      res.clearCookie('jwt', { httpOnly: true, secure: true, sameSite: 'none' });

      return res.sendStatus(204);
    }
    
    const update_response = await Db.update_refresh_token_admin(admin.id, null);
    if (update_response instanceof Db_no_data) return res.status(400).json({ message: update_response.message });
    
    res.clearCookie('jwt', { httpOnly: true, sameSite: 'none', secure: true });

    return res.sendStatus(204);
  } catch (error) {
    console.error('Error in admin logout');
    return server_error(res);
  }
};

export const refresh_token: T_Controller = async (req, res) => {
  const cookies = req.cookies;
  
  if (!cookies.jwt) return custom_error(res, 401);
  const refresh_token = cookies.jwt;
   try {
    const admin = await Db.get_admin_by_refresh_token(refresh_token);

    if (admin instanceof Db_no_data) return custom_error(res, 403);

    const handle_verification = (err: VerifyErrors | null, decoded: JwtPayload | string | undefined) => {
      if (err || admin.username !== (decoded as JwtPayload)?.username) return custom_error(res, 403);
      const jwtPayload = decoded as JwtPayload;
      
      const access_token = jwt.sign(
        { username: jwtPayload.username},
        process.env.ACCESS_TOKEN_SECRET!,
        { expiresIn: '30m' }
      );

      return res.json({ access_token });
    };

    jwt.verify(
      refresh_token,
      process.env.REFRESH_TOKEN_SECRET,
      handle_verification
    );
  } catch (error) {
    console.error('Error in admin refresh token');
    return server_error(res);
  }
};

