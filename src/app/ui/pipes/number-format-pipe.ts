import {Pipe, PipeTransform} from "@angular/core";

@Pipe({name: 'numberFormat'})
export class NumberFormatPipe implements PipeTransform {
  transform(value: number, fractionDigits: number = 3): any {
    return value.toFixed(fractionDigits);
  }
}
