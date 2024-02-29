import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { MailService } from 'src/mail/mail.service';
import { SendEmailFromTutor } from './domain/dto/send-email-from-tutor.dto';
import { SchedulerRegistry } from '@nestjs/schedule';
import { CronJob } from 'cron';
import { InjectConnection } from '@nestjs/mongoose';
import { Connection } from 'mongoose';
import { QueryMailDto } from 'src/mail/dto/query-email.dto';
import { SendEmailOptionsEnum } from './domain/enums/send-email-option.enum';
import { UpdateEmailFromTutor } from './domain/dto/update-email-from-tutor.dto';
@Injectable()
export class LearnersService {
  constructor(
    private readonly mailService: MailService,
    private readonly scheduleRegistry: SchedulerRegistry,
    @InjectConnection() private readonly connection: Connection,
  ) {}
  async sendEmailFromTutor(sendEmailDto: SendEmailFromTutor) {
    const recipients = sendEmailDto.recipients;
    const from = sendEmailDto.sender;
    if (recipients.includes(from)) {
      throw new HttpException(
        {
          status: HttpStatus.UNPROCESSABLE_ENTITY,
          error: 'You cannot send an email to yourself',
        },
        HttpStatus.UNPROCESSABLE_ENTITY,
      );
    }

    const currentDate = Date.now();
    const ONE_MINUTE = 60000;
    if (sendEmailDto?.sendEmailOption === SendEmailOptionsEnum.NONE) {
      sendEmailDto.sendAt = new Date();
    }
    // Ensure that the sendAt date is after the current date
    const startDateSend = new Date(sendEmailDto.sendAt).getTime() + ONE_MINUTE;
    if (currentDate > startDateSend) {
      throw new HttpException(
        {
          status: HttpStatus.BAD_REQUEST,
          message: 'Sent date must be after current date',
        },
        HttpStatus.BAD_REQUEST,
      );
    }
    const session = await this.connection.startSession();

    session.startTransaction();
    try {
      const email = await this.mailService.saveEmail(sendEmailDto);
      if (sendEmailDto.sendEmailOption === SendEmailOptionsEnum.SEND_MONTHLY) {
        this.sendEmailScheduleCron(sendEmailDto, email.id);
      } else if (
        sendEmailDto.sendEmailOption === SendEmailOptionsEnum.SEND_SCHEDULED
      ) {
        this.sendEmailScheduleTimeout(sendEmailDto, email.id);
      } else {
        await this.mailService.sendEmail(sendEmailDto);
      }
      await session.commitTransaction();
      return email;
    } catch (err) {
      await session.abortTransaction();
      throw new HttpException(
        {
          status: HttpStatus.BAD_REQUEST,
          message: err.message,
        },
        HttpStatus.BAD_REQUEST,
      );
    } finally {
      await session.endSession();
    }
  }

  sendEmailScheduleCron(sendEmailDto: SendEmailFromTutor, emailId: string) {
    const date = new Date(sendEmailDto.sendAt);
    const alias = `${sendEmailDto.subject}-cronjob-${date.toISOString()}`;
    const jobs = this.scheduleRegistry.getCronJobs();
    console.log('🚀 ~ LearnersService ~ sendEmailScheduleCron ~ jobs:', jobs);
    if (jobs.has(alias)) {
      throw new HttpException(
        {
          status: HttpStatus.BAD_REQUEST,
          message: 'This email is scheduled to send monthly',
        },
        HttpStatus.BAD_REQUEST,
      );
    }

    const cronJob = new CronJob(date, async () => {
      await this.mailService.sendEmail(sendEmailDto);
      await this.mailService.updateSendEmailMonthlyToNextMonth(emailId);
    });

    this.scheduleRegistry.addCronJob(alias, cronJob);
    cronJob.start();
  }

  sendEmailScheduleTimeout(sendEmailDto: SendEmailFromTutor, id: string) {
    const now = new Date().getTime();
    const sendAt = new Date(sendEmailDto.sendAt);
    if (now > sendAt.getTime()) {
      throw new HttpException(
        {
          status: HttpStatus.BAD_REQUEST,
          message: 'Send time must be after current time',
        },
        HttpStatus.BAD_REQUEST,
      );
    }

    const alias = `${sendEmailDto.subject}-timeout-${sendAt.toISOString()}`;
    const jobs = this.scheduleRegistry.getTimeouts();
    console.log(
      '🚀 ~ LearnersService ~ sendEmailScheduleTimeout ~ jobs:',
      jobs,
    );
    if (jobs.includes(alias)) {
      throw new HttpException(
        {
          status: HttpStatus.BAD_REQUEST,
          message: `This email is scheduled to send at ${new Date(sendEmailDto.sendAt)}`,
        },
        HttpStatus.BAD_REQUEST,
      );
    }

    const timeDiff = Math.abs(sendAt.getTime() - now);

    const timeout = setTimeout(async () => {
      await this.mailService.sendEmail(sendEmailDto);
      await this.mailService.cancelSendEmailScheduled(id);
    }, timeDiff);

    this.scheduleRegistry.addTimeout(alias, timeout);
  }

  async cancelSendEmailMonthly(id: string) {
    const session = await this.connection.startSession();

    session.startTransaction();
    try {
      const data = await this.mailService.findEmailById(id);

      const subject = data!.subject;
      const sendAt = data?.sendAt ?? new Date();
      this.removeCronSendEmailMonthly(subject, sendAt);
      await this.mailService.cancelSendEmailMonthly(id);
      await session.commitTransaction();
    } catch (err) {
      await session.abortTransaction();
      throw new HttpException(
        {
          status: HttpStatus.BAD_REQUEST,
          message: err.message,
        },
        HttpStatus.BAD_REQUEST,
      );
    } finally {
      await session.endSession();
    }
  }

