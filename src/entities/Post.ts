import{
    Entity,
    PrimaryGeneratedColumn,
    Column,
    CreateDateColumn,
    UpdateDateColumn,
    OneToMany,
    ManyToOne,
    ManyToMany,
    JoinColumn,
    Index,
} from 'typeorm';

import {User} from './User';
import {Hashtag} from './Hashtag';
import {Like} from './Like';

@Entity('posts')
export class Post{
    @PrimaryGeneratedColumn('increment')
    id: number;

    @Column({type:'text'})
    content: string;

    @Index()
    @Column()
    userId: number;

    @OneToMany(()=> Like, like=> like.post)
    likes: Like[];

    @ManyToOne(()=> User, {onDelete: 'CASCADE'})
    @JoinColumn({name: 'userId'})
    user: User;

    @ManyToMany(()=> Hashtag, hashtag=> hashtag.posts)
    hashtags: Hashtag[];

    @CreateDateColumn()
    createdAt: Date;

    @UpdateDateColumn()
    updatedAt: Date;
}