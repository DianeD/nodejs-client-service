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

// router.use(function(req, res, next) {
//   if (req.isAuthenticated()) 
//     return next();
//   res.redirect('/connect');
// });

router.get('/', (req, res) => {
  if (req.isAuthenticated() && req.user.microsoftAccountName)
    res.render('journal', { current: user });
  // passport.authenticate('azuread-openidconnect', { failureRedirect: '/doo' }), //this call doesn't trigger the auth redirect for login
  //   (req, res) => {
  //     res.redirect('/');
  // }
  else res.redirect('/connect');
});

// router.get('/', function (req, res) {
//   let user = Database.users.findOne({ 'sessionId' : req.sessionID });
//   if (user && user.microsoftAccountName) {
//     res.render('journal', { current: user });//{ displayName: user.displayName, microsoftAccountName: user.microsoftAccountName });
//   } else {
//     Auth.prototype.login(req, res); 
//   }
// });

router.get('/getMyPages', function (req, res) { 
  let res1 = res;
  let user = req.user;
  Auth.prototype.ensureAuthenticated(); //
  // let user = Database.users.findOne({ 'sessionId' : req.sessionID });
  // let accessToken = Auth.prototype.getAccessToken(user);
  request
    .get('https://graph.microsoft.com/beta/me/notes/pages')
    .set('Authorization', 'Bearer ' + user.accessToken)
    .end(function(err, res) {
      if (err || !res.ok) res1.render('error', { error: err });
      else {
        res1.render('journal', {
          current : user,
          response: JSON.stringify(res.body)
        });
      }
    });
});