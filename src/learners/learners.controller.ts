import { Controller, Get, Post } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('Learners')
@Controller({
  path: 'learners',
  version: '1',
})
export class LearnersController {
  constructor() {}

  @Post('send-email')
  async sendEmail() {
    return 'Email sent successfully!';
  }
}
