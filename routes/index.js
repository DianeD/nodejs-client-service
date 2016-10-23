/*
 * Copyright (c) Microsoft. All rights reserved. Licensed under the MIT license.
 * See LICENSE in the project root for license information.
 */

'use strict';

const express = require('express'),
  router = express.Router(),
  passport = require('passport'),
  config = require('../utils/config');

// Local account login
router.post('/login', (req, res) => {
  let username = req.body.username;
  let password = req.body.password;
  if (username && password)
    passport.authenticate('local', function(err, user) {
      if (!user)
        res.status(404).send('User not found.');
      else {
        res.header('U-Token', user.userToken);
        res.sendStatus(200);
      }
    })(req, res);
  else
    res.status(401).send('The username or password is missing.');
});

// Routes for Azure AD authentication.
router.get('/connect', //check userToken
	passport.authenticate('azuread-openidconnect', { failureRedirect: '/connect' }),
	(req, res) => {
		res.redirect('/');
  });
router.get('/token', 
	passport.authenticate('azuread-openidconnect', { failureRedirect: '/connect' }),
	(req, res) => {
    res.header('U-Token', req.user.userToken);    
    res.sendStatus(200);
  });

router.get('/logout', (req, res) => {
  let userToken = req.user.userToken;
  if (userToken === req.headers.u-token)
    req.session.destroy( (err) => {
      req.logOut();
    res.clearCookie(config.cookieName);
    res.sendStatus(200);
  });
  else
    res.status(401).send('Invalid user token.');
});

router.get('/schedule',
  (req, res) => {
    res.header('U-Token', user.userToken);
    res.status(200).send('some schedule info');
  });

module.exports = router;
