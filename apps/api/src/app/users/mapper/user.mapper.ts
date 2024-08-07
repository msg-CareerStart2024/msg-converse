import { User } from '../domain/user.domain';
import { CreateUserDTO } from '../dto/create-user.dto';
import { UserDTO } from '../dto/user.dto';
import { UpdateUserDTO } from '../dto/update-user.dto';

export class UserMapper {
    static toDTO(user: User): UserDTO {
        return new UserDTO(
            user.id,
            user.username,
            user.email,
            user.firstName,
            user.lastName,
            user.role
        );
    }

    static createDTOToEntity(creteUserDTO: CreateUserDTO): User {
        return new User(
            creteUserDTO.username,
            creteUserDTO.email,
            creteUserDTO.firstName,
            creteUserDTO.lastName,
            creteUserDTO.password,
            creteUserDTO.role
        );
    }

    static updateDTOToEntity(updateUserDTO: UpdateUserDTO): User {
        return new User(
            updateUserDTO.username,
            updateUserDTO.email,
            updateUserDTO.firstName,
            updateUserDTO.lastName,
            updateUserDTO.password,
            updateUserDTO.role
        );
    }
}
