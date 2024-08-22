import { Column, Entity, ManyToMany, PrimaryGeneratedColumn } from 'typeorm';
import { Message } from '../../messages/domain/message.domain';
import { Role } from '../enums/role.enum';

@Entity()
export class User {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column({ unique: true, nullable: false })
    email: string;

    @Column({ name: 'first_name', nullable: false })
    firstName: string;

    @Column({ name: 'last_name', nullable: false })
    lastName: string;

    @Column({ nullable: false })
    password: string;

    @Column({ type: 'enum', enum: Role, default: Role.USER })
    role: Role;

    @ManyToMany(() => Message, message => message.usersWhoLiked)
    messagesLiked: Message[];
}
