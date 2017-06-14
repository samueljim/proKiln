(function (app) {
  'use strict';

  app.registerModule('memes', ['core']);// The core module is required for special route handling; see /core/client/config/core.client.routes
  app.registerModule('memes.admin', ['core.admin']);
  app.registerModule('memes.admin.routes', ['core.admin.routes']);
  app.registerModule('memes.services');
  app.registerModule('memes.routes', ['ui.router', 'core.routes', 'memes.services']);
}(ApplicationConfiguration));
