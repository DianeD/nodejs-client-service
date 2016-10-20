/*
 * Copyright (c) Microsoft. All rights reserved. Licensed under the MIT license.
 * See LICENSE in the project root for license information.
 */

'use strict';

const express = require('express'),
  router = express.Router(),
  Auth = require('../utils/auth');
const request = require('superagent');

  module.exports = function (app) {
    app.use('/graph', router);
  };

router.get('/', (req, res) => {
  if (req.isAuthenticated() && req.user.microsoftAccountName)
    res.render('journal', { current: req.user });
  else res.redirect('/connect'); //still unable to get passport.authenticate() to trigger redirect when called from here
});

router.get('/getMyPages', function (req, res) { 
  let res1 = res;
  let user = req.user;
  if (Auth.prototype.ensureAuthenticated(req)) {
    request
      .get('https://graph.microsoft.com/beta/me/notes/pages')
      .set('Authorization', 'Bearer ' + user.accessToken)
      .end((err, res) => {
        if (err || !res.ok) 
          res1.render('error', { error: err });
        else
          res1.render('journal', { current : user, response: JSON.stringify(res.body) });
      })
    }
    else 
      res1.redirect('/temp============');
});

module.exports = router;
