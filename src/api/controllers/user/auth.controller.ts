import mongoose from 'mongoose';
import moment from 'moment';
import {BaseController} from '../base.controller';
import {
  AppContext,
  Errors,
  PasswordResetTokenStatus,
  ResponseFormat,
  IPasswordReset,
  UserRole,
} from '../../../interface';
import {
  ErrorManager,
  extractTokenInfoFromUser,
  generateUserAuthToken,
  generateHash,
  isPasswordValid,
} from '../../../utils';
import {UserService} from '../../services';
import {PasswordResetModel} from '../../../models';

class AuthController extends BaseController {
  private userService: UserService;
  constructor(context: AppContext, dbSession: mongoose.mongo.ClientSession) {
    super(context, dbSession);
    this.userService = new UserService(context, dbSession);
  }

  public async login(): Promise<ResponseFormat> {
    let {email} = this.context.req.body;
    const {password} = this.context.req.body;
    email = email.toLowerCase();

    if (!email || !password) {
      return Promise.reject(ErrorManager.getError(Errors.INVALID_DATA_ERROR));
    }

    const user = await this.userService.getEntity({email}, {}, true);

    const isPasswordCorrect = await isPasswordValid(password, user.password);
    if (!isPasswordCorrect) {
      return Promise.reject(
        ErrorManager.getError(
          Errors.CUSTOM_ERROR,
          null,
          'The provided credentials are incorrect'
        )
      );
    }

    return {
      message: 'Logged in Successfully',
      data: {
        token: generateUserAuthToken(extractTokenInfoFromUser(user)),
      },
    };
  }

  public async signup(): Promise<ResponseFormat> {
    const {role, name, confirmPassword, companyRole} = this.context.req.body;
    let {email, password} = this.context.req.body;
    email = email.toLowerCase();

    const existingCustomer = await this.userService.getEntity(
      {email},
      {},
      false
    );

    if (existingCustomer) {
      return Promise.reject(
        ErrorManager.getError(Errors.CUSTOM_ERROR, null, 'User already exists')
      );
    }

    if (password !== confirmPassword) {
      return Promise.reject(
        ErrorManager.getError(
          Errors.CUSTOM_ERROR,
          null,
          'Passwords do not match'
        )
      );
    }

    if (password) {
      password = await generateHash(password);
    }

    const customer = await this.userService.createEntity({
      name,
      email,
      password,
      role,
      companyRole,
    });

    const token = generateUserAuthToken(extractTokenInfoFromUser(customer));

    return {
      message: 'Account Created Successfully',
      data: {token},
    };
  }

  public async forgotPassword(): Promise<ResponseFormat> {
    let {email} = this.context.req.body;
    email = email.toLowerCase();

    const user = await this.userService.getEntity({email}, {}, false);

    if (!user) {
      return Promise.reject(
        ErrorManager.getError(Errors.CUSTOM_ERROR, null, 'User not found')
      );
    }

    if (!user.role || user.role === UserRole.SUPERADMIN) {
      return Promise.reject(
        ErrorManager.getError(
          Errors.CUSTOM_ERROR,
          null,
          'Password reset not allowed for superadmin'
        )
      );
    }

    const existingPasswordReset = (await PasswordResetModel.findOne({
      email,
      status: PasswordResetTokenStatus.ACTIVE,
    }).lean()) as IPasswordReset;
    if (existingPasswordReset) {
      await PasswordResetModel.updateOne(
        {_id: existingPasswordReset._id},
        {status: PasswordResetTokenStatus.INACTIVE}
      );
    }

    const passwordReset =
      await this.userService.createResetPasswordEntity(user);

    return {
      message: 'Password reset link sent to your email',
      data: passwordReset,
    };
  }

  public async resetPassword(): Promise<ResponseFormat> {
    let {password} = this.context.req.body;
    const {token} = this.context.req.body;

    const passwordReset = (await PasswordResetModel.findOne({
      token,
    }).lean()) as IPasswordReset;

    if (!passwordReset) {
      return Promise.reject(
        ErrorManager.getError(Errors.CUSTOM_ERROR, null, 'Invalid token')
      );
    }

    const isTokenOlderThan6Hours = moment
      .utc(passwordReset.createdAt)
      .isBefore(moment.utc().subtract(6, 'hours'));
    if (
      isTokenOlderThan6Hours ||
      passwordReset.status !== PasswordResetTokenStatus.ACTIVE
    ) {
      if (passwordReset.status === PasswordResetTokenStatus.ACTIVE) {
        await PasswordResetModel.updateOne(
          {_id: passwordReset._id},
          {status: PasswordResetTokenStatus.EXPIRED}
        );
      }

      return Promise.reject(
        ErrorManager.getError(Errors.CUSTOM_ERROR, null, 'Token expired')
      );
    }

    const user = await this.userService.getEntity({_id: passwordReset.userId});
    if (!user.role || user.role === UserRole.SUPERADMIN) {
      return Promise.reject(
        ErrorManager.getError(
          Errors.CUSTOM_ERROR,
          null,
          'Password reset not allowed for superadmin'
        )
      );
    }

    if (password) {
      password = await generateHash(password);
    }

    await this.userService.updateEntity({_id: user._id}, {password});

    await PasswordResetModel.updateOne(
      {_id: passwordReset._id},
      {status: PasswordResetTokenStatus.USED}
    );

    return {
      message: 'Password reset successfully',
    };
  }

  public async changePassword(): Promise<ResponseFormat> {
    let {newPassword} = this.context.req.body;
    const {password} = this.context.req.body;

    const user = await this.userService.getEntity({
      _id: this.context.authUser?.userId,
    });

    if (newPassword) {
      newPassword = await generateHash(newPassword);
    }

    const isPasswordCorrect = await isPasswordValid(password, user.password);
    if (!isPasswordCorrect) {
      return Promise.reject(
        ErrorManager.getError(
          Errors.CUSTOM_ERROR,
          null,
          'The current password is incorrect'
        )
      );
    }

    await this.userService.updateEntity(
      {_id: user._id},
      {password: newPassword}
    );

    return {
      message: 'Password changed successfully',
    };
  }
}

export {AuthController};
