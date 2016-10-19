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

router.use(function(req, res, next) {
  if (req.isAuthenticated()) 
    return next();
  res.redirect('/connect');
});

router.get('/', (req, res) => {
  let user = req.user;
  if (user && user.microsoftAccountName) //user.isAuthenticated
    res.render('journal', { current: user });
  // passport.authenticate('azuread-openidconnect', { failureRedirect: '/doo' }), //this call doesn't trigger the auth redirect for login
  //   (req, res) => {
  //     res.redirect('/');
  // }
});

// router.get('/', function (req, res) {
//   let user = Database.users.findOne({ 'sessionId' : req.sessionID });
//   if (user && user.microsoftAccountName) {
//     res.render('journal', { current: user });//{ displayName: user.displayName, microsoftAccountName: user.microsoftAccountName });
//   } else {
//     Auth.prototype.login(req, res); 
//   }
// });

router.get('/getMe', function (req, res) { 
  // let res1 = res;
  // let user = Database.users.findOne({ 'sessionId' : req.sessionID });
  // let accessToken = Auth.prototype.getAccessToken(user);
  // request
  //   .get('https://graph.microsoft.com/beta/me/notes/pages')
  //   .set('Authorization', 'Bearer ' + accessToken)
  //   .end(function(err, res) {
  //     if (err || !res.ok) {
  //       renderError(res1, err);
  //     } else {
  //       res1.render('journal', {
  //         current : user,
  //         response: JSON.stringify(res.body)
  //       });
  //     }
  //   });
});

// app.get('/login',
// 	passport.authenticate('azuread-openidconnect', { failureRedirect: '/' }),
// 	(req, res) => {
// 		res.redirect('/');
// });

// app.get('/logout', (req, res) => {
//   req.session.destroy( (err) => {
//     req.logOut();
// 	res.clearCookie('graphNodeCookie');
// 	res.status(200);
// 	res.redirect('https://local.vroov.com:' + port);
//   });
// });

// app.get('/token', 
// 	passport.authenticate('azuread-openidconnect', { failureRedirect: '/' }), 
// 	(req, res) => { 
// 		res.render('emailSender', { user: req.user.profile});
// });

// app.post('/emailSender',
// 	ensureAuthenticated,
// 	(req, res) => {
// 		var client = graph.init({
// 			defaultVersion: 'v1.0',
// 			debugLogging: true,
// 			authProvider: function (done) {
// 				done(null, req.user.accessToken);
// 			}
// 		});
// 		client.api('/me').select(["displayName", "userPrincipalName"]).get((err, me) => {
// 			if (err) {
// 				renderError(res, err);
// 				return;
// 			}
// 			const mailBody = emailHelper.generateMailBody(me.displayName, req.body.input_email);
// 			client.api('/users/me/sendMail').post(mailBody,(err, mail) => {
// 				if (err){
// 					renderError(res, err);
// 					return;
// 				}
// 				else
// 					console.log("Sent an email");
// 					res.render('emailSender', { user: req.user.profile, status: "success"});
// 			})
// 		});
// });

function renderError (res, e) {
	res.render('error', {
		message: e.message,
		error: e
	});
	console.error(e);
};