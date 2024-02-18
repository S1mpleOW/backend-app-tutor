export class Email {
  id: string;
  sender: string;
  recipients: string[];
  subject: string;
  body: string;
  isSendMonthly: boolean;
  createdAt: Date;
  sendMonthlyAt?: Date;
}
