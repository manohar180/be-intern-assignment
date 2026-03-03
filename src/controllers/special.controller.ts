import { Request, Response } from 'express';
import { AppDataSource } from '../data-source';
import { Post } from '../entities/Post';
import { Follow } from '../entities/Follow';
import { Like } from '../entities/Like';
import { Hashtag } from '../entities/Hashtag';

export class SpecialController {

  async getFeed(req: Request, res: Response) {
    try {
      const userId = parseInt(req.query.userId as string);
      if (!userId) {
        return res.status(400).json({ message: 'userId query parameter is required' });
      }

      const limit = parseInt(req.query.limit as string) || 10;
      const offset = parseInt(req.query.offset as string) || 0;
      const follows = await AppDataSource.getRepository(Follow).find({
        where: { followerId: userId },
      });

      const followingIds = follows.map(f => f.followingId);
      if (followingIds.length === 0) {
        return res.json({
          data: [],
          total: 0,
          limit,
          offset,
          message: 'You are not following anyone yet',
        });
      }

      const [posts, total] = await AppDataSource.getRepository(Post)
        .createQueryBuilder('post')
        .leftJoinAndSelect('post.user', 'user')
        .leftJoinAndSelect('post.hashtags', 'hashtags')
        .leftJoin('post.likes', 'likes')
        .addSelect('COUNT(DISTINCT likes.id)', 'likeCount')
        .where('post.userId IN (:...followingIds)', { followingIds })
        .groupBy('post.id')
        .orderBy('post.createdAt', 'DESC')
        .limit(limit)
        .offset(offset)
        .getManyAndCount();

      res.json({
        data: posts,
        total,
        limit,
        offset,
      });
    } catch (error) {
      res.status(500).json({ message: 'Error fetching feed', error });
    }
  }

  async getPostsByHashtag(req: Request, res: Response) {
    try {
      const tag = req.params.tag.toLowerCase().replace('#', '');
      const limit = parseInt(req.query.limit as string) || 10;
      const offset = parseInt(req.query.offset as string) || 0;
      const hashtag = await AppDataSource.getRepository(Hashtag).findOne({
        where: { name: tag },
      });

      if (!hashtag) {
        return res.json({
          data: [],
          total: 0,
          limit,
          offset,
          message: `No posts found for hashtag #${tag}`,
        });
      }

      const [posts, total] = await AppDataSource.getRepository(Post)
        .createQueryBuilder('post')
        .leftJoinAndSelect('post.user', 'user')
        .leftJoinAndSelect('post.hashtags', 'hashtags')
        .leftJoin('post.likes', 'likes')
        .addSelect('COUNT(DISTINCT likes.id)', 'likeCount')
        .innerJoin('post.hashtags', 'searchHashtag')
        .where('searchHashtag.name = :tag', { tag })
        .groupBy('post.id')
        .orderBy('post.createdAt', 'DESC')
        .limit(limit)
        .offset(offset)
        .getManyAndCount();

      res.json({
        data: posts,
        total,
        limit,
        offset,
        hashtag: hashtag.name,
      });
    } catch (error) {
      res.status(500).json({ message: 'Error fetching posts by hashtag', error });
    }
  }

  async getUserFollowers(req: Request, res: Response) {
    try {
      const userId = parseInt(req.params.id);
      const limit = parseInt(req.query.limit as string) || 10;
      const offset = parseInt(req.query.offset as string) || 0;

      const [follows, total] = await AppDataSource.getRepository(Follow)
        .createQueryBuilder('follow')
        .leftJoinAndSelect('follow.follower', 'follower')
        .where('follow.followingId = :userId', { userId })
        .orderBy('follow.createdAt', 'DESC')
        .limit(limit)
        .offset(offset)
        .getManyAndCount();

      const followers = follows.map(f => ({
        id: f.follower.id,
        firstName: f.follower.firstName,
        lastName: f.follower.lastName,
        email: f.follower.email,
        followedAt: f.createdAt,
      }));

      res.json({
        data: followers,
        total,
        limit,
        offset,
      });
    } catch (error) {
      res.status(500).json({ message: 'Error fetching followers', error });
    }
  }

  async getUserActivity(req: Request, res: Response) {
    try {
      const userId = parseInt(req.params.id);
      const limit = parseInt(req.query.limit as string) || 10;
      const offset = parseInt(req.query.offset as string) || 0;
      const type = req.query.type as string;
      const startDate = req.query.startDate as string;
      const endDate = req.query.endDate as string;

      let activities: any[] = [];
      if (!type || type === 'post') {
        const postRepo = AppDataSource.getRepository(Post);
        let postQuery = postRepo
          .createQueryBuilder('post')
          .where('post.userId = :userId', { userId });

        if (startDate) postQuery = postQuery.andWhere('post.createdAt >= :startDate', { startDate });
        if (endDate) postQuery = postQuery.andWhere('post.createdAt <= :endDate', { endDate });

        const posts = await postQuery.getMany();
        activities.push(...posts.map(p => ({
          type: 'post',
          id: p.id,
          content: p.content,
          createdAt: p.createdAt,
        })));
      }

      if (!type || type === 'like') {
        const likeRepo = AppDataSource.getRepository(Like);
        let likeQuery = likeRepo
          .createQueryBuilder('like')
          .leftJoinAndSelect('like.post', 'post')
          .where('like.userId = :userId', { userId });

        if (startDate) likeQuery = likeQuery.andWhere('like.createdAt >= :startDate', { startDate });
        if (endDate) likeQuery = likeQuery.andWhere('like.createdAt <= :endDate', { endDate });

        const likes = await likeQuery.getMany();
        activities.push(...likes.map(l => ({
          type: 'like',
          id: l.id,
          post: l.post,
          createdAt: l.createdAt,
        })));
      }

      if (!type || type==='follow') {
        const followRepo = AppDataSource.getRepository(Follow);
        let followQuery = followRepo
          .createQueryBuilder('follow')
          .leftJoinAndSelect('follow.following', 'following')
          .where('follow.followerId = :userId', { userId });

        if (startDate) followQuery = followQuery.andWhere('follow.createdAt >= :startDate', { startDate });
        if (endDate) followQuery = followQuery.andWhere('follow.createdAt <= :endDate', { endDate });

        const follows = await followQuery.getMany();
        activities.push(...follows.map(f => ({
          type: 'follow',
          id: f.id,
          following: f.following,
          createdAt: f.createdAt,
        })));
      }

      activities.sort((a, b) =>
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      );

      const total = activities.length;
      const paginated = activities.slice(offset, offset + limit);
      res.json({
        data: paginated,
        total,
        limit,
        offset,
      });
    } catch (error) {
      res.status(500).json({ message: 'Error fetching user activity', error });
    }
  }
}