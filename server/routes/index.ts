import {Router} from 'express';
import * as colors from 'colors';

import {Resource} from './Resource';
import {PostResource} from './post/PostResource';
import {logger} from '../logger';

export class Routes {

  private apis: Resource[] = [new PostResource()];
  router: Router;

  constructor() {
    this.router = Router();
    this.apis.forEach((resource) => {
      this.router.use(resource.contextPath, resource.router);
      logger.debug(`Exposing "${resource.name}" routes on ${colors.blue(resource.contextPath) } context`);
    });
  }
}