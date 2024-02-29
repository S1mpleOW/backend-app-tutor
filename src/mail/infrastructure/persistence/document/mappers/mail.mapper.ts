import { Email } from 'src/mail/domain/email';
import { EmailSchemaClass } from '../entities/email.schema';

export class MailMapper {
  static toDomain(raw: EmailSchemaClass): Email {
    const email = new Email();
    email.id = raw._id.toString();
    email.sender = raw.sender;
    email.recipients = [...raw.recipients];
    email.subject = raw.subject;
    email.body = raw.body;
    email.sendEmailOption = raw.sendEmailOption;
    email.sendAt = raw.sendAt ? raw.sendAt : undefined;
    email.createdAt = raw.createdAt;
    return email;
  }

  static toPersistence(email: Email): EmailSchemaClass {
    const emailEntity = new EmailSchemaClass();
    if (email.id && typeof email.id === 'string') {
      emailEntity._id = email.id;
    }
    emailEntity.sender = email.sender;
    emailEntity.recipients = [...email.recipients];
    emailEntity.subject = email.subject;
    emailEntity.body = email.body;
    emailEntity.createdAt = new Date();
    emailEntity.sendEmailOption = email.sendEmailOption;
    emailEntity.sendAt = email.sendAt;
    return emailEntity;
  }
}
