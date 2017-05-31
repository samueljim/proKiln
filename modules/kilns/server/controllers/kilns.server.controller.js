'use strict';

/**
 * Module dependencies
 */
var path = require('path'),
  mongoose = require('mongoose'),
  Kiln = mongoose.model('Kiln'),
  errorHandler = require(path.resolve('./modules/core/server/controllers/errors.server.controller'));

/**
 * Create an kiln
 */
exports.create = function (req, res) {
  var kiln = new Kiln(req.body);
  kiln.user = req.user;

  kiln.save(function (err) {
    if (err) {
      return res.status(422).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.json(kiln);
    }
  });
};

/**
 * Show the current kiln
 */
exports.read = function (req, res) {
  // convert mongoose document to JSON
  var kiln = req.kiln ? req.kiln.toJSON() : {};

  // Add a custom field to the Kiln, for determining if the current User is the "owner".
  // NOTE: This field is NOT persisted to the database, since it doesn't exist in the Kiln model.
  kiln.isCurrentUserOwner = !!(req.user && kiln.user && kiln.user._id.toString() === req.user._id.toString());

  res.json(kiln);
};

/**
 * Update an kiln
 */
exports.update = function (req, res) {
  var kiln = req.kiln;

  kiln.title = req.body.title;
  kiln.content = req.body.content;

  kiln.save(function (err) {
    if (err) {
      return res.status(422).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.json(kiln);
    }
  });
};

/**
 * Delete an kiln
 */
exports.delete = function (req, res) {
  var kiln = req.kiln;

  kiln.remove(function (err) {
    if (err) {
      return res.status(422).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.json(kiln);
    }
  });
};

/**
 * List of Kilns
 */
exports.list = function (req, res) {
  Kiln.find().sort('-created').populate('user', 'displayName').exec(function (err, kilns) {
    if (err) {
      return res.status(422).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.json(kilns);
    }
  });
};

/**
 * Kiln middleware
 */
exports.kilnByID = function (req, res, next, id) {

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).send({
      message: 'Kiln is invalid'
    });
  }

  Kiln.findById(id).populate('user', 'displayName').exec(function (err, kiln) {
    if (err) {
      return next(err);
    } else if (!kiln) {
      return res.status(404).send({
        message: 'No kiln with that identifier has been found'
      });
    }
    req.kiln = kiln;
    next();
  });
};
