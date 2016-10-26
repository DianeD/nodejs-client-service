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
    passport.authenticate('local', (err, user) => {
      if (err)
        res.status(500).send(err.message);
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

// Azure AD authorization
router.get('/connect',
  (req, res) => {
    const state = req.headers['u-token'];
    passport.authenticate('azuread-openidconnect', { customState: state, failureRedirect: '/connect' })(req, res),
    (req, res) => {
      res.end();
    }
  });
router.get('/token', 
	passport.authenticate('azuread-openidconnect', { failureRedirect: '/connect' }),
	(req, res) => {
    console.log('Mapped user ' + req.user.user.id);
    res.end(); // notify client?
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
