import express from 'express';

import { login, logout, refresh_token } from '@/controllers/auth_controllers.admin';
import { check_username_defined, check_password_defined } from '@/middleware/check_body';

const auth_router_admin = express.Router();

auth_router_admin.post('/login', check_username_defined, check_password_defined, login);
auth_router_admin.get('/logout', logout);
auth_router_admin.get('/refresh', refresh_token);

export default auth_router_admin;