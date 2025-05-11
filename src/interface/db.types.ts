import {Document} from 'mongoose';
import {PasswordResetTokenStatus, UserRole, UserStatus} from './enums.types';

type SchemaWithOptions<T extends Record<string, unknown>> = T &
  Document & {
    createdAt: Date;
    updatedAt: Date;
  };

interface IUser extends Document {
  email: string;
  name: string;
  password: string;
  image: string;
  status: UserStatus;
  role: UserRole;
}

interface IPasswordReset extends Document {
  userId: IUser['_id'];
  token: string;
  email: string;
  status: PasswordResetTokenStatus;
  createdAt: Date;
  updatedAt: Date;
}

export {SchemaWithOptions, IUser, IPasswordReset};
