import { Injectable } from '@nestjs/common';
import { MailRepository } from '../../mail.repository';
import { EmailSchemaClass } from '../entities/email.schema';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { Email } from 'src/mail/domain/email';
import { MailMapper } from '../mappers/mail.mapper';
import { EntityCondition } from 'src/utils/types/entity-condition.type';
import { NullableType } from 'src/utils/types/nullable.type';

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

  async findOne(fields: EntityCondition<Email>): Promise<NullableType<Email>> {
    if (fields.id) {
      const mailObject = await this.mailModel.findById(fields.id);
      return mailObject ? MailMapper.toDomain(mailObject) : null;
    }

    const sessionObject = await this.mailModel.findOne(fields);
    return sessionObject ? MailMapper.toDomain(sessionObject) : null;
  }

  async update(
    id: Email['id'],
    payload: Partial<Email>,
  ): Promise<Email | null> {
    const clonedPayload = { ...payload };
    delete clonedPayload.id;

    const filter = { _id: id };
    const mailObject = await this.mailModel.findOneAndUpdate(
      filter,
      clonedPayload,
    );

    return mailObject ? MailMapper.toDomain(mailObject) : null;
  }
}
