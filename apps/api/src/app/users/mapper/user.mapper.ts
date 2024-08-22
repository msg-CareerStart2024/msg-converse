import { User } from '../domain/user.domain';
import { CreateUserDTO } from '../dto/create-user.dto';
import { UserDTO } from '../dto/user.dto';

export class UserMapper {
    static toDTO(user: User): UserDTO {
        const { id, email, firstName, lastName, role } = user;
        return { id, email, firstName, lastName, role };
    }

    static fromCreateDto(createUserDto: CreateUserDTO): Omit<User, 'id'> {
        const { email, firstName, lastName, password, role } = createUserDto;
        return {
            email,
            firstName,
            lastName,
            password,
            role,
            messagesLiked: []
        };
    }
    static fromDto(userDto: UserDTO): User {
        const { id, email, firstName, lastName, role } = userDto;
        return {
            id,
            email,
            firstName,
            lastName,
            password: undefined,
            role,
            messagesLiked: undefined
        };
    }
}
