import { Body, Controller, HttpCode, HttpStatus, Post } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { SendEmailDto } from '../mail/dto/send-email-dto';
import { LearnersService } from './learners.service';

@ApiTags('Learners')
@Controller({
  path: 'learners',
  version: '1',
})
export class LearnersController {
  constructor(private readonly learnerService: LearnersService) {}

  @Post('send-email')
  @HttpCode(HttpStatus.OK)
  sendEmail(@Body() sendEmailDto: SendEmailDto) {
    return this.learnerService.sendEmail(sendEmailDto);
  }
}
