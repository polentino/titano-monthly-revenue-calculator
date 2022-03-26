export {};

declare global {
  interface Date {
    plusDays(days: number): Date;
    minusDays(days: number): Date;
    clone(): Date;
  }
}

Object.defineProperty(Date.prototype, 'clone', {
  enumerable: false,
  configurable: false,
  writable: false,
  value: function () {
    return (new Date(this));
  }
});

Object.defineProperty(Date.prototype, 'plusDays', {
  enumerable: false,
  configurable: false,
  writable: false,
  value: function (days: number) {
    const date = this.clone()
    const intDays = Math.trunc(days);
    if (intDays > 0) {
      date.setDate(date.getDate() + intDays);
    }
    return date;
  }
});

Object.defineProperty(Date.prototype, 'minusDays', {
  enumerable: false,
  configurable: false,
  writable: false,
  value: function (days: number) {
    const date = this.clone()
    const intDays = Math.trunc(days);
    if (intDays > 0) {
      date.setDate(date.getDate() - intDays);
    }
    return date;
  }
});
