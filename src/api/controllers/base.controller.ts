import mongoose from 'mongoose';
import {AppContext} from '../../interface';

class BaseController {
  protected dbSession: mongoose.mongo.ClientSession;
  protected context: AppContext;

  constructor(context: AppContext, dbSession: mongoose.mongo.ClientSession) {
    this.context = context;
    this.dbSession = dbSession;
  }
}

export {BaseController};
