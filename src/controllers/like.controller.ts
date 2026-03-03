import {Request, Response} from 'express';
import {AppDataSource} from '../data-source';
import {Like} from '../entities/Like';
import {Post} from '../entities/Post';
import {User} from '../entities/User';

export class LikeController{
    private likeRepository = AppDataSource.getRepository(Like);

    async getAllLikes(req: Request, res: Response){
        try{
            const likes= await this.likeRepository.find({
                relations: ['user', 'post'],
            });
            res.json(likes);
        }
        catch(error){
            res.status(500).json({message: 'Error fetching likes', error});
        }
    }

    async getLikeById(req: Request, res: Response){
        try{
            const like= await this.likeRepository.findOne({
                where:{id: parseInt(req.params.id)},
                relations: ['user', 'post'],
            });
            if(!like){
                return res.status(404).json({message: 'Like not found'});
            }
            res.json(like);
        }
        catch(error){
            res.status(500).json({message: 'Error fetching like', error});
        }
    }
    async createLike(req: Request, res: Response){
        try{
            const user= await AppDataSource.getRepository(User).findOneBy({id: req.body.userId});
            if(!user){
                return res.status(404).json({message: 'User not found'});
            }
            const post= await AppDataSource.getRepository(Post).findOneBy({id: req.body.postId});
            if(!post){
                return res.status(404).json({message: 'Post not found'});
            }
            const existingLike= await this.likeRepository.findOneBy({userId: req.body.userId, postId: req.body.postId});
            if(existingLike){
                return res.status(400).json({message: 'User has already liked this post'});
            }
            const like= this.likeRepository.create(req.body);
            const result= await this.likeRepository.save(like);
            res.status(201).json(result);
        }
        catch(error){
            res.status(500).json({message: 'Error creating like', error});
        }
    }
    async updateLike(req: Request, res: Response){
        try{
            const like= await this.likeRepository.findOneBy({id: parseInt(req.params.id)});
            if(!like){
                return res.status(404).json({message: 'Like not found'});
            }
            this.likeRepository.merge(like, req.body);
            const result= await this.likeRepository.save(like);
            res.json(result);
        }
        catch(error){
            res.status(500).json({message: 'Error updating like', error});
        }
    }
    async deleteLike(req: Request, res: Response){
        try{
            const result= await this.likeRepository.delete(parseInt(req.params.id));
            if(result.affected === 0){
                return res.status(404).json({message: 'Like not found'});
            }
            res.status(204).send();
        }
        catch(error){
            res.status(500).json({message: 'Error deleting like', error});
        }
    }
}