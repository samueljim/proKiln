'use strict';

/**
 * Module dependencies
 */
var path = require('path'),
  mongoose = require('mongoose'),
  Settings = mongoose.model('Settings'),
  errorHandler = require(path.resolve('./modules/core/server/controllers/errors.server.controller'));

/**
 * Create an settings
 */
exports.create = function (req, res) {
  var settings = new Settings(req.body);
  settings.user = req.user;

  settings.save(function (err) {
    if (err) {
      return res.status(422).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.json(settings);
    }
  });
};

/**
 * Show the current settings
 */
exports.read = function (req, res) {
  // convert mongoose document to JSON
  var settings = req.settings ? req.settings.toJSON() : {};

  // Add a custom field to the Settings, for determining if the current User is the "owner".
  // NOTE: This field is NOT persisted to the database, since it doesn't exist in the Settings model.
  settings.isCurrentUserOwner = !!(req.user && settings.user && settings.user._id.toString() === req.user._id.toString());

  res.json(settings);
};

/**
 * Update an settings
 */
exports.update = function (req, res) {
  var settings = req.settings;

  settings.title = req.body.title;
  settings.content = req.body.content;

  settings.save(function (err) {
    if (err) {
      return res.status(422).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.json(settings);
    }
  });
};

/**
 * Delete an settings
 */
exports.delete = function (req, res) {
  var settings = req.settings;

  settings.remove(function (err) {
    if (err) {
      return res.status(422).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.json(settings);
    }
  });
};

/**
 * List of Settingss
 */
exports.list = function (req, res) {
  Settings.find().sort('-created').populate('user', 'displayName').exec(function (err, settingss) {
    if (err) {
      return res.status(422).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.json(settingss);
    }
  });
};

/**
 * Settings middleware
 */
exports.settingsByID = function (req, res, next, id) {

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).send({
      message: 'Settings is invalid'
    });
  }

  Settings.findById(id).populate('user', 'displayName').exec(function (err, settings) {
    if (err) {
      return next(err);
    } else if (!settings) {
      return res.status(404).send({
        message: 'No settings with that identifier has been found'
      });
    }
    req.settings = settings;
    next();
  });
};
