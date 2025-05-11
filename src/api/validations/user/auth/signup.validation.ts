import {ObjectSchema} from 'joi';
import {BaseValidation} from '../..';
import {UserRole} from '../../../../interface';

class SignupValidation extends BaseValidation {
  private static instance: SignupValidation;

  constructor() {
    super();
    if (SignupValidation.instance) {
      return SignupValidation.instance;
    }

    SignupValidation.instance = this;
  }

  getBodySchema(): ObjectSchema<any> {
    return this.joi.object().keys({
      email: this.joi.string().email().required(),
      password: this.joi.string().required(),
      confirmPassword: this.joi.string().required(),
      name: this.joi.string().required(),
      role: this.joi
        .string()
        .valid(...Object.values(UserRole))
        .required(),
    });
  }
}

const signupValidation = new SignupValidation();
export {signupValidation};
