import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { I18nContext } from 'nestjs-i18n';
import { MailData } from './interfaces/mail-data.interface';
import { AllConfigType } from 'src/config/config.type';
import { MaybeType } from '../utils/types/maybe.type';
import { MailerService } from '../mailer/mailer.service';
import path from 'path';
import { SendEmailDto } from './dto/send-email.dto';
import { MailRepository } from './infrastructure/persistence/mail.repository';
import { QueryMailDto } from './dto/query-email.dto';
// import { infinityPagination } from 'src/utils/infinity-pagination';

@Injectable()
export class MailService {
  constructor(
    private readonly mailerService: MailerService,
    private readonly configService: ConfigService<AllConfigType>,
    private readonly mailRepository: MailRepository,
  ) {}

  async userSignUp(mailData: MailData<{ hash: string }>): Promise<void> {
    const i18n = I18nContext.current();
    let emailConfirmTitle: MaybeType<string>;
    let text1: MaybeType<string>;
    let text2: MaybeType<string>;
    let text3: MaybeType<string>;

    if (i18n) {
      [emailConfirmTitle, text1, text2, text3] = await Promise.all([
        i18n.t('common.confirmEmail'),
        i18n.t('confirm-email.text1'),
        i18n.t('confirm-email.text2'),
        i18n.t('confirm-email.text3'),
      ]);
    }

    const url = new URL(
      this.configService.getOrThrow('app.frontendDomain', {
        infer: true,
      }) + '/confirm-email',
    );
    url.searchParams.set('hash', mailData.data.hash);

    await this.mailerService.sendMail({
      to: mailData.to,
      subject: emailConfirmTitle,
      text: `${url.toString()} ${emailConfirmTitle}`,
      templatePath: path.join(
        this.configService.getOrThrow('app.workingDirectory', {
          infer: true,
        }),
        'src',
        'mail',
        'mail-templates',
        'activation.hbs',
      ),
      context: {
        title: emailConfirmTitle,
        url: url.toString(),
        actionTitle: emailConfirmTitle,
        app_name: this.configService.get('app.name', { infer: true }),
        text1,
        text2,
        text3,
      },
    });
  }

  async forgotPassword(mailData: MailData<{ hash: string }>): Promise<void> {
    const i18n = I18nContext.current();
    let resetPasswordTitle: MaybeType<string>;
    let text1: MaybeType<string>;
    let text2: MaybeType<string>;
    let text3: MaybeType<string>;
    let text4: MaybeType<string>;

    if (i18n) {
      [resetPasswordTitle, text1, text2, text3, text4] = await Promise.all([
        i18n.t('common.resetPassword'),
        i18n.t('reset-password.text1'),
        i18n.t('reset-password.text2'),
        i18n.t('reset-password.text3'),
        i18n.t('reset-password.text4'),
      ]);
    }

    const url = new URL(
      this.configService.getOrThrow('app.frontendDomain', {
        infer: true,
      }) + '/password-change',
    );
    url.searchParams.set('hash', mailData.data.hash);

    await this.mailerService.sendMail({
      to: mailData.to,
      subject: resetPasswordTitle,
      text: `${url.toString()} ${resetPasswordTitle}`,
      templatePath: path.join(
        this.configService.getOrThrow('app.workingDirectory', {
          infer: true,
        }),
        'src',
        'mail',
        'mail-templates',
        'reset-password.hbs',
      ),
      context: {
        title: resetPasswordTitle,
        url: url.toString(),
        actionTitle: resetPasswordTitle,
        app_name: this.configService.get('app.name', {
          infer: true,
        }),
        text1,
        text2,
        text3,
        text4,
      },
    });
  }

  async saveEmail(mailData: SendEmailDto): Promise<void> {
    const from = mailData.sender;
    const recipients = mailData.recipients;
    const subject = mailData.subject;
    const content = mailData.body;
    const isSendMonthly = mailData.sendMonthly;
    const sendMonthlyAt = mailData.sendMonthlyAt || null;
    await this.mailRepository.create({
      sender: from,
      recipients,
      subject,
      body: content,
      isSendMonthly,
      sendMonthlyAt,
    });
  }

  async sendEmail(mailData: SendEmailDto): Promise<void> {
    const from = mailData.sender;
    const recipients = mailData.recipients;
    if (recipients.includes(from)) {
      throw new HttpException(
        {
          status: HttpStatus.UNPROCESSABLE_ENTITY,
          error: 'You cannot send an email to yourself',
        },
        HttpStatus.UNPROCESSABLE_ENTITY,
      );
    }
    const subject = mailData.subject;
    const content = mailData.body;
    const sendToRecipients = recipients.map((recipient) => {
      return this.mailerService.sendMail({
        to: recipient,
        subject,
        text: content,
        templatePath: path.join(
          this.configService.getOrThrow('app.workingDirectory', {
            infer: true,
          }),
          'src',
          'mail',
          'mail-templates',
          'send-email-to-learner.hbs',
        ),
        context: {
          title: subject,
          content,
          app_name: this.configService.get('app.name', {
            infer: true,
          }),
        },
        from,
      });
    });
    await this.saveEmail(mailData);

    await Promise.all(sendToRecipients);
  }

  async cancelSendEmailMonthly(_id: string) {
    const data = await this.mailRepository.findOne({
      id: _id,
    });
    if (!data?.id) {
      throw new HttpException(
        {
          status: HttpStatus.BAD_REQUEST,
          message: 'Cannot find email to cancel',
        },
        HttpStatus.BAD_REQUEST,
      );
    }

    if (!data?.subject || !data?.sendMonthlyAt || !data?.isSendMonthly) {
      throw new HttpException(
        {
          status: HttpStatus.BAD_REQUEST,
          message: 'This email is not scheduled to send monthly',
        },
        HttpStatus.BAD_REQUEST,
      );
    }
    data.isSendMonthly = false;
    await this.mailRepository.update(_id, data);
    return data;
  }

  findEmailById(_id: string) {
    return this.mailRepository.findOne({
      id: _id,
    });
  }

  async findManyEmails(query: QueryMailDto) {
    return await this.mailRepository.findMany({
      filterOptions: query?.filters,
    });
  }
}
