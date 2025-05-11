import mongoose from 'mongoose';
import {Application, Request, Response} from 'express';
import {config} from '../config';
import {AppContext, Route} from '../interface';
import {CustomError, Logger} from '../utils';
import {
  AuthenticationMiddleware,
  MulterMiddleware,
  ValidationMiddleware,
} from './middlewares';
import {USER_ROUTES} from './routes';

class Router {
  constructor() {}

  init(app: Application) {
    this.createRoutes(app, USER_ROUTES as Route[]);
  }

  createRoutes(app: Application, routes: Route[]) {
    routes.forEach((route: Route) => {
      const multer = new MulterMiddleware();
      const uploader = multer.uploadFiles();

      if (route.handleFiles) {
        app[route.op](
          route.path,
          uploader.single('file'),
          (req: Request, res: Response) => {
            this.handleRequest(req, res, route);
          }
        );
      } else {
        app[route.op](route.path, (req: Request, res: Response) => {
          this.handleRequest(req, res, route);
        });
      }
    });
  }

  async handleRequest(req: Request, res: Response, route: Route) {
    const validator = new ValidationMiddleware();
    const auth = new AuthenticationMiddleware();

    const appContext: AppContext = {
      logger: Logger.getLogger(),
      req,
      res,
      authUser: null,
    };

    if (route.validation) {
      try {
        await validator.validate(req, route.validation);
      } catch (e: any) {
        res.status(e?.meta?.httpStatusCode || 500).json(e?.meta || e);
        return this.handleResponse(res, appContext, e);
      }
    }

    if (route.authenticate) {
      try {
        const token = await auth.authenticate(req, route.authorization);
        appContext.authUser = token;
      } catch (e: any) {
        res.status(e?.meta?.httpStatusCode || 500).json(e?.meta || e);
        return this.handleResponse(res, appContext, e);
      }
    }

    const dbSession = await mongoose.startSession();
    let response: any;
    try {
      await dbSession.startTransaction();

      const routeController = new route.controller(appContext, dbSession);
      response = await routeController[route.method]();

      await dbSession.commitTransaction();

      if (response && response.fileContent) {
        res.status(200).send(response.fileContent);
      } else {
        res.status(200).json(response);
      }
    } catch (e: any) {
      console.log(e);
      try {
        await dbSession.abortTransaction();
      } catch (e) {
        console.error(e);
      }

      res.status(e?.meta?.httpStatusCode || 500).json(e?.meta || e);
      return this.handleResponse(res, appContext, e);
    } finally {
      await dbSession.endSession();
    }

    return this.handleResponse(res, appContext);
  }

  handleResponse(res: Response, context: AppContext, error?: any) {
    const {enableStackTrace} = config;
    if (error) {
      if (enableStackTrace || !(error instanceof CustomError)) {
        console.log(error);
      } else {
        context.logger.error(error);
      }
    }

    return res;
  }
}

export {Router};
