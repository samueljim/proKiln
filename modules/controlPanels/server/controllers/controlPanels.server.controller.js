'use strict';

/**
 * Module dependencies
 */
var path = require('path'),
  mongoose = require('mongoose'),
  ControlPanel = mongoose.model('ControlPanel'),
  errorHandler = require(path.resolve('./modules/core/server/controllers/errors.server.controller'));

/**
 * Create an controlPanel
 */
exports.create = function (req, res) {
  var controlPanel = new ControlPanel(req.body);
  controlPanel.user = req.user;

  controlPanel.save(function (err) {
    if (err) {
      return res.status(422).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.json(controlPanel);
    }
  });
};

/**
 * Show the current controlPanel
 */
exports.read = function (req, res) {
  // convert mongoose document to JSON
  var controlPanel = req.controlPanel ? req.controlPanel.toJSON() : {};

  // Add a custom field to the ControlPanel, for determining if the current User is the "owner".
  // NOTE: This field is NOT persisted to the database, since it doesn't exist in the ControlPanel model.
  controlPanel.isCurrentUserOwner = !!(req.user && controlPanel.user && controlPanel.user._id.toString() === req.user._id.toString());

  res.json(controlPanel);
};

/**
 * Update an controlPanel
 */
exports.update = function (req, res) {
  var controlPanel = req.controlPanel;

  controlPanel.title = req.body.title;
  controlPanel.content = req.body.content;
  controlPanel.temp = req.body.temp;
  controlPanel.info = req.body.info;
  controlPanel.online = req.body.online;
  controlPanel.schedule = req.body.schedule;

  controlPanel.save(function (err) {
    if (err) {
      return res.status(422).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.json(controlPanel);
    }
  });
};

/**
 * Delete an controlPanel
 */
exports.delete = function (req, res) {
  var controlPanel = req.controlPanel;

  controlPanel.remove(function (err) {
    if (err) {
      return res.status(422).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.json(controlPanel);
    }
  });
};

/**
 * List of ControlPanels
 */
exports.list = function (req, res) {
  ControlPanel.find({ "user": req.user._id}).sort('-created').populate('user', 'displayName').exec(function (err, controlPanels) {
    if (err) {
      return res.status(422).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.json(controlPanels);
    }
  });
};

/**
 * ControlPanel middleware
 */
exports.controlPanelByID = function (req, res, next, id) {

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).send({
      message: 'ControlPanel is invalid'
    });
  }

  ControlPanel.findById(id).populate('user', 'displayName').exec(function (err, controlPanel) {
    if (err) {
      return next(err);
    } else if (!controlPanel) {
      return res.status(404).send({
        message: 'No controlPanel with that identifier has been found'
      });
    }
    req.controlPanel = controlPanel;
    next();
  });
};
