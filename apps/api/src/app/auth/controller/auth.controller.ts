import { Body, Controller, Post, Request, UseGuards } from '@nestjs/common';
import {
    ApiBadRequestResponse,
    ApiOkResponse,
    ApiOperation,
    ApiTags,
    ApiUnauthorizedResponse
} from '@nestjs/swagger';
import { CreateUserDTO } from '../../users/dto/create-user.dto';
import { UserDTO } from '../../users/dto/user.dto';
import { UserMapper } from '../../users/mapper/user.mapper';
import { UserService } from '../../users/service/user.service';
import { Public } from '../decorators/public.decorator';
import { LocalAuthGuard } from '../guards/local-auth.guard';
import { AuthService } from '../service/auth.service';
import { LoginResponse } from '../dto/login-response.dto';

@ApiTags('Authentication')
@Controller('auth')
export class AuthController {
    constructor(
        private readonly authService: AuthService,
        private readonly userService: UserService
    ) {}

    @Public()
    @UseGuards(LocalAuthGuard)
    @Post('login')
    @ApiOperation({
        summary: 'User login',
        description: 'Authenticate a user and return a JWT token'
    })
    @ApiOkResponse({
        description: 'User successfully logged in'
    })
    @ApiUnauthorizedResponse({ description: 'Incorrect email address or password' })
    async login(@Request() req): Promise<LoginResponse> {
        return await this.authService.login(req.user);
    }

    @Public()
    @ApiOkResponse({
        description: 'New user successfully created'
    })
    @ApiBadRequestResponse({ description: 'Incorrect user body' })
    @Post('register')
    async register(@Body() createUserDto: CreateUserDTO): Promise<UserDTO> {
        const user = UserMapper.createDtoToEntity(createUserDto);
        const newUser = await this.userService.create(user);
        return UserMapper.toDTO(newUser);
    }
}
