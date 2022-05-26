import {ScaleNumber} from './scale.number';

describe('ScaleNumber', () => {
  const scales = ['M', 'G', 'T', 'P', 'E', 'Z', 'Y', '???'];

  it(`should not convert a positive number lower than 1000`, () => {
    expect(ScaleNumber.scale(999)).toEqual('999');
  });

  it(`should not convert a negative number greater than -1000`, () => {
    expect(ScaleNumber.scale(-999)).toEqual('-999');
  });

  it(`must not show insignificant zeroes`, () => {
    expect(ScaleNumber.scale(123400)).toEqual('123.4K');
  });

  scales.forEach((scale, index) => {
    const value = 12345678 * Math.pow(1000, index);
    const expected = `12.35${scale}`;

    it(`should convert '${value} into '${expected}'`, () => {
      expect(ScaleNumber.scale(value)).toEqual(expected);
    });

    it(`should convert '-${value} into '-${expected}'`, () => {
      expect(ScaleNumber.scale(-value)).toEqual(`-${expected}`);
    });
  });
});
