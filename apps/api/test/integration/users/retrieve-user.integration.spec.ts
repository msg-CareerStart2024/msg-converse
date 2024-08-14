import { Test, TestingModule } from '@nestjs/testing';
import { UserRepository } from '../../../src/app/users/repository/user.repository';
import { UserService } from '../../../src/app/users/service/user.service';
import { mockUsers } from '../../../src/app/users/__mocks__/user.mock';

describe('UserService - retrieve Integration Test', () => {
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

    it('service should be defined', () => {
        expect(userService).toBeDefined();
    });

    describe('retrieve', () => {
        it('should retrieve user by email', async () => {
            const notFoundError = new Error('Not found');
            userRepository.getByEmail.mockImplementation(async email => {
                const user = mockUsers.find(user => user.email === email);
                if (!user) throw notFoundError;
                return user;
            });

            const result = await userService.getByEmail(mockUsers[0].email);

            expect(result).toEqual(mockUsers[0]);
            expect(userRepository.getByEmail).toHaveBeenCalledWith(mockUsers[0].email);
        });

        it('should not find by email', async () => {
            const notFoundError = new Error('Not found');
            userRepository.getByEmail.mockImplementation(async email => {
                const user = mockUsers.find(user => user.email === email);
                if (!user) throw notFoundError;
                return user;
            });

            await expect(userService.getByEmail('')).rejects.toThrow(notFoundError);
            expect(userRepository.getByEmail).toHaveBeenCalledWith('');
        });

        it('should retrieve user by id', async () => {
            const notFoundError = new Error('Not found');
            userRepository.getById.mockImplementation(async id => {
                const user = mockUsers.find(user => user.id === id);
                if (!user) throw notFoundError;
                return user;
            });

            const result = await userService.getById(mockUsers[0].id);

            expect(result).toEqual(mockUsers[0]);
            expect(userRepository.getById).toHaveBeenCalledWith(mockUsers[0].id);
        });

        it('should not find by email', async () => {
            const notFoundError = new Error('Not found');
            userRepository.getById.mockImplementation(async id => {
                const user = mockUsers.find(user => user.id === id);
                if (!user) throw notFoundError;
                return user;
            });

            await expect(userService.getById('')).rejects.toThrow(notFoundError);
            expect(userRepository.getById).toHaveBeenCalledWith('');
        });
    });
});
