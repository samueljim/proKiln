'use strict';

/**
 * Module dependencies.
 */
var should = require('should'),
  mongoose = require('mongoose'),
  User = mongoose.model('User'),
  ControlPanel = mongoose.model('ControlPanel');

/**
 * Globals
 */
var user,
  controlPanel;

/**
 * Unit tests
 */
describe('ControlPanel Model Unit Tests:', function () {

  beforeEach(function (done) {
    user = new User({
      firstName: 'Full',
      lastName: 'Name',
      displayName: 'Full Name',
      email: 'test@test.com',
      username: 'username',
      password: 'M3@n.jsI$Aw3$0m3'
    });

    user.save(function () {
      controlPanel = new ControlPanel({
        title: 'ControlPanel Title',
        content: 'ControlPanel Content',
        user: user
      });

      done();
    });
  });

  describe('Method Save', function () {
    it('should be able to save without problems', function (done) {
      this.timeout(10000);
      controlPanel.save(function (err) {
        should.not.exist(err);
        return done();
      });
    });

    it('should be able to show an error when try to save without title', function (done) {
      controlPanel.title = '';

      controlPanel.save(function (err) {
        should.exist(err);
        return done();
      });
    });
  });

  afterEach(function (done) {
    ControlPanel.remove().exec(function () {
      User.remove().exec(done);
    });
  });
});
