import winston from 'winston';
import {Request, Response} from 'express';
import mongoose from 'mongoose';
import {UserRole} from './enums.types';

interface ResponseFormat {
  message: string;
  sessionId?: string;
  data?: any;
  fileContent?: any;
  metaData?: {
    total?: number;
    skip?: number;
    limit?: number;
  };
}
interface JwtToken {
  role: UserRole;
  email: string;
  userId: mongoose.Types.ObjectId;
  image: string;
  status: string;
}

interface AppContext {
  logger: winston.Logger;
  req: Request;
  res: Response;
  authUser: JwtToken | null;
}

interface CustomError extends Error {
  meta: any;
}

interface ErrorCodes {
  [key: string]: {
    code: number;
    message: string;
  };
}

interface CronModule {
  execute: Function;
}

interface CronExecutionReturn {
  message: string;
  success: boolean;
}

interface DailyNotificationScheduleItem {
  type: string;
  time: string;
  days?: number[];
}

interface Route {
  op: 'post' | 'get' | 'put' | 'delete';
  path: string;
  controller: any;
  method: string;
  authenticate: boolean;
  authorization: UserRole[];
  handleFiles?: boolean;
  isSecret?: boolean;
  validation: any;
}

export {
  JwtToken,
  AppContext,
  CustomError,
  ErrorCodes,
  ResponseFormat,
  Route,
  CronExecutionReturn,
  CronModule,
  DailyNotificationScheduleItem,
};
