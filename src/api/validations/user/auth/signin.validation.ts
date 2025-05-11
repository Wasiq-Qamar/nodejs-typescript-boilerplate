import {ObjectSchema} from 'joi';
import {BaseValidation} from '../..';

class LoginValidation extends BaseValidation {
  private static instance: LoginValidation;

  constructor() {
    super();
    if (LoginValidation.instance) {
      return LoginValidation.instance;
    }

    LoginValidation.instance = this;
  }

  getBodySchema(): ObjectSchema<any> {
    return this.joi.object().keys({
      email: this.joi.string().email().required(),
      password: this.joi.string().required(),
    });
  }
}

const loginValidation = new LoginValidation();
export {loginValidation};
