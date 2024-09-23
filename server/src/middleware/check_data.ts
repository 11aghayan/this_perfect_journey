import { T_Controller } from "@/types";
import { custom_error, server_error } from "@/util/errors";

export const check_login_data: T_Controller = (req, res, next) => {
  try {
    const { username, password } = req.body;

    if (!username) return custom_error(res, 400, 'Please provide username');
    if (!password) return custom_error(res, 400, 'Please provide password');
    
    next();
  } catch (error) {
    console.error("Error in check_login_data: " + error);
    return server_error(res);
  }
};