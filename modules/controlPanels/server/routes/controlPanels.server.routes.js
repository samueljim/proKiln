'use strict';

/**
 * Module dependencies
 */
var controlPanelsPolicy = require('../policies/controlPanels.server.policy'),
  controlPanels = require('../controllers/controlPanels.server.controller');

module.exports = function (app) {
  // ControlPanels collection routes
  app.route('/api/controlPanels').all(controlPanelsPolicy.isAllowed)
    .get(controlPanels.list)
    .post(controlPanels.create);
    // .get(controlPanels.adminlist)

  // Single controlPanel routes
  app.route('/api/controlPanels/:controlPanelId').all(controlPanelsPolicy.isAllowed)
    .get(controlPanels.read)
    .put(controlPanels.update)
    .delete(controlPanels.delete);

  // Finish by binding the controlPanel middleware
  app.param('controlPanelId', controlPanels.controlPanelByID);
};
