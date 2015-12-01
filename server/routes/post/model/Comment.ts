import {ConnectionOptions} from 'rethinkdb';
import {Document, Model} from 'thinky';

import {thinky} from '../../../rethinkdb/thinky';

const type = thinky.type;
const r = thinky.r;
const createModel = thinky.createModel;

export interface IComment {
  id?: string;
  postId: string,
  text: string;
  createdAt?: Date;
}

export const Comment = createModel.call(thinky, 'Comment',
  {
    id: type.string(),
    postId: type.string(),
    text: type.string().required(),
    createdAt: type.date().optional().default(r.now())
  });
Comment.ensureIndex('createdAt');
