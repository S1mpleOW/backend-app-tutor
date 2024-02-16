import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { EmailSchemaClass } from 'src/learners/infrastructure/persistence/document/entities/email.schema';

@Injectable()
export class EmailSeedService {
  constructor(
    @InjectModel(EmailSchemaClass.name)
    private readonly model: Model<EmailSchemaClass>,
  ) {}

  async run() {
    const emailSender = await this.model.findOne({
      sender: 'dungdqch@gmail.com',
    });

    if (!emailSender) {
      const data = new this.model({
        sender: 'dungdqch@gmail.com',
        recipients: ['dungdqch2@gmail.com'],
        subject: 'Test',
        body: 'Test',
      });
      await data.save();
    }
  }
}
