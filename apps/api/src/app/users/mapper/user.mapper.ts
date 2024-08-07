import { User } from '../domain/user.domain';
import { CreateUserDTO } from '../dto/create-user.dto';
import { UserDTO } from '../dto/user.dto';
import { UpdateUserDTO } from '../dto/update-user.dto';

export class UserMapper {
    static toDTO(user: User): UserDTO {
        const { id, email, firstName, lastName, role } = user;
        return { id, email, firstName, lastName, role };
    }

    static createDtoToEntity(createUserDTO: CreateUserDTO): Omit<User, 'id'> {
        const { email, firstName, lastName, password, role } = createUserDTO;
        return { email, firstName, lastName, password, role };
    }

    static updateDtoToEntity(updateUserDTO: UpdateUserDTO): Omit<User, 'id'> {
        const { email, firstName, lastName, password, role } = updateUserDTO;
        return { email, firstName, lastName, password, role };
    }
}
