import { SendEmailOptionsEnum } from 'src/learners/domain/enums/send-email-option.enum';

export class Email {
  id: string;
  sender: string;
  recipients: string[];
  subject: string;
  body: string;
  sendEmailOption: SendEmailOptionsEnum;
  createdAt: Date;
  sendAt?: Date;
}
