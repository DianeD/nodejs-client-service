/*
 * Copyright (c) Microsoft. All rights reserved. Licensed under the MIT license.
 * See LICENSE in the project root for license information.
 */

'use strict';

const express = require('express'),
  router = express.Router(),
  passport = require('passport');

module.exports = function (app) {
  app.use('/', router);
};

router.use((req, res, next) => {
  console.log(req.method + ' ' + req.url); //todo: add something useful or remove
  next();
});

router.get('/', 
  (req, res) => {
    res.render('index', {
      current: req.user || null
    });
  });

router.get('/login',
  (req, res) => {
    res.render('login');
  });

router.post('/login', 
  passport.authenticate('local', { failureRedirect: '/login' }), //todo: add login error message
  (req, res) => {
    res.redirect('/');
  });

router.get('/schedule', //dummy page
  (req, res) => {
    res.render('schedule', {
      current: req.user || null
    });
  });


//////////////////test
router.get('/connect',
	passport.authenticate('azuread-openidconnect', { failureRedirect: '/yabba' }),
	(req, res) => {
		res.redirect('/');
});

router.get('/token', 
	passport.authenticate('azuread-openidconnect', { failureRedirect: '/dabba' }), //how add error message
	(req, res) => { 
    let user = req.user;
    user.accessToken = user.access_token;
    user.refreshToken = user.refresh_token;
    user.tokenExpires = Math.floor((Date.now() / 1000) + user.expires_in); //
    user.microsoftAccountName = '';//user.profile.
    passport.users.update(user);//Database.users.update(user); //don't expect this to work
		res.redirect('/graph');
});