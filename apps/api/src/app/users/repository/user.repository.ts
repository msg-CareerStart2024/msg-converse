import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from '../domain/user.domain';
import { Repository } from 'typeorm';

@Injectable()
export class UserRepository {
    constructor(@InjectRepository(User) private readonly userRepository: Repository<User>) {}

    async getAll(): Promise<User[]> {
        return await this.userRepository.find();
    }

    async getById(id: string): Promise<User | null> {
        return await this.userRepository.findOneBy({ id });
    }

    async create(userData: User): Promise<User> {
        return await this.userRepository.save(userData);
    }

    async update(id: string, userData: User): Promise<User> {
        userData.id = id;
        return await this.userRepository.save(userData);
    }

    async remove(id: string): Promise<void> {
        await this.userRepository.delete(id);
    }
}
