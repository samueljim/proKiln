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
describe('Schedule CRUD tests', function () {

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

    // Save a user to the test db and create new schedule
    user.save(function () {
      schedule = {
        title: 'Schedule Title',
        content: 'Schedule Content'
      };

      done();
    });
  });

  it('should not be able to save an schedule if logged in without the "admin" role', function (done) {
    agent.post('/api/auth/signin')
      .send(credentials)
      .expect(200)
      .end(function (signinErr, signinRes) {
        // Handle signin error
        if (signinErr) {
          return done(signinErr);
        }

        agent.post('/api/schedules')
          .send(schedule)
          .expect(403)
          .end(function (scheduleSaveErr, scheduleSaveRes) {
            // Call the assertion callback
            done(scheduleSaveErr);
          });

      });
  });

  it('should not be able to save an schedule if not logged in', function (done) {
    agent.post('/api/schedules')
      .send(schedule)
      .expect(403)
      .end(function (scheduleSaveErr, scheduleSaveRes) {
        // Call the assertion callback
        done(scheduleSaveErr);
      });
  });

  it('should not be able to update an schedule if signed in without the "admin" role', function (done) {
    agent.post('/api/auth/signin')
      .send(credentials)
      .expect(200)
      .end(function (signinErr, signinRes) {
        // Handle signin error
        if (signinErr) {
          return done(signinErr);
        }

        agent.post('/api/schedules')
          .send(schedule)
          .expect(403)
          .end(function (scheduleSaveErr, scheduleSaveRes) {
            // Call the assertion callback
            done(scheduleSaveErr);
          });
      });
  });

  it('should be able to get a list of schedules if not signed in', function (done) {
    // Create new schedule model instance
    var scheduleObj = new Schedule(schedule);

    // Save the schedule
    scheduleObj.save(function () {
      // Request schedules
      request(app).get('/api/schedules')
        .end(function (req, res) {
          // Set assertion
          res.body.should.be.instanceof(Array).and.have.lengthOf(1);

          // Call the assertion callback
          done();
        });

    });
  });

  it('should be able to get a single schedule if not signed in', function (done) {
    // Create new schedule model instance
    var scheduleObj = new Schedule(schedule);

    // Save the schedule
    scheduleObj.save(function () {
      request(app).get('/api/schedules/' + scheduleObj._id)
        .end(function (req, res) {
          // Set assertion
          res.body.should.be.instanceof(Object).and.have.property('title', schedule.title);

          // Call the assertion callback
          done();
        });
    });
  });

  it('should return proper error for single schedule with an invalid Id, if not signed in', function (done) {
    // test is not a valid mongoose Id
    request(app).get('/api/schedules/test')
      .end(function (req, res) {
        // Set assertion
        res.body.should.be.instanceof(Object).and.have.property('message', 'Schedule is invalid');

        // Call the assertion callback
        done();
      });
  });

  it('should return proper error for single schedule which doesnt exist, if not signed in', function (done) {
    // This is a valid mongoose Id but a non-existent schedule
    request(app).get('/api/schedules/559e9cd815f80b4c256a8f41')
      .end(function (req, res) {
        // Set assertion
        res.body.should.be.instanceof(Object).and.have.property('message', 'No schedule with that identifier has been found');

        // Call the assertion callback
        done();
      });
  });

  it('should not be able to delete an schedule if signed in without the "admin" role', function (done) {
    agent.post('/api/auth/signin')
      .send(credentials)
      .expect(200)
      .end(function (signinErr, signinRes) {
        // Handle signin error
        if (signinErr) {
          return done(signinErr);
        }

        agent.post('/api/schedules')
          .send(schedule)
          .expect(403)
          .end(function (scheduleSaveErr, scheduleSaveRes) {
            // Call the assertion callback
            done(scheduleSaveErr);
          });
      });
  });

  it('should not be able to delete an schedule if not signed in', function (done) {
    // Set schedule user
    schedule.user = user;

    // Create new schedule model instance
    var scheduleObj = new Schedule(schedule);

    // Save the schedule
    scheduleObj.save(function () {
      // Try deleting schedule
      request(app).delete('/api/schedules/' + scheduleObj._id)
        .expect(403)
        .end(function (scheduleDeleteErr, scheduleDeleteRes) {
          // Set message assertion
          (scheduleDeleteRes.body.message).should.match('User is not authorized');

          // Handle schedule error error
          done(scheduleDeleteErr);
        });

    });
  });

  it('should be able to get a single schedule that has an orphaned user reference', function (done) {
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

          // Save a new schedule
          agent.post('/api/schedules')
            .send(schedule)
            .expect(200)
            .end(function (scheduleSaveErr, scheduleSaveRes) {
              // Handle schedule save error
              if (scheduleSaveErr) {
                return done(scheduleSaveErr);
              }

              // Set assertions on new schedule
              (scheduleSaveRes.body.title).should.equal(schedule.title);
              should.exist(scheduleSaveRes.body.user);
              should.equal(scheduleSaveRes.body.user._id, orphanId);

              // force the schedule to have an orphaned user reference
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
                        should.equal(scheduleInfoRes.body.user, undefined);

                        // Call the assertion callback
                        done();
                      });
                  });
              });
            });
        });
    });
  });

  it('should be able to get a single schedule if not signed in and verify the custom "isCurrentUserOwner" field is set to "false"', function (done) {
    // Create new schedule model instance
    var scheduleObj = new Schedule(schedule);

    // Save the schedule
    scheduleObj.save(function () {
      request(app).get('/api/schedules/' + scheduleObj._id)
        .end(function (req, res) {
          // Set assertion
          res.body.should.be.instanceof(Object).and.have.property('title', schedule.title);
          // Assert the custom field "isCurrentUserOwner" is set to false for the un-authenticated User
          res.body.should.be.instanceof(Object).and.have.property('isCurrentUserOwner', false);
          // Call the assertion callback
          done();
        });
    });
  });

  it('should be able to get single schedule, that a different user created, if logged in & verify the "isCurrentUserOwner" field is set to "false"', function (done) {
    // Create temporary user creds
    var _creds = {
      usernameOrEmail: 'scheduleowner',
      password: 'M3@n.jsI$Aw3$0m3'
    };

    // Create user that will create the Schedule
    var _scheduleOwner = new User({
      firstName: 'Full',
      lastName: 'Name',
      displayName: 'Full Name',
      email: 'temp@test.com',
      username: _creds.usernameOrEmail,
      password: _creds.password,
      provider: 'local',
      roles: ['admin', 'user']
    });

    _scheduleOwner.save(function (err, _user) {
      // Handle save error
      if (err) {
        return done(err);
      }

      // Sign in with the user that will create the Schedule
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

          // Save a new schedule
          agent.post('/api/schedules')
            .send(schedule)
            .expect(200)
            .end(function (scheduleSaveErr, scheduleSaveRes) {
              // Handle schedule save error
              if (scheduleSaveErr) {
                return done(scheduleSaveErr);
              }

              // Set assertions on new schedule
              (scheduleSaveRes.body.title).should.equal(schedule.title);
              should.exist(scheduleSaveRes.body.user);
              should.equal(scheduleSaveRes.body.user._id, userId);

              // now signin with the test suite user
              agent.post('/api/auth/signin')
                .send(credentials)
                .expect(200)
                .end(function (err, res) {
                  // Handle signin error
                  if (err) {
                    return done(err);
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
                      // Assert that the custom field "isCurrentUserOwner" is set to false since the current User didn't create it
                      (scheduleInfoRes.body.isCurrentUserOwner).should.equal(false);

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
      Schedule.remove().exec(done);
    });
  });
});
