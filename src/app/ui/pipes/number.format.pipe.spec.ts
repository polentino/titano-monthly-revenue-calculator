import {NumberFormatPipe} from "./number.format.pipe";

describe('NumberFormatPipe', () => {
  const pipe = new NumberFormatPipe();

  // todo: replace all " with '
  it(`should convert '0.123456' into '0.123'`, () => {
    expect(pipe.transform(0.123456)).toEqual("0.123");
  });

  it(`should convert '0.123456' into '0.1235' (4 decimal places)`, () => {
    expect(pipe.transform(0.123456, 5)).toEqual("0.12346");
  });

  it(`should convert '0.9876' into '0.99' (2 decimal places)`, () => {
    expect(pipe.transform(0.9876, 2)).toEqual("0.99");
  });

  it(`should convert '0.9876' into '1' (0 decimal places)`, () => {
    expect(pipe.transform(0.9876, 0)).toEqual("1");
  });
});
