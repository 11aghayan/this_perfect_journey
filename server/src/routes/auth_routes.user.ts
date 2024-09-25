import express from 'express';

import { check_email_defined, check_email_in_db, check_email_valid, check_name_defined, check_password_defined, check_password_valid, check_verification_code_defined } from '@/middleware/check_body';
import { login, logout, refresh_token, register } from '@/controllers/auth_controllers.user';;



const auth_router_user = express.Router();

auth_router_user.post('/login', check_email_defined, check_password_defined, login);
auth_router_user.get('/logout', logout);

auth_router_user.post(
  '/register', 
  check_email_defined, 
  check_name_defined, 
  check_password_defined, 
  check_email_valid,
  check_password_valid,
  check_email_in_db,
  register
);

auth_router_user.get('/refresh', refresh_token);

export default auth_router_user;