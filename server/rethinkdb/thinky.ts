import * as thinkyConstructor from 'thinky';
import {dbOptions} from './conf';

export const thinky = thinkyConstructor(dbOptions);
export const DocumentNotFound = thinky.Errors.DocumentNotFound;