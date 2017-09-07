(function (app) {
  'use strict';

  app.registerModule('controlPanels', ['core', 'chart.js']);// The core module is required for special route handling; see /core/client/config/core.client.routes
  app.registerModule('controlPanels.admin', ['core.admin']);
  app.registerModule('controlPanels.admin.routes', ['core.admin.routes']);
  app.registerModule('controlPanels.services');
  app.registerModule('controlPanels.routes', ['ui.router', 'core.routes', 'controlPanels.services']);
}(ApplicationConfiguration));
