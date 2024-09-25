import bcrypt from 'bcrypt';

import Db, { Db_no_data } from "@/db";
import { T_Controller } from "@/types";
import { custom_error, server_error } from "@/util/errors";


export const get_admin_account_info: T_Controller = async (req, res) => {
  const { jwt_id: id } = req.body;
  
  try {
    const admin = await Db.admin.get_by_id(id);
    if (admin instanceof Db_no_data) return custom_error(res, 404, 'No admin found');
    if ('is_error' in admin) return custom_error(res, 500, admin.message);

    const admin_filtered = {
      username: admin.username,
      id: admin.id,
      permission: admin.permission
    }

    return res.status(200).json(admin_filtered)
    
  } catch (error) {
    console.error('Error in get_admin_account_info: ' + error);
    return server_error(res);
  }
}; 

export const change_admin_password: T_Controller = async (req, res) => {
  const { jwt_id: id, password, old_password } = req.body;

  try {
    const admin = await Db.admin.get_by_id(id);
    if (admin instanceof Db_no_data) return custom_error(res, 404, 'No admin found');
    if ('is_error' in admin) return custom_error(res, 500, admin.message);

    const is_password_correct = await bcrypt.compare(old_password, admin.password_hash);
    if (!is_password_correct) return custom_error(res, 403, 'Wrong Credentials');

    const new_hash = await bcrypt.hash(password, 10);
    
    const response = await Db.admin.change_password(id, new_hash);
    if (response?.is_error) return custom_error(res, 500, response.message);
    
    return res.sendStatus(200);
  } catch (error) {
    console.error('Error in change_admin_password: ' + error);
    return server_error(res);
  }
}; 