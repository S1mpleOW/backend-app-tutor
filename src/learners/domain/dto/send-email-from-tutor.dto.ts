import { ApiProperty } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import {
  ArrayMinSize,
  IsArray,
  IsBoolean,
  IsEmail,
  IsISO8601,
  IsNotEmpty,
  IsOptional,
  MinLength,
} from 'class-validator';
import { lowerCaseTransformer } from 'src/utils/transformers/lower-case.transformer';

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

  @ApiProperty()
  @IsBoolean()
  sendMonthly: boolean;

  @ApiProperty()
  @IsISO8601()
  @IsOptional()
  sendMonthlyAt: Date;
}
