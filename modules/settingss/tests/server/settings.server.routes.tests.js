'use strict';

var should = require('should'),
  request = require('supertest'),
  path = require('path'),
  mongoose = require('mongoose'),
  User = mongoose.model('User'),
  Settings = mongoose.model('Settings'),
  express = require(path.resolve('./config/lib/express'));

/**
 * Globals
 */
var app,
  agent,
  credentials,
  user,
  settings;

/**
 * Settings routes tests
 */
describe('Settings CRUD tests', function () {

  before(function (done) {
    // Get application
    app = express.init(mongoose);
    agent = request.agent(app);

    done();
  });

  beforeEach(function (done) {
    // Create user credentials
    credentials = {
      usernameOrEmail: 'username',
      password: 'M3@n.jsI$Aw3$0m3'
    };

    // Create a new user
    user = new User({
      firstName: 'Full',
      lastName: 'Name',
      displayName: 'Full Name',
      email: 'test@test.com',
      username: credentials.usernameOrEmail,
      password: credentials.password,
      provider: 'local'
    });

    // Save a user to the test db and create new settings
    user.save(function () {
      settings = {
        title: 'Settings Title',
        content: 'Settings Content'
      };

      done();
    });
  });

  it('should not be able to save an settings if logged in without the "admin" role', function (done) {
    agent.post('/api/auth/signin')
      .send(credentials)
      .expect(200)
      .end(function (signinErr, signinRes) {
        // Handle signin error
        if (signinErr) {
          return done(signinErr);
        }

        agent.post('/api/settingss')
          .send(settings)
          .expect(403)
          .end(function (settingsSaveErr, settingsSaveRes) {
            // Call the assertion callback
            done(settingsSaveErr);
          });

      });
  });

  it('should not be able to save an settings if not logged in', function (done) {
    agent.post('/api/settingss')
      .send(settings)
      .expect(403)
      .end(function (settingsSaveErr, settingsSaveRes) {
        // Call the assertion callback
        done(settingsSaveErr);
      });
  });

  it('should not be able to update an settings if signed in without the "admin" role', function (done) {
    agent.post('/api/auth/signin')
      .send(credentials)
      .expect(200)
      .end(function (signinErr, signinRes) {
        // Handle signin error
        if (signinErr) {
          return done(signinErr);
        }

        agent.post('/api/settingss')
          .send(settings)
          .expect(403)
          .end(function (settingsSaveErr, settingsSaveRes) {
            // Call the assertion callback
            done(settingsSaveErr);
          });
      });
  });

  it('should be able to get a list of settingss if not signed in', function (done) {
    // Create new settings model instance
    var settingsObj = new Settings(settings);

    // Save the settings
    settingsObj.save(function () {
      // Request settingss
      request(app).get('/api/settingss')
        .end(function (req, res) {
          // Set assertion
          res.body.should.be.instanceof(Array).and.have.lengthOf(1);

          // Call the assertion callback
          done();
        });

    });
  });

  it('should be able to get a single settings if not signed in', function (done) {
    // Create new settings model instance
    var settingsObj = new Settings(settings);

    // Save the settings
    settingsObj.save(function () {
      request(app).get('/api/settingss/' + settingsObj._id)
        .end(function (req, res) {
          // Set assertion
          res.body.should.be.instanceof(Object).and.have.property('title', settings.title);

          // Call the assertion callback
          done();
        });
    });
  });

  it('should return proper error for single settings with an invalid Id, if not signed in', function (done) {
    // test is not a valid mongoose Id
    request(app).get('/api/settingss/test')
      .end(function (req, res) {
        // Set assertion
        res.body.should.be.instanceof(Object).and.have.property('message', 'Settings is invalid');

        // Call the assertion callback
        done();
      });
  });

  it('should return proper error for single settings which doesnt exist, if not signed in', function (done) {
    // This is a valid mongoose Id but a non-existent settings
    request(app).get('/api/settingss/559e9cd815f80b4c256a8f41')
      .end(function (req, res) {
        // Set assertion
        res.body.should.be.instanceof(Object).and.have.property('message', 'No settings with that identifier has been found');

        // Call the assertion callback
        done();
      });
  });

  it('should not be able to delete an settings if signed in without the "admin" role', function (done) {
    agent.post('/api/auth/signin')
      .send(credentials)
      .expect(200)
      .end(function (signinErr, signinRes) {
        // Handle signin error
        if (signinErr) {
          return done(signinErr);
        }

        agent.post('/api/settingss')
          .send(settings)
          .expect(403)
          .end(function (settingsSaveErr, settingsSaveRes) {
            // Call the assertion callback
            done(settingsSaveErr);
          });
      });
  });

  it('should not be able to delete an settings if not signed in', function (done) {
    // Set settings user
    settings.user = user;

    // Create new settings model instance
    var settingsObj = new Settings(settings);

    // Save the settings
    settingsObj.save(function () {
      // Try deleting settings
      request(app).delete('/api/settingss/' + settingsObj._id)
        .expect(403)
        .end(function (settingsDeleteErr, settingsDeleteRes) {
          // Set message assertion
          (settingsDeleteRes.body.message).should.match('User is not authorized');

          // Handle settings error error
          done(settingsDeleteErr);
        });

    });
  });

  it('should be able to get a single settings that has an orphaned user reference', function (done) {
    // Create orphan user creds
    var _creds = {
      usernameOrEmail: 'orphan',
      password: 'M3@n.jsI$Aw3$0m3'
    };

    // Create orphan user
    var _orphan = new User({
      firstName: 'Full',
      lastName: 'Name',
      displayName: 'Full Name',
      email: 'orphan@test.com',
      username: _creds.usernameOrEmail,
      password: _creds.password,
      provider: 'local',
      roles: ['admin']
    });

    _orphan.save(function (err, orphan) {
      // Handle save error
      if (err) {
        return done(err);
      }

      agent.post('/api/auth/signin')
        .send(_creds)
        .expect(200)
        .end(function (signinErr, signinRes) {
          // Handle signin error
          if (signinErr) {
            return done(signinErr);
          }

          // Get the userId
          var orphanId = orphan._id;

          // Save a new settings
          agent.post('/api/settingss')
            .send(settings)
            .expect(200)
            .end(function (settingsSaveErr, settingsSaveRes) {
              // Handle settings save error
              if (settingsSaveErr) {
                return done(settingsSaveErr);
              }

              // Set assertions on new settings
              (settingsSaveRes.body.title).should.equal(settings.title);
              should.exist(settingsSaveRes.body.user);
              should.equal(settingsSaveRes.body.user._id, orphanId);

              // force the settings to have an orphaned user reference
              orphan.remove(function () {
                // now signin with valid user
                agent.post('/api/auth/signin')
                  .send(credentials)
                  .expect(200)
                  .end(function (err, res) {
                    // Handle signin error
                    if (err) {
                      return done(err);
                    }

                    // Get the settings
                    agent.get('/api/settingss/' + settingsSaveRes.body._id)
                      .expect(200)
                      .end(function (settingsInfoErr, settingsInfoRes) {
                        // Handle settings error
                        if (settingsInfoErr) {
                          return done(settingsInfoErr);
                        }

                        // Set assertions
                        (settingsInfoRes.body._id).should.equal(settingsSaveRes.body._id);
                        (settingsInfoRes.body.title).should.equal(settings.title);
                        should.equal(settingsInfoRes.body.user, undefined);

                        // Call the assertion callback
                        done();
                      });
                  });
              });
            });
        });
    });
  });

  it('should be able to get a single settings if not signed in and verify the custom "isCurrentUserOwner" field is set to "false"', function (done) {
    // Create new settings model instance
    var settingsObj = new Settings(settings);

    // Save the settings
    settingsObj.save(function () {
      request(app).get('/api/settingss/' + settingsObj._id)
        .end(function (req, res) {
          // Set assertion
          res.body.should.be.instanceof(Object).and.have.property('title', settings.title);
          // Assert the custom field "isCurrentUserOwner" is set to false for the un-authenticated User
          res.body.should.be.instanceof(Object).and.have.property('isCurrentUserOwner', false);
          // Call the assertion callback
          done();
        });
    });
  });

  it('should be able to get single settings, that a different user created, if logged in & verify the "isCurrentUserOwner" field is set to "false"', function (done) {
    // Create temporary user creds
    var _creds = {
      usernameOrEmail: 'settingsowner',
      password: 'M3@n.jsI$Aw3$0m3'
    };

    // Create user that will create the Settings
    var _settingsOwner = new User({
      firstName: 'Full',
      lastName: 'Name',
      displayName: 'Full Name',
      email: 'temp@test.com',
      username: _creds.usernameOrEmail,
      password: _creds.password,
      provider: 'local',
      roles: ['admin', 'user']
    });

    _settingsOwner.save(function (err, _user) {
      // Handle save error
      if (err) {
        return done(err);
      }

      // Sign in with the user that will create the Settings
      agent.post('/api/auth/signin')
        .send(_creds)
        .expect(200)
        .end(function (signinErr, signinRes) {
          // Handle signin error
          if (signinErr) {
            return done(signinErr);
          }

          // Get the userId
          var userId = _user._id;

          // Save a new settings
          agent.post('/api/settingss')
            .send(settings)
            .expect(200)
            .end(function (settingsSaveErr, settingsSaveRes) {
              // Handle settings save error
              if (settingsSaveErr) {
                return done(settingsSaveErr);
              }

              // Set assertions on new settings
              (settingsSaveRes.body.title).should.equal(settings.title);
              should.exist(settingsSaveRes.body.user);
              should.equal(settingsSaveRes.body.user._id, userId);

              // now signin with the test suite user
              agent.post('/api/auth/signin')
                .send(credentials)
                .expect(200)
                .end(function (err, res) {
                  // Handle signin error
                  if (err) {
                    return done(err);
                  }

                  // Get the settings
                  agent.get('/api/settingss/' + settingsSaveRes.body._id)
                    .expect(200)
                    .end(function (settingsInfoErr, settingsInfoRes) {
                      // Handle settings error
                      if (settingsInfoErr) {
                        return done(settingsInfoErr);
                      }

                      // Set assertions
                      (settingsInfoRes.body._id).should.equal(settingsSaveRes.body._id);
                      (settingsInfoRes.body.title).should.equal(settings.title);
                      // Assert that the custom field "isCurrentUserOwner" is set to false since the current User didn't create it
                      (settingsInfoRes.body.isCurrentUserOwner).should.equal(false);

                      // Call the assertion callback
                      done();
                    });
                });
            });
        });
    });
  });

  afterEach(function (done) {
    User.remove().exec(function () {
      Settings.remove().exec(done);
    });
  });
});
