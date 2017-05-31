'use strict';

/**
 * Module dependencies
 */
var kilnsPolicy = require('../policies/kilns.server.policy'),
  kilns = require('../controllers/kilns.server.controller');

module.exports = function (app) {
  // Kilns collection routes
  app.route('/api/kilns').all(kilnsPolicy.isAllowed)
    .get(kilns.list)
    .post(kilns.create);

  // Single kiln routes
  app.route('/api/kilns/:kilnId').all(kilnsPolicy.isAllowed)
    .get(kilns.read)
    .put(kilns.update)
    .delete(kilns.delete);

  // Finish by binding the kiln middleware
  app.param('kilnId', kilns.kilnByID);
};
