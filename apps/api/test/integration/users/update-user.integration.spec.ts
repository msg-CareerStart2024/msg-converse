import { Test, TestingModule } from '@nestjs/testing';
import { UserRepository } from '../../../src/app/users/repository/user.repository';
import { UserService } from '../../../src/app/users/service/user.service';
import { mockUser } from '../../../src/app/users/__mocks__/user.mock';

describe('UserService - update Integration Test', () => {
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

    describe('update', () => {
        it('should update a user successfully', async () => {
            userRepository.update.mockResolvedValue({
                ...mockUser,
                id: '73ec7a0d-a499-4304-9629-670e5eebdc9d'
            });

            const result = await userService.update('73ec7a0d-a499-4304-9629-670e5eebdc9d', {
                ...mockUser,
                id: '73ec7a0d-a499-4304-9629-670e5eebdc9d'
            });

            expect(result).toEqual({ ...mockUser, id: '73ec7a0d-a499-4304-9629-670e5eebdc9d' });
            expect(userRepository.update).toHaveBeenCalled();
        });

        it('should not update a user because it was not found', async () => {
            const error = new Error('Not found');
            userRepository.update.mockRejectedValue(error);

            await expect(
                userService.update('73ec7a0d-a499-4304-9629-670e5eebdc9d', {
                    ...mockUser,
                    id: '73ec7a0d-a499-4304-9629-670e5eebdc9d'
                })
            ).rejects.toThrow(error);
            expect(userRepository.update).toHaveBeenCalled();
        });
    });
});
