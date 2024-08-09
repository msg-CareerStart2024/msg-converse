import {
    Column,
    CreateDateColumn,
    Entity,
    JoinColumn,
    ManyToOne,
    PrimaryGeneratedColumn
} from 'typeorm';
import { User } from '../../users/domain/user.domain';
import { Channel } from '../../channels/domain/channel.entity';

@Entity()
export class Message {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column({ nullable: false })
    content: string;

    @Column({ name: 'is_pinned', nullable: false, default: false })
    isPinned: boolean;

    @CreateDateColumn({ name: 'created_at' })
    createdAt: Date;

    @ManyToOne(() => User, { eager: true })
    @JoinColumn({ name: 'user_id' })
    user: User;

    @ManyToOne(() => Channel, channel => channel.messages)
    @JoinColumn({ name: 'channel_id' })
    channel: Channel;
}
