import { Body, Controller, Post, Request, UseGuards } from '@nestjs/common';
import { CreateUserDTO } from '../../users/dto/create-user.dto';
import { UserDTO } from '../../users/dto/user.dto';
import { UserMapper } from '../../users/mapper/user.mapper';
import { UserService } from '../../users/service/user.service';
import { Public } from '../decorators/public.decorator';
import { LocalAuthGuard } from '../guards/local-auth.guard';
import { AuthService } from '../service/auth.service';

@Controller('auth')
export class AuthController {
    constructor(
        private readonly authService: AuthService,
        private readonly userService: UserService
    ) {}

    @Public()
    @UseGuards(LocalAuthGuard)
    @Post('login')
    // @ApiOkResponse({
    //     description: 'New user successfully created'
    // })
    // @ApiNotFoundResponse({ description: 'User not found' })
    async login(@Request() req) {
        console.log(req.user);
        return await this.authService.login(req.user);
    }

    @Public()
    @Post('register')
    async register(@Body() createUserDto: CreateUserDTO): Promise<UserDTO> {
        const user = UserMapper.createDtoToEntity(createUserDto);
        const newUser = await this.userService.create(user);
        return UserMapper.toDTO(newUser);
    }
}
