import { T_Controller } from "@/types";
import { custom_error, server_error } from "@/util/errors";

export const check_username_defined: T_Controller = (req, res, next) => {
  try {
    const { username } = req.body;

    if (!username) return custom_error(res, 400, 'Please provide username');
    
    next();
  } catch (error) {
    console.error("Error in check_valid_username: " + error);
    return server_error(res);
  }
};

export const check_password_defined: T_Controller = (req, res, next) => {
  try {
    const { password } = req.body;

    if (!password) return custom_error(res, 400, 'Please provide password');
    
    next();
  } catch (error) {
    console.error("Error in check_valid_password: " + error);
    return server_error(res);
  }
};

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