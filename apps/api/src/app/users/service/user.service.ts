import { Injectable } from '@nestjs/common';
import * as bcrypt from 'bcryptjs';
import { User } from '../domain/user.domain';
import { UserRepository } from '../repository/user.repository';

@Injectable()
export class UserService {
    constructor(private readonly userRepository: UserRepository) {}

    async getById(id: string): Promise<User | null> {
        return this.userRepository.getById(id);
    }

    async getByEmail(email: string): Promise<User | null> {
        return this.userRepository.getByEmail(email);
    }

    async create(userData: Omit<User, 'id'>): Promise<User> {
        const hashedPassword = await bcrypt.hash(userData.password, 10);
        userData.password = hashedPassword;
        return this.userRepository.create(userData);
    }

    async update(id: string, userData: User): Promise<User> {
        return this.userRepository.update(id, userData);
    }
}
