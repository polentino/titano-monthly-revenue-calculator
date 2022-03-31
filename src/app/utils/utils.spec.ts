describe('Utils', () => {

  describe('Date extension methods', () => {

    describe('\'clone()\'', () => {
      it('should produce a Date object independent from the original one', () => {
        const originalDate = new Date(2021, 1, 21);
        const clonedDate = originalDate.clone();
        expect(clonedDate).toEqual(originalDate);

        originalDate.setMonth(0);
        expect(originalDate.getMonth()).not.toEqual(clonedDate.getMonth());

        clonedDate.setMonth(3);
        expect(clonedDate.getMonth()).not.toEqual(originalDate.getMonth());
      })
    });

    describe('\'plusDays(days: number)\'', () => {
      it('should return the same date, if argument is 0', () => {
        const startDate = new Date(2021, 1, 21);
        const expectedDate = new Date(2021, 1, 21);
        expect(startDate.plusDays(0)).toEqual(expectedDate);
      });

      it('should return the same date, if argument is negative', () => {
        const startDate = new Date(2021, 1, 21);
        const expectedDate = new Date(2021, 1, 21);
        expect(startDate.plusDays(-100)).toEqual(expectedDate);
      });

      it('should increase the date as expected', () => {
        const startDate = new Date(2021, 1, 28);
        const expectedDate = new Date(2022, 1, 28);
        expect(startDate.plusDays(365)).toEqual(expectedDate);
      });

      it('should increase the date as expected [leap year]', () => {
        const startDate = new Date(2020, 1, 28);
        const expectedDate = new Date(2021, 1, 27);
        expect(startDate.plusDays(365)).toEqual(expectedDate);
      });

      it('should drop the decimal part and increase the date as expected, if the number is not an integer', () => {
        const startDate = new Date(2021, 1, 28);
        const expectedDate = new Date(2022, 1, 28);
        expect(startDate.plusDays(365.9)).toEqual(expectedDate);
      });
    });

    describe('\'minusDays(days: number)\'', () => {
      it('should return the same date, if argument is 0', () => {
        const startDate = new Date(2021, 1, 21);
        const expectedDate = new Date(2021, 1, 21);
        expect(startDate.minusDays(0)).toEqual(expectedDate);
      });

      it('should return the same date, if argument is negative', () => {
        const startDate = new Date(2021, 1, 21);
        const expectedDate = new Date(2021, 1, 21);
        expect(startDate.minusDays(-100)).toEqual(expectedDate);
      });

      it('should decrease the date as expected', () => {
        const startDate = new Date(2022, 1, 28);
        const expectedDate = new Date(2021, 1, 28);
        expect(startDate.minusDays(365)).toEqual(expectedDate);
      });

      it('should decrease the date as expected [leap year]', () => {
        const startDate = new Date(2021, 1, 28);
        const expectedDate = new Date(2020, 1, 29 );
        expect(startDate.minusDays(365)).toEqual(expectedDate);
      });

      it('should drop the decimal part and decrease the date as expected, if the number is not an integer', () => {
        const startDate = new Date(2022, 1, 28);
        const expectedDate = new Date(2021, 1, 28);
        expect(startDate.minusDays(365.9)).toEqual(expectedDate);
      });
    });

    describe('\'daysBetween(otherDate: Date)\'', () => {
      it('should return 0, when applied to the same date', () => {
        const startDate = new Date(2021, 8, 15);
        const result = startDate.daysBetween(startDate);
        expect(result).toEqual(0);
      });

      it('should return 1, when applied to the previous day', () => {
        const yesterday = new Date(2021, 8, 15);
        const tomorrow = yesterday.plusDays(1)
        const result = tomorrow.daysBetween(yesterday);
        expect(result).toEqual(1);
      });

      it('should return -1, when applied to the next day', () => {
        const yesterday = new Date(2021, 8, 15);
        const tomorrow = yesterday.plusDays(1)
        const result = yesterday.daysBetween(tomorrow);
        expect(result).toEqual(-1);
      });

      it('should return 1, when applied to the previous day [leap year]', () => {
        const yesterday = new Date(2020, 1, 28);
        const tomorrow = yesterday.plusDays(1)
        const result = tomorrow.daysBetween(yesterday);
        expect(result).toEqual(1);
      });

      it('should return -1, when applied to the next day [leap year]', () => {
        const yesterday = new Date(2020, 1, 28);
        const tomorrow = yesterday.plusDays(1)
        const result = yesterday.daysBetween(tomorrow);
        expect(result).toEqual(-1);
      });
    });
  });
});
