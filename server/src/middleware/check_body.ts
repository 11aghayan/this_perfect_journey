import Db from "@/db";
import { T_Controller } from "@/types";
import { custom_error, server_error } from "@/util/errors";

export const check_username_defined: T_Controller = (req, res, next) => {
  const { username } = req.body;
  if (!username) return custom_error(res, 400, 'Username is not provided');
  next();
};

export const check_password_defined: T_Controller = (req, res, next) => {
  const { password } = req.body;
  if (!password) return custom_error(res, 400, 'Password is not provided');
  next();
}

export const check_permission_valid: T_Controller = (req, res, next) => {
  const { permission } = req.body;
  const valid_values = ['s', 'f', 'r'];
  if (!valid_values.includes(permission)) return custom_error(res, 400, `Wrong permission value. It should be "s", "f" or "r". You specified ${permission}`);
  next();
};

export const check_password_valid: T_Controller = (req, res, next) => {
  const { password, old_password } = req.body;

  
  const regex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).{10,}$/;
  const is_valid = regex.test(password);
  
  if (!is_valid) return custom_error(
    res, 
    400, 
    'Password must contain at least: One uppercase letter, one lowercase letter, one number, one special character and have at least 10 symbols length'
  );
  if (old_password !== undefined && old_password === password) return custom_error(res, 400, 'New password must not be the same as the old one');

  next();
};

export const check_email_defined: T_Controller = (req, res, next) => {
  const { email } = req.body;
  if (!email) return custom_error(res, 400, 'Email is not provided');
  next();
};

export const check_email_valid: T_Controller = async (req, res, next) => {
  const { email } = req.body;

  const regex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
  const is_valid = regex.test(email);

  if (!is_valid) return custom_error(res, 400, 'Email is not valid');

  next();
};

export const check_email_in_db: T_Controller = async (req, res, next) => {
  const { email } = req.body;
  try {
    const email_in_db = await Db.user.is_email_in_db(email);
    if (email_in_db) return custom_error(res, 400, 'Email is already registered. @Did you forget your password?@');
    next();
  } catch (error) {
    console.error('Error in check_email_in_db: ' + error);
    return server_error(res);
  }
};

export const check_name_defined: T_Controller = (req, res, next) => {
  const { name } = req.body;
  if (!name) return custom_error(res, 400, 'Name is not provided');
  next()
};

export const check_verification_code_defined: T_Controller = (req, res, next) => {
  const { verification_code } = req.body;
  if (!verification_code) return custom_error(res, 400, 'Verification code is not provided');
  next();
};