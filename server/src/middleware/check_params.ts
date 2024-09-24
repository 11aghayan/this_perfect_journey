import Db, { Db_no_data } from "@/db";
import { T_Controller } from "@/types";
import { custom_error, server_error } from "@/util/errors";

const OWNER_USERNAME = process.env.OWNER_USERNAME as string;

export const check_valid_id: T_Controller = (req, res, next) => {
  const { id } = req.params;
  if (!id) return custom_error(res, 400, 'ID is missing');
  next();
};

export const prevent_owner_and_self_delete: T_Controller = async (req, res, next) => {
  const { id } = req.params;
  const { jwt_username } = req.body

  try {
    const admin = await Db.admin.get_by_id(id);
    if (admin instanceof Db_no_data) return custom_error(res, 404, 'ID not found');
    if ('is_error' in admin) return custom_error(res, 500, admin.message);
    
    if (admin.username === jwt_username) return custom_error(res, 403, 'You cannot delete your own account');
    if (admin.username === OWNER_USERNAME) return custom_error(res, 403, 'Owner cannot be deleted or modified');
    
    next();
  } catch (error) {
    console.error('Error in check_owner: ' + error);
    return server_error(res);
  }
};