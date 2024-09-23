import express from 'express';

import { login, logout, refresh_token } from '@/controllers/auth_controllers.admin';
import { check_login_data } from '@/middleware/check_data';

const auth_router_admin = express.Router();

auth_router_admin.post('/login', check_login_data, login);
auth_router_admin.get('/logout', logout);
auth_router_admin.get('/refresh', refresh_token);

export default auth_router_admin;