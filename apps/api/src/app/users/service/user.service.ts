import { Injectable } from '@nestjs/common';
import { UserRepository } from '../repository/user.repository';
import { User } from '../domain/user.domain';

@Injectable()
export class UserService {
    constructor(private readonly userRepository: UserRepository) {}

    async getById(id: string): Promise<User | null> {
        return this.userRepository.getById(id);
    }

    async getByEmail(email: string): Promise<User | null> {
        return this.userRepository.getByEmail(email);
    }

    async create(userData: User): Promise<User> {
        return this.userRepository.create(userData);
    }

    async update(id: string, userData: User): Promise<User> {
        return this.userRepository.update(id, userData);
    }
}
