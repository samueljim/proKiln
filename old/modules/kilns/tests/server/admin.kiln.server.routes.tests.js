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
describe('Kiln Admin CRUD tests', function () {
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

    // Save a user to the test db and create new kiln
    user.save(function () {
      kiln = {
        title: 'Kiln Title',
        content: 'Kiln Content'
      };

      done();
    });
  });

  it('should be able to save an kiln if logged in', function (done) {
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

        // Save a new kiln
        agent.post('/api/kilns')
          .send(kiln)
          .expect(200)
          .end(function (kilnSaveErr, kilnSaveRes) {
            // Handle kiln save error
            if (kilnSaveErr) {
              return done(kilnSaveErr);
            }

            // Get a list of kilns
            agent.get('/api/kilns')
              .end(function (kilnsGetErr, kilnsGetRes) {
                // Handle kiln save error
                if (kilnsGetErr) {
                  return done(kilnsGetErr);
                }

                // Get kilns list
                var kilns = kilnsGetRes.body;

                // Set assertions
                (kilns[0].user._id).should.equal(userId);
                (kilns[0].title).should.match('Kiln Title');

                // Call the assertion callback
                done();
              });
          });
      });
  });

  it('should be able to update an kiln if signed in', function (done) {
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

        // Save a new kiln
        agent.post('/api/kilns')
          .send(kiln)
          .expect(200)
          .end(function (kilnSaveErr, kilnSaveRes) {
            // Handle kiln save error
            if (kilnSaveErr) {
              return done(kilnSaveErr);
            }

            // Update kiln title
            kiln.title = 'WHY YOU GOTTA BE SO MEAN?';

            // Update an existing kiln
            agent.put('/api/kilns/' + kilnSaveRes.body._id)
              .send(kiln)
              .expect(200)
              .end(function (kilnUpdateErr, kilnUpdateRes) {
                // Handle kiln update error
                if (kilnUpdateErr) {
                  return done(kilnUpdateErr);
                }

                // Set assertions
                (kilnUpdateRes.body._id).should.equal(kilnSaveRes.body._id);
                (kilnUpdateRes.body.title).should.match('WHY YOU GOTTA BE SO MEAN?');

                // Call the assertion callback
                done();
              });
          });
      });
  });

  it('should not be able to save an kiln if no title is provided', function (done) {
    // Invalidate title field
    kiln.title = '';

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

        // Save a new kiln
        agent.post('/api/kilns')
          .send(kiln)
          .expect(422)
          .end(function (kilnSaveErr, kilnSaveRes) {
            // Set message assertion
            (kilnSaveRes.body.message).should.match('Title cannot be blank');

            // Handle kiln save error
            done(kilnSaveErr);
          });
      });
  });

  it('should be able to delete an kiln if signed in', function (done) {
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

        // Save a new kiln
        agent.post('/api/kilns')
          .send(kiln)
          .expect(200)
          .end(function (kilnSaveErr, kilnSaveRes) {
            // Handle kiln save error
            if (kilnSaveErr) {
              return done(kilnSaveErr);
            }

            // Delete an existing kiln
            agent.delete('/api/kilns/' + kilnSaveRes.body._id)
              .send(kiln)
              .expect(200)
              .end(function (kilnDeleteErr, kilnDeleteRes) {
                // Handle kiln error error
                if (kilnDeleteErr) {
                  return done(kilnDeleteErr);
                }

                // Set assertions
                (kilnDeleteRes.body._id).should.equal(kilnSaveRes.body._id);

                // Call the assertion callback
                done();
              });
          });
      });
  });

  it('should be able to get a single kiln if signed in and verify the custom "isCurrentUserOwner" field is set to "true"', function (done) {
    // Create new kiln model instance
    kiln.user = user;
    var kilnObj = new Kiln(kiln);

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

        // Save a new kiln
        agent.post('/api/kilns')
          .send(kiln)
          .expect(200)
          .end(function (kilnSaveErr, kilnSaveRes) {
            // Handle kiln save error
            if (kilnSaveErr) {
              return done(kilnSaveErr);
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

                // Assert that the "isCurrentUserOwner" field is set to true since the current User created it
                (kilnInfoRes.body.isCurrentUserOwner).should.equal(true);

                // Call the assertion callback
                done();
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
