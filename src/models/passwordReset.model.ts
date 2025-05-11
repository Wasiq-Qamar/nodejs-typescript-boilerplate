import mongoose, {Schema} from 'mongoose';
import {PasswordResetTokenStatus, IPasswordReset} from '../interface';

const PasswordResetSchema: Schema = new Schema(
  {
    userId: {type: Schema.Types.ObjectId, ref: 'User', required: true},
    token: {type: String, required: true},
    email: {type: String, required: true},
    status: {
      type: String,
      enum: Object.values(PasswordResetTokenStatus),
      default: PasswordResetTokenStatus.ACTIVE,
    },
  },
  {
    timestamps: true,
  }
);

const PasswordResetModel =
  mongoose.models?.PasswordReset ||
  mongoose.model<IPasswordReset>('PasswordReset', PasswordResetSchema);

export {PasswordResetModel};
