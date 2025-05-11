import {ObjectSchema} from 'joi';
import {BaseValidation} from '../..';

class ResetPasswordValidation extends BaseValidation {
  private static instance: ResetPasswordValidation;

  constructor() {
    super();
    if (ResetPasswordValidation.instance) {
      return ResetPasswordValidation.instance;
    }

    ResetPasswordValidation.instance = this;
  }

  getBodySchema(): ObjectSchema<any> {
    return this.joi.object().keys({
      token: this.joi.string().required(),
      password: this.joi.string().required(),
    });
  }
}

const resetPasswordValidation = new ResetPasswordValidation();
export {resetPasswordValidation};
