import { PipeTransform, UnprocessableEntityException } from '@nestjs/common';
import mongoose from 'mongoose';
export class ParamsObjectIdPipe implements PipeTransform {
  transform(value: any) {
    if (!mongoose.Types.ObjectId.isValid(value)) {
      throw new UnprocessableEntityException('Invalid ObjectId');
    }
    return value;
  }
}
