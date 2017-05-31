'use strict';

var should = require('should'),
  request = require('supertest'),
  path = require('path'),
  mongoose = require('mongoose'),
  User = mongoose.model('User'),
  Kiln = mongoose.model('Kiln'),
  express = require(path.resolve('./config/lib/express'));

/**
 * Globals
 */
var app,
  agent,
  credentials,
  user,
  kiln;

/**
 * Kiln routes tests
 */
describe('Kiln CRUD tests', function () {

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

    // Save a user to the test db and create new kiln
    user.save(function () {
      kiln = {
        title: 'Kiln Title',
        content: 'Kiln Content'
      };

      done();
    });
  });

  it('should not be able to save an kiln if logged in without the "admin" role', function (done) {
    agent.post('/api/auth/signin')
      .send(credentials)
      .expect(200)
      .end(function (signinErr, signinRes) {
        // Handle signin error
        if (signinErr) {
          return done(signinErr);
        }

        agent.post('/api/kilns')
          .send(kiln)
          .expect(403)
          .end(function (kilnSaveErr, kilnSaveRes) {
            // Call the assertion callback
            done(kilnSaveErr);
          });

      });
  });

  it('should not be able to save an kiln if not logged in', function (done) {
    agent.post('/api/kilns')
      .send(kiln)
      .expect(403)
      .end(function (kilnSaveErr, kilnSaveRes) {
        // Call the assertion callback
        done(kilnSaveErr);
      });
  });

  it('should not be able to update an kiln if signed in without the "admin" role', function (done) {
    agent.post('/api/auth/signin')
      .send(credentials)
      .expect(200)
      .end(function (signinErr, signinRes) {
        // Handle signin error
        if (signinErr) {
          return done(signinErr);
        }

        agent.post('/api/kilns')
          .send(kiln)
          .expect(403)
          .end(function (kilnSaveErr, kilnSaveRes) {
            // Call the assertion callback
            done(kilnSaveErr);
          });
      });
  });

  it('should be able to get a list of kilns if not signed in', function (done) {
    // Create new kiln model instance
    var kilnObj = new Kiln(kiln);

    // Save the kiln
    kilnObj.save(function () {
      // Request kilns
      request(app).get('/api/kilns')
        .end(function (req, res) {
          // Set assertion
          res.body.should.be.instanceof(Array).and.have.lengthOf(1);

          // Call the assertion callback
          done();
        });

    });
  });

  it('should be able to get a single kiln if not signed in', function (done) {
    // Create new kiln model instance
    var kilnObj = new Kiln(kiln);

    // Save the kiln
    kilnObj.save(function () {
      request(app).get('/api/kilns/' + kilnObj._id)
        .end(function (req, res) {
          // Set assertion
          res.body.should.be.instanceof(Object).and.have.property('title', kiln.title);

          // Call the assertion callback
          done();
        });
    });
  });

  it('should return proper error for single kiln with an invalid Id, if not signed in', function (done) {
    // test is not a valid mongoose Id
    request(app).get('/api/kilns/test')
      .end(function (req, res) {
        // Set assertion
        res.body.should.be.instanceof(Object).and.have.property('message', 'Kiln is invalid');

        // Call the assertion callback
        done();
      });
  });

  it('should return proper error for single kiln which doesnt exist, if not signed in', function (done) {
    // This is a valid mongoose Id but a non-existent kiln
    request(app).get('/api/kilns/559e9cd815f80b4c256a8f41')
      .end(function (req, res) {
        // Set assertion
        res.body.should.be.instanceof(Object).and.have.property('message', 'No kiln with that identifier has been found');

        // Call the assertion callback
        done();
      });
  });

  it('should not be able to delete an kiln if signed in without the "admin" role', function (done) {
    agent.post('/api/auth/signin')
      .send(credentials)
      .expect(200)
      .end(function (signinErr, signinRes) {
        // Handle signin error
        if (signinErr) {
          return done(signinErr);
        }

        agent.post('/api/kilns')
          .send(kiln)
          .expect(403)
          .end(function (kilnSaveErr, kilnSaveRes) {
            // Call the assertion callback
            done(kilnSaveErr);
          });
      });
  });

  it('should not be able to delete an kiln if not signed in', function (done) {
    // Set kiln user
    kiln.user = user;

    // Create new kiln model instance
    var kilnObj = new Kiln(kiln);

    // Save the kiln
    kilnObj.save(function () {
      // Try deleting kiln
      request(app).delete('/api/kilns/' + kilnObj._id)
        .expect(403)
        .end(function (kilnDeleteErr, kilnDeleteRes) {
          // Set message assertion
          (kilnDeleteRes.body.message).should.match('User is not authorized');

          // Handle kiln error error
          done(kilnDeleteErr);
        });

    });
  });

  it('should be able to get a single kiln that has an orphaned user reference', function (done) {
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

          // Save a new kiln
          agent.post('/api/kilns')
            .send(kiln)
            .expect(200)
            .end(function (kilnSaveErr, kilnSaveRes) {
              // Handle kiln save error
              if (kilnSaveErr) {
                return done(kilnSaveErr);
              }

              // Set assertions on new kiln
              (kilnSaveRes.body.title).should.equal(kiln.title);
              should.exist(kilnSaveRes.body.user);
              should.equal(kilnSaveRes.body.user._id, orphanId);

              // force the kiln to have an orphaned user reference
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

                    // Get the kiln
                    agent.get('/api/kilns/' + kilnSaveRes.body._id)
                      .expect(200)
                      .end(function (kilnInfoErr, kilnInfoRes) {
                        // Handle kiln error
                        if (kilnInfoErr) {
                          return done(kilnInfoErr);
                        }

                        // Set assertions
                        (kilnInfoRes.body._id).should.equal(kilnSaveRes.body._id);
                        (kilnInfoRes.body.title).should.equal(kiln.title);
                        should.equal(kilnInfoRes.body.user, undefined);

                        // Call the assertion callback
                        done();
                      });
                  });
              });
            });
        });
    });
  });

  it('should be able to get a single kiln if not signed in and verify the custom "isCurrentUserOwner" field is set to "false"', function (done) {
    // Create new kiln model instance
    var kilnObj = new Kiln(kiln);

    // Save the kiln
    kilnObj.save(function () {
      request(app).get('/api/kilns/' + kilnObj._id)
        .end(function (req, res) {
          // Set assertion
          res.body.should.be.instanceof(Object).and.have.property('title', kiln.title);
          // Assert the custom field "isCurrentUserOwner" is set to false for the un-authenticated User
          res.body.should.be.instanceof(Object).and.have.property('isCurrentUserOwner', false);
          // Call the assertion callback
          done();
        });
    });
  });

  it('should be able to get single kiln, that a different user created, if logged in & verify the "isCurrentUserOwner" field is set to "false"', function (done) {
    // Create temporary user creds
    var _creds = {
      usernameOrEmail: 'kilnowner',
      password: 'M3@n.jsI$Aw3$0m3'
    };

    // Create user that will create the Kiln
    var _kilnOwner = new User({
      firstName: 'Full',
      lastName: 'Name',
      displayName: 'Full Name',
      email: 'temp@test.com',
      username: _creds.usernameOrEmail,
      password: _creds.password,
      provider: 'local',
      roles: ['admin', 'user']
    });

    _kilnOwner.save(function (err, _user) {
      // Handle save error
      if (err) {
        return done(err);
      }

      // Sign in with the user that will create the Kiln
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

          // Save a new kiln
          agent.post('/api/kilns')
            .send(kiln)
            .expect(200)
            .end(function (kilnSaveErr, kilnSaveRes) {
              // Handle kiln save error
              if (kilnSaveErr) {
                return done(kilnSaveErr);
              }

              // Set assertions on new kiln
              (kilnSaveRes.body.title).should.equal(kiln.title);
              should.exist(kilnSaveRes.body.user);
              should.equal(kilnSaveRes.body.user._id, userId);

              // now signin with the test suite user
              agent.post('/api/auth/signin')
                .send(credentials)
                .expect(200)
                .end(function (err, res) {
                  // Handle signin error
                  if (err) {
                    return done(err);
                  }

                  // Get the kiln
                  agent.get('/api/kilns/' + kilnSaveRes.body._id)
                    .expect(200)
                    .end(function (kilnInfoErr, kilnInfoRes) {
                      // Handle kiln error
                      if (kilnInfoErr) {
                        return done(kilnInfoErr);
                      }

                      // Set assertions
                      (kilnInfoRes.body._id).should.equal(kilnSaveRes.body._id);
                      (kilnInfoRes.body.title).should.equal(kiln.title);
                      // Assert that the custom field "isCurrentUserOwner" is set to false since the current User didn't create it
                      (kilnInfoRes.body.isCurrentUserOwner).should.equal(false);

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
      Kiln.remove().exec(done);
    });
  });
});
