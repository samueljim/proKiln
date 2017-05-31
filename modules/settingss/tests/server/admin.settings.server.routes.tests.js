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
describe('Settings Admin CRUD tests', function () {
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
      roles: ['user', 'admin'],
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

  it('should be able to save an settings if logged in', function (done) {
    agent.post('/api/auth/signin')
      .send(credentials)
      .expect(200)
      .end(function (signinErr, signinRes) {
        // Handle signin error
        if (signinErr) {
          return done(signinErr);
        }

        // Get the userId
        var userId = user.id;

        // Save a new settings
        agent.post('/api/settingss')
          .send(settings)
          .expect(200)
          .end(function (settingsSaveErr, settingsSaveRes) {
            // Handle settings save error
            if (settingsSaveErr) {
              return done(settingsSaveErr);
            }

            // Get a list of settingss
            agent.get('/api/settingss')
              .end(function (settingssGetErr, settingssGetRes) {
                // Handle settings save error
                if (settingssGetErr) {
                  return done(settingssGetErr);
                }

                // Get settingss list
                var settingss = settingssGetRes.body;

                // Set assertions
                (settingss[0].user._id).should.equal(userId);
                (settingss[0].title).should.match('Settings Title');

                // Call the assertion callback
                done();
              });
          });
      });
  });

  it('should be able to update an settings if signed in', function (done) {
    agent.post('/api/auth/signin')
      .send(credentials)
      .expect(200)
      .end(function (signinErr, signinRes) {
        // Handle signin error
        if (signinErr) {
          return done(signinErr);
        }

        // Get the userId
        var userId = user.id;

        // Save a new settings
        agent.post('/api/settingss')
          .send(settings)
          .expect(200)
          .end(function (settingsSaveErr, settingsSaveRes) {
            // Handle settings save error
            if (settingsSaveErr) {
              return done(settingsSaveErr);
            }

            // Update settings title
            settings.title = 'WHY YOU GOTTA BE SO MEAN?';

            // Update an existing settings
            agent.put('/api/settingss/' + settingsSaveRes.body._id)
              .send(settings)
              .expect(200)
              .end(function (settingsUpdateErr, settingsUpdateRes) {
                // Handle settings update error
                if (settingsUpdateErr) {
                  return done(settingsUpdateErr);
                }

                // Set assertions
                (settingsUpdateRes.body._id).should.equal(settingsSaveRes.body._id);
                (settingsUpdateRes.body.title).should.match('WHY YOU GOTTA BE SO MEAN?');

                // Call the assertion callback
                done();
              });
          });
      });
  });

  it('should not be able to save an settings if no title is provided', function (done) {
    // Invalidate title field
    settings.title = '';

    agent.post('/api/auth/signin')
      .send(credentials)
      .expect(200)
      .end(function (signinErr, signinRes) {
        // Handle signin error
        if (signinErr) {
          return done(signinErr);
        }

        // Get the userId
        var userId = user.id;

        // Save a new settings
        agent.post('/api/settingss')
          .send(settings)
          .expect(422)
          .end(function (settingsSaveErr, settingsSaveRes) {
            // Set message assertion
            (settingsSaveRes.body.message).should.match('Title cannot be blank');

            // Handle settings save error
            done(settingsSaveErr);
          });
      });
  });

  it('should be able to delete an settings if signed in', function (done) {
    agent.post('/api/auth/signin')
      .send(credentials)
      .expect(200)
      .end(function (signinErr, signinRes) {
        // Handle signin error
        if (signinErr) {
          return done(signinErr);
        }

        // Get the userId
        var userId = user.id;

        // Save a new settings
        agent.post('/api/settingss')
          .send(settings)
          .expect(200)
          .end(function (settingsSaveErr, settingsSaveRes) {
            // Handle settings save error
            if (settingsSaveErr) {
              return done(settingsSaveErr);
            }

            // Delete an existing settings
            agent.delete('/api/settingss/' + settingsSaveRes.body._id)
              .send(settings)
              .expect(200)
              .end(function (settingsDeleteErr, settingsDeleteRes) {
                // Handle settings error error
                if (settingsDeleteErr) {
                  return done(settingsDeleteErr);
                }

                // Set assertions
                (settingsDeleteRes.body._id).should.equal(settingsSaveRes.body._id);

                // Call the assertion callback
                done();
              });
          });
      });
  });

  it('should be able to get a single settings if signed in and verify the custom "isCurrentUserOwner" field is set to "true"', function (done) {
    // Create new settings model instance
    settings.user = user;
    var settingsObj = new Settings(settings);

    agent.post('/api/auth/signin')
      .send(credentials)
      .expect(200)
      .end(function (signinErr, signinRes) {
        // Handle signin error
        if (signinErr) {
          return done(signinErr);
        }

        // Get the userId
        var userId = user.id;

        // Save a new settings
        agent.post('/api/settingss')
          .send(settings)
          .expect(200)
          .end(function (settingsSaveErr, settingsSaveRes) {
            // Handle settings save error
            if (settingsSaveErr) {
              return done(settingsSaveErr);
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

                // Assert that the "isCurrentUserOwner" field is set to true since the current User created it
                (settingsInfoRes.body.isCurrentUserOwner).should.equal(true);

                // Call the assertion callback
                done();
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
