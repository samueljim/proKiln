'use strict';

describe('Schedules E2E Tests:', function () {
  describe('Test schedules page', function () {
    it('Should report missing credentials', function () {
      browser.get('http://localhost:3001/schedules');
      expect(element.all(by.repeater('schedule in schedules')).count()).toEqual(0);
    });
  });
});
