import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './domain/user.domain';
import { UserRepository } from './repository/user.repository';
import { UserService } from './service/user.service';
import { UsersController } from './controller/users.controller';

@Module({
    imports: [TypeOrmModule.forFeature([User])],
    providers: [UserRepository, UserService],
    exports: [UserService, UserRepository],
    controllers: [UsersController]
})
export class UsersModule {}
