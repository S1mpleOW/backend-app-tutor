import { Injectable } from '@nestjs/common';
import { MailRepository } from '../../mail.repository';
import { EmailSchemaClass } from '../entities/email.schema';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { Email } from 'src/mail/domain/email';
import { MailMapper } from '../mappers/mail.mapper';

@Injectable()
export class MailDocumentRepository implements MailRepository {
  constructor(
    @InjectModel(EmailSchemaClass.name)
    private readonly mailModel: Model<EmailSchemaClass>,
  ) {}
  async create(email: Email): Promise<Email> {
    const persistenceModel = MailMapper.toPersistence(email);
    const createdEmail = new this.mailModel(persistenceModel);
    const emailObject = await createdEmail.save();
    return MailMapper.toDomain(emailObject);
  }
}
