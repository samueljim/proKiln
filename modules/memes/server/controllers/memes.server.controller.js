'use strict';

/**
 * Module dependencies
 */
var path = require('path'),
  mongoose = require('mongoose'),
  Meme = mongoose.model('Meme'),
  errorHandler = require(path.resolve('./modules/core/server/controllers/errors.server.controller'));

/**
 * Create an meme
 */
exports.create = function (req, res) {
  var meme = new Meme(req.body);
  meme.user = req.user;

  meme.save(function (err) {
    if (err) {
      return res.status(422).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.json(meme);
    }
  });
};

/**
 * Show the current meme
 */
exports.read = function (req, res) {
  // convert mongoose document to JSON
  var meme = req.meme ? req.meme.toJSON() : {};

  // Add a custom field to the Meme, for determining if the current User is the "owner".
  // NOTE: This field is NOT persisted to the database, since it doesn't exist in the Meme model.
  meme.isCurrentUserOwner = !!(req.user && meme.user && meme.user._id.toString() === req.user._id.toString());

  res.json(meme);
};

/**
 * Update an meme
 */
exports.update = function (req, res) {
  var meme = req.meme;

  meme.title = req.body.title;
  meme.content = req.body.content;

  meme.save(function (err) {
    if (err) {
      return res.status(422).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.json(meme);
    }
  });
};

/**
 * Delete an meme
 */
exports.delete = function (req, res) {
  var meme = req.meme;

  meme.remove(function (err) {
    if (err) {
      return res.status(422).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.json(meme);
    }
  });
};

/**
 * List of Memes
 */
exports.list = function (req, res) {
  Meme.find().sort('-created').populate('user', 'displayName').exec(function (err, memes) {
    if (err) {
      return res.status(422).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.json(memes);
    }
  });
};

/**
 * Meme middleware
 */
exports.memeByID = function (req, res, next, id) {

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).send({
      message: 'Meme is invalid'
    });
  }

  Meme.findById(id).populate('user', 'displayName').exec(function (err, meme) {
    if (err) {
      return next(err);
    } else if (!meme) {
      return res.status(404).send({
        message: 'No meme with that identifier has been found'
      });
    }
    req.meme = meme;
    next();
  });
};
