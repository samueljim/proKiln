'use strict';

/**
 * Module dependencies
 */
var acl = require('acl');

// Using the memory backend
acl = new acl(new acl.memoryBackend());

/**
 * Invoke ControlPanels Permissions
 */
exports.invokeRolesPolicies = function () {
  acl.allow([{
    roles: ['admin'],
    allows: [{
      resources: '/api/controlPanels',
      permissions: '*'
    }, {
      resources: '/api/controlPanels/:controlPanelId',
      permissions: '*'
    }]
  }, {
    roles: ['user'],
    allows: [{
      resources: '/api/controlPanels',
      permissions: ['get']
    }, {
      resources: '/api/controlPanels/:controlPanelId',
      permissions: ['get']
    }]
  }, {
    roles: ['guest'],
    allows: [{
      resources: '/api/controlPanels',
      permissions: ['get']
    }, {
      resources: '/api/controlPanels/:controlPanelId',
      permissions: ['get']
    }]
  }]);
};

/**
 * Check If ControlPanels Policy Allows
 */
exports.isAllowed = function (req, res, next) {
  var roles = (req.user) ? req.user.roles : ['guest'];

  // If an controlPanel is being processed and the current user created it then allow any manipulation
  if (req.controlPanel && req.user && req.controlPanel.user && req.controlPanel.user.id === req.user.id) {
    return next();
  }

  // Check for user roles
  acl.areAnyRolesAllowed(roles, req.route.path, req.method.toLowerCase(), function (err, isAllowed) {
    if (err) {
      // An authorization error occurred
      return res.status(500).send('Unexpected authorization error');
    } else {
      if (isAllowed) {
        // Access granted! Invoke next middleware
        return next();
      } else {
        return res.status(403).json({
          message: 'User is not authorized'
        });
      }
    }
  });
};
