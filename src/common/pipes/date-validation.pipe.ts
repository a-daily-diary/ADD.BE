import { BadRequestException, Injectable, PipeTransform } from '@nestjs/common';
import { exceptionMessage } from 'src/constants/exceptionMessage';

@Injectable()
export class DateValidationPipe implements PipeTransform {
  constructor(private readonly required: boolean) {}

  transform(value: Date) {
    if (isNaN(value.getTime())) {
      if (this.required === false) {
        return undefined;
      }

      throw new BadRequestException(exceptionMessage.INVALID_DATE_FORMAT);
    }

    return value;
  }
}
