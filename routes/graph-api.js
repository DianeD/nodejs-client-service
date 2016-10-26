/*
 * Copyright (c) Microsoft. All rights reserved. Licensed under the MIT license.
 * See LICENSE in the project root for license information.
 */

'use strict';

const express = require('express'),
  router = express.Router(),
  database = require('../utils/database'),
  graph = require('msgraph-sdk-javascript'),
  qs = require('querystring'),
  authHelper = require('../utils/authHelper');

router.use((req, res, next) => {

  // Check that the request has a valid user session and sent a user teken.
  const userToken = req.headers['u-token'];
  const user = (req.user) ? req.user : database.users.findOne({ 'userToken' : userToken });
  if (!user) {
    res.status(401).send('Invalid user token.');
    return;
  }

  // Check that the local user account has a mapped Microsoft account.
  if (user.microsoftAccountName)
    next();

  // If no mapped account, send the login information to the client.
  else
    res.header('U-Token', user.userToken);
    res.status(401).send('Sign in required at /connect.');
});


// Returns the title, createdTime, and body content of the three latest notes.
// Gets the journal (a OneNote section named "<user.displayName>'s journal"). Creates it if it doesn't exist.
// Gets the last three notes (the three most recently created pages).
router.get('/getJournal', (req, res) => {

  // Check whether the user is authenticated and has a mapped Microsoft login.  
  const user = (req.user) ? req.user : database.users.findOne({ 'userToken' : userToken });
  res.header('U-Token', user.userToken);
  res.status(200).send('some OneNote json');
});
//   if (req.isAuthenticated()) {
//     let client = graph.init({
//       defaultVersion: 'beta',
//       debugLogging: true,
//       authProvider: function (done) {
//         done(null, user.accessToken);
//       }
//     });

//     // Get the journal section.
//     //https://graph.microsoft.com/beta/me/notes/sections?filter=name%20eq%20'Alex%20Darrow''s%20journal'
//     client.api('/me/notes/sections')
//       .filter('name eq \'' + user.displayName + '\'\'s journal\'')
//       .select('name,id')
//       .get((err, response) => {
//         if (err) {
//           res.render('error', { message: err.message, error: err });
//           return;
//         }
//         let sections = response.value;

//         // If the journal section exists, get the last three pages. 
//         // Expanding on pages is not supported for Office 365 notebooks, so this call is made separately.
//         if (sections.length > 0) {
//           const section = sections[0];
//           const sectionId = section.id;
//           const pages = [];
//           //client.api('me/notes/pages?filter=/parentSection/id eq \'' + sectionId + '\'')
//             //.select('title,createdTime,content')
//             //.top(3)
//           client.api('/me/notes/sections/' + sectionId + '/pages')
//             .select('title,createdTime,pageContentUrl')
//             .orderby('lastModifiedTime desc')
//             .top(3)
//             .get((err, response) => {
//               if (err) {
//                 res.render('error', { message: err.message, error: err });
//                 return;
//               }
//               //loop pages = response.value;
//               const html = '<div><p><b>hello </b></p></div><div><p><i>test page html</i></p></div>';
//               // get and prep page content
//               res.render('journal', { user: user, section: section.name, pages: pages, test: html });
//           });
//       }  
      
//       // Otherwise create the journal section and the initial page.
//       // Then redirect back to this route.
//       // This should only be required only on first visit to this page.
//       else
//         //let sectionName = qs.escape(user.displayName + ' \'s journal');
//         client.api('/me/notes/pages?sectionName=' + user.displayName + '\' journal').post((err, response) => { //errs here
//           if (err) {
//             res.render('error', { message: err.message, error: err });
//             return;
//           }
//           // res.header('U-Token', user.userToken);
//           else res.redirect('/graph');
//         });
//     });
//   }
//   else
//     res.redirect('/connect');
// });

module.exports = router;
