import { Module } from '@nestjs/common';
import { LearnersController } from './learners.controller';
import { LearnersService } from './learners.service';
import { MailModule } from 'src/mail/mail.module';

@Module({
  imports: [MailModule],
  controllers: [LearnersController],
  providers: [LearnersService],
  exports: [LearnersService],
})
export class LearnersModule {}
