import { Request, Response } from "express";
import {AppDataSource} from '../data-source';
import {Hashtag} from '../entities/Hashtag';
import {Post} from '../entities/Post';

export class HashtagController{
    private hashtagRepository = AppDataSource.getRepository(Hashtag);
    private postRepository = AppDataSource.getRepository(Post);

    async getAllHashtags(req: Request, res: Response){
        try{
            const hashtags= await this.hashtagRepository.find({relations: ['posts']})
            res.json(hashtags);
        }
        catch(error){
            res.status(500).json({message: 'Error fetching hashtags', error});
        }
    }
    async getHashtagById(req: Request, res: Response){
        try{
            const hashtag= await this.hashtagRepository.findOne({
                where:{id: parseInt(req.params.id)},
                relations: ['posts'],
            });
            if(!hashtag){
                return res.status(404).json({message: 'Hashtag not found'});
            }
            res.json(hashtag);
        }
        catch(error){
            res.status(500).json({message: 'Error fetching hashtag', error});
        }
    }
    async createHashtag(req: Request, res: Response){
        try{
            const name=req.body.name.toLowerCase().replace(/\s+/g, '');
            const existingHashtag= await this.hashtagRepository.findOneBy({name});
            if(existingHashtag){
                return res.status(400).json({message: 'Hashtag already exists'});
            }
            const hashtag= this.hashtagRepository.create({name});
            const result= await this.hashtagRepository.save(hashtag);
            res.status(201).json(result);
        }
        catch(error){
            res.status(500).json({message: 'Error creating hashtag', error});
        }
    }
    async updateHashtag(req: Request, res: Response){
        try{
            const hashtag= await this.hashtagRepository.findOneBy({id: parseInt(req.params.id)});
            if(!hashtag){
                return res.status(404).json({message: 'Hashtag not found'});
            }
            if(req.body.name){
                req.body.name=req.body.name.toLowerCase().replace(/\s+/g, '');
            }
            this.hashtagRepository.merge(hashtag, req.body);
            const result= await this.hashtagRepository.save(hashtag);
            res.json(result);
        }
        catch(error){
            res.status(500).json({message: 'Error updating hashtag', error});
        }
    }
    async deleteHashtag(req: Request, res: Response){
        try{
            const result= await this.hashtagRepository.delete(parseInt(req.params.id));
            if(result.affected === 0){
                return res.status(404).json({message: 'Hashtag not found'});
            }
            res.status(204).send();
        }
        catch(error){
            res.status(500).json({message: 'Error deleting hashtag', error});
        }
    }
    async addHashtagToPost(req: Request, res: Response){
        try{
            const post= await this.postRepository.findOne({
                where:{id: parseInt(req.params.postId)},
                relations: ['hashtags'],
            });
            if(!post){
                return res.status(404).json({message: 'Post not found'});
            }
            const hashtag= await this.hashtagRepository.findOneBy({id: parseInt(req.params.hashtagId)});
            if(!hashtag){
                return res.status(404).json({message: 'Hashtag not found'});
            }
            const alraedyTagged= post.hashtags.some(h=> h.id === hashtag.id);
            if(alraedyTagged){
                return res.status(400).json({message: 'Hashtag is already added to this post'});
            }
            post.hashtags.push(hashtag);
            await this.postRepository.save(post);
            res.status(201).json({message: 'Hashtag added to post', post});
        }
        catch(error){
            res.status(500).json({message: 'Error adding hashtag to post', error});
        }
    }
    async removeHashtagFromPost(req: Request, res: Response){
        try{
            const post= await this.postRepository.findOne({
                where:{id: parseInt(req.params.postId)},
                relations: ['hashtags'],
            });
            if(!post){
                return res.status(404).json({message: 'Post not found'});
            }
            post.hashtags= post.hashtags.filter(h=> h.id !== parseInt(req.params.hashtagId));
            await this.postRepository.save(post);
            res.json({message: 'Hashtag removed from post', post});
        }
        catch(error){
            res.status(500).json({message: 'Error removing hashtag from post', error});
        }
    }
}