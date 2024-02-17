import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import {
  EmailSchema,
  EmailSchemaClass,
} from 'src/mail/infrastructure/persistence/document/entities/email.schema';
import { EmailSeedService } from './email-seed.service';

@Module({
  imports: [
    MongooseModule.forFeature([
      {
        name: EmailSchemaClass.name,
        schema: EmailSchema,
      },
    ]),
  ],
  providers: [EmailSeedService],
  exports: [EmailSeedService],
})
export class EmailSeedModule {}
