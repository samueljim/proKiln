'use strict';

/**
 * Module dependencies
 */
var schedulesPolicy = require('../policies/schedules.server.policy'),
  schedules = require('../controllers/schedules.server.controller');

module.exports = function (app) {
  // Schedules collection routes
  app.route('/api/schedules').all(schedulesPolicy.isAllowed)
    .get(schedules.list)
    .post(schedules.create);

  // Single schedule routes
  app.route('/api/schedules/:scheduleId').all(schedulesPolicy.isAllowed)
    .get(schedules.read)
    .put(schedules.update)
    .delete(schedules.delete);

    // Program schedule routes
  app.route('/api/schedules/:scheduleId/program').all(schedulesPolicy.isAllowed)
      .get(schedules.read)
      .put(schedules.update)
      .delete(schedules.delete);

  // Finish by binding the schedule middleware
  app.param('scheduleId', schedules.scheduleByID);
};
