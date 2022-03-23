import {ScaleNumberPipe} from "./scale.number.pipe";

describe('ScaleNumberPipe', () => {
  const pipe = new ScaleNumberPipe();
  const scales = ["M", "G", "T", "P", "E", "Z", "Y", "???"];

  it(`should not convert a positive number lower than 1000`, () => {
    expect(pipe.transform(999)).toEqual("999");
  });

  it(`should not convert a negative number greater than -1000`, () => {
    expect(pipe.transform(-999)).toEqual("-999");
  });

  scales.forEach((scale, index) => {
    const value = 12345678 * Math.pow(1000, index);
    const expected = `12.35${scale}`;

    it(`should convert '${value} into '${expected}'`, () => {
      expect(pipe.transform(value)).toEqual(expected);
    });

    it(`should convert '-${value} into '-${expected}'`, () => {
      expect(pipe.transform(-value)).toEqual(`-${expected}`);
    });
  });
});
