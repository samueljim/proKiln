'use strict';

var should = require('should'),
  request = require('supertest'),
  path = require('path'),
  mongoose = require('mongoose'),
  User = mongoose.model('User'),
  Users = mongoose.model('Users'),
  express = require(path.resolve('./config/lib/express'));

/**
 * Globals
 */
var app,
  agent,
  credentials,
  user,
  users;

/**
 * Users routes tests
 */
describe('Users CRUD tests', function () {

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

    // Save a user to the test db and create new users
    user.save(function () {
      users = {
        title: 'Users Title',
        content: 'Users Content'
      };

      done();
    });
  });

  it('should not be able to save an users if logged in without the "admin" role', function (done) {
    agent.post('/api/auth/signin')
      .send(credentials)
      .expect(200)
      .end(function (signinErr, signinRes) {
        // Handle signin error
        if (signinErr) {
          return done(signinErr);
        }

        agent.post('/api/userss')
          .send(users)
          .expect(403)
          .end(function (usersSaveErr, usersSaveRes) {
            // Call the assertion callback
            done(usersSaveErr);
          });

      });
  });

  it('should not be able to save an users if not logged in', function (done) {
    agent.post('/api/userss')
      .send(users)
      .expect(403)
      .end(function (usersSaveErr, usersSaveRes) {
        // Call the assertion callback
        done(usersSaveErr);
      });
  });

  it('should not be able to update an users if signed in without the "admin" role', function (done) {
    agent.post('/api/auth/signin')
      .send(credentials)
      .expect(200)
      .end(function (signinErr, signinRes) {
        // Handle signin error
        if (signinErr) {
          return done(signinErr);
        }

        agent.post('/api/userss')
          .send(users)
          .expect(403)
          .end(function (usersSaveErr, usersSaveRes) {
            // Call the assertion callback
            done(usersSaveErr);
          });
      });
  });

  it('should be able to get a list of userss if not signed in', function (done) {
    // Create new users model instance
    var usersObj = new Users(users);

    // Save the users
    usersObj.save(function () {
      // Request userss
      request(app).get('/api/userss')
        .end(function (req, res) {
          // Set assertion
          res.body.should.be.instanceof(Array).and.have.lengthOf(1);

          // Call the assertion callback
          done();
        });

    });
  });

  it('should be able to get a single users if not signed in', function (done) {
    // Create new users model instance
    var usersObj = new Users(users);

    // Save the users
    usersObj.save(function () {
      request(app).get('/api/userss/' + usersObj._id)
        .end(function (req, res) {
          // Set assertion
          res.body.should.be.instanceof(Object).and.have.property('title', users.title);

          // Call the assertion callback
          done();
        });
    });
  });

  it('should return proper error for single users with an invalid Id, if not signed in', function (done) {
    // test is not a valid mongoose Id
    request(app).get('/api/userss/test')
      .end(function (req, res) {
        // Set assertion
        res.body.should.be.instanceof(Object).and.have.property('message', 'Users is invalid');

        // Call the assertion callback
        done();
      });
  });

  it('should return proper error for single users which doesnt exist, if not signed in', function (done) {
    // This is a valid mongoose Id but a non-existent users
    request(app).get('/api/userss/559e9cd815f80b4c256a8f41')
      .end(function (req, res) {
        // Set assertion
        res.body.should.be.instanceof(Object).and.have.property('message', 'No users with that identifier has been found');

        // Call the assertion callback
        done();
      });
  });

  it('should not be able to delete an users if signed in without the "admin" role', function (done) {
    agent.post('/api/auth/signin')
      .send(credentials)
      .expect(200)
      .end(function (signinErr, signinRes) {
        // Handle signin error
        if (signinErr) {
          return done(signinErr);
        }

        agent.post('/api/userss')
          .send(users)
          .expect(403)
          .end(function (usersSaveErr, usersSaveRes) {
            // Call the assertion callback
            done(usersSaveErr);
          });
      });
  });

  it('should not be able to delete an users if not signed in', function (done) {
    // Set users user
    users.user = user;

    // Create new users model instance
    var usersObj = new Users(users);

    // Save the users
    usersObj.save(function () {
      // Try deleting users
      request(app).delete('/api/userss/' + usersObj._id)
        .expect(403)
        .end(function (usersDeleteErr, usersDeleteRes) {
          // Set message assertion
          (usersDeleteRes.body.message).should.match('User is not authorized');

          // Handle users error error
          done(usersDeleteErr);
        });

    });
  });

  it('should be able to get a single users that has an orphaned user reference', function (done) {
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

          // Save a new users
          agent.post('/api/userss')
            .send(users)
            .expect(200)
            .end(function (usersSaveErr, usersSaveRes) {
              // Handle users save error
              if (usersSaveErr) {
                return done(usersSaveErr);
              }

              // Set assertions on new users
              (usersSaveRes.body.title).should.equal(users.title);
              should.exist(usersSaveRes.body.user);
              should.equal(usersSaveRes.body.user._id, orphanId);

              // force the users to have an orphaned user reference
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

                    // Get the users
                    agent.get('/api/userss/' + usersSaveRes.body._id)
                      .expect(200)
                      .end(function (usersInfoErr, usersInfoRes) {
                        // Handle users error
                        if (usersInfoErr) {
                          return done(usersInfoErr);
                        }

                        // Set assertions
                        (usersInfoRes.body._id).should.equal(usersSaveRes.body._id);
                        (usersInfoRes.body.title).should.equal(users.title);
                        should.equal(usersInfoRes.body.user, undefined);

                        // Call the assertion callback
                        done();
                      });
                  });
              });
            });
        });
    });
  });

  it('should be able to get a single users if not signed in and verify the custom "isCurrentUserOwner" field is set to "false"', function (done) {
    // Create new users model instance
    var usersObj = new Users(users);

    // Save the users
    usersObj.save(function () {
      request(app).get('/api/userss/' + usersObj._id)
        .end(function (req, res) {
          // Set assertion
          res.body.should.be.instanceof(Object).and.have.property('title', users.title);
          // Assert the custom field "isCurrentUserOwner" is set to false for the un-authenticated User
          res.body.should.be.instanceof(Object).and.have.property('isCurrentUserOwner', false);
          // Call the assertion callback
          done();
        });
    });
  });

  it('should be able to get single users, that a different user created, if logged in & verify the "isCurrentUserOwner" field is set to "false"', function (done) {
    // Create temporary user creds
    var _creds = {
      usernameOrEmail: 'usersowner',
      password: 'M3@n.jsI$Aw3$0m3'
    };

    // Create user that will create the Users
    var _usersOwner = new User({
      firstName: 'Full',
      lastName: 'Name',
      displayName: 'Full Name',
      email: 'temp@test.com',
      username: _creds.usernameOrEmail,
      password: _creds.password,
      provider: 'local',
      roles: ['admin', 'user']
    });

    _usersOwner.save(function (err, _user) {
      // Handle save error
      if (err) {
        return done(err);
      }

      // Sign in with the user that will create the Users
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

          // Save a new users
          agent.post('/api/userss')
            .send(users)
            .expect(200)
            .end(function (usersSaveErr, usersSaveRes) {
              // Handle users save error
              if (usersSaveErr) {
                return done(usersSaveErr);
              }

              // Set assertions on new users
              (usersSaveRes.body.title).should.equal(users.title);
              should.exist(usersSaveRes.body.user);
              should.equal(usersSaveRes.body.user._id, userId);

              // now signin with the test suite user
              agent.post('/api/auth/signin')
                .send(credentials)
                .expect(200)
                .end(function (err, res) {
                  // Handle signin error
                  if (err) {
                    return done(err);
                  }

                  // Get the users
                  agent.get('/api/userss/' + usersSaveRes.body._id)
                    .expect(200)
                    .end(function (usersInfoErr, usersInfoRes) {
                      // Handle users error
                      if (usersInfoErr) {
                        return done(usersInfoErr);
                      }

                      // Set assertions
                      (usersInfoRes.body._id).should.equal(usersSaveRes.body._id);
                      (usersInfoRes.body.title).should.equal(users.title);
                      // Assert that the custom field "isCurrentUserOwner" is set to false since the current User didn't create it
                      (usersInfoRes.body.isCurrentUserOwner).should.equal(false);

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
      Users.remove().exec(done);
    });
  });
});
