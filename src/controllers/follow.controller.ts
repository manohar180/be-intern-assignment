import {Request, Response} from 'express';
import {AppDataSource} from '../data-source';
import {Follow} from '../entities/Follow';
import {User} from '../entities/User';

export class FollowController{
    private followRepository = AppDataSource.getRepository(Follow);

    async getAllFollows(req: Request, res: Response){
        try{
            const follows= await this.followRepository.find({relations: ['follower', 'following']})
            res.json(follows);
        }
        catch(error){
            res.status(500).json({message: "Error fetching follows", error});
        }
    }

    async getFollowById(req: Request, res: Response){
        try{
            const follow= await this.followRepository.findOne({
                where:{id: parseInt(req.params.id)},
                relations: ['follower', 'following'],
            })
            if(follow){
                res.json(follow);
            }
            else{
                res.status(404).json({message: "Follow not found"});
            }
        }
        catch(error){
            res.status(500).json({message: "Error fetching follow", error});
        }
    }
    async createFollow(req: Request, res: Response){
        try{
            const follower= await AppDataSource.getRepository(User).findOneBy({id: req.body.followerId});
            if(!follower){
                return res.status(404).json({message: 'Follower user not found'});
            }
            const following= await AppDataSource.getRepository(User).findOneBy({id: req.body.followingId});
            if(!following){
                return res.status(404).json({message: 'Following user not found'});
            }
            if(req.body.followerId === req.body.followingId){
                return res.status(400).json({message: 'User cannot follow themselves'});
            }
            const existingFollow= await this.followRepository.findOne({
                where: {followerId: req.body.followerId, followingId: req.body.followingId},
            })
            if(existingFollow){
                return res.status(400).json({message: 'User is already following this user'});
            }
            const follow= this.followRepository.create(req.body);
            const result= await this.followRepository.save(follow);
            res.status(201).json(result);
        }
        catch(error){
            res.status(500).json({message: "Error creating follow", error});
        }
    }
    async updateFollow(req: Request, res: Response){
        try{
            const follow= await this.followRepository.findOneBy({id: parseInt(req.params.id)});
            if(!follow){
                return res.status(404).json({message: 'Follow not found'});
            }
            this.followRepository.merge(follow, req.body);
            const result= await this.followRepository.save(follow);
            res.json(result);
        }
        catch(error){
            res.status(500).json({message: "Error updating follow", error});
        }
    }
    async deleteFollow(req: Request, res: Response){
        try{
            const result= await this.followRepository.delete(parseInt(req.params.id));
            if(result.affected === 0){
                return res.status(404).json({message: 'Follow not found'});
            }
            res.status(204).send();
        }
        catch(error){
            res.status(500).json({message: "Error deleting follow", error});
        }
    }
}