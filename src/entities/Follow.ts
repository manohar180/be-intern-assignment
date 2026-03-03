import{
    Entity,
    PrimaryGeneratedColumn,
    Column,
    CreateDateColumn,
    ManyToOne,
    JoinColumn,
    Index,
    Unique,
} from 'typeorm';

import {User} from './User';

@Entity('follows')
@Unique(['followerId', 'followingId'])
export class Follow{
    @PrimaryGeneratedColumn('increment')
    id: number;

    @Index()
    @Column()
    followerId: number;

    @Index()
    @Column()
    followingId: number;

    @ManyToOne(()=> User, {onDelete: 'CASCADE'})
    @JoinColumn({name: 'followerId'})
    follower: User;

    @ManyToOne(()=> User, {onDelete: 'CASCADE'})
    @JoinColumn({name: 'followingId'})
    following: User;

    @CreateDateColumn()
    createdAt: Date;
}