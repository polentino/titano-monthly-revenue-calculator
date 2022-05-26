export namespace ScaleNumber {
  const scales = ['K', 'M', 'G', 'T', 'P', 'E', 'Z', 'Y', '???'];

  export function scale(value: number): string {
    const exponent = Math.trunc(Math.log10(Math.abs(value)));
    if (exponent < 3) {
      return parseFloat(value.toFixed(2)).toString();
    }

    const valueScaled = Math.trunc(value) / scaleFactor(exponent);
    const multiplierSuffix = suffix(exponent);

    return `${parseFloat(valueScaled.toFixed(2))}${multiplierSuffix}`;
  }

  export function scaleFactor(exponent: number): number {
    return Math.pow(1000, Math.trunc(exponent / 3));
  }

  export function suffix(exponent: number): string {
    const index = Math.trunc(exponent / 3);
    const finalIndex = (index > scales.length - 1) ? scales.length : index;
    return scales[finalIndex - 1];
  }
}
