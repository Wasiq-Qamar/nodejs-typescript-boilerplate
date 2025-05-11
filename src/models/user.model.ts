import mongoose, {Schema} from 'mongoose';
import {UserRole, IUser, UserStatus} from '../interface';

const UserSchema: Schema = new Schema(
  {
    name: {type: String},
    email: {type: String, required: true, unique: true},
    role: {
      type: String,
      enum: Object.values(UserRole),
      required: true,
    },
    companyRole: {type: String},
    password: {type: String, required: true},
    image: {type: String},
    companyId: {type: Schema.Types.ObjectId, ref: 'Company'},
    status: {
      type: String,
      enum: Object.values(UserStatus),
      default: UserStatus.ACTIVE,
    },
    allowSecretsAccess: {type: Boolean, default: false},
  },
  {
    timestamps: true,
  }
);

const UserModel =
  mongoose.models?.User || mongoose.model<IUser>('User', UserSchema);

export {UserModel};
