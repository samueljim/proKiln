(function (app) {
  'use strict';

  app.registerModule('userss', ['core']);// The core module is required for special route handling; see /core/client/config/core.client.routes
  app.registerModule('userss.admin', ['core.admin']);
  app.registerModule('userss.admin.routes', ['core.admin.routes']);
  app.registerModule('userss.services');
  app.registerModule('userss.routes', ['ui.router', 'core.routes', 'userss.services']);
}(ApplicationConfiguration));
