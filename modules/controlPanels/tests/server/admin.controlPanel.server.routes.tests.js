'use strict';

var should = require('should'),
  request = require('supertest'),
  path = require('path'),
  mongoose = require('mongoose'),
  User = mongoose.model('User'),
  ControlPanel = mongoose.model('ControlPanel'),
  express = require(path.resolve('./config/lib/express'));

/**
 * Globals
 */
var app,
  agent,
  credentials,
  user,
  controlPanel;

/**
 * ControlPanel routes tests
 */
describe('ControlPanel Admin CRUD tests', function () {
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

    // Save a user to the test db and create new controlPanel
    user.save(function () {
      controlPanel = {
        title: 'ControlPanel Title',
        content: 'ControlPanel Content'
      };

      done();
    });
  });

  it('should be able to save an controlPanel if logged in', function (done) {
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

        // Save a new controlPanel
        agent.post('/api/controlPanels')
          .send(controlPanel)
          .expect(200)
          .end(function (controlPanelSaveErr, controlPanelSaveRes) {
            // Handle controlPanel save error
            if (controlPanelSaveErr) {
              return done(controlPanelSaveErr);
            }

            // Get a list of controlPanels
            agent.get('/api/controlPanels')
              .end(function (controlPanelsGetErr, controlPanelsGetRes) {
                // Handle controlPanel save error
                if (controlPanelsGetErr) {
                  return done(controlPanelsGetErr);
                }

                // Get controlPanels list
                var controlPanels = controlPanelsGetRes.body;

                // Set assertions
                (controlPanels[0].user._id).should.equal(userId);
                (controlPanels[0].title).should.match('ControlPanel Title');

                // Call the assertion callback
                done();
              });
          });
      });
  });

  it('should be able to update an controlPanel if signed in', function (done) {
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

        // Save a new controlPanel
        agent.post('/api/controlPanels')
          .send(controlPanel)
          .expect(200)
          .end(function (controlPanelSaveErr, controlPanelSaveRes) {
            // Handle controlPanel save error
            if (controlPanelSaveErr) {
              return done(controlPanelSaveErr);
            }

            // Update controlPanel title
            controlPanel.title = 'WHY YOU GOTTA BE SO MEAN?';

            // Update an existing controlPanel
            agent.put('/api/controlPanels/' + controlPanelSaveRes.body._id)
              .send(controlPanel)
              .expect(200)
              .end(function (controlPanelUpdateErr, controlPanelUpdateRes) {
                // Handle controlPanel update error
                if (controlPanelUpdateErr) {
                  return done(controlPanelUpdateErr);
                }

                // Set assertions
                (controlPanelUpdateRes.body._id).should.equal(controlPanelSaveRes.body._id);
                (controlPanelUpdateRes.body.title).should.match('WHY YOU GOTTA BE SO MEAN?');

                // Call the assertion callback
                done();
              });
          });
      });
  });

  it('should not be able to save an controlPanel if no title is provided', function (done) {
    // Invalidate title field
    controlPanel.title = '';

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

        // Save a new controlPanel
        agent.post('/api/controlPanels')
          .send(controlPanel)
          .expect(422)
          .end(function (controlPanelSaveErr, controlPanelSaveRes) {
            // Set message assertion
            (controlPanelSaveRes.body.message).should.match('Title cannot be blank');

            // Handle controlPanel save error
            done(controlPanelSaveErr);
          });
      });
  });

  it('should be able to delete an controlPanel if signed in', function (done) {
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

        // Save a new controlPanel
        agent.post('/api/controlPanels')
          .send(controlPanel)
          .expect(200)
          .end(function (controlPanelSaveErr, controlPanelSaveRes) {
            // Handle controlPanel save error
            if (controlPanelSaveErr) {
              return done(controlPanelSaveErr);
            }

            // Delete an existing controlPanel
            agent.delete('/api/controlPanels/' + controlPanelSaveRes.body._id)
              .send(controlPanel)
              .expect(200)
              .end(function (controlPanelDeleteErr, controlPanelDeleteRes) {
                // Handle controlPanel error error
                if (controlPanelDeleteErr) {
                  return done(controlPanelDeleteErr);
                }

                // Set assertions
                (controlPanelDeleteRes.body._id).should.equal(controlPanelSaveRes.body._id);

                // Call the assertion callback
                done();
              });
          });
      });
  });

  it('should be able to get a single controlPanel if signed in and verify the custom "isCurrentUserOwner" field is set to "true"', function (done) {
    // Create new controlPanel model instance
    controlPanel.user = user;
    var controlPanelObj = new ControlPanel(controlPanel);

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

        // Save a new controlPanel
        agent.post('/api/controlPanels')
          .send(controlPanel)
          .expect(200)
          .end(function (controlPanelSaveErr, controlPanelSaveRes) {
            // Handle controlPanel save error
            if (controlPanelSaveErr) {
              return done(controlPanelSaveErr);
            }

            // Get the controlPanel
            agent.get('/api/controlPanels/' + controlPanelSaveRes.body._id)
              .expect(200)
              .end(function (controlPanelInfoErr, controlPanelInfoRes) {
                // Handle controlPanel error
                if (controlPanelInfoErr) {
                  return done(controlPanelInfoErr);
                }

                // Set assertions
                (controlPanelInfoRes.body._id).should.equal(controlPanelSaveRes.body._id);
                (controlPanelInfoRes.body.title).should.equal(controlPanel.title);

                // Assert that the "isCurrentUserOwner" field is set to true since the current User created it
                (controlPanelInfoRes.body.isCurrentUserOwner).should.equal(true);

                // Call the assertion callback
                done();
              });
          });
      });
  });

  afterEach(function (done) {
    User.remove().exec(function () {
      ControlPanel.remove().exec(done);
    });
  });
});
