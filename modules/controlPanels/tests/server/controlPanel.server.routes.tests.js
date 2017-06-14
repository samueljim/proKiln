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
describe('ControlPanel CRUD tests', function () {

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

    // Save a user to the test db and create new controlPanel
    user.save(function () {
      controlPanel = {
        title: 'ControlPanel Title',
        content: 'ControlPanel Content'
      };

      done();
    });
  });

  it('should not be able to save an controlPanel if logged in without the "admin" role', function (done) {
    agent.post('/api/auth/signin')
      .send(credentials)
      .expect(200)
      .end(function (signinErr, signinRes) {
        // Handle signin error
        if (signinErr) {
          return done(signinErr);
        }

        agent.post('/api/controlPanels')
          .send(controlPanel)
          .expect(403)
          .end(function (controlPanelSaveErr, controlPanelSaveRes) {
            // Call the assertion callback
            done(controlPanelSaveErr);
          });

      });
  });

  it('should not be able to save an controlPanel if not logged in', function (done) {
    agent.post('/api/controlPanels')
      .send(controlPanel)
      .expect(403)
      .end(function (controlPanelSaveErr, controlPanelSaveRes) {
        // Call the assertion callback
        done(controlPanelSaveErr);
      });
  });

  it('should not be able to update an controlPanel if signed in without the "admin" role', function (done) {
    agent.post('/api/auth/signin')
      .send(credentials)
      .expect(200)
      .end(function (signinErr, signinRes) {
        // Handle signin error
        if (signinErr) {
          return done(signinErr);
        }

        agent.post('/api/controlPanels')
          .send(controlPanel)
          .expect(403)
          .end(function (controlPanelSaveErr, controlPanelSaveRes) {
            // Call the assertion callback
            done(controlPanelSaveErr);
          });
      });
  });

  it('should be able to get a list of controlPanels if not signed in', function (done) {
    // Create new controlPanel model instance
    var controlPanelObj = new ControlPanel(controlPanel);

    // Save the controlPanel
    controlPanelObj.save(function () {
      // Request controlPanels
      request(app).get('/api/controlPanels')
        .end(function (req, res) {
          // Set assertion
          res.body.should.be.instanceof(Array).and.have.lengthOf(1);

          // Call the assertion callback
          done();
        });

    });
  });

  it('should be able to get a single controlPanel if not signed in', function (done) {
    // Create new controlPanel model instance
    var controlPanelObj = new ControlPanel(controlPanel);

    // Save the controlPanel
    controlPanelObj.save(function () {
      request(app).get('/api/controlPanels/' + controlPanelObj._id)
        .end(function (req, res) {
          // Set assertion
          res.body.should.be.instanceof(Object).and.have.property('title', controlPanel.title);

          // Call the assertion callback
          done();
        });
    });
  });

  it('should return proper error for single controlPanel with an invalid Id, if not signed in', function (done) {
    // test is not a valid mongoose Id
    request(app).get('/api/controlPanels/test')
      .end(function (req, res) {
        // Set assertion
        res.body.should.be.instanceof(Object).and.have.property('message', 'ControlPanel is invalid');

        // Call the assertion callback
        done();
      });
  });

  it('should return proper error for single controlPanel which doesnt exist, if not signed in', function (done) {
    // This is a valid mongoose Id but a non-existent controlPanel
    request(app).get('/api/controlPanels/559e9cd815f80b4c256a8f41')
      .end(function (req, res) {
        // Set assertion
        res.body.should.be.instanceof(Object).and.have.property('message', 'No controlPanel with that identifier has been found');

        // Call the assertion callback
        done();
      });
  });

  it('should not be able to delete an controlPanel if signed in without the "admin" role', function (done) {
    agent.post('/api/auth/signin')
      .send(credentials)
      .expect(200)
      .end(function (signinErr, signinRes) {
        // Handle signin error
        if (signinErr) {
          return done(signinErr);
        }

        agent.post('/api/controlPanels')
          .send(controlPanel)
          .expect(403)
          .end(function (controlPanelSaveErr, controlPanelSaveRes) {
            // Call the assertion callback
            done(controlPanelSaveErr);
          });
      });
  });

  it('should not be able to delete an controlPanel if not signed in', function (done) {
    // Set controlPanel user
    controlPanel.user = user;

    // Create new controlPanel model instance
    var controlPanelObj = new ControlPanel(controlPanel);

    // Save the controlPanel
    controlPanelObj.save(function () {
      // Try deleting controlPanel
      request(app).delete('/api/controlPanels/' + controlPanelObj._id)
        .expect(403)
        .end(function (controlPanelDeleteErr, controlPanelDeleteRes) {
          // Set message assertion
          (controlPanelDeleteRes.body.message).should.match('User is not authorized');

          // Handle controlPanel error error
          done(controlPanelDeleteErr);
        });

    });
  });

  it('should be able to get a single controlPanel that has an orphaned user reference', function (done) {
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

          // Save a new controlPanel
          agent.post('/api/controlPanels')
            .send(controlPanel)
            .expect(200)
            .end(function (controlPanelSaveErr, controlPanelSaveRes) {
              // Handle controlPanel save error
              if (controlPanelSaveErr) {
                return done(controlPanelSaveErr);
              }

              // Set assertions on new controlPanel
              (controlPanelSaveRes.body.title).should.equal(controlPanel.title);
              should.exist(controlPanelSaveRes.body.user);
              should.equal(controlPanelSaveRes.body.user._id, orphanId);

              // force the controlPanel to have an orphaned user reference
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
                        should.equal(controlPanelInfoRes.body.user, undefined);

                        // Call the assertion callback
                        done();
                      });
                  });
              });
            });
        });
    });
  });

  it('should be able to get a single controlPanel if not signed in and verify the custom "isCurrentUserOwner" field is set to "false"', function (done) {
    // Create new controlPanel model instance
    var controlPanelObj = new ControlPanel(controlPanel);

    // Save the controlPanel
    controlPanelObj.save(function () {
      request(app).get('/api/controlPanels/' + controlPanelObj._id)
        .end(function (req, res) {
          // Set assertion
          res.body.should.be.instanceof(Object).and.have.property('title', controlPanel.title);
          // Assert the custom field "isCurrentUserOwner" is set to false for the un-authenticated User
          res.body.should.be.instanceof(Object).and.have.property('isCurrentUserOwner', false);
          // Call the assertion callback
          done();
        });
    });
  });

  it('should be able to get single controlPanel, that a different user created, if logged in & verify the "isCurrentUserOwner" field is set to "false"', function (done) {
    // Create temporary user creds
    var _creds = {
      usernameOrEmail: 'controlPanelowner',
      password: 'M3@n.jsI$Aw3$0m3'
    };

    // Create user that will create the ControlPanel
    var _controlPanelOwner = new User({
      firstName: 'Full',
      lastName: 'Name',
      displayName: 'Full Name',
      email: 'temp@test.com',
      username: _creds.usernameOrEmail,
      password: _creds.password,
      provider: 'local',
      roles: ['admin', 'user']
    });

    _controlPanelOwner.save(function (err, _user) {
      // Handle save error
      if (err) {
        return done(err);
      }

      // Sign in with the user that will create the ControlPanel
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

          // Save a new controlPanel
          agent.post('/api/controlPanels')
            .send(controlPanel)
            .expect(200)
            .end(function (controlPanelSaveErr, controlPanelSaveRes) {
              // Handle controlPanel save error
              if (controlPanelSaveErr) {
                return done(controlPanelSaveErr);
              }

              // Set assertions on new controlPanel
              (controlPanelSaveRes.body.title).should.equal(controlPanel.title);
              should.exist(controlPanelSaveRes.body.user);
              should.equal(controlPanelSaveRes.body.user._id, userId);

              // now signin with the test suite user
              agent.post('/api/auth/signin')
                .send(credentials)
                .expect(200)
                .end(function (err, res) {
                  // Handle signin error
                  if (err) {
                    return done(err);
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
                      // Assert that the custom field "isCurrentUserOwner" is set to false since the current User didn't create it
                      (controlPanelInfoRes.body.isCurrentUserOwner).should.equal(false);

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
      ControlPanel.remove().exec(done);
    });
  });
});
