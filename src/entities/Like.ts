import{
    Entity,
    PrimaryGeneratedColumn,
    Column,
    CreateDateColumn,
    ManyToOne,
    JoinColumn,
    Index,
    Unique,
}from 'typeorm';

import {User} from './User';
import {Post} from './Post';

@Entity('likes')
@Unique(['userId', 'postId'])
export class Like{
    @PrimaryGeneratedColumn('increment')
    id: number;

    @Index()
    @Column()
    userId: number;

    @Index()
    @Column()
    postId: number;

    @ManyToOne(()=> User, {onDelete: 'CASCADE'})
    @JoinColumn({name: 'userId'})
    user: User;

    @ManyToOne(()=> Post, post=> post.likes, {onDelete: 'CASCADE'})
    @JoinColumn({name: 'postId'})
    post: Post;

    @CreateDateColumn()
    createdAt: Date;
}