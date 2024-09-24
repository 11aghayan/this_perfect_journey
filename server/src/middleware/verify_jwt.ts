import jwt, { JwtPayload, VerifyErrors } from 'jsonwebtoken';

import { custom_error } from "@/util/errors";
import { T_Controller } from '@/types';

const ACCESS_TOKEN_SECRET = process.env.ACCESS_TOKEN_SECRET as string;

const verify_jwt: T_Controller = (req, res, next) => {
  const auth_header = req.headers['authorization'];

  if (!auth_header) return custom_error(res, 401);
  
  const token = auth_header.split(' ')[1];

  const handle_verification = (err: VerifyErrors | null, decoded: JwtPayload | string | undefined) => {
    if (err) return custom_error(res, 403);
    const jwtPayload = decoded as JwtPayload;
    req.body.jwt_username = jwtPayload.username;
    next();
  };
  
  jwt.verify(
    token,
    ACCESS_TOKEN_SECRET,
    handle_verification
  );
}

export default verify_jwt;