import express from 'express';

import { restore_user, send_verification_code, verify_user, delete_user, update_user } from '@/controllers/account_controllers.user';
import { check_email_defined, check_email_in_db, check_email_valid, check_verification_code_defined } from '@/middleware/check_body';

const account_router_user = express.Router();

account_router_user.post(
  '/send-verification-code', 
  check_email_defined, 
  check_email_valid,
  check_email_in_db,
  send_verification_code
);

account_router_user.post(
  '/verify', 
  check_email_defined,
  check_verification_code_defined, 
  verify_user
);

account_router_user.post('/restore', check_verification_code_defined, restore_user);
account_router_user.delete('/delete', delete_user);
account_router_user.put('/update', update_user);

export default account_router_user;