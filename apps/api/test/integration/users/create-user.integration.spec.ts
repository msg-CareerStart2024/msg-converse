import { Test, TestingModule } from '@nestjs/testing';
import { UserRepository } from '../../../src/app/users/repository/user.repository';
import { UserService } from '../../../src/app/users/service/user.service';
import { mockUser, mockUserDto } from '../../../src/app/users/__mocks__/user.mock';

describe('UserService - create Integration Test', () => {
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

    describe('create', () => {
        it('should create a new user successfully', async () => {
            userRepository.create.mockResolvedValue({
                ...mockUser,
                id: '73ec7a0d-a499-4304-9629-670e5eebdc9d'
            });

            const result = await userService.create(mockUserDto);

            expect(result).toEqual({ ...mockUser, id: '73ec7a0d-a499-4304-9629-670e5eebdc9d' });
            expect(userRepository.create).toHaveBeenCalled();
        });

        it('should handle database error for duplicate email', async () => {
            const duplicateError = new Error('Duplicate entry');
            userRepository.create.mockRejectedValue(duplicateError);

            await expect(userService.create(mockUserDto)).rejects.toThrow(duplicateError);
            expect(userRepository.create).toHaveBeenCalled();
        });

        it('should handle database error for empty first name', async () => {
            const emptyError = new Error('Empty field');
            userRepository.create.mockRejectedValue(emptyError);

            await expect(userService.create({ ...mockUserDto, firstName: '' })).rejects.toThrow(
                emptyError
            );
            expect(userRepository.create).toHaveBeenCalled();
        });

        it('should handle database error for empty last name', async () => {
            const emptyError = new Error('Empty field');
            userRepository.create.mockRejectedValue(emptyError);

            await expect(userService.create({ ...mockUserDto, lastName: '' })).rejects.toThrow(
                emptyError
            );
            expect(userRepository.create).toHaveBeenCalled();
        });

        it('should handle database error for empty email', async () => {
            const emptyError = new Error('Empty field');
            userRepository.create.mockRejectedValue(emptyError);

            await expect(userService.create({ ...mockUserDto, email: '' })).rejects.toThrow(
                emptyError
            );
            expect(userRepository.create).toHaveBeenCalled();
        });

        it('should handle database error for empty password', async () => {
            const emptyError = new Error('Empty field');
            userRepository.create.mockRejectedValue(emptyError);

            await expect(userService.create({ ...mockUserDto, password: '' })).rejects.toThrow(
                emptyError
            );
            expect(userRepository.create).toHaveBeenCalled();
        });
    });
});
