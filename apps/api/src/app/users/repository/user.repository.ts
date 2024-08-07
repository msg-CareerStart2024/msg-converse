import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from '../domain/user.domain';
import { Repository } from 'typeorm';

@Injectable()
export class UserRepository {
    constructor(@InjectRepository(User) private readonly userRepository: Repository<User>) {}

    async getById(id: string): Promise<User | null> {
        return this.userRepository.findOneBy({ id });
    }

    async getByEmail(email: string): Promise<User | null> {
        return this.userRepository.findOneBy({ email });
    }

    async create(userData: User): Promise<User> {
        return this.userRepository.save(userData);
    }

    async update(id: string, userData: User): Promise<User> {
        userData.id = id;
        return this.userRepository.save(userData);
    }
}
