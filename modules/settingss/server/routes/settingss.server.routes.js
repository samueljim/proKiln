'use strict';

/**
 * Module dependencies
 */
var settingssPolicy = require('../policies/settingss.server.policy'),
  settingss = require('../controllers/settingss.server.controller');

module.exports = function (app) {
  // Settingss collection routes
  app.route('/api/settingss').all(settingssPolicy.isAllowed)
    .get(settingss.list)
    .post(settingss.create);

  // Single settings routes
  app.route('/api/settingss/:settingsId').all(settingssPolicy.isAllowed)
    .get(settingss.read)
    .put(settingss.update)
    .delete(settingss.delete);

  // Finish by binding the settings middleware
  app.param('settingsId', settingss.settingsByID);
};
