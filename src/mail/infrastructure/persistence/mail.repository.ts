import { Email } from 'src/mail/domain/email';

export abstract class MailRepository {
  abstract create(email: Omit<Email, 'id' | 'createdAt'>): Promise<Email>;
}
