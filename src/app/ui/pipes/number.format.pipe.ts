import {Pipe, PipeTransform} from '@angular/core';

@Pipe({name: 'numberFormat'})
export class NumberFormatPipe implements PipeTransform {
  transform(value: number, fractionDigits = 3): string {
    return value.toFixed(fractionDigits);
  }
}
