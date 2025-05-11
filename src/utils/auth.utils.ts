import crypto from 'crypto';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import {config} from '../config';
import {JwtToken, IUser} from '../interface';
import moment from 'moment';

const algorithm = 'aes-256-cbc';
const secretKey = Buffer.from(config.encryptionKey, 'hex');

const generateHash = async (password: string): Promise<string> => {
  return bcrypt.hash(password, 10);
};

const isPasswordValid = async (
  password: string,
  hash: string
): Promise<boolean> => {
  let isValid = false;

  try {
    isValid = await bcrypt.compare(password, hash);
  } catch (error) {
    isValid = false;
  }

  return isValid;
};

const generateUserAuthToken = (payload: JwtToken): string => {
  const secretKey = config.secretKey;
  const token = jwt.sign(payload, secretKey, {
    expiresIn: '1d',
  });
  return token;
};

const extractTokenInfoFromUser = (user: IUser): JwtToken => {
  return {
    email: user.email || '',
    userId: user._id || '',
    role: user.role || '',
    image: user.image || '',
    status: user.status || '',
  };
};

const encrypt = (
  text: string
): {
  iv: string;
  content: string;
} => {
  const iv = crypto.randomBytes(16);
  const cipher = crypto.createCipheriv(algorithm, secretKey, iv);
  let encrypted = cipher.update(text, 'utf8', 'hex');
  encrypted += cipher.final('hex');
  return {iv: iv.toString('hex'), content: encrypted};
};

const decrypt = (hash: {iv: string; content: string}): string => {
  try {
    const decipher = crypto.createDecipheriv(
      algorithm,
      secretKey,
      Buffer.from(hash.iv, 'hex')
    );
    let decrypted = decipher.update(hash.content, 'hex', 'utf8');
    decrypted += decipher.final('utf8');
    return decrypted;
  } catch (error) {
    console.log('Error in decrypting hash', error);
    return hash.content || '';
  }
};

const getEncryptedApiKey = (text: string): string => {
  const key = config.secretKey;
  const hmac = crypto.createHmac('sha256', key);

  const apiKey = `${moment.utc().format('YYYY-MM-DD')}-${text}`;
  hmac.update(apiKey);
  return hmac.digest('hex');
};

export {
  extractTokenInfoFromUser,
  generateUserAuthToken,
  generateHash,
  encrypt,
  decrypt,
  getEncryptedApiKey,
  isPasswordValid,
};
