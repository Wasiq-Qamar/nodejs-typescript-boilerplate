import {Environments} from './interface';

const config = {
  port: process.env.PORT || 4000,
  environment: process.env.NODE_ENV?.trim() || Environments.DEVELOPMENT,
  enableStackTrace: process.env.ENABLE_STACK_TRACE === 'true',
  baseUrl: process.env.BASE_URL || 'http://localhost:4000',
  appUrl: process.env.APP_URL || 'http://localhost:5173',
  apiKey: process.env.API_KEY || 'myApiKey',
  secretKey: process.env.SECRET_KEY || 'mySecretKey',
  encryptionKey: process.env.ENCRYPTION_KEY || 'myEncryptionKey',
  allowedOrigins: process.env.ALLOWED_ORIGINS?.split(',') || null,
  mongo: {
    uri: process.env.MONGODB_URI || 'mongodb://admin:pass123@127.0.0.1:27017/',
    addtionalUri:
      process.env.ADDITIONAL_MONGODB_URI ||
      'mongodb://admin:pass123@127.0.0.1:27017/',
    db: process.env.MONGODB_DATABASE || Environments.DEVELOPMENT,
  },
  mail: {
    fromMailId: process.env.FROM_MAIL_ID || 'noreply@disruptready.com',
    clientId: process.env.OAUTH_CLIENT_ID || 'myClientId',
    clientSecret: process.env.OAUTH_CLIENT_SECRET || 'myClientSecret',
    refreshToken: process.env.OAUTH_REFRESH_TOKEN || 'myRefreshToken',
  },
};

export {config};
