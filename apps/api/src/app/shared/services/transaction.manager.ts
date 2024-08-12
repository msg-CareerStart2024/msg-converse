import { Injectable } from '@nestjs/common';
import { InjectEntityManager } from '@nestjs/typeorm';
import { EntityManager } from 'typeorm';

@Injectable()
export class TransactionManager {
    constructor(@InjectEntityManager() private readonly entityManager: EntityManager) {}

    async runInTransaction<T>(operation: (manager: EntityManager) => Promise<T>): Promise<T> {
        return this.entityManager.transaction(async transactionalEntityManager => {
            return operation(transactionalEntityManager);
        });
    }
}
