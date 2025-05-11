import {Request} from 'express';
import jwt from 'jsonwebtoken';
import mongoose from 'mongoose';
import {config} from '../../config';
import {Errors, JwtToken, UserRole, UserStatus} from '../../interface';
import {ErrorManager, getEncryptedApiKey} from '../../utils';

class AuthenticationMiddleware {
  constructor() {}

  authenticate(
    req: Request | any,
    allowedRoles: UserRole[],
  ): Promise<JwtToken> {
    const token = req.header('x-auth-token');
    const headerKey = req.header('x-api-key');
    const secretKey = config.secretKey;

    if (!token) {
      return Promise.reject(ErrorManager.getError(Errors.UNAUTHORIZED_USER));
    }

    try {
      const encryptedApiKey = getEncryptedApiKey(config.apiKey);
      if (headerKey !== encryptedApiKey) {
        return Promise.reject(ErrorManager.getError(Errors.ACCESS_DENIED));
      }

      const extractedToken = token.replace('Bearer', '').trim();
      const decoded = jwt.verify(extractedToken, secretKey) as JwtToken;

      if (
        !decoded.role ||
        !allowedRoles.includes(decoded.role) ||
        decoded.status !== UserStatus.ACTIVE
      ) {
        return Promise.reject(ErrorManager.getError(Errors.UNAUTHORIZED_USER));
      }

      if (decoded.userId) {
        decoded.userId = new mongoose.Types.ObjectId(decoded.userId.toString());
      }

      return Promise.resolve(decoded);
    } catch (e) {
      console.log(e);
      return Promise.reject(ErrorManager.getError(Errors.UNAUTHORIZED_USER));
    }
  }
}

export {AuthenticationMiddleware};
