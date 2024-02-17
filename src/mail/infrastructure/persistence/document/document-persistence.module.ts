import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { EmailSchema, EmailSchemaClass } from './entities/email.schema';
import { MailRepository } from '../mail.repository';
import { MailDocumentRepository } from './repositories/mail.repository';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: EmailSchemaClass.name, schema: EmailSchema },
    ]),
  ],
  providers: [
    {
      provide: MailRepository,
      useClass: MailDocumentRepository,
    },
  ],
  exports: [MailRepository],
})
export class DocumentMailPersistenceModule {}
