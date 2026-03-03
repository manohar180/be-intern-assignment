import { Request, Response } from "express";
import {Post} from '../entities/Post';
import {AppDataSource} from '../data-source';

export class PostController{
    private postRepository = AppDataSource.getRepository(Post);
    async getAllPosts(req: Request, res: Response){
        try{
            const posts= await this.postRepository.find({
                relations: ['user'],
                order: {createdAt: 'DESC'},
            });
            res.json(posts);
        }
        catch(error){
            res.status(500).json({message: 'Error fetching posts', error});
        }
    }

    async getPostById(req: Request, res: Response){
        try{
            const post= await this.postRepository.findOne({
                where:{id: parseInt(req.params.id)},
                relations: ['user'],
            });
            if(!post){
                return res.status(404).json({message: 'Post not found'});
            }
            res.json(post);
        }
        catch(error){
            res.status(500).json({message: 'Error fetching post', error});
        }
    }

    async createPost(req: Request, res: Response){
        try{
            const user= await AppDataSource.getRepository('User').findOneBy({id: req.body.userId});
            if(!user){
                return res.status(404).json({message: 'User not found'});
            }
            const post= this.postRepository.create(req.body);
            const result=await this.postRepository.save(post);
            res.status(201).json(result);
        }
        catch(error){
            res.status(500).json({message: 'Error creating post', error});
        }
    }
    async updatePost(req: Request, res: Response){
        try{
            const post= await this.postRepository.findOneBy({id: parseInt(req.params.id)});
            if(!post){
                return res.status(404).json({message: 'Post not found'});
            }
            this.postRepository.merge(post, req.body);
            const result= await this.postRepository.save(post);
            res.json(result);
        }
        catch(error){
            res.status(500).json({message: 'Error updating post', error});
        }
    }
    async deletePost(req: Request, res: Response){
        try{
            const result= await this.postRepository.delete(parseInt(req.params.id));
            if(result.affected === 0){
                return res.status(404).json({message: 'Post not found'});
            }
            res.status(204).send();            
        }
        catch(error){
            res.status(500).json({message: 'Error deleting post', error});
        }
    }
}