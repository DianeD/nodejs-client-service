/*
 * Copyright (c) Microsoft. All rights reserved. Licensed under the MIT license.
 * See LICENSE in the project root for license information.
 */

'use strict';

const express = require('express'),
  router = express.Router(),
  graph = require('msgraph-sdk-javascript'),
  Auth = require('../utils/auth');
//const request = require('superagent');

router.get('/', (req, res) => {

  // Check whether the user is authenticated and their Microsoft login is mapped to the local user.
  let user = req.user;
  if (req.isAuthenticated() && user.microsoftAccountName) {
    let client = graph.init({
      defaultVersion: 'beta',
      debugLogging: true,
      authProvider: function (done) {
        done(null, user.accessToken);
      }
    });

    // Get the journal section.
    client.api('/me/notes/sections').orderby('lastModifiedTime%20desc').get((err, response) => { //filter by section name
      if (err) {
        res.render('error', { message: err.message, error: err });
        return;
      }
      let sections = response.value;

      // If the journal section exists, get the last three pages. 
      if (sections.length > 0) {
        const section = sections[0];
        const sectionId = section.id;
        client.api('/me/notes/sections/' + sectionId + '/pages').get((err, response) => {
          if (err) {
            res.render('error', { message: err.message, error: err });
            return;
          }
          const pages = response.value;
          const html = '<div><p><b>hello </b></p></div><div><p><i>test page html</i></p></div>';
          // get and prep page content
          res.render('journal', { user: user, section: section.name, pages: pages, test: html });
        });
      }  
      
      // Otherwise create the journal section and the initial page.
      // Then redirect back to this route.
      // This should only be required only on first visit to this page.
      else {
        let sectionName = encodeUrlComponent(user.displayName + ' \'s journal');
        client.api('/me/notes/pages?sectionName=').post((err, response) => {
          if (err) {
            res.render('error', { message: err.message, error: err });
            return;
          }
          res.redirect('/graph');
        });
      }
    });
  }
  else res.redirect('/connect'); //still unable to get passport.authenticate() to trigger redirect when called from here
});

// function getSections(req) {
//   let req1 = req;
//   if (Auth.prototype.ensureAuthenticated(req)) {
//     request
//       .get('https://graph.microsoft.com/beta/me/notes/sections')
//       .set('Authorization', 'Bearer ' + req.user.accessToken)
//       .end((err, res) => {
//         if (err || !res.ok) 
//           return err;
//         let sections = res.body.value;
//         if (sections.length === 0)
//           createPageInSection(req1, 'My page', 'My%20journal');//todo: promisify
//         return sections;
//       })
//   }
// }

// // Create a page and optionally create a parent section.
// function createPageInSection(req, pageTitle, sectionName) {
//   let pageHtml = '<!DOCTYPE html>' +
//     '<html>' +
//       '<head>' +
//         '<title>' + pageTitle + '</title>' +
//         '<meta name=\'created\' content=\'' + new Date() + '\'/>' +
//       '</head>' +
//     '</html>';
//   if (Auth.prototype.ensureAuthenticated(req)) {
//     let page = null;
//     request
//       .post('https://graph.microsoft.com/beta/me/notes/pages?sectionName=' + sectionName)
//       .set('Authorization', 'Bearer ' + req.user.accessToken)
//       .type('text/html')
//       .send(pageHtml)
//       .end((err, res) => {
//         if (err || !res.ok) 
//           res1.render('error', { error: err });
//         else
//           page = res.body;
//           return page;
//     })
//   }
// }

module.exports = router;
