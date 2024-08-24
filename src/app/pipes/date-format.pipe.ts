import { DatePipe } from '@angular/common';
import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'dateFormat',
  standalone: true
})
export class DateFormatPipe implements PipeTransform {

  transform(value: string): string {
    if (!value) {
      return 'No aplica';
    }
    const datePipe = new DatePipe('en-US');
    return datePipe.transform(value, 'dd-MM-yyyy') || '';
  }

}
