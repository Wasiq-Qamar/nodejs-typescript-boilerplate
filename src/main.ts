require('dotenv').config();
import bodyParser from 'body-parser';
import cors, {CorsOptionsDelegate} from 'cors';
import express, {NextFunction, Request, Response} from 'express';
import rateLimit from 'express-rate-limit';
import http from 'http';
import morgan from 'morgan';
import {Router} from './api/router';
import {config} from './config';
import {MongoClient} from './connections';
import {Errors} from './interface';
import {ErrorManager} from './utils';

export const initialize = async () => {
  try {
    const {port, environment, allowedOrigins} = config;

    await MongoClient.setup();

    const app = express();

    const corsOriginDelegate: CorsOptionsDelegate = (req, callback) => {
      const origin = req.headers?.origin;

      // Allow requests with no origin (e.g., mobile apps, Postman)
      if (!origin || (allowedOrigins || []).includes(origin)) {
        callback(null, {origin: true});
      } else {
        callback(new Error('Access Blocked by CORS'));
      }
    };

    if (allowedOrigins) {
      app.use(cors(corsOriginDelegate));
    } else {
      app.use(cors());
    }

    // Enable rate limiting for all requests
    const limiter = rateLimit({
      windowMs: 15 * 60 * 1000, // 15 minutes
      max: 100, // limit each IP to 100 requests per windowMs
    });
    app.use(limiter);

    // Body parser for request body
    app.use(bodyParser.urlencoded({limit: '200mb', extended: true}));
    app.use((req: Request, res: Response, next: NextFunction) => {
      bodyParser.json({limit: '200mb'})(req, res, err => {
        if (err) {
          return Promise.reject(ErrorManager.getError(Errors.BAD_REQUEST));
        }
        return next();
      });
    });

    // Configure app to use api requests logging
    app.use(
      morgan(
        ':current-time: [OPERATION] | :method | :url | :res[content-length] chars | :response-time ms - :status :status-code',
        {
          skip: (req: Request) => req.baseUrl === '/ping',
        }
      )
    );
    morgan.token('current-time', () => new Date().toISOString());
    morgan.token(
      'status-code',
      (req: Request, res: Response) => http.STATUS_CODES[res.statusCode] || ''
    );

    app.use('/ping', (req, res) => {
      res
        .status(200)
        .send(
          `<h1><center>NodeJS backend API Health Check: OK (${environment})</center></h1>`
        );
    });

    const router = new Router();
    router.init(app);

    app.listen(port, () => {
      console.log(
        `NodeJS backend listening on port ${port} in ${config.environment} mode.`
      );
    });
  } catch (err) {
    console.log('Failed to intialize NodeJS backend.');
    console.log(err);
  }
};

const shutdown = async () => {
  console.log('Closing all connection on the service...');

  await MongoClient.closeConnection();

  process.exitCode = 1;
  throw new Error('NodeJS backend has been shut down');
};

initialize();

// Gracefully shut-down server and close all connections
process.on('SIGINT', async () => await shutdown());
