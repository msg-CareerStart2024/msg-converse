import { Controller, Delete, Get, Param } from '@nestjs/common';
import {
    ApiBearerAuth,
    ApiNotFoundResponse,
    ApiOkResponse,
    ApiTags,
    ApiUnauthorizedResponse
} from '@nestjs/swagger';
import { UserDTO } from '../dto/user.dto';
import { UserMapper } from '../mapper/user.mapper';
import { UserService } from '../service/user.service';

@ApiTags('Users')
@ApiBearerAuth()
@Controller('users')
export class UsersController {
    constructor(private readonly userService: UserService) {}

    @ApiOkResponse({ description: 'Get user by id' })
    @ApiUnauthorizedResponse({ description: 'Invalid credentials' })
    @ApiNotFoundResponse({ description: 'User not found' })
    @Get(':id')
    async get(@Param('id') id: string): Promise<UserDTO> {
        const user = await this.userService.getById(id);
        return UserMapper.toDTO(user);
    }

    @ApiOkResponse({ description: 'Delete user by id' })
    @ApiUnauthorizedResponse({ description: 'Invalid credentials' })
    @ApiNotFoundResponse({ description: 'User not found' })
    @Delete(':id')
    async delete(@Param('id') id: string): Promise<void> {
        return await this.userService.delete(id);
    }
}
