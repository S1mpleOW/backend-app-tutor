import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { MailService } from './mail.service';
import { MailerModule } from '../mailer/mailer.module';
import { DocumentMailPersistenceModule } from './infrastructure/persistence/document/document-persistence.module';

@Module({
  imports: [ConfigModule, MailerModule, DocumentMailPersistenceModule],
  providers: [MailService],
  exports: [MailService],
})
export class MailModule {}
