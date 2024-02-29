import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, now } from 'mongoose';
import { SendEmailOptionsEnum } from 'src/learners/domain/enums/send-email-option.enum';
import { EntityDocumentHelper } from 'src/utils/document-entity-helper';

@Schema({
  timestamps: true,
  toJSON: {
    virtuals: true,
    getters: true,
  },
})
export class EmailSchemaClass extends EntityDocumentHelper {
  @Prop({
    type: String,
  })
  sender: string;

  @Prop({
    type: [String],
  })
  recipients: string[];

  @Prop({
    type: String,
  })
  subject: string;

  @Prop({
    type: String,
  })
  body: string;

  @Prop({
    type: Date,
    default: now,
  })
  createdAt: Date;

  @Prop({
    type: String,
    enum: SendEmailOptionsEnum,
    default: SendEmailOptionsEnum.NONE,
  })
  sendEmailOption: SendEmailOptionsEnum;

  @Prop({
    type: Date,
  })
  sendAt?: Date;
}

export type EmailSchemaDocument = HydratedDocument<EmailSchemaClass>;

export const EmailSchema = SchemaFactory.createForClass(EmailSchemaClass);

EmailSchema.index({ sender: 1 });