  async cancelSendEmailScheduled(id: string) {
    const session = await this.connection.startSession();
    session.startTransaction();
    try {
      const data = await this.mailService.findEmailById(id);
      const subject = data!.subject;
      const sendAt = data!.sendAt ?? new Date();
      this.removeTimeoutSendEmailScheduled(subject, sendAt);
      await this.mailService.cancelSendEmailScheduled(id);
      await session.commitTransaction();
    } catch (err) {
      await session.abortTransaction();
      throw new HttpException(
        {
          status: HttpStatus.BAD_REQUEST,
          message: err.message,
        },
        HttpStatus.BAD_REQUEST,
      );
    } finally {
      await session.endSession();
    }
  }

  async updateEmail(id: string, emailUpdateDto: UpdateEmailFromTutor) {
    const recipients = emailUpdateDto?.recipients ?? [];
    const from = emailUpdateDto?.sender ?? '';
    if (recipients.includes(from)) {
      throw new HttpException(
        {
          status: HttpStatus.UNPROCESSABLE_ENTITY,
          error: 'You cannot send an email to yourself',
        },
        HttpStatus.UNPROCESSABLE_ENTITY,
      );
    }

    const currentDate = Date.now();
    const ONE_MINUTE = 60000;
    // Ensure that the sendAt date is after the current date
    const startDateSend =
      new Date(emailUpdateDto.sendAt).getTime() + ONE_MINUTE;
    if (currentDate > startDateSend) {
      throw new HttpException(
        {
          status: HttpStatus.BAD_REQUEST,
          message: 'Sent date must be after current date',
        },
        HttpStatus.BAD_REQUEST,
      );
    }
    const currentEmail = await this.mailService.findEmailById(id);

    if (!currentEmail?.id) {
      throw new HttpException(
        {
          status: HttpStatus.BAD_REQUEST,
          message: 'Email not found',
        },
        HttpStatus.BAD_REQUEST,
      );
    }
    const isSendMonthly =
      currentEmail?.sendEmailOption === SendEmailOptionsEnum.SEND_MONTHLY;
    const isSendScheduled =
      currentEmail?.sendEmailOption === SendEmailOptionsEnum.SEND_SCHEDULED;
    const updatedEmail = await this.mailService.updateEmail(id, emailUpdateDto);
    if (isSendMonthly) {
      this.removeCronSendEmailMonthly(
        currentEmail.subject,
        currentEmail.sendAt ?? new Date(),
      );
      const emailUpdateDtoCron = new SendEmailFromTutor();
      emailUpdateDtoCron.body = updatedEmail.body;
      emailUpdateDtoCron.recipients = updatedEmail.recipients;
      emailUpdateDtoCron.sendAt = updatedEmail.sendAt || new Date();
      emailUpdateDtoCron.sendEmailOption = SendEmailOptionsEnum.SEND_MONTHLY;
      emailUpdateDtoCron.subject = updatedEmail.subject;
      this.sendEmailScheduleCron(emailUpdateDtoCron, id);
    } else if (isSendScheduled) {
      this.removeTimeoutSendEmailScheduled(
        currentEmail.subject,
        currentEmail.sendAt ?? new Date(),
      );
      const emailUpdateDtoTimeout = new SendEmailFromTutor();
      emailUpdateDtoTimeout.body = updatedEmail.body;
      emailUpdateDtoTimeout.recipients = updatedEmail.recipients;
      emailUpdateDtoTimeout.sendAt = updatedEmail.sendAt || new Date();
      emailUpdateDtoTimeout.sendEmailOption =
        SendEmailOptionsEnum.SEND_SCHEDULED;
      emailUpdateDtoTimeout.subject = updatedEmail.subject;
      this.sendEmailScheduleTimeout(emailUpdateDtoTimeout, id);
    }
    return updatedEmail;
  }

  removeTimeoutSendEmailScheduled(subject: string, sendAt: Date) {
    const alias = `${subject}-timeout-${sendAt?.toISOString()}`;
    const jobs = this.scheduleRegistry.getTimeouts();
    console.log(
      '🚀 ~ LearnersService ~ removeTimeoutSendEmailScheduled ~ jobs:',
      jobs,
    );
    console.log(
      '🚀 ~ LearnersService ~ removeTimeoutSendEmailScheduled ~ alias:',
      alias,
    );

    if (jobs.includes(alias)) {
      const timeout = jobs.find((job) => job === alias);
      if (timeout) {
        clearTimeout(timeout);
        this.scheduleRegistry.deleteTimeout(alias);
      }
    }
  }

  removeCronSendEmailMonthly(subject: string, sendAt: Date) {
    const alias = `${subject}-cronjob-${sendAt?.toISOString()}`;
    const jobs = this.scheduleRegistry.getCronJobs();
    console.log(
      '🚀 ~ LearnersService ~ cancelSendEmailMonthly ~ alias:',
      alias,
    );
    if (jobs.has(alias)) {
      const job = jobs.get(alias);
      if (job) {
        job.stop();
        this.scheduleRegistry.deleteCronJob(alias);
      }
    }
  }

  getEmails(query: QueryMailDto) {
    return this.mailService.findManyEmails(query);
  }

  getEmailById(id: string) {
    return this.mailService.findEmailById(id);
  }
}
