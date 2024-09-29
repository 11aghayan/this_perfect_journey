import bcrypt from 'bcrypt';

import Db, { Db_no_data } from "@/db";
import Email from "@/lib/Email_Sender";
import Email_Store from "@/lib/Email_Store";
import { T_Controller, T_User } from "@/types";
import { custom_error, server_error } from "@/util/errors";
import { generate_random_password, generate_verification_code } from "@/util/generate";




export const send_verification_code: T_Controller = async (req, res) => {
  const { email } = req.body;

  const cooldown_passed = Email_Store.cooldown_passed(email);
  if (!cooldown_passed) return custom_error(res, 403, 'You can make requests every 60 seconds');

  const verification_code = generate_verification_code();
  const create_time = new Date(Date.now()).toUTCString();
  const timeout_id = setTimeout(() => {
    Email_Store.delete(email);
  }, 1000 * 60 * 10);

  Email_Store.set(email, verification_code, create_time, timeout_id);

  try {
    const response = await Email.send_verification_code(email, verification_code);
    if (!response.success) return server_error(res);
    return res.sendStatus(200);
  } catch (error) {
    console.error('Error in send verification code: ' + error);
    return server_error(res);
  }
};

export const verify_user: T_Controller = async (req, res) => {
  const { email, verification_code } = req.body;
  const code_matches = Email_Store.check_verification_code(email, verification_code);
  if (!code_matches) return custom_error(res, 403, 'Verification code is wrong');

  try {
    const response = await Db.user.verify(email);
    if (response?.is_error) return custom_error(res, 500, response.message);
    Email_Store.clear_timeout(email);
    Email_Store.delete(email);
    return res.sendStatus(200);
  } catch (error) {
    console.error(error);
    return server_error(res);
  }
};

export const restore_user: T_Controller = async (req, res) => {
  const { email, verification_code } = req.body;
  const code_matches = Email_Store.check_verification_code(email, verification_code);
  if (!code_matches) return custom_error(res, 403, 'Verification code is wrong');
  const password = generate_random_password();
  try {
    const password_hash = await bcrypt.hash(password, 10);
    const update_response = await Db.user.update_password(email, password_hash);
    if (update_response?.is_error) return custom_error(res, 500, update_response.message);

    const email_response = await Email.send_generated_password(email, password);
    if (!email_response.success) return custom_error(res, 500, 'Password sending error: ' + email_response.error);
    
    return res.sendStatus(200);
  } catch (error) {
    console.error('Error in user restore: ' + error);
    return server_error(res);
  }
};

export const delete_user: T_Controller = async (req, res) => {
  const { jwt_id: id, email, password } = req.body;
  try {
    const user = await Db.user.get_by_id(id);
    if (user instanceof Db_no_data) return custom_error(res, 403, 'Wrong credentials');
    if ('is_error' in user) return custom_error(res, 500, user.message);
    if (user.email !== email) return custom_error(res, 403, 'Wrong credentials');
    if (!user?.password_hash) return custom_error(res, 403, 'Wrong credentials'); 
    const password_correct = await bcrypt.compare(password, user.password_hash);
    if (!password_correct) return custom_error(res, 403, 'Wrong credentials');
    
    const response = await Db.user.delete_by_id(id);
    if (response?.is_error) return custom_error(res, 500, response.message);
    
    return res.sendStatus(200);
  } catch (error) {
    console.error('Error in user restore: ' + error);
    return server_error(res);
  }
};

export const update_user_info: T_Controller = async (req, res) => {
  const { jwt_id: id, name, birthday = null, sex = null, nationality = null } = req.body;
  try {
    const response = await Db.user.update_info({ id, name, birthday, sex, nationality });
    if (response?.is_error) return custom_error(res, 500, response.message);
    
    return res.sendStatus(200);
  } catch (error) {
    console.error('Error in user restore: ' + error);
    return server_error(res);
  }
};

export const change_user_password: T_Controller = async (req, res) => {
  const { jwt_id: id, old_password, password } = req.body;
  try {
    const user = await Db.user.get_by_id(id);
    if (user instanceof Db_no_data) return custom_error(res, 404, user.message);
    if ('is_error' in user) return custom_error(res, 500, user.message);

    if (!user?.password_hash) return custom_error(res, 403, 'Wrong credentials'); 
    const password_correct = await bcrypt.compare(old_password, user.password_hash);
    if (!password_correct) return custom_error(res, 403, 'Wrong credentials'); 
    const password_hash = await bcrypt.hash(password, 10);

    const response = await Db.user.change_password(id, password_hash);
    if (response?.is_error) return custom_error(res, 500, response.message);

    return res.sendStatus(200);
  } catch (error) {
    console.error('Error in change_user_password: ' + error);
    return server_error(res);
  }
};