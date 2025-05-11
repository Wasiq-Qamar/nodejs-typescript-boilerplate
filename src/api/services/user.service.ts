import mongoose from 'mongoose';
import {v4 as uuidv4} from 'uuid';
import mustache from 'mustache';
import {AppContext, Errors, IUser} from '../../interface';
import {PasswordResetModel, UserModel} from '../../models';
import {ErrorManager} from '../../utils';
import {BaseService} from './base.service';
import {config} from '../../config';
import {forgotPasswordTemplate} from '../../constants';

class UserService extends BaseService {
  constructor(context: AppContext, dbSession: mongoose.mongo.ClientSession) {
    super(context, dbSession);
  }

  public async getEntity(
    filter: any,
    projection = {},
    throwNotFoundError?: boolean
  ): Promise<IUser> {
    const user = await UserModel.findOne(filter, projection, {
      session: this.dbSession,
    })
      .populate('companyId', 'name')
      .lean()
      .exec();

    if (!user && throwNotFoundError) {
      return Promise.reject(ErrorManager.getError(Errors.USER_NOT_FOUND));
    }

    return user as IUser;
  }

  public async createEntity(data: {
    name: string;
    email: string;
    password?: string;
    role: 'admin' | 'user' | 'superadmin';
    companyRole: string;
    companyId?: mongoose.Types.ObjectId;
  }): Promise<IUser> {
    const {name, email, password, role, companyRole} = data;
    const {companyId} = data;

    let user = new UserModel({
      name,
      email,
      password,
      role,
      companyId: companyId ? new mongoose.Types.ObjectId(companyId) : null,
      companyRole,
    });

    user = await user.save({session: this.dbSession});

    return user;
  }

  public async updateEntity(
    filter: any,
    data: any,
    options: any = {}
  ): Promise<IUser> {
    const user = await UserModel.findOneAndUpdate(
      filter,
      data,
      Object.assign(options, {session: this.dbSession, new: true})
    )
      .lean()
      .exec();

    if (!user) {
      return Promise.reject(ErrorManager.getError(Errors.USER_NOT_FOUND));
    }

    return user as IUser;
  }

  public async getEntityById(
    id: mongoose.Types.ObjectId | undefined,
    projection = {},
    returnLean = true,
    throwNotFoundError = true
  ): Promise<IUser> {
    let query = UserModel.findById(id, projection, {
      session: this.dbSession,
    });

    if (returnLean) {
      query = query.populate('companyId', 'name').lean();
    }

    const user = await query.exec();

    if (!user && throwNotFoundError) {
      return Promise.reject(ErrorManager.getError(Errors.USER_NOT_FOUND));
    }

    return user as IUser;
  }

  public async createResetPasswordEntity(user: IUser): Promise<any> {
    const passwordReset = await PasswordResetModel.create({
      userId: user._id,
      token: uuidv4(),
      email: user.email,
      status: 'active',
    });

    const emailContent = {
      data: {
        name: user.name,
        resetLink: `${config.appUrl}/reset-password?token=${passwordReset.token}`,
      },
    };

    const template = mustache.render(forgotPasswordTemplate, emailContent);

    await this.sendEmail({
      email: user.email,
      subject: 'Reset Password',
      textContent: '',
      htmlContent: template,
    });

    return {
      token: passwordReset.token,
      email: user.email,
    };
  }

  public async deleteEntity(): Promise<boolean> {
    const {id} = this.context.req.params;
    try {
      const user = await UserModel.findById(id, null, {
        session: this.dbSession,
      }).exec();
      if (!user) {
        return Promise.reject(
          ErrorManager.getError(Errors.CUSTOM_ERROR, null, 'User not found')
        );
      }

      await UserModel.findByIdAndDelete(id, {
        session: this.dbSession,
      }).exec();

      return Promise.resolve(true);
    } catch (error) {
      return Promise.reject(
        ErrorManager.getError(
          Errors.CUSTOM_ERROR,
          error as Error,
          'Failed to delete user'
        )
      );
    }
  }
}

export {UserService};
