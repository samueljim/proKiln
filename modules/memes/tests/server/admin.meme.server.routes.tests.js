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
describe('Meme Admin CRUD tests', function () {
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

    // Save a user to the test db and create new meme
    user.save(function () {
      meme = {
        title: 'Meme Title',
        content: 'Meme Content'
      };

      done();
    });
  });

  it('should be able to save an meme if logged in', function (done) {
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

        // Save a new meme
        agent.post('/api/memes')
          .send(meme)
          .expect(200)
          .end(function (memeSaveErr, memeSaveRes) {
            // Handle meme save error
            if (memeSaveErr) {
              return done(memeSaveErr);
            }

            // Get a list of memes
            agent.get('/api/memes')
              .end(function (memesGetErr, memesGetRes) {
                // Handle meme save error
                if (memesGetErr) {
                  return done(memesGetErr);
                }

                // Get memes list
                var memes = memesGetRes.body;

                // Set assertions
                (memes[0].user._id).should.equal(userId);
                (memes[0].title).should.match('Meme Title');

                // Call the assertion callback
                done();
              });
          });
      });
  });

  it('should be able to update an meme if signed in', function (done) {
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

        // Save a new meme
        agent.post('/api/memes')
          .send(meme)
          .expect(200)
          .end(function (memeSaveErr, memeSaveRes) {
            // Handle meme save error
            if (memeSaveErr) {
              return done(memeSaveErr);
            }

            // Update meme title
            meme.title = 'WHY YOU GOTTA BE SO MEAN?';

            // Update an existing meme
            agent.put('/api/memes/' + memeSaveRes.body._id)
              .send(meme)
              .expect(200)
              .end(function (memeUpdateErr, memeUpdateRes) {
                // Handle meme update error
                if (memeUpdateErr) {
                  return done(memeUpdateErr);
                }

                // Set assertions
                (memeUpdateRes.body._id).should.equal(memeSaveRes.body._id);
                (memeUpdateRes.body.title).should.match('WHY YOU GOTTA BE SO MEAN?');

                // Call the assertion callback
                done();
              });
          });
      });
  });

  it('should not be able to save an meme if no title is provided', function (done) {
    // Invalidate title field
    meme.title = '';

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

        // Save a new meme
        agent.post('/api/memes')
          .send(meme)
          .expect(422)
          .end(function (memeSaveErr, memeSaveRes) {
            // Set message assertion
            (memeSaveRes.body.message).should.match('Title cannot be blank');

            // Handle meme save error
            done(memeSaveErr);
          });
      });
  });

  it('should be able to delete an meme if signed in', function (done) {
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

        // Save a new meme
        agent.post('/api/memes')
          .send(meme)
          .expect(200)
          .end(function (memeSaveErr, memeSaveRes) {
            // Handle meme save error
            if (memeSaveErr) {
              return done(memeSaveErr);
            }

            // Delete an existing meme
            agent.delete('/api/memes/' + memeSaveRes.body._id)
              .send(meme)
              .expect(200)
              .end(function (memeDeleteErr, memeDeleteRes) {
                // Handle meme error error
                if (memeDeleteErr) {
                  return done(memeDeleteErr);
                }

                // Set assertions
                (memeDeleteRes.body._id).should.equal(memeSaveRes.body._id);

                // Call the assertion callback
                done();
              });
          });
      });
  });

  it('should be able to get a single meme if signed in and verify the custom "isCurrentUserOwner" field is set to "true"', function (done) {
    // Create new meme model instance
    meme.user = user;
    var memeObj = new Meme(meme);

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

        // Save a new meme
        agent.post('/api/memes')
          .send(meme)
          .expect(200)
          .end(function (memeSaveErr, memeSaveRes) {
            // Handle meme save error
            if (memeSaveErr) {
              return done(memeSaveErr);
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

                // Assert that the "isCurrentUserOwner" field is set to true since the current User created it
                (memeInfoRes.body.isCurrentUserOwner).should.equal(true);

                // Call the assertion callback
                done();
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
