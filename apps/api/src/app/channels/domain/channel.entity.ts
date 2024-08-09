import {
    Column,
    CreateDateColumn,
    Entity,
    JoinTable,
    ManyToMany,
    OneToMany,
    PrimaryGeneratedColumn
} from 'typeorm';

import { Topic } from './topic.entity';
import { Message } from '../../messages/domain/message.domain';
import { User } from '../../users/domain/user.domain';

@Entity('channels')
export class Channel {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column({ type: 'varchar', unique: true })
    name: string;

    @Column({ type: 'text', nullable: true })
    description: string;

    @CreateDateColumn({ name: 'created_at' })
    createdAt: Date;

    @ManyToMany(() => User)
    @JoinTable({
        name: 'enrollments',
        joinColumn: { name: 'channel_id', referencedColumnName: 'id' },
        inverseJoinColumn: { name: 'user_id', referencedColumnName: 'id' }
    })
    users: User[];

    @ManyToMany(() => Topic, topic => topic.channels)
    @JoinTable({
        name: 'channel_topics',
        joinColumn: { name: 'channel_id', referencedColumnName: 'id' },
        inverseJoinColumn: { name: 'topic_id', referencedColumnName: 'id' }
    })
    topics: Topic[];

    @OneToMany(() => Message, message => message.channel)
    messages: Message[];
}
