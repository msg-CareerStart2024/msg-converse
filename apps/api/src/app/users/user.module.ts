import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './domain/user.domain';
import { UserRepository } from './repository/user.repository';
import { UserMapper } from './mapper/user.mapper';

@Module({
    imports: [TypeOrmModule.forFeature([User])],
    providers: [UserRepository, UserMapper],
    controllers: []
})
export class UserModule {}
