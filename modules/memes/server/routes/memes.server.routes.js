'use strict';

/**
 * Module dependencies
 */
var memesPolicy = require('../policies/memes.server.policy'),
  memes = require('../controllers/memes.server.controller');

module.exports = function (app) {
  // Memes collection routes
  app.route('/api/memes').all(memesPolicy.isAllowed)
    .get(memes.list)
    .post(memes.create);

  // Single meme routes
  app.route('/api/memes/:memeId').all(memesPolicy.isAllowed)
    .get(memes.read)
    .put(memes.update)
    .delete(memes.delete);

  // Finish by binding the meme middleware
  app.param('memeId', memes.memeByID);
};
