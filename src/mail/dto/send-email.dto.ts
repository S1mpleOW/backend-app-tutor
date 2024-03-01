import { Transform } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';
import {
  ArrayMinSize,
  IsArray,
  IsEmail,
  IsEnum,
  IsISO8601,
  IsNotEmpty,
  IsOptional,
  MinDate,
  MinLength,
} from 'class-validator';
import { lowerCaseTransformer } from 'src/utils/transformers/lower-case.transformer';
import { SendEmailOptionsEnum } from 'src/learners/domain/enums/send-email-option.enum';

export class SendEmailDto {
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
  @IsISO8601()
  @Transform(({ value }) => value && new Date(value))
  @MinDate(new Date())
  sendAt: Date;
}
