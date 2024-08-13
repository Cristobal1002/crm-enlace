import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'statusLabel',
  standalone: true
})
export class StatusLabelPipe implements PipeTransform {

  transform(value: boolean): string {
    return value ? 'activo' : 'inactivo';
  }

}
