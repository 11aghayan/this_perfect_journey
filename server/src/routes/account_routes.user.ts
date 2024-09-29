import express from 'express';

import { restore_user, send_verification_code, verify_user, delete_user, update_user_info, change_user_password } from '@/controllers/account_controllers.user';
import { check_email_defined, check_email_in_db, check_email_valid, check_name_defined, check_password_defined, check_password_valid, check_sex_valid, check_verification_code_defined, parse_birthday, parse_nationality } from '@/middleware/check_body';
import verify_jwt from '@/middleware/verify_jwt';
import { check_user_verified_by_id } from '@/middleware/check_user_verified';

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

account_router_user.delete(
  '/delete', 
  verify_jwt, 
  check_user_verified_by_id,
  check_email_defined, 
  check_email_valid, 
  check_email_in_db,
  check_password_defined,
  delete_user
);

account_router_user.post(
  '/restore', 
  check_email_defined,
  check_email_valid,
  check_email_in_db,
  check_verification_code_defined,
  restore_user
);

account_router_user.put(
  '/update-info', 
  verify_jwt,
  check_user_verified_by_id,
  check_name_defined,
  parse_birthday,
  check_sex_valid,
  parse_nationality,
  update_user_info
);

account_router_user.put(
  '/change-password',
  verify_jwt,
  check_user_verified_by_id,
  check_password_defined,
  check_password_valid,
  change_user_password
);

export default account_router_user;