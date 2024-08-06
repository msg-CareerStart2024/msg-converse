import { ApiProperty } from '@nestjs/swagger';
import { Role } from '../enums/role.enum';
import {
    IsEmail,
    IsEnum,
    IsNotEmpty,
    IsString,
    MaxLength,
    MinLength
} from '@nestjs/class-validator';

export class CreateUserDTO {
    @ApiProperty({ description: 'The username of the user' })
    @IsNotEmpty()
    @IsString()
    @MinLength(2)
    username: string;

    @ApiProperty({ description: 'The email of the user' })
    @IsNotEmpty()
    @IsEmail()
    email: string;

    @ApiProperty({ description: 'The first name of the user' })
    @IsNotEmpty()
    @IsString()
    @MinLength(2)
    firstName: string;

    @ApiProperty({ description: 'The last name of the user' })
    @IsNotEmpty()
    @IsString()
    @MinLength(2)
    lastName: string;

    @ApiProperty({ description: 'The password of the user' })
    @IsNotEmpty()
    @IsString()
    @MinLength(6)
    @MaxLength(20)
    password: string;

    @ApiProperty({ description: 'The role of the user' })
    @IsNotEmpty()
    @IsEnum(Role)
    role: Role;

    constructor(
        username: string,
        email: string,
        firstName: string,
        lastName: string,
        password: string,
        role: Role
    ) {
        this.username = username;
        this.email = email;
        this.firstName = firstName;
        this.lastName = lastName;
        this.password = password;
        this.role = role;
    }
}
