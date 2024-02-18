import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { MailService } from 'src/mail/mail.service';
import { SendEmailFromTutor } from './domain/dto/send-email-from-tutor.dto';
import { SchedulerRegistry } from '@nestjs/schedule';
import { CronJob } from 'cron';
import { InjectConnection } from '@nestjs/mongoose';
import { Connection } from 'mongoose';
import { QueryMailDto } from 'src/mail/dto/query-email.dto';
@Injectable()
export class LearnersService {
  constructor(
    private readonly mailService: MailService,
    private readonly scheduleRegistry: SchedulerRegistry,
    @InjectConnection() private readonly connection: Connection,
  ) {}
  async sendEmailFromTutor(sendEmailDto: SendEmailFromTutor) {
    const currentDate = Date.now();
    const startDateSend = new Date(sendEmailDto.sendMonthlyAt).getTime();
    if (currentDate > startDateSend) {
      throw new HttpException(
        {
          status: HttpStatus.BAD_REQUEST,
          message: 'Sent date must be after current date',
        },
        HttpStatus.BAD_REQUEST,
      );
    }

    if (sendEmailDto.sendMonthly) {
      this.sendEmailScheduleCron(sendEmailDto);
      return;
    }
    if (sendEmailDto.sendMonthlyAt) {
      this.sendEmailScheduleTimeout(sendEmailDto);
      return;
    } else {
      await this.mailService.sendEmail(sendEmailDto);
    }
  }

  sendEmailScheduleCron(sendEmailDto: SendEmailFromTutor) {
    const alias = `${sendEmailDto.subject}-cron-${sendEmailDto.sendMonthlyAt}`;
    const jobs = this.scheduleRegistry.getCronJobs();
    if (jobs.has(alias)) {
      throw new HttpException(
        {
          status: HttpStatus.BAD_REQUEST,
          message: 'This email is scheduled to send monthly',
        },
        HttpStatus.BAD_REQUEST,
      );
    }
    const date = new Date(sendEmailDto.sendMonthlyAt);
    const cronJob = new CronJob(date, async () => {
      await this.mailService.sendEmail(sendEmailDto);
    });

    this.scheduleRegistry.addCronJob(alias, cronJob);
    cronJob.start();
  }
  sendEmailScheduleTimeout(sendEmailDto: SendEmailFromTutor) {
    const now = new Date().getTime();
    const sendMonthlyAt = new Date(sendEmailDto.sendMonthlyAt).getTime();
    if (now > sendMonthlyAt) {
      throw new HttpException(
        {
          status: HttpStatus.BAD_REQUEST,
          message: 'Sent date must be after current date',
        },
        HttpStatus.BAD_REQUEST,
      );
    }
    const alias = `${sendEmailDto.subject}-timeout-${sendEmailDto.sendMonthlyAt}`;

    const jobs = this.scheduleRegistry.getTimeouts();
    if (jobs.includes(alias)) {
      throw new HttpException(
        {
          status: HttpStatus.BAD_REQUEST,
          message: `This email is scheduled to send at ${new Date(sendEmailDto.sendMonthlyAt)}`,
        },
        HttpStatus.BAD_REQUEST,
      );
    }

    const timeDiff = Math.abs(sendMonthlyAt - now);

    const timeout = setTimeout(async () => {
      await this.mailService.sendEmail(sendEmailDto);
    }, timeDiff);

    this.scheduleRegistry.addTimeout(alias, timeout);
  }

  async cancelSendEmailMonthly(id: string) {
    const session = await this.connection.startSession();

    session.startTransaction();
    try {
      const data = await this.mailService.findEmailById(id);

      const subject = data?.subject;
      const sendMonthlyAt = data?.sendMonthlyAt;
      const alias = `${subject}-cron-${sendMonthlyAt}`;
      const jobs = this.scheduleRegistry.getCronJobs();
      if (jobs.has(alias)) {
        const job = jobs.get(alias);

        if (job) {
          job.stop();
          this.scheduleRegistry.deleteCronJob(alias);
        }
      }
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

  getEmails(query: QueryMailDto) {
    return this.mailService.findManyEmails(query);
  }
}
