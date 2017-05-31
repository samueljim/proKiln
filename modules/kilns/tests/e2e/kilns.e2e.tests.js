'use strict';

describe('Kilns E2E Tests:', function () {
  describe('Test kilns page', function () {
    it('Should report missing credentials', function () {
      browser.get('http://localhost:3001/kilns');
      expect(element.all(by.repeater('kiln in kilns')).count()).toEqual(0);
    });
  });
});
