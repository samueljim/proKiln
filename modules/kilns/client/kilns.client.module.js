(function (app) {
  'use strict';

  app.registerModule('kilns', ['core']);// The core module is required for special route handling; see /core/client/config/core.client.routes
  app.registerModule('kilns.admin', ['core.admin']);
  app.registerModule('kilns.admin.routes', ['core.admin.routes']);
  app.registerModule('kilns.services');
  app.registerModule('kilns.routes', ['ui.router', 'core.routes', 'kilns.services']);
}(ApplicationConfiguration));
