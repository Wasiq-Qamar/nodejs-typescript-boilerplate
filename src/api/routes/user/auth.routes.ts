import {AuthController} from '../../controllers';
import {
  changePasswordValidation,
  forgotPasswordValidation,
  loginValidation,
  resetPasswordValidation,
  signupValidation,
} from '../../validations';
import {UserRole} from '../../../interface';

const {SUPERADMIN, ADMIN, USER} = UserRole;

const AuthRoutes = [
  {
    op: 'post',
    path: '/auth/login',
    controller: AuthController,
    method: 'login',
    authenticate: false,
    authorization: [SUPERADMIN, ADMIN, USER],
    validation: loginValidation,
  },
  {
    op: 'post',
    path: '/auth/signup',
    controller: AuthController,
    method: 'signup',
    authenticate: false,
    validation: signupValidation,
  },
  {
    op: 'post',
    path: '/auth/forgot-password',
    controller: AuthController,
    method: 'forgotPassword',
    authenticate: false,
    authorization: [SUPERADMIN, ADMIN, USER],
    validation: forgotPasswordValidation,
  },
  {
    op: 'post',
    path: '/auth/reset-password',
    controller: AuthController,
    method: 'resetPassword',
    authenticate: false,
    authorization: [SUPERADMIN, ADMIN, USER],
    validation: resetPasswordValidation,
  },
  {
    op: 'post',
    path: '/auth/change-password',
    controller: AuthController,
    method: 'changePassword',
    authenticate: true,
    authorization: [SUPERADMIN, ADMIN, USER],
    validation: changePasswordValidation,
  },
];

export {AuthRoutes};
