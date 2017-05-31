'use strict';

/**
 * Module dependencies
 */
var userssPolicy = require('../policies/userss.server.policy'),
  userss = require('../controllers/userss.server.controller');

module.exports = function (app) {
  // Userss collection routes
  app.route('/api/userss').all(userssPolicy.isAllowed)
    .get(userss.list)
    .post(userss.create);

  // Single users routes
  app.route('/api/userss/:usersId').all(userssPolicy.isAllowed)
    .get(userss.read)
    .put(userss.update)
    .delete(userss.delete);

  // Finish by binding the users middleware
  app.param('usersId', userss.usersByID);
};
