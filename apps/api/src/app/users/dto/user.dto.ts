import { ApiProperty } from '@nestjs/swagger';
import { Role } from '../enums/role.enum';

export class UserDTO {
    @ApiProperty({ description: 'The id of the user' })
    id: string;

    @ApiProperty({ description: 'The username of the user' })
    username: string;

    @ApiProperty({ description: 'The email of the user' })
    email: string;

    @ApiProperty({ description: 'The first name of the user' })
    firstName: string;

    @ApiProperty({ description: 'The last name of the user' })
    lastName: string;

    @ApiProperty({ description: 'The role of the user' })
    role: Role;

    constructor(
        id: string,
        username: string,
        email: string,
        firstName: string,
        lastName: string,
        role: Role
    ) {
        this.id = id;
        this.username = username;
        this.email = email;
        this.firstName = firstName;
        this.lastName = lastName;
        this.role = role;
    }
}
