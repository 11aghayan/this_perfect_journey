import Db from "@/db";
import Email from "@/lib/Email_Sender";
import Email_Store from "@/lib/Email_Store";
import { T_Controller } from "@/types";
import { custom_error, server_error } from "@/util/errors";
import { generate_verification_code } from "@/util/generate";




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
  try {
    const { email, verification_code } = req.body;
    const code_matches = Email_Store.check_verification_code(email, verification_code);
    if (!code_matches) return custom_error(res, 403, 'Verification code is wrong');
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
  try {
    
  } catch (error) {
    console.error('Error in user restore: ' + error);
    return server_error(res);
  }
};

export const delete_user: T_Controller = async (req, res) => {
  try {
    
  } catch (error) {
    console.error('Error in user restore: ' + error);
    return server_error(res);
  }
};

export const update_user: T_Controller = async (req, res) => {
  try {
    
  } catch (error) {
    console.error('Error in user restore: ' + error);
    return server_error(res);
  }
};