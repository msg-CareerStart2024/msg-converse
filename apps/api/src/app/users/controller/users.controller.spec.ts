import { Test, TestingModule } from '@nestjs/testing';
import { Role } from '../enums/role.enum';
import { UserService } from '../service/user.service';
import { UsersController } from './users.controller';

describe('UsersController', () => {
    let usersController: UsersController;
    let userService: UserService;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            controllers: [UsersController],
            providers: [
                {
                    provide: UserService,
                    useValue: {
                        getById: jest.fn()
                    }
                }
            ]
        }).compile();

        usersController = module.get<UsersController>(UsersController);
        userService = module.get<UserService>(UserService);
    });

    it('should be defined', () => {
        expect(usersController).toBeDefined();
    });

    it('should return a UserDTO on successful user creation', async () => {
        const mockUser = {
            id: '1',
            email: 'test@example.com',
            password: 'password123',
            firstName: 'John',
            lastName: 'Doe',
            role: Role.USER
        };
        jest.spyOn(userService, 'getById').mockResolvedValue(mockUser);

        const result = await usersController.get(mockUser.id);

        expect(result).toEqual({ ...mockUser, password: undefined });
        expect(userService.getById).toHaveBeenCalledWith(mockUser.id);
    });
});
