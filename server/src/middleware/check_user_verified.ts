import Db, { Db_no_data } from "@/db";
import { T_Controller } from "@/types";
import { custom_error, server_error } from "@/util/errors";

export const check_user_verified_by_email: T_Controller = async (req, res, next) => {
  const { email } = req.body;
  try {
    const user = await Db.user.get_by_email(email);
    if (user instanceof Db_no_data) return custom_error(res, 403, user.message);
    if ('is_error' in user) return custom_error(res, 500, user.message);
    if (!user.verified) return res.status(401).json({ verified: false });
    next();
  } catch (error) {
    console.error('Error in check_user_verified_by_email: ' + error);
    return server_error(res);
  }
};


export const check_user_verified_by_id: T_Controller = async (req, res, next) => {
  const { jwt_id: id } = req.body;
  try {
    const user = await Db.user.get_by_id(id);
    if (user instanceof Db_no_data) return custom_error(res, 403, user.message);
    if ('is_error' in user) return custom_error(res, 500, user.message);
    if (!user.verified) return res.status(401).json({ verified: false });
    next();
  } catch (error) {
    console.error('Error in check_user_verified_by_id: ' + error);
    return server_error(res);
  }
};

export const check_user_verified_by_refresh_token: T_Controller = async (req, res, next) => {
  try {
    const cookies = req.cookies;
    if (!cookies.jwt) return custom_error(res, 401);
    const refresh_token = cookies.jwt;
    const user = await Db.user.get_by_refresh_token(refresh_token);
    if (user instanceof Db_no_data) return custom_error(res, 403, user.message);
    if ('is_error' in user) return custom_error(res, 500, user.message);
    if (!user.verified) return res.status(401).json({ verified: false });
    next();
  } catch (error) {
    console.error('Error in check)user_verified_by_refresh_token: ' + error);
    return server_error(res);
  }
};