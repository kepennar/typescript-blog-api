import {Request, Response} from 'express';

export const cors = function(req: Request, res: Response, next: Function) {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'POST, GET, HEAD');
  res.header('Access-Control-Allow-Headers', '*');

  next();
};
