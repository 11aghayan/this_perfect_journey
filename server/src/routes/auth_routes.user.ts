import express from 'express';

import { check_email_defined, check_email_in_db, check_email_valid, check_name_defined, check_password_defined, check_password_valid, check_sex_valid, check_verification_code_defined, check_verified_defined, optimize_profile_photo, parse_birthday } from '@/middleware/check_body';
import { login, login_google, logout, refresh_token, register } from '@/controllers/auth_controllers.user';import { verify_google_id_token } from '@/middleware/verify_google';
;



const auth_router_user = express.Router();

auth_router_user.post('/login', check_email_defined, check_password_defined, login);
auth_router_user.post('/login-google', verify_google_id_token, login_google);
auth_router_user.get('/logout', logout);

auth_router_user.post(
  '/register', 
  check_email_defined, 
  check_name_defined, 
  check_password_defined, 
  check_email_valid,
  check_password_valid,
  check_email_in_db,
  parse_birthday,
  check_sex_valid,
  check_verified_defined,
  optimize_profile_photo,
  register
);

auth_router_user.get('/refresh', refresh_token);

export default auth_router_user;