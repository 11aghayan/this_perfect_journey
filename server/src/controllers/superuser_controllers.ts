import bcrypt from 'bcrypt';

import Db, { Db_no_data } from "@/db";
import { T_Controller } from "@/types";
import { custom_error, server_error } from "@/util/errors";
import remove_key_from_obj from "@/util/remove_key_from_obj";


export const get_all_admins: T_Controller = async (_req, res) => {
  try {
    const admin_list = await Db.admin.get_all();
    if (admin_list instanceof Db_no_data) return custom_error(res, 404, admin_list.message);
  
    const filtered_admin_list = admin_list.map(obj => remove_key_from_obj(obj, 'password_hash'));
    
    return res.status(200).json(filtered_admin_list);
  } catch (error) {
    console.error('Error in get_all_admins: ' + error);
    return server_error(res);
  }
};

export const get_admin_by_id: T_Controller = async (req, res) => {
  const { id } = req.params;

  try {
    const admin = await Db.admin.get_by_id(id);
    if (admin instanceof Db_no_data) return custom_error(res, 404, admin.message);
  
    const filtered_admin = remove_key_from_obj(admin, 'password_hash');
  
    return res.status(200).json(filtered_admin);
  } catch (error) {
    console.error('Error in get_admin_by_id' + error);
    return server_error(res);
  }
};

export const create_admin: T_Controller = async (req, res) => {
  const { username, password, permission } = req.body;
  
  try {
    const password_hash = await bcrypt.hash(password, 10);

    const response = await Db.admin.create(username, password_hash, permission);
    if (response?.is_error) return custom_error(res, 400, `${response.message}`);
    
    return res.sendStatus(201);
  } catch (error) {
    console.error('Error in create_admin: ' + error);
    return server_error(res);
  }
};

export const update_admin: T_Controller = async (req, res) => {
  const { username, permission } = req.body;
  const { id } = req.params;
  
  try {
    const response = await Db.admin.update(username, permission, id);
    if (response?.is_error) return custom_error(res, 400, `${response.message}`);
    
    return res.sendStatus(200);
  } catch (error) {
    console.error('Error in update_admin: ' + error);
    return server_error(res);
  }
};

export const delete_admin: T_Controller = async (req, res) => {
  const { id } = req.params;

  try {
    const response = await Db.admin.delete(id);
    if (response?.is_error) return custom_error(res, 400, `${response.message}`);
    
    return res.sendStatus(200);
  } catch (error) {
    console.error('Error in delete_admin: ' + error);
    return server_error(res);
  }
};