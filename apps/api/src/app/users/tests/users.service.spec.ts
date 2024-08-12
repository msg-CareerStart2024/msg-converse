import { Test, TestingModule } from '@nestjs/testing';
import { UserRepository } from '../repository/user.repository';
import { UserService } from '../service/user.service';
import { User } from '../domain/user.domain';
import { Role } from '../enums/role.enum';

describe('UserService', () => {
    let userService: UserService;
    let userRepository: jest.Mocked<UserRepository>;

    const users: User[] = [
        {
            id: '73ec7a0d-a499-4304-9629-670e5eebdc9d',
            email: 'User.Name@msg.group',
            firstName: 'User',
            lastName: 'Name',
            password: 'password',
            role: Role.ADMIN
        },
        {
            id: '97803cd1-c6ca-49f6-be11-5650b251c8a1',
            email: 'Second.User@msg.group',
            firstName: 'Second',
            lastName: 'User',
            password: 'password',
            role: Role.USER
        }
    ];

    beforeEach(async () => {
        userRepository = {
            create: jest.fn(),
            getByEmail: jest.fn(),
            getById: jest.fn(),
            update: jest.fn()
        } as unknown as jest.Mocked<UserRepository>;

        const module: TestingModule = await Test.createTestingModule({
            providers: [UserService, { provide: UserRepository, useValue: userRepository }]
        }).compile();

        userService = module.get<UserService>(UserService);
    });

    it('should be defined', () => {
        expect(userService).toBeDefined();
    });

    it('should create a user', async () => {
        userRepository.create.mockResolvedValue(users[0]);

        const result = await userService.create(users[0]);

        expect(result).toEqual(users[0]);
        expect(userRepository.create).toHaveBeenCalledWith(users[0]);
    });

    it('should find a user by email address', async () => {
        userRepository.getByEmail.mockImplementation(async (email: string): Promise<User> => {
            return users.find(user => user.email === email);
        });

        const result = await userService.getByEmail(users[0].email);

        expect(result).toEqual(users[0]);
        expect(userRepository.getByEmail).toHaveBeenCalledWith(users[0].email);
    });

    it('should find a user by id', async () => {
        userRepository.getById.mockImplementation(async (id: string): Promise<User> => {
            return users.find(user => user.id === id);
        });

        const result = await userService.getById(users[0].id);

        expect(result).toEqual(users[0]);
        expect(userRepository.getById).toHaveBeenCalledWith(users[0].id);
    });

    it('should update a user', async () => {
        const updatedUser: User = {
            ...users[0],
            firstName: 'Updated'
        };
        userRepository.update.mockResolvedValue(updatedUser);

        const result = await userService.update(users[0].id, updatedUser);

        expect(result).toEqual(updatedUser);
        expect(userRepository.update).toHaveBeenCalledWith(users[0].id, updatedUser);
    });
});
