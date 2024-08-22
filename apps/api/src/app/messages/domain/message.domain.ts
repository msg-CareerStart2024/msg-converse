import {
    Column,
    CreateDateColumn,
    Entity,
    JoinColumn,
    JoinTable,
    ManyToMany,
    ManyToOne,
    PrimaryGeneratedColumn
} from 'typeorm';
import { Channel } from '../../channels/domain/channel.entity';
import { User } from '../../users/domain/user.domain';

@Entity()
export class Message {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column({ nullable: false })
    content: string;

    @Column({ name: 'is_pinned', nullable: false, default: false })
    isPinned: boolean;

    @Column({ name: 'is_deleted', default: false })
    isDeleted: boolean;

    @CreateDateColumn({ name: 'created_at', nullable: false })
    createdAt: Date;

    @ManyToOne(() => User, { eager: true })
    @JoinColumn({ name: 'user_id' })
    user: User;

    @ManyToOne(() => Channel, channel => channel.messages)
    @JoinColumn({ name: 'channel_id' })
    channel: Channel;

    @ManyToMany(() => User, user => user.likes, { cascade: ['insert'], eager: true })
    @JoinTable({
        name: 'likes',
        joinColumn: { name: 'message_id', referencedColumnName: 'id' },
        inverseJoinColumn: { name: 'user_id', referencedColumnName: 'id' }
    })
    likes: User[];
}
