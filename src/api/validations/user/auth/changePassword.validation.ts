import {ObjectSchema} from 'joi';
import {BaseValidation} from '../..';

class ChangePasswordValidation extends BaseValidation {
  private static instance: ChangePasswordValidation;

  constructor() {
    super();
    if (ChangePasswordValidation.instance) {
      return ChangePasswordValidation.instance;
    }

    ChangePasswordValidation.instance = this;
  }

  getBodySchema(): ObjectSchema<any> {
    return this.joi.object().keys({
      password: this.joi.string().required(),
      newPassword: this.joi.string().required(),
    });
  }
}

const changePasswordValidation = new ChangePasswordValidation();
export {changePasswordValidation};
