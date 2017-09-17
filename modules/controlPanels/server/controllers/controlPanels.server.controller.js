'use strict';

/**
 * Module dependencies
 */
var path = require('path'),
  mongoose = require('mongoose'),
  ControlPanel = mongoose.model('ControlPanel'),
  errorHandler = require(path.resolve('./modules/core/server/controllers/errors.server.controller'));

var numOfTemps = 4000;

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
  // numOfTemps = req.controlPanel.numOfTemps;
  var controlPanel = req.controlPanel ? req.controlPanel.toJSON() : {};
  // temp filterfindOne
  // controlPanel.temp = req.controlPanel.temp[temp]
  // req.controlPanel ? req.controlPanel.find( {}, { temp: { $slice: -1 }}) : {};
  // Add a custom field to the ControlPanel, for determining if the current User is the "owner".
  // NOTE: This field is NOT persisted to the database, since it doesn't exist in the ControlPanel model.
  controlPanel.isCurrentUserOwner = !!(req.user && controlPanel.user && controlPanel.user._id.toString() === req.user._id.toString());
  if (controlPanel.isCurrentUserOwner || req.user.roles[1] === 'admin') {
    // var test = controlPanel.temp.slice(10);
    // controlPanel.temp.slice(3)
    controlPanel.temp = controlPanel.temp.slice(-numOfTemps);
    res.json(controlPanel);
  } else {
    return res.status(403).json({
      message: 'User is not authorized'
    });
  }

};

/**
 * Update an controlPanel
 */
exports.update = function (req, res) {
  var controlPanel = req.controlPanel;

  controlPanel.title = req.body.title;
  controlPanel.content = req.body.content;
  controlPanel.info = req.body.info;
  controlPanel.online = req.body.online;
  // controlPanel.temp = req.body.temp;
  // controlPanel.temp.data = 0;
  // controlPanel.temp.time = 0;
  // controlPanel.temp._id = 0;
  controlPanel.schedule = req.body.schedule;
  controlPanel.scheduleProgress = req.body.scheduleProgress;
  controlPanel.scheduleStatus = req.body.scheduleStatus;

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
  var ownerOnly;
  if (req.user.roles[1] === 'admin') {
    console.log('' + req.user.roles[1]);
    ownerOnly = '';
  } else {
    ownerOnly = {
      'user': req.user._id
    };
  }
  ControlPanel.find(ownerOnly).sort('-online').populate('user', 'displayName').exec(function (err, controlPanels) {
    for (let controlPanel of controlPanels) {
      // remove all but the lastest temp
      controlPanel.temp = controlPanel.temp.slice(-1);
      // set the schedule to be a none existant schedule so it won't show
      controlPanel.schedule = controlPanel.schedule.slice(2);

    }

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
