enum PasswordResetTokenStatus {
  ACTIVE = 'active',
  INACTIVE = 'inactive',
  EXPIRED = 'expired',
  USED = 'used',
}

enum UserStatus {
  ACTIVE = 'active',
  INACTIVE = 'inactive',
  DELETED = 'deleted',
}

enum UserRole {
  ADMIN = 'admin',
  SUPERADMIN = 'super_admin',
  USER = 'user',
}

enum Errors {
  INTERNAL_SERVER_ERROR = 'INTERNAL_SERVER_ERROR',
  BAD_REQUEST = 'BAD_REQUEST',
  UNAUTHORIZED = 'UNAUTHORIZED',
  INVALID_DATA_ERROR = 'INVALID_DATA_ERROR',
  CUSTOM_ERROR = 'CUSTOM_ERROR',
  UNAUTHORIZED_USER = 'UNAUTHORIZED_USER',
  USER_NOT_FOUND = 'USER_NOT_FOUND',
  GENERAL_PROCESSING_ERROR = 'GENERAL_PROCESSING_ERROR',
  ACCESS_DENIED = 'ACCESS_DENIED',
}

enum Environments {
  DEVELOPMENT = 'development',
  STAGING = 'staging',
  PRODUCTION = 'production',
}

export {PasswordResetTokenStatus, Errors, Environments, UserStatus, UserRole};
