
import {Request, Response} from 'express';
import * as r from 'rethinkdb';
import * as config from 'config';

import {errors} from '../middlewares/errors';
import {logger} from '../logger';

const rethinkdbConfig = config.get<r.ConnectionOptions>('rethinkdb');
export const dbOptions= {
		host: process.env.DB_PORT_28015_TCP_ADDR || rethinkdbConfig.host,
		port: process.env.DB_PORT_28015_TCP_PORT || rethinkdbConfig.port,
		authKey: rethinkdbConfig.authKey,
		db: rethinkdbConfig.db
	};

export function createConnection(): Promise<r.Connection> {
  return r.connect({ host: dbOptions.host, port: dbOptions.port })
    .then(conn => {
      conn['_id'] = Math.floor(Math.random() * 10001);
      return conn;
    });
}