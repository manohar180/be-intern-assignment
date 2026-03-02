import{
    Entity,
    PrimaryGeneratedColumn,
    Column,
    CreateDateColumn,
    UpdateDateColumn,
    ManyToOne,
    OneToMany,
    JoinColumn,
    Index,
} from 'typeorm';

import {User} from './User';

@Entity('posts')
export class Post{
    @PrimaryGeneratedColumn('increment')
    id: number;

    @Column({type:'text'})
    content: string;

    @Index()
    @Column()
    userId: number;

    @ManyToOne(()=> User, {onDelete: 'CASCADE'})
    @JoinColumn({name: 'userId'})
    user: User;

    @CreateDateColumn()
    createdAt: Date;

    @UpdateDateColumn()
    updatedAt: Date;
}