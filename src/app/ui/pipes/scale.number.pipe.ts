import {Pipe, PipeTransform} from '@angular/core';

@Pipe({name: 'scaleNumber'})
export class ScaleNumberPipe implements PipeTransform {
  private static scales = ['K', 'M', 'G', 'T', 'P', 'E', 'Z', 'Y', '???'];

  transform(value: number): string {
    const exponent = Math.trunc(Math.log10(Math.abs(value)));
    if (exponent < 3) {
      return parseFloat(value.toFixed(2)).toString();
    }

    const valueScaled = Math.trunc(value) / ScaleNumberPipe.scaleFactor(exponent);
    const multiplierSuffix = ScaleNumberPipe.suffix(exponent);

    return `${valueScaled.toFixed(2)}${multiplierSuffix}`;
  }

  private static scaleFactor(exponent: number): number {
    return Math.pow(1000, Math.trunc(exponent / 3));
  }

  private static suffix(exponent: number): string {
    const index = Math.trunc(exponent / 3);
    const finalIndex = (index > this.scales.length - 1) ? this.scales.length : index;
    return this.scales[finalIndex - 1];
  }
}
