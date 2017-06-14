'use strict';

var should = require('should'),
  request = require('supertest'),
  path = require('path'),
  mongoose = require('mongoose'),
  User = mongoose.model('User'),
  Meme = mongoose.model('Meme'),
  express = require(path.resolve('./config/lib/express'));

/**
 * Globals
 */
var app,
  agent,
  credentials,
  user,
  meme;

/**
 * Meme routes tests
 */
describe('Meme CRUD tests', function () {

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

    // Save a user to the test db and create new meme
    user.save(function () {
      meme = {
        title: 'Meme Title',
        content: 'Meme Content'
      };

      done();
    });
  });

  it('should not be able to save an meme if logged in without the "admin" role', function (done) {
    agent.post('/api/auth/signin')
      .send(credentials)
      .expect(200)
      .end(function (signinErr, signinRes) {
        // Handle signin error
        if (signinErr) {
          return done(signinErr);
        }

        agent.post('/api/memes')
          .send(meme)
          .expect(403)
          .end(function (memeSaveErr, memeSaveRes) {
            // Call the assertion callback
            done(memeSaveErr);
          });

      });
  });

  it('should not be able to save an meme if not logged in', function (done) {
    agent.post('/api/memes')
      .send(meme)
      .expect(403)
      .end(function (memeSaveErr, memeSaveRes) {
        // Call the assertion callback
        done(memeSaveErr);
      });
  });

  it('should not be able to update an meme if signed in without the "admin" role', function (done) {
    agent.post('/api/auth/signin')
      .send(credentials)
      .expect(200)
      .end(function (signinErr, signinRes) {
        // Handle signin error
        if (signinErr) {
          return done(signinErr);
        }

        agent.post('/api/memes')
          .send(meme)
          .expect(403)
          .end(function (memeSaveErr, memeSaveRes) {
            // Call the assertion callback
            done(memeSaveErr);
          });
      });
  });

  it('should be able to get a list of memes if not signed in', function (done) {
    // Create new meme model instance
    var memeObj = new Meme(meme);

    // Save the meme
    memeObj.save(function () {
      // Request memes
      request(app).get('/api/memes')
        .end(function (req, res) {
          // Set assertion
          res.body.should.be.instanceof(Array).and.have.lengthOf(1);

          // Call the assertion callback
          done();
        });

    });
  });

  it('should be able to get a single meme if not signed in', function (done) {
    // Create new meme model instance
    var memeObj = new Meme(meme);

    // Save the meme
    memeObj.save(function () {
      request(app).get('/api/memes/' + memeObj._id)
        .end(function (req, res) {
          // Set assertion
          res.body.should.be.instanceof(Object).and.have.property('title', meme.title);

          // Call the assertion callback
          done();
        });
    });
  });

  it('should return proper error for single meme with an invalid Id, if not signed in', function (done) {
    // test is not a valid mongoose Id
    request(app).get('/api/memes/test')
      .end(function (req, res) {
        // Set assertion
        res.body.should.be.instanceof(Object).and.have.property('message', 'Meme is invalid');

        // Call the assertion callback
        done();
      });
  });

  it('should return proper error for single meme which doesnt exist, if not signed in', function (done) {
    // This is a valid mongoose Id but a non-existent meme
    request(app).get('/api/memes/559e9cd815f80b4c256a8f41')
      .end(function (req, res) {
        // Set assertion
        res.body.should.be.instanceof(Object).and.have.property('message', 'No meme with that identifier has been found');

        // Call the assertion callback
        done();
      });
  });

  it('should not be able to delete an meme if signed in without the "admin" role', function (done) {
    agent.post('/api/auth/signin')
      .send(credentials)
      .expect(200)
      .end(function (signinErr, signinRes) {
        // Handle signin error
        if (signinErr) {
          return done(signinErr);
        }

        agent.post('/api/memes')
          .send(meme)
          .expect(403)
          .end(function (memeSaveErr, memeSaveRes) {
            // Call the assertion callback
            done(memeSaveErr);
          });
      });
  });

  it('should not be able to delete an meme if not signed in', function (done) {
    // Set meme user
    meme.user = user;

    // Create new meme model instance
    var memeObj = new Meme(meme);

    // Save the meme
    memeObj.save(function () {
      // Try deleting meme
      request(app).delete('/api/memes/' + memeObj._id)
        .expect(403)
        .end(function (memeDeleteErr, memeDeleteRes) {
          // Set message assertion
          (memeDeleteRes.body.message).should.match('User is not authorized');

          // Handle meme error error
          done(memeDeleteErr);
        });

    });
  });

  it('should be able to get a single meme that has an orphaned user reference', function (done) {
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

          // Save a new meme
          agent.post('/api/memes')
            .send(meme)
            .expect(200)
            .end(function (memeSaveErr, memeSaveRes) {
              // Handle meme save error
              if (memeSaveErr) {
                return done(memeSaveErr);
              }

              // Set assertions on new meme
              (memeSaveRes.body.title).should.equal(meme.title);
              should.exist(memeSaveRes.body.user);
              should.equal(memeSaveRes.body.user._id, orphanId);

              // force the meme to have an orphaned user reference
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

                    // Get the meme
                    agent.get('/api/memes/' + memeSaveRes.body._id)
                      .expect(200)
                      .end(function (memeInfoErr, memeInfoRes) {
                        // Handle meme error
                        if (memeInfoErr) {
                          return done(memeInfoErr);
                        }

                        // Set assertions
                        (memeInfoRes.body._id).should.equal(memeSaveRes.body._id);
                        (memeInfoRes.body.title).should.equal(meme.title);
                        should.equal(memeInfoRes.body.user, undefined);

                        // Call the assertion callback
                        done();
                      });
                  });
              });
            });
        });
    });
  });

  it('should be able to get a single meme if not signed in and verify the custom "isCurrentUserOwner" field is set to "false"', function (done) {
    // Create new meme model instance
    var memeObj = new Meme(meme);

    // Save the meme
    memeObj.save(function () {
      request(app).get('/api/memes/' + memeObj._id)
        .end(function (req, res) {
          // Set assertion
          res.body.should.be.instanceof(Object).and.have.property('title', meme.title);
          // Assert the custom field "isCurrentUserOwner" is set to false for the un-authenticated User
          res.body.should.be.instanceof(Object).and.have.property('isCurrentUserOwner', false);
          // Call the assertion callback
          done();
        });
    });
  });

  it('should be able to get single meme, that a different user created, if logged in & verify the "isCurrentUserOwner" field is set to "false"', function (done) {
    // Create temporary user creds
    var _creds = {
      usernameOrEmail: 'memeowner',
      password: 'M3@n.jsI$Aw3$0m3'
    };

    // Create user that will create the Meme
    var _memeOwner = new User({
      firstName: 'Full',
      lastName: 'Name',
      displayName: 'Full Name',
      email: 'temp@test.com',
      username: _creds.usernameOrEmail,
      password: _creds.password,
      provider: 'local',
      roles: ['admin', 'user']
    });

    _memeOwner.save(function (err, _user) {
      // Handle save error
      if (err) {
        return done(err);
      }

      // Sign in with the user that will create the Meme
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

          // Save a new meme
          agent.post('/api/memes')
            .send(meme)
            .expect(200)
            .end(function (memeSaveErr, memeSaveRes) {
              // Handle meme save error
              if (memeSaveErr) {
                return done(memeSaveErr);
              }

              // Set assertions on new meme
              (memeSaveRes.body.title).should.equal(meme.title);
              should.exist(memeSaveRes.body.user);
              should.equal(memeSaveRes.body.user._id, userId);

              // now signin with the test suite user
              agent.post('/api/auth/signin')
                .send(credentials)
                .expect(200)
                .end(function (err, res) {
                  // Handle signin error
                  if (err) {
                    return done(err);
                  }

                  // Get the meme
                  agent.get('/api/memes/' + memeSaveRes.body._id)
                    .expect(200)
                    .end(function (memeInfoErr, memeInfoRes) {
                      // Handle meme error
                      if (memeInfoErr) {
                        return done(memeInfoErr);
                      }

                      // Set assertions
                      (memeInfoRes.body._id).should.equal(memeSaveRes.body._id);
                      (memeInfoRes.body.title).should.equal(meme.title);
                      // Assert that the custom field "isCurrentUserOwner" is set to false since the current User didn't create it
                      (memeInfoRes.body.isCurrentUserOwner).should.equal(false);

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
      Meme.remove().exec(done);
    });
  });
});
