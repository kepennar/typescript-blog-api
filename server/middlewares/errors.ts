import {Request, Response} from 'express';
import {logger} from '../logger';

export const errors = function(err: any, req: Request, res: Response) {
  logger.error(err.stack);

  // respond with 500 "Internal Server Error".
  res.status(500);
  res.send('Internal Server Error');
}