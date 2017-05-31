'use strict';

/**
 * Module dependencies
 */
var path = require('path'),
  mongoose = require('mongoose'),
  Users = mongoose.model('Users'),
  errorHandler = require(path.resolve('./modules/core/server/controllers/errors.server.controller'));

/**
 * Create an users
 */
exports.create = function (req, res) {
  var users = new Users(req.body);
  users.user = req.user;

  users.save(function (err) {
    if (err) {
      return res.status(422).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.json(users);
    }
  });
};

/**
 * Show the current users
 */
exports.read = function (req, res) {
  // convert mongoose document to JSON
  var users = req.users ? req.users.toJSON() : {};

  // Add a custom field to the Users, for determining if the current User is the "owner".
  // NOTE: This field is NOT persisted to the database, since it doesn't exist in the Users model.
  users.isCurrentUserOwner = !!(req.user && users.user && users.user._id.toString() === req.user._id.toString());

  res.json(users);
};

/**
 * Update an users
 */
exports.update = function (req, res) {
  var users = req.users;

  users.title = req.body.title;
  users.content = req.body.content;

  users.save(function (err) {
    if (err) {
      return res.status(422).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.json(users);
    }
  });
};

/**
 * Delete an users
 */
exports.delete = function (req, res) {
  var users = req.users;

  users.remove(function (err) {
    if (err) {
      return res.status(422).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.json(users);
    }
  });
};

/**
 * List of Userss
 */
exports.list = function (req, res) {
  Users.find().sort('-created').populate('user', 'displayName').exec(function (err, userss) {
    if (err) {
      return res.status(422).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.json(userss);
    }
  });
};

/**
 * Users middleware
 */
exports.usersByID = function (req, res, next, id) {

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).send({
      message: 'Users is invalid'
    });
  }

  Users.findById(id).populate('user', 'displayName').exec(function (err, users) {
    if (err) {
      return next(err);
    } else if (!users) {
      return res.status(404).send({
        message: 'No users with that identifier has been found'
      });
    }
    req.users = users;
    next();
  });
};
