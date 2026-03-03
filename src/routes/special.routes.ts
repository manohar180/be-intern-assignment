import {Router} from 'express';
import {SpecialController} from '../controllers/special.controller';

export const specialRouter = Router();
const specialController = new SpecialController();

specialRouter.get('/feed', specialController.getFeed.bind(specialController));
specialRouter.get('/hashtags/:hashtag', specialController.getPostsByHashtag.bind(specialController));
specialRouter.get('/users/:id/followers', specialController.getUserFollowers.bind(specialController));
specialRouter.get('/users/:id/activity', specialController.getUserActivity.bind(specialController));