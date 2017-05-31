'use strict';

var should = require('should'),
  request = require('supertest'),
  path = require('path'),
  mongoose = require('mongoose'),
  User = mongoose.model('User'),
  Schedule = mongoose.model('Schedule'),
  express = require(path.resolve('./config/lib/express'));

/**
 * Globals
 */
var app,
  agent,
  credentials,
  user,
  schedule;

/**
 * Schedule routes tests
 */
describe('Schedule Admin CRUD tests', function () {
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

    // Save a user to the test db and create new schedule
    user.save(function () {
      schedule = {
        title: 'Schedule Title',
        content: 'Schedule Content'
      };

      done();
    });
  });

  it('should be able to save an schedule if logged in', function (done) {
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

        // Save a new schedule
        agent.post('/api/schedules')
          .send(schedule)
          .expect(200)
          .end(function (scheduleSaveErr, scheduleSaveRes) {
            // Handle schedule save error
            if (scheduleSaveErr) {
              return done(scheduleSaveErr);
            }

            // Get a list of schedules
            agent.get('/api/schedules')
              .end(function (schedulesGetErr, schedulesGetRes) {
                // Handle schedule save error
                if (schedulesGetErr) {
                  return done(schedulesGetErr);
                }

                // Get schedules list
                var schedules = schedulesGetRes.body;

                // Set assertions
                (schedules[0].user._id).should.equal(userId);
                (schedules[0].title).should.match('Schedule Title');

                // Call the assertion callback
                done();
              });
          });
      });
  });

  it('should be able to update an schedule if signed in', function (done) {
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

        // Save a new schedule
        agent.post('/api/schedules')
          .send(schedule)
          .expect(200)
          .end(function (scheduleSaveErr, scheduleSaveRes) {
            // Handle schedule save error
            if (scheduleSaveErr) {
              return done(scheduleSaveErr);
            }

            // Update schedule title
            schedule.title = 'WHY YOU GOTTA BE SO MEAN?';

            // Update an existing schedule
            agent.put('/api/schedules/' + scheduleSaveRes.body._id)
              .send(schedule)
              .expect(200)
              .end(function (scheduleUpdateErr, scheduleUpdateRes) {
                // Handle schedule update error
                if (scheduleUpdateErr) {
                  return done(scheduleUpdateErr);
                }

                // Set assertions
                (scheduleUpdateRes.body._id).should.equal(scheduleSaveRes.body._id);
                (scheduleUpdateRes.body.title).should.match('WHY YOU GOTTA BE SO MEAN?');

                // Call the assertion callback
                done();
              });
          });
      });
  });

  it('should not be able to save an schedule if no title is provided', function (done) {
    // Invalidate title field
    schedule.title = '';

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

        // Save a new schedule
        agent.post('/api/schedules')
          .send(schedule)
          .expect(422)
          .end(function (scheduleSaveErr, scheduleSaveRes) {
            // Set message assertion
            (scheduleSaveRes.body.message).should.match('Title cannot be blank');

            // Handle schedule save error
            done(scheduleSaveErr);
          });
      });
  });

  it('should be able to delete an schedule if signed in', function (done) {
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

        // Save a new schedule
        agent.post('/api/schedules')
          .send(schedule)
          .expect(200)
          .end(function (scheduleSaveErr, scheduleSaveRes) {
            // Handle schedule save error
            if (scheduleSaveErr) {
              return done(scheduleSaveErr);
            }

            // Delete an existing schedule
            agent.delete('/api/schedules/' + scheduleSaveRes.body._id)
              .send(schedule)
              .expect(200)
              .end(function (scheduleDeleteErr, scheduleDeleteRes) {
                // Handle schedule error error
                if (scheduleDeleteErr) {
                  return done(scheduleDeleteErr);
                }

                // Set assertions
                (scheduleDeleteRes.body._id).should.equal(scheduleSaveRes.body._id);

                // Call the assertion callback
                done();
              });
          });
      });
  });

  it('should be able to get a single schedule if signed in and verify the custom "isCurrentUserOwner" field is set to "true"', function (done) {
    // Create new schedule model instance
    schedule.user = user;
    var scheduleObj = new Schedule(schedule);

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

        // Save a new schedule
        agent.post('/api/schedules')
          .send(schedule)
          .expect(200)
          .end(function (scheduleSaveErr, scheduleSaveRes) {
            // Handle schedule save error
            if (scheduleSaveErr) {
              return done(scheduleSaveErr);
            }

            // Get the schedule
            agent.get('/api/schedules/' + scheduleSaveRes.body._id)
              .expect(200)
              .end(function (scheduleInfoErr, scheduleInfoRes) {
                // Handle schedule error
                if (scheduleInfoErr) {
                  return done(scheduleInfoErr);
                }

                // Set assertions
                (scheduleInfoRes.body._id).should.equal(scheduleSaveRes.body._id);
                (scheduleInfoRes.body.title).should.equal(schedule.title);

                // Assert that the "isCurrentUserOwner" field is set to true since the current User created it
                (scheduleInfoRes.body.isCurrentUserOwner).should.equal(true);

                // Call the assertion callback
                done();
              });
          });
      });
  });

  afterEach(function (done) {
    User.remove().exec(function () {
      Schedule.remove().exec(done);
    });
  });
});
