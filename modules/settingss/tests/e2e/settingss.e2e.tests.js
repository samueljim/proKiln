'use strict';

describe('Settingss E2E Tests:', function () {
  describe('Test settingss page', function () {
    it('Should report missing credentials', function () {
      browser.get('http://localhost:3001/settingss');
      expect(element.all(by.repeater('settings in settingss')).count()).toEqual(0);
    });
  });
});
