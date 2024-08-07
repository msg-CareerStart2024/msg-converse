import { Injectable } from '@nestjs/common';
import { UserRepository } from '../repository/user.repository';
import { User } from '../domain/user.domain';

@Injectable()
export class UserService {
    constructor(private readonly userRepository: UserRepository) {}

    async getAll(): Promise<User[]> {
        return await this.userRepository.getAll();
    }

    async getById(id: string): Promise<User | null> {
        return await this.userRepository.getById(id);
    }

    async getByEmail(email: string): Promise<User | null> {
        return await this.userRepository.getByEmail(email);
    }

    async create(userData: User): Promise<User> {
        return await this.userRepository.create(userData);
    }

    async update(id: string, userData: User): Promise<User> {
        return await this.userRepository.update(id, userData);
    }

    async remove(id: string): Promise<void> {
        await this.userRepository.remove(id);
    }
}
