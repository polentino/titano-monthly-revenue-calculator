import {Pipe, PipeTransform} from "@angular/core";


@Pipe({name: 'scaleNumber'})
export class ScaleNumberPipe implements PipeTransform {

  transform(value: number): string {
    const exponent = Math.trunc(Math.log10(value));
    if (exponent < 3) {
      return value.toString();
    }

    const valueScaled = Math.trunc(value) / this.scaleFactor(exponent);
    const multiplierSuffix = this.suffix(exponent);

    return `${valueScaled.toFixed(2)}${multiplierSuffix}`
  }

  private scaleFactor(exponent: number): number {
    return Math.pow(1000, Math.trunc(exponent / 3));
  }

  private suffix(exponent: number): string {
    switch (Math.trunc(exponent / 3)) {
      case 1:
        return "K";
      case 2:
        return "M";
      case 3:
        return "G";
      case 4:
        return "T";
      case 5:
        return "P";
      // those are a bit too much :)
      case 6:
        return "E";
      case 7:
        return "Z";
      case 8:
        return "Y";
      default:
        return "???";
    }
  }
}
