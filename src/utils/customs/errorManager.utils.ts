import util from 'util';
import {errorCodes} from '../../constants';
import {ErrorCodes} from '../../interface';

class CustomError extends Error {
  meta: any;

  constructor(message: string, meta?: any) {
    super(message);
    this.name = this.constructor.name;
    this.meta = meta;

    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, this.constructor);
    } else {
      this.stack = new Error(message).stack;
    }
  }
}

class ErrorManager {
  static getCodes(): ErrorCodes {
    return errorCodes as unknown as ErrorCodes;
  }

  static getError(
    codeName: string,
    err?: CustomError | Error | null,
    data?: any
  ): CustomError {
    if (err && err instanceof CustomError && err.meta) {
      return err;
    }

    let customError: CustomError = new CustomError('Unknown error');

    const codes = this.getCodes();
    const errData = codes[codeName];

    const meta: any = {};
    meta.code = codeName;
    meta.httpStatusCode = errData.code;

    if (data) {
      meta.message = errData.message;
      if (Array.isArray(data)) {
        for (const item of data) {
          meta.message = util.format(meta.message, item);
        }
      } else {
        meta.message = util.format(meta.message, data);
        if (meta.message === errData.message && data) {
          meta.message = data;
        }
      }
    } else {
      meta.message = errData.message;
    }

    if (!err) {
      customError = new CustomError(meta.message);
    }

    const isNotCustomError =
      !customError || !(customError instanceof CustomError);
    if (isNotCustomError) {
      customError = new CustomError(
        err?.message
          ? err.message
          : typeof err === 'string'
            ? err
            : 'Unknown error'
      );
    }

    if (err) {
      console.log(err);
    }

    customError.meta = meta;
    return customError;
  }
}

export {CustomError, ErrorManager};
