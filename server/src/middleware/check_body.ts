import { T_Controller } from "@/types";
import { custom_error, server_error } from "@/util/errors";

export const check_valid_username: T_Controller = (req, res, next) => {
  try {
    const { username } = req.body;

    if (!username) return custom_error(res, 400, 'Please provide username');
    
    next();
  } catch (error) {
    console.error("Error in check_valid_username: " + error);
    return server_error(res);
  }
};

export const check_valid_password: T_Controller = (req, res, next) => {
  try {
    const { password } = req.body;

    if (!password) return custom_error(res, 400, 'Please provide password');
    
    next();
  } catch (error) {
    console.error("Error in check_valid_password: " + error);
    return server_error(res);
  }
};

export const check_valid_permission: T_Controller = (req, res, next) => {
  const { permission } = req.body;

  const valid_values = ['s', 'f', 'r'];
  
  if (!valid_values.includes(permission)) return custom_error(res, 400, `Wrong permission value. It should be "s", "f" or "r". You specified ${permission}`);

  next();
};

