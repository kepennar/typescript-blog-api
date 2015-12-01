import {ConnectionOptions} from 'rethinkdb';
import {Document, Model} from 'thinky';

import {IComment, Comment} from './Comment';
import {thinky} from '../../../rethinkdb/thinky';

const type = thinky.type;
const r = thinky.r;
const createModel = thinky.createModel;

// Exported interface
export interface IPost {
  id?: string;
  userRate?: number;
  numRates?: number;
  name: string;
  text: string;
  createdAt?: Date;
  comments?: Comment[];
}

const Post = createModel.call(thinky, 'Post',
  {
    id: type.string(),
    userRate: type.number().default(null),
    numRates: type.number().default(0),
    name: type.string().required(),
    text: type.string().required(),
    createdAt: type.date().optional().default(r.now())
  });
Post.ensureIndex('createdAt');
Post.ensureIndex('userRate');

// A post has multiple comments
Post.hasMany(Comment, 'comments', 'id', 'postId');
Comment.belongsTo(Post, 'post', 'postId', 'id');


// Exported functions //

export function find(start: number = 0, pageNumber: number = 1, size: number = 10): Promise<IPost[]> {
  const end = pageNumber * size + start;
  return Post.orderBy('-createdAt').slice(start, end);
}

export function save(post: IPost): Promise<any> {
  return Post.save(post);
}

export function update(postId: string, updatedPost: IPost): Promise<any> {
  return Post.get(postId).run()
  .then(function(post) {
    return post.merge(updatedPost).save();
  });
}

export function detail(postId: string): Promise<IPost> {
  return Post.get(postId);
}

export function deletePost(postId: string): Promise<any> {
  return Post.get(postId)
  .then(function(post) {
    return post.delete();
  });
    
}

export function getComments(postId: string): Promise<IPost> {
  return Post.get(postId).getJoin({ comments: { _order: 'createdAt' } })
    .run();
}

export function comment(comment: IComment): Promise<any> {
  return Comment.save(comment);
}

export function rate(postId: string, rate: number): Promise<any> {
  return Post.get(postId).update(function(post) {
    const numRates = post('numRates');
    const userRate = post('userRate');
    
    const numRatesPlusOne = numRates.add(1);
    return r.branch(
      post('numRates').gt(0),
      {
        userRate: (userRate.mul(numRates).add(rate)).div(numRatesPlusOne),
        numRates: numRatesPlusOne 
      },
      {
        userRate: rate,
        numRates: numRatesPlusOne
      });
  }, {
      nonAtomic: true
    }).run();
}
