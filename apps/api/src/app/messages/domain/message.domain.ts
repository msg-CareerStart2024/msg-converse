import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { User } from '../../users/domain/user.domain';
import { Channel } from '../../channels/domain/channel.entity';

@Entity()
export class Message {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column({ nullable: false })
    content: string;

    @Column({ nullable: false, default: false })
    isPinned: boolean;

    @Column({ name: 'created_at', nullable: false })
    createdAt: Date;

    @ManyToOne(() => User, { eager: true })
    @JoinColumn({ name: 'user' })
    user: User;

    @ManyToOne(() => Channel, channel => channel.messages)
    @JoinColumn({ name: 'channel' })
    channel: Channel;
}
