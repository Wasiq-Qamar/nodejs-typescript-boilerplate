import Joi, {ArraySchema, ObjectSchema} from 'joi';

/*
 * This is the base class for all schemas. It contains the common
 * properties and methods for all schemas.
 * Properties common to all may be
 * - headersSchema
 * - querySchema
 * - bodySchema
 * - any reusable regexes that may be used for validation
 */
class BaseValidation {
  public joi: Joi.Root;

  options: {
    headers: Joi.BaseValidationOptions;
    query: Joi.BaseValidationOptions;
    body: Joi.BaseValidationOptions;
    params: Joi.BaseValidationOptions;
  } = {
    headers: {
      allowUnknown: true,
      abortEarly: false,
    },
    query: {
      allowUnknown: false,
      abortEarly: false,
    },
    body: {
      allowUnknown: false,
      abortEarly: false,
    },
    params: {
      allowUnknown: false,
      abortEarly: false,
    },
  };
  constructor() {
    this.joi = Joi;
  }

  getHeadersSchema() {
    return;
  }

  getQuerySchema() {
    return this.joi.object().keys({});
  }

  getBodySchema(): ObjectSchema<any> | ArraySchema<any> {
    return this.joi.object().keys({});
  }

  getParamsSchema() {
    return this.joi.object().keys({});
  }
}

export {BaseValidation};
