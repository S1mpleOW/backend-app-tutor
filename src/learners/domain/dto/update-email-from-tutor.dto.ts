import { ApiProperty, PartialType } from '@nestjs/swagger';
import {
  ArrayMinSize,
  IsArray,
  IsEmail,
  IsISO8601,
  IsNotEmpty,
  IsOptional,
  MinLength,
} from 'class-validator';

import { SendEmailFromTutor } from './send-email-from-tutor.dto';

export class UpdateEmailFromTutor extends PartialType(SendEmailFromTutor) {
  @ApiProperty({
    example: ['dungdqch@example.com'],
  })
  @IsArray()
  @IsEmail({}, { each: true })
  @ArrayMinSize(1)
  @IsOptional()
  recipients: string[];

  @ApiProperty()
  @IsNotEmpty()
  @IsOptional()
  subject: string;

  @ApiProperty()
  @IsNotEmpty()
  @MinLength(10)
  @IsOptional()
  body: string;

  @ApiProperty()
  @IsISO8601()
  @IsOptional()
  sendAt: Date;
}
