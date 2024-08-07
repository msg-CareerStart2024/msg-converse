import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { User } from '../../users/domain/user.domain';
// import {Channel} from '../../../channels/domain/channel.entity'

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

    @ManyToOne(() => User, user => user.messages, { eager: true })
    @JoinColumn({ name: 'user_id' })
    userId: string;

    // @ManyToOne(() => Channel, channel => channel.)
}
