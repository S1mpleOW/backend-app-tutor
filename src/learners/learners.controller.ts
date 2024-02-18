import {
  Body,
  Controller,
  HttpCode,
  HttpStatus,
  Param,
  Post,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { LearnersService } from './learners.service';
import { SendEmailFromTutor } from './domain/dto/send-email-from-tutor.dto';

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

  @Post('cancel-send-email-monthly/:id')
  @HttpCode(HttpStatus.OK)
  cancelSendEmailMonthly(@Param('id') id: string) {
    return this.learnerService.cancelSendEmailMonthly(id);
  }
}
