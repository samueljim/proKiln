(function (app) {
  'use strict';

  app.registerModule('settingss', ['core']);// The core module is required for special route handling; see /core/client/config/core.client.routes
  app.registerModule('settingss.admin', ['core.admin']);
  app.registerModule('settingss.admin.routes', ['core.admin.routes']);
  app.registerModule('settingss.services');
  app.registerModule('settingss.routes', ['ui.router', 'core.routes', 'settingss.services']);
}(ApplicationConfiguration));
