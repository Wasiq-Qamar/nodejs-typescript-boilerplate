import {Request} from 'express';
import {ErrorManager} from '../../utils';
import {Errors} from '../../interface';

class ValidationMiddleware {
  constructor() {}

  validateHeaders(req: Request, schema: any, options = {}) {
    const {error, value} = schema.validate(req.headers, options);
    if (error) {
      return Promise.reject(
        ErrorManager.getError(Errors.INVALID_DATA_ERROR, null, error.message)
      );
    }

    req.headers = value;
    return Promise.resolve();
  }

  validateQuery(req: Request, schema: any, options = {}) {
    const {error, value} = schema.validate(req.query, options);
    if (error) {
      return Promise.reject(
        ErrorManager.getError(Errors.INVALID_DATA_ERROR, null, error.message)
      );
    }

    req.query = value;
    return Promise.resolve();
  }

  validateBody(req: Request, schema: any, options = {}) {
    const {error, value} = schema.validate(req.body, options);
    if (error) {
      return Promise.reject(
        ErrorManager.getError(Errors.INVALID_DATA_ERROR, null, error.message)
      );
    }

    req.body = value;
    return Promise.resolve();
  }

  validateParams(req: Request, schema: any, options = {}) {
    const {error, value} = schema.validate(req.params, options);
    if (error) {
      return Promise.reject(
        ErrorManager.getError(Errors.INVALID_DATA_ERROR, null, error.message)
      );
    }

    req.params = value;
    return Promise.resolve();
  }

  async validate(req: Request, schemaContainer: any) {
    const headerSchema = schemaContainer.getHeadersSchema();
    const querySchema = schemaContainer.getQuerySchema();
    const bodySchema = schemaContainer.getBodySchema();
    const paramsSchema = schemaContainer.getParamsSchema();

    const options = schemaContainer.options;

    if (headerSchema) {
      await this.validateHeaders(req, headerSchema, options.headers);
    }

    if (querySchema) {
      await this.validateQuery(req, querySchema, options.query);
    }

    if (bodySchema) {
      await this.validateBody(req, bodySchema, options.body);
    }

    if (paramsSchema) {
      await this.validateParams(req, paramsSchema, options.params);
    }

    return Promise.resolve();
  }
}

export {ValidationMiddleware};
