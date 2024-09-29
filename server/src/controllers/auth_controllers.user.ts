import bcrypt from 'bcrypt';
import jwt, { JwtPayload, VerifyErrors } from 'jsonwebtoken';

import { T_Controller } from "@/types";
import { custom_error, server_error } from "@/util/errors";
import Db, { Db_no_data } from '@/db';

const ACCESS_TOKEN_SECRET = process.env.ACCESS_TOKEN_SECRET as string;
const REFRESH_TOKEN_SECRET = process.env.REFRESH_TOKEN_SECRET as string;

export const login: T_Controller = async (req, res) => {
  const  { email, password } = req.body;
  
  try {
    const user = await Db.user.get_by_email(email);
    if (user instanceof Db_no_data) return custom_error(res, 403, user.message);
    if ('is_error' in user) return custom_error(res, 500, user.message);
    
    const is_password_correct = await bcrypt.compare(password, user?.password_hash ?? '');
    
    if (!is_password_correct) return custom_error(res, 403, 'Wrong credentials');

    const access_token = jwt.sign(
      { id: user.id }, 
      ACCESS_TOKEN_SECRET,
      { expiresIn: '30m' }
    );
    
    const refresh_token = jwt.sign(
      { id: user.id }, 
      REFRESH_TOKEN_SECRET,
      { expiresIn: '1d' }
    );
    
    await Db.user.update_refresh_token(user.id, refresh_token);
    
    const max_age = 24 * 60 * 60 * 1000; //1 day
    
    res.cookie('jwt', refresh_token, { httpOnly: true, sameSite: 'none', maxAge: max_age, secure: true });
    return res.status(200).json({ access_token, role: user.role, verified: user.verified, method: 'credentials' });
  } catch (error) {
    console.error('Error in user login: ' + error);
    return server_error(res);
  }
};

export const login_google: T_Controller = async (req, res) => {
  const email = req.body.email;
  const name = req.body.name ?? '';
  const profile_photo_url = req.body.profile_photo_url ?? null;
  const google_id = req.body.id ?? null;

  try {
    const user = await Db.user.get_by_email(email);
    if ('is_error' in user) return custom_error(res, 500 ,user.message);

    if (user instanceof Db_no_data) {
      return res.status(200).json({ email, name, profile_photo_url, google_id }); 
    }

    if (!user.verified) {
      const response = await Db.user.verify(user.id);
      if (response?.is_error) return custom_error(res, 500, response.message);
    }

    const access_token = jwt.sign(
      { id: user.id }, 
      ACCESS_TOKEN_SECRET,
      { expiresIn: '30m' }
    );
    
    const refresh_token = jwt.sign(
      { id: user.id }, 
      REFRESH_TOKEN_SECRET,
      { expiresIn: '1d' }
    );
    
    await Db.user.update_refresh_token(user.id, refresh_token);
    
    const max_age = 24 * 60 * 60 * 1000; //1 day
    
    res.cookie('jwt', refresh_token, { httpOnly: true, sameSite: 'none', maxAge: max_age, secure: true });

    return res.status(200).json({ access_token, role: user.role, verified: user.verified, method: 'google' });
  } catch (error) {
    console.error('Error in login_google: ' + error);
    return server_error(res);
  }
};

export const logout: T_Controller = async (req, res) => {
  const { cookies } = req;
  
  if (!cookies.jwt) return res.sendStatus(204);
  const refresh_token = cookies.jwt;
  
  try {
    const user = await Db.user.get_by_refresh_token(refresh_token); 
    if ('is_error' in user) return custom_error(res, 500, user.message); 
    
    if (user instanceof Db_no_data) {
      res.clearCookie('jwt', { httpOnly: true, secure: true, sameSite: 'none' });

      return res.sendStatus(204);
    }
    
    await Db.user.update_refresh_token(user.id, null);
    
    res.clearCookie('jwt', { httpOnly: true, sameSite: 'none', secure: true });

    return res.sendStatus(204);
  } catch (error) {
    console.error('Error in user logout: ' + error);
    return server_error(res);
  }
};

export const refresh_token: T_Controller = async (req, res) => {
  const cookies = req.cookies;
  
  if (!cookies.jwt) return custom_error(res, 401);
  const refresh_token = cookies.jwt;
  
  try {
    const user = await Db.user.get_by_refresh_token(refresh_token);

    if (user instanceof Db_no_data) return custom_error(res, 403);
    if ('is_error' in user) return custom_error(res, 500, user.message);

    const handle_verification = (err: VerifyErrors | null, decoded: JwtPayload | string | undefined) => {
      if (err || user.id !== (decoded as JwtPayload)?.id) return custom_error(res, 403);
      const jwtPayload = decoded as JwtPayload;
      
      const access_token = jwt.sign(
        { jwt_id: jwtPayload.id},
        ACCESS_TOKEN_SECRET,
        { expiresIn: '30m' }
      );

      return res.json({ access_token, role: user.role });
    };

    jwt.verify(
      refresh_token,
      REFRESH_TOKEN_SECRET,
      handle_verification
    );
  } catch (error) {
    console.error('Error in user refresh_token: ' + error);
  }
};

export const register: T_Controller = async (req, res) => {
  const { email, name, password, sex, birthday, verified, profile_photo } = req.body;
  try {
    const password_hash = await bcrypt.hash(password, 10);
    const user = await Db.user.register(email, name, password_hash, verified, sex, birthday);
    if ('is_error' in user) return custom_error(res, 500, user.message);
    
    if (profile_photo) {
      const response = await Db.profile_photo.add(user.id, profile_photo);
      if (response?.is_error) {
        return custom_error(res, 418, `User was created but the profile photo could not be saved. ${response.message}`);
      }
    }
    
    return res.sendStatus(201);
  } catch (error) {
    console.error('Error in user_register: ' + error);
    return server_error(res);
  }
};
