import { Controller, Get, Param } from '@nestjs/common';
import { ApiNotFoundResponse, ApiOkResponse, ApiUnauthorizedResponse } from '@nestjs/swagger';
import { UserMapper } from '../mapper/user.mapper';
import { UserService } from '../service/user.service';

@Controller('users')
export class UsersController {
    constructor(private readonly userService: UserService) {}

    @ApiOkResponse({ description: 'Get user by id' })
    @ApiUnauthorizedResponse({ description: 'Invalid credentials' })
    @ApiNotFoundResponse({ description: 'User not found' })
    @Get(':id')
    async getUser(@Param('id') id: string) {
        const user = await this.userService.getById(id);
        return UserMapper.toDTO(user);
    }
}
