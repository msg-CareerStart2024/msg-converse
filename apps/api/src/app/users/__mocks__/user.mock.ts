import { User } from '../domain/user.domain';
import { CreateUserDTO } from '../dto/create-user.dto';
import { Role } from '../enums/role.enum';

export const mockUserDto: CreateUserDTO = {
    email: 'User.Name@msg.group',
    firstName: 'User',
    lastName: 'Name',
    password: 'password',
    role: Role.ADMIN
};

export const mockHashedPassword = '$2a$10$ybI3Jp37Omjr9A1gSbo4ru4W9ApfY9Su4RStqFNbAs2Ta8a05n6SC';

export const mockUser: Omit<User, 'id'> = {
    ...mockUserDto,
    password: mockHashedPassword,
    likedMessages: []
};

export const mockUsers: User[] = [
    {
        id: '73ec7a0d-a499-4304-9629-670e5eebdc9d',
        email: 'User.Name@msg.group',
        firstName: 'User',
        lastName: 'Name',
        password: 'password',
        role: Role.ADMIN,
        likedMessages: []
    },
    {
        id: '97803cd1-c6ca-49f6-be11-5650b251c8a1',
        email: 'Second.User@msg.group',
        firstName: 'Second',
        lastName: 'User',
        password: 'password',
        role: Role.USER,
        likedMessages: []
    }
];
