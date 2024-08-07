import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';
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

    @Column({ default: Role.USER })
    role: Role;

    constructor(email: string, firstName: string, lastName: string, password: string, role: Role) {
        this.email = email;
        this.firstName = firstName;
        this.lastName = lastName;
        this.password = password;
        this.role = role;
    }
}
