import { OAuth2Client } from 'google-auth-library';

import { T_Controller } from "@/types";
import { custom_error, server_error } from "@/util/errors";

const client = new OAuth2Client();
const GOOGLE_OAUTH_CLIENT_ID = process.env.GOOGLE_OAUTH_CLIENT_ID as string;

export const verify_google_id_token: T_Controller = async (req, res, next) => {
  const { google_token_id: token } = req.body;
  
  if (!token) return custom_error(res, 400, 'Token ID missing');

  try {
    const ticket = await client.verifyIdToken({
      idToken: token,
      audience: GOOGLE_OAUTH_CLIENT_ID,  
    });

    const payload = ticket.getPayload();

    if (!payload) return custom_error(res, 400, 'Payload is undefined');
    
    const user_email_verified = payload.email_verified;
    if (!user_email_verified) return custom_error(res, 401, 'Your email is not verified by Google');

    const { email, name, picture: profile_photo_url, sub: id } = payload;
    
    req.body = {
      ...req.body,
      email,
      name,
      profile_photo_url,
      id
    };
    next();
  } catch (error) {
    console.error('Error in verify_google_id_token: ' + error);
    return server_error(res);
  }
};

