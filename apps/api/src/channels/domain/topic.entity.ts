import { Column, Entity, ManyToMany, PrimaryGeneratedColumn } from 'typeorm';

import { Channel } from './channel.entity';

@Entity('topics')
export class Topic {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column({ type: 'varchar', nullable: false, unique: true })
    name: string;

    @ManyToMany(() => Channel, channel => channel.topics)
    channels: Channel[];
}
