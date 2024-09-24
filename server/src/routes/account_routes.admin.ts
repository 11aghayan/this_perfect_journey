import { change_admin_password, get_admin_account_info } from '@/controllers/account_controllers.admin';
import { check_password_defined, check_password_valid } from '@/middleware/check_body';
import verify_jwt from '@/middleware/verify_jwt';
import express from 'express';


const account_router_admin = express.Router();

account_router_admin.get('/info', verify_jwt, get_admin_account_info);
account_router_admin.put('/change_password', verify_jwt, check_password_defined, check_password_valid, change_admin_password);

export default account_router_admin;