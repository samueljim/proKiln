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
describe('Users Admin CRUD tests', function () {
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

    // Save a user to the test db and create new users
    user.save(function () {
      users = {
        title: 'Users Title',
        content: 'Users Content'
      };

      done();
    });
  });

  it('should be able to save an users if logged in', function (done) {
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

        // Save a new users
        agent.post('/api/userss')
          .send(users)
          .expect(200)
          .end(function (usersSaveErr, usersSaveRes) {
            // Handle users save error
            if (usersSaveErr) {
              return done(usersSaveErr);
            }

            // Get a list of userss
            agent.get('/api/userss')
              .end(function (userssGetErr, userssGetRes) {
                // Handle users save error
                if (userssGetErr) {
                  return done(userssGetErr);
                }

                // Get userss list
                var userss = userssGetRes.body;

                // Set assertions
                (userss[0].user._id).should.equal(userId);
                (userss[0].title).should.match('Users Title');

                // Call the assertion callback
                done();
              });
          });
      });
  });

  it('should be able to update an users if signed in', function (done) {
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

        // Save a new users
        agent.post('/api/userss')
          .send(users)
          .expect(200)
          .end(function (usersSaveErr, usersSaveRes) {
            // Handle users save error
            if (usersSaveErr) {
              return done(usersSaveErr);
            }

            // Update users title
            users.title = 'WHY YOU GOTTA BE SO MEAN?';

            // Update an existing users
            agent.put('/api/userss/' + usersSaveRes.body._id)
              .send(users)
              .expect(200)
              .end(function (usersUpdateErr, usersUpdateRes) {
                // Handle users update error
                if (usersUpdateErr) {
                  return done(usersUpdateErr);
                }

                // Set assertions
                (usersUpdateRes.body._id).should.equal(usersSaveRes.body._id);
                (usersUpdateRes.body.title).should.match('WHY YOU GOTTA BE SO MEAN?');

                // Call the assertion callback
                done();
              });
          });
      });
  });

  it('should not be able to save an users if no title is provided', function (done) {
    // Invalidate title field
    users.title = '';

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

        // Save a new users
        agent.post('/api/userss')
          .send(users)
          .expect(422)
          .end(function (usersSaveErr, usersSaveRes) {
            // Set message assertion
            (usersSaveRes.body.message).should.match('Title cannot be blank');

            // Handle users save error
            done(usersSaveErr);
          });
      });
  });

  it('should be able to delete an users if signed in', function (done) {
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

        // Save a new users
        agent.post('/api/userss')
          .send(users)
          .expect(200)
          .end(function (usersSaveErr, usersSaveRes) {
            // Handle users save error
            if (usersSaveErr) {
              return done(usersSaveErr);
            }

            // Delete an existing users
            agent.delete('/api/userss/' + usersSaveRes.body._id)
              .send(users)
              .expect(200)
              .end(function (usersDeleteErr, usersDeleteRes) {
                // Handle users error error
                if (usersDeleteErr) {
                  return done(usersDeleteErr);
                }

                // Set assertions
                (usersDeleteRes.body._id).should.equal(usersSaveRes.body._id);

                // Call the assertion callback
                done();
              });
          });
      });
  });

  it('should be able to get a single users if signed in and verify the custom "isCurrentUserOwner" field is set to "true"', function (done) {
    // Create new users model instance
    users.user = user;
    var usersObj = new Users(users);

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

        // Save a new users
        agent.post('/api/userss')
          .send(users)
          .expect(200)
          .end(function (usersSaveErr, usersSaveRes) {
            // Handle users save error
            if (usersSaveErr) {
              return done(usersSaveErr);
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

                // Assert that the "isCurrentUserOwner" field is set to true since the current User created it
                (usersInfoRes.body.isCurrentUserOwner).should.equal(true);

                // Call the assertion callback
                done();
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
