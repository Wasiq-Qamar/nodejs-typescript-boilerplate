import {ObjectSchema} from 'joi';
import {BaseValidation} from '../..';

class ForgotPasswordValidation extends BaseValidation {
  private static instance: ForgotPasswordValidation;

  constructor() {
    super();
    if (ForgotPasswordValidation.instance) {
      return ForgotPasswordValidation.instance;
    }

    ForgotPasswordValidation.instance = this;
  }

  getBodySchema(): ObjectSchema<any> {
    return this.joi.object().keys({
      email: this.joi.string().email().required(),
    });
  }
}

const forgotPasswordValidation = new ForgotPasswordValidation();
export {forgotPasswordValidation};
