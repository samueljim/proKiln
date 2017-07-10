'use strict';

describe('ControlPanels E2E Tests:', function () {
  describe('Test controlPanels page', function () {
    it('Should report missing credentials', function () {
      browser.get('http://localhost:3001/controlPanels');
      expect(element.all(by.repeater('controlPanel in controlPanels')).count()).toEqual(0);
    });
  });
});
