import { ApiProperty, PartialType } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import {
  ArrayMinSize,
  IsArray,
  IsEmail,
  IsISO8601,
  IsNotEmpty,
  IsOptional,
  MinDate,
  MinLength,
} from 'class-validator';
import { SendEmailDto } from './send-email.dto';

export class UpdateEmailDto extends PartialType(SendEmailDto) {
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
  @Transform(({ value }) => value && new Date(value))
  @MinDate(new Date())
  sendAt: Date;
}
