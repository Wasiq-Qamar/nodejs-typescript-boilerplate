import mongoose from 'mongoose';
import {config} from '../config';

let client: mongoose.Mongoose;
class MongoClient {
  static async setup(): Promise<void> {
    const {
      mongo: {uri, db},
    } = config;

    /**
     * Mongo URI Description:
     * protocol://username:password@host:port1,host:port2/database?replicaSet=name_of_your_replica_set
     * Example: mongodb://username:password@localhost:27017,localhost:27018/admin?replicaSet=myReplicaSet
     */

    client = await mongoose.connect(uri, {
      dbName: db,
    });
    console.log('Successfully connected to MongoDB');
  }

  static async getInstance(): Promise<mongoose.Mongoose> {
    if (!client) {
      await this.setup();
    }

    return client;
  }

  static async closeConnection(): Promise<void> {
    await mongoose.connection.close();
  }
}

export {MongoClient};
