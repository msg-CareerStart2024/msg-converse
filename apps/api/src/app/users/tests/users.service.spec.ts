import { Test, TestingModule } from '@nestjs/testing';
import { UserRepository } from '../repository/user.repository';
import { UserService } from '../service/user.service';
import { User } from '../domain/user.domain';
import { mockUsers } from '../__mocks__/user.mock';

describe('UserService', () => {
    let userService: UserService;
    let userRepository: jest.Mocked<UserRepository>;

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

    afterEach(() => {
        jest.clearAllMocks();
    });

    it('should be defined', () => {
        expect(userService).toBeDefined();
    });

    it('should create a user', async () => {
        userRepository.create.mockResolvedValue(mockUsers[0]);

        const result = await userService.create(mockUsers[0]);

        expect(result).toEqual(mockUsers[0]);
        expect(userRepository.create).toHaveBeenCalledWith(mockUsers[0]);
    });

    it('should find a user by email address', async () => {
        userRepository.getByEmail.mockImplementation(async (email: string): Promise<User> => {
            return mockUsers.find(user => user.email === email);
        });

        const result = await userService.getByEmail(mockUsers[0].email);

        expect(result).toEqual(mockUsers[0]);
        expect(userRepository.getByEmail).toHaveBeenCalledWith(mockUsers[0].email);
    });

    it('should find a user by id', async () => {
        userRepository.getById.mockImplementation(async (id: string): Promise<User> => {
            return mockUsers.find(user => user.id === id);
        });

        const result = await userService.getById(mockUsers[0].id);

        expect(result).toEqual(mockUsers[0]);
        expect(userRepository.getById).toHaveBeenCalledWith(mockUsers[0].id);
    });

    it('should update a user', async () => {
        const updatedUser: User = {
            ...mockUsers[0],
            firstName: 'Updated'
        };
        userRepository.update.mockResolvedValue(updatedUser);

        const result = await userService.update(mockUsers[0].id, updatedUser);

        expect(result).toEqual(updatedUser);
        expect(userRepository.update).toHaveBeenCalledWith(mockUsers[0].id, updatedUser);
    });
});
