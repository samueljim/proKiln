'use strict';

describe('Memes E2E Tests:', function () {
  describe('Test memes page', function () {
    it('Should report missing credentials', function () {
      browser.get('http://localhost:3001/memes');
      expect(element.all(by.repeater('meme in memes')).count()).toEqual(0);
    });
  });
});
