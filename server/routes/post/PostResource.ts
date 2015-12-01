import {Router, Request, Response} from 'express';
import {json} from 'body-parser';

import {Resource} from '../Resource';
import {logger} from '../../logger';
import {cors} from '../../middlewares/cors';
import {IComment} from './model/Comment';
import {DocumentNotFound} from '../../rethinkdb/thinky';

import {
  IPost,
  find,
  save,
  deletePost,
  detail,
  comment,
  getComments,
  rate,
  update
} from './model/Post';

export class PostResource implements Resource {
  router: Router;
  name: string = 'PostResource';
  contextPath: string = '/api/posts';

  constructor() {
    this.router = Router();
    this.configureRoute();
  }

  private list(req: Request, res: Response) {
    var begin = req.query.begin;
    var page = req.query.page;
    var size = req.query.size;

    find(begin, page, size)
      .then((posts: IPost[]) => res.status(200).json(posts))
      .catch((err: any) => {
        logger.error(err);
        res.status(500).send(err);
      }
      );
  }

  private detail(req: Request, res: Response) {
    var postId = req.params.postId;

    detail(postId)
      .then((post: IPost) => {
        logger.debug(post);
        res.status(200).json(post);
      })
      .catch(DocumentNotFound, () => {res.status(404).send('Not found')})
      .catch((err: any) => {
        logger.error(err);
        res.status(500).send(err);
      }
      );
  }

  private create(req: Request, res: Response) {
    const post: IPost = {
      name: req.body.name,
      text: req.body.text
    };
    save(post)
      .then(() => res.status(201).json('Thank you'))
      .catch((err) => {
        logger.error(err);
        res.status(400).send(err);
      })
  }
  
  private update(req: Request, res: Response) {
    const postId: string = req.params.postId;
    const post: IPost = {

      name: req.body.name,
      text: req.body.text
    };
    update(postId, post)
      .then(() => res.status(201).json('Thank you'))
      .catch((err) => {
        logger.error(err);
        res.status(400).send(err);
      })
  }
  
  private delete(req: Request, res: Response) {
    const postId: string = req.params.postId;
    deletePost(postId)
      .then(() => res.status(200).json('Deleted'))
      .catch((err) => {
        logger.error(err);
        res.status(500).send(err);
      })
  }

  private comment(req: Request, res: Response) {
    const com: IComment = {
      postId: req.params.postId,
      text: req.body.text
    }
    logger.debug('Create comment', com);
    comment(com)
      .then(() => res.status(201).json('Commented'))
      .catch((err) => {
        logger.error(err);
        res.status(400).send(err);
      })
  }
  
  private getComments(req: Request, res: Response) {
    const postId: string = req.params.postId;
    getComments(postId)
      .then((post: IPost) => res.status(201).json(post.comments))
      .catch((err) => {
        logger.error(err);
        res.status(500).send(err);
      })
  }
  private rate(req: Request, res: Response) {
    const postId: string = req.params.postId;
    const userRate: number = req.body.rate;
    rate(postId, userRate)
      .then(() => res.status(201).json('Rated'))
      .catch((err) => {
        logger.error(err);
        res.status(400).send(err);
      })
  }
  
  private configureRoute() {

    this.router.use(cors);
    this.router.use(json());

    this.router.get('/', this.list);
    this.router.post('/', this.create);
    this.router.get('/:postId', this.detail);
    this.router.post('/:postId', this.create);
    this.router.put('/:postId', this.update);
    this.router.delete('/:postId', this.delete);
    this.router.get('/:postId/comments', this.getComments);
    this.router.post('/:postId/comments', this.comment);
    this.router.post('/:postId/rate', this.rate);
  }
}