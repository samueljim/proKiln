'use strict';

describe('Userss E2E Tests:', function () {
  describe('Test userss page', function () {
    it('Should report missing credentials', function () {
      browser.get('http://localhost:3001/userss');
      expect(element.all(by.repeater('users in userss')).count()).toEqual(0);
    });
  });
});
