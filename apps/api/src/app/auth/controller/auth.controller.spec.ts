import { Test, TestingModule } from '@nestjs/testing';
import { CreateUserDTO } from '../../users/dto/create-user.dto';
import { UserDTO } from '../../users/dto/user.dto';
import { Role } from '../../users/enums/role.enum';
import { UserMapper } from '../../users/mapper/user.mapper';
import { UserService } from '../../users/service/user.service';
import { AuthService } from '../service/auth.service';
import { AuthController } from './auth.controller';

describe('AuthController', () => {
    let authController: AuthController;
    let authService: AuthService;
    let userService: UserService;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            controllers: [AuthController],
            providers: [
                {
                    provide: AuthService,
                    useValue: {
                        login: jest.fn()
                    }
                },
                {
                    provide: UserService,
                    useValue: {
                        create: jest.fn()
                    }
                }
            ]
        }).compile();

        authController = module.get<AuthController>(AuthController);
        authService = module.get<AuthService>(AuthService);
        userService = module.get<UserService>(UserService);
    });

    describe('login', () => {
        it('should return a LoginResponse on successful login', async () => {
            const mockUser = {
                id: '1',
                email: 'test@example.com',
                password: 'password123',
                firstName: 'John',
                lastName: 'Doe',
                role: Role.USER
            };
            const mockLoginResponse = { user: mockUser, accessToken: 'some-token' };

            jest.spyOn(authService, 'login').mockResolvedValue(mockLoginResponse);

            const result = await authController.login({ user: mockUser });

            expect(result).toEqual(mockLoginResponse);
            expect(authService.login).toHaveBeenCalledWith(mockUser);
        });

        it('should throw an error if login fails', async () => {
            const mockUser = { id: '1', email: 'test@example.com' };

            jest.spyOn(authService, 'login').mockRejectedValue(new Error('Unauthorized'));

            await expect(authController.login({ user: mockUser })).rejects.toThrow('Unauthorized');
            expect(authService.login).toHaveBeenCalledWith(mockUser);
        });
    });

    describe('register', () => {
        it('should return a UserDTO on successful registration', async () => {
            const mockCreateUserDTO: CreateUserDTO = {
                email: 'newuser@example.com',
                password: 'password123',
                firstName: 'John',
                lastName: 'Doe',
                role: Role.USER
            };
            const mockUser = { ...mockCreateUserDTO, id: '1' };
            const mockUserDTO: UserDTO = {
                id: '1',
                email: 'newuser@example.com',
                firstName: 'John',
                lastName: 'Doe',
                role: Role.USER
            };

            jest.spyOn(UserMapper, 'fromCreateDto').mockReturnValue(mockUser);
            jest.spyOn(userService, 'create').mockResolvedValue(mockUser);
            jest.spyOn(UserMapper, 'toDTO').mockReturnValue(mockUserDTO);

            const result = await authController.register(mockCreateUserDTO);

            expect(result).toEqual(mockUserDTO);
            expect(UserMapper.fromCreateDto).toHaveBeenCalledWith(mockCreateUserDTO);
            expect(userService.create).toHaveBeenCalledWith(mockUser);
            expect(UserMapper.toDTO).toHaveBeenCalledWith(mockUser);
        });

        it('should throw an error if registration fails', async () => {
            const mockCreateUserDTO: CreateUserDTO = {
                email: 'newuser@example.com',
                password: 'password123',
                firstName: 'John',
                lastName: 'Doe',
                role: Role.USER
            };

            jest.spyOn(userService, 'create').mockRejectedValue(new Error('Bad Request'));

            await expect(authController.register(mockCreateUserDTO)).rejects.toThrow('Bad Request');
            expect(userService.create).toHaveBeenCalled();
        });
    });
});
