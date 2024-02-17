import { Injectable } from '@nestjs/common';
import { SendEmailDto } from 'src/mail/dto/send-email-dto';
import { MailService } from 'src/mail/mail.service';

@Injectable()
export class LearnersService {
  constructor(private readonly mailService: MailService) {}
  async sendEmail(sendEmailDto: SendEmailDto) {
    return this.mailService.sendEmail(sendEmailDto);
  }
}
