/*
 * Copyright (c) Microsoft. All rights reserved. Licensed under the MIT license.
 * See LICENSE in the project root for license information.
 */

'use strict';

const express = require('express'),
  router = express.Router(),
  passport = require('passport');

// // Web client routes
// router.get('/', (req, res) => {
//   res.render('home');
// });
// router.get('/login', (req, res) => {
//   res.render('login');
// });

// Local account login
router.post('/login', (req, res) => {
  let username = req.body.username;
  let password = req.body.password;
   if (username && password)
    passport.authenticate('local', function(err, user) {
      if (!user) { res.status(404).send('User not found.'); }
      else {
        res.header('U-Token', user.userToken);
        res.sendStatus(200);//.end();
      }
    })(req, res);
  else res.status(401).send('The username or password is missing.');
});

// Routes for Azure AD authentication.
router.get('/connect',
	passport.authenticate('azuread-openidconnect', { failureRedirect: '/connect' }),
	(req, res) => {
		res.redirect('/');
});
router.get('/token', 
	passport.authenticate('azuread-openidconnect', { failureRedirect: '/connect' }), //how add error message
	(req, res) => { 
    res.append('U-Token', req.user.userToken);    
    res.status(200).end();
		//res.redirect('/graph');
});

router.get('/schedule', //loads a dummy page
  (req, res) => {
    res.render('schedule', {
      current: req.user || null
    });
  });

module.exports = router;
