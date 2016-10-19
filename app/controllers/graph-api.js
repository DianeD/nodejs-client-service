/*
 * Copyright (c) Microsoft. All rights reserved. Licensed under the MIT license.
 * See LICENSE in the project root for license information.
 */

'use strict';

const express = require('express'),
  router = express.Router(),
  passport = require('passport'),
  Auth = require('../utils/auth');
const request = require('superagent');

module.exports = function (app) {
  app.use('/graph', router);
};

router.get('/', (req, res) => {
  let user = req.user;
  if (user && user.microsoftAccountName)
    res.render('journal', { current: user });
  else
    Auth.prototype.login(req, res);
});

router.get('/callback', (req, res) => {
  Auth.prototype.getTokenFromCode(req, res);
});

router.get('/getMyPages', function (req, res) { 
  let res1 = res;
  //Database.users.findOne({ 'sessionId' : req.sessionID });
  let accessToken = Auth.prototype.getAccessToken(req.user);
  request
    .get('https://graph.microsoft.com/beta/me/notes/pages')
    .set('Authorization', 'Bearer ' + accessToken)
    .end(function(err, res) {
      if (err || !res.ok) {
        renderError(res1, err);
      } else {
        res1.render('journal', {
          current : user,
          response: JSON.stringify(res.body)
        });
      }
    });
});