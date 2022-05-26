import {Pipe, PipeTransform} from '@angular/core';
import {ScaleNumber} from '../../utils/scale.number';

@Pipe({name: 'scaleNumber'})
export class ScaleNumberPipe implements PipeTransform {

  transform(value: number): string {
    return ScaleNumber.scale(value);
  }
}
