import { Router } from 'express';
import { validate } from '../middleware/validation.middleware';
import { createPostSchema, updatePostSchema } from '../validations/post.validation';
import { PostController } from '../controllers/post.controller';
import { SpecialController } from '../controllers/special.controller';

export const postRouter = Router();
const postController = new PostController();
const specialController = new SpecialController();

postRouter.get('/hashtag/:tag', specialController.getPostsByHashtag.bind(specialController));
postRouter.get('/', postController.getAllPosts.bind(postController));
postRouter.get('/:id', postController.getPostById.bind(postController));
postRouter.post('/', validate(createPostSchema), postController.createPost.bind(postController));
postRouter.put('/:id', validate(updatePostSchema), postController.updatePost.bind(postController));
postRouter.delete('/:id', postController.deletePost.bind(postController));