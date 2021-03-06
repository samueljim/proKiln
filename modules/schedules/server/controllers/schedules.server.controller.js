'use strict';

/**
 * Module dependencies
 */
var path = require('path'),
  mongoose = require('mongoose'),
  Schedule = mongoose.model('Schedule'),
  errorHandler = require(path.resolve('./modules/core/server/controllers/errors.server.controller'));

/**
 * Create an schedule
 */
exports.create = function (req, res) {
  var schedule = new Schedule(req.body);
  schedule.user = req.user;
  schedule.program = [{
    segment: 1,
    rate: 0,
    goal: 0,
    hold: 0
  }];

  schedule.save(function (err) {
    if (err) {
      return res.status(422).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.json(schedule);
    }
  });
};

/**
 * Show the current schedule
 */
exports.read = function (req, res) {
  // convert mongoose document to JSON
  var schedule = req.schedule ? req.schedule.toJSON() : {};

  // Add a custom field to the Schedule, for determining if the current User is the "owner".
  // NOTE: This field is NOT persisted to the database, since it doesn't exist in the Schedule model.
  schedule.isCurrentUserOwner = !!(req.user && schedule.user && schedule.user._id.toString() === req.user._id.toString());

  res.json(schedule);
};

/**
 * Update an schedule
 */
exports.update = function (req, res) {
  var schedule = req.schedule;

  schedule.title = req.body.title;
  schedule.content = req.body.content;
  // controlPanel.schedule = req.body.schedule;
  schedule.scheduleStatus = req.body.scheduleStatus;
  schedule.scheduleStatus = req.body.scheduleStatus;
  schedule.program = req.body.program;
  schedule.totalTiming = req.body.totalTiming;
  schedule.values = req.body.values;
  schedule.startTemp = req.body.startTemp;

  // schedule.program.forEach(function (segment, index) {
  //   if (segment.hold < 0 || segment.rate === 0) {
  //     return res.status(422).send({
  //       message: 'Segment ' + segment.segment + ' has a error.'
  //     });
  //   }
  // });

  // var continue = true;

  schedule.program.forEach(function (segment, index) {
    // if (continue === true) {
    if (segment.hold < 0) {
      // continue = false;
      return res.status(422).send({
        message: 'Hold in Segment ' + segment.segment + ' must not be less than zero.'
      });
    }
    if (segment.rate <= 0) {
      // continue = false;
      return res.status(422).send({
        message: 'Rate in Segment ' + segment.segment + ' must be more than zero.'
      });
    }
    if (segment.goal < 0) {
      // continue = false;
      return res.status(422).send({
          message: 'Goal in Segment ' + segment.segment + ' must not be less than zero.'
      });
    }
    // }
  });

  schedule.save(function (err) {
    if (err) {
      return res.status(422).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.json(schedule);
    }
  });
};

/**
 * Delete an schedule
 */
exports.delete = function (req, res) {
  var schedule = req.schedule;

  schedule.remove(function (err) {
    if (err) {
      return res.status(422).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.json(schedule);
    }
  });
};

/**
 * List of Schedules
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
  Schedule.find(ownerOnly).sort('-created').populate('user', 'displayName').exec(function (err, schedules) {
    if (err) {
      return res.status(422).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.json(schedules);
    }
  });
};

/**
 * Schedule middleware
 */
exports.scheduleByID = function (req, res, next, id) {

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).send({
      message: 'Schedule is invalid'
    });
  }

  Schedule.findById(id).populate('user', 'displayName').exec(function (err, schedule) {
    if (err) {
      return next(err);
    } else if (!schedule) {
      return res.status(404).send({
        message: 'No schedule with that identifier has been found'
      });
    }
    req.schedule = schedule;
    next();
  });
};
