import jwt, { JwtPayload, Secret } from 'jsonwebtoken';
import config from '../config';

export const createToken = (
  payload: Record<string, unknown>, // { userId: string; role: string }
  secret: Secret = config.JWT_SECRET,
  expiresIn: string = config.JWT_EXPIRES_IN
): string => {
  return jwt.sign(payload, secret, {
    expiresIn,
  });
};

export const verifyToken = (
  token: string,
  secret: Secret = config.JWT_SECRET
): JwtPayload => {
  return jwt.verify(token, secret) as JwtPayload;
};
