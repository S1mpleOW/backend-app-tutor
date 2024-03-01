import { ApiProperty } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import {
  ArrayMinSize,
  IsArray,
  IsDateString,
  IsEmail,
  IsEnum,
  IsNotEmpty,
  IsOptional,
  MinLength,
} from 'class-validator';
import { lowerCaseTransformer } from 'src/utils/transformers/lower-case.transformer';
import { SendEmailOptionsEnum } from '../enums/send-email-option.enum';

export class SendEmailFromTutor {
  @ApiProperty({ example: 'test1@example.com' })
  @Transform(lowerCaseTransformer)
  @IsNotEmpty()
  @IsEmail()
  sender: string;

  @ApiProperty({
    example: ['dungdqch@example.com'],
  })
  @IsArray()
  @IsEmail({}, { each: true })
  @ArrayMinSize(1)
  recipients: string[];

  @ApiProperty()
  @IsNotEmpty()
  subject: string;

  @ApiProperty()
  @IsNotEmpty()
  @MinLength(10)
  body: string;

  @ApiProperty({
    default: SendEmailOptionsEnum.NONE,
  })
  @IsEnum(SendEmailOptionsEnum)
  sendEmailOption: SendEmailOptionsEnum;

  @ApiProperty({
    default: new Date().toISOString(),
  })
  @IsOptional()
  @IsDateString()
  sendAt: Date;
}
