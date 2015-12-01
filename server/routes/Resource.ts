import {Router} from 'express';

export interface Resource {
  name: string;
  router: Router;
  contextPath: string;
}