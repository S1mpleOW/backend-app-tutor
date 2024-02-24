import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Patch,
  Post,
  Query,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { LearnersService } from './learners.service';
import { SendEmailFromTutor } from './domain/dto/send-email-from-tutor.dto';
import { QueryMailDto } from 'src/mail/dto/query-email.dto';

@ApiTags('Learners')
@Controller({
  path: 'learners',
  version: '1',
})
export class LearnersController {
  constructor(private readonly learnerService: LearnersService) {}

  @Post('send-email')
  @HttpCode(HttpStatus.OK)
  sendEmail(@Body() sendEmailDto: SendEmailFromTutor) {
    return this.learnerService.sendEmailFromTutor(sendEmailDto);
  }

  @Patch('emails/:id/cancel-send-email-monthly')
  @HttpCode(HttpStatus.OK)
  cancelSendEmailMonthly(@Param('id') id: string) {
    return this.learnerService.cancelSendEmailMonthly(id);
  }

  @Get('emails')
  @HttpCode(HttpStatus.OK)
  async getEmails(@Query() query: QueryMailDto) {
    return this.learnerService.getEmails(query);
  }

  @Get('emails/:id')
  @HttpCode(HttpStatus.OK)
  async getEmailById(@Param('id') id: string) {
    return this.learnerService.getEmailById(id);
  }
}
