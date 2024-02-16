import { Module } from '@nestjs/common';
import { DatabaseConfig } from 'src/database/config/database-config.type';
import databaseConfig from 'src/database/config/database.config';
import { DocumentUserPersistenceModule } from 'src/users/infrastructure/persistence/document/document-persistence.module';
import { RelationalUserPersistenceModule } from 'src/users/infrastructure/persistence/relational/relational-persistence.module';
import { LearnersService } from './learners.service';
import { LearnersController } from './learners.controller';

const infrastructurePersistenceModule = (databaseConfig() as DatabaseConfig)
  .isDocumentDatabase
  ? DocumentUserPersistenceModule
  : RelationalUserPersistenceModule;

@Module({
  imports: [infrastructurePersistenceModule],
  controllers: [LearnersController],
  providers: [LearnersService],
  exports: [LearnersService, infrastructurePersistenceModule],
})
export class LearnersModule {}
