/*
 * Copyright (c) Microsoft. All rights reserved. Licensed under the MIT license.
 * See LICENSE in the project root for license information.
 */

'use strict';

const express = require('express'),
  router = express.Router(),
  database = require('../utils/database'),
  graph = require('msgraph-sdk-javascript'),
  //qs = require('querystring'),
  async = require('async'),
  authHelper = require('../utils/authHelper');

const createPageInSection = (res, client, sectionName) => {
  const date = new Date();
  const pageHtml = '<!DOCTYPE html>' +
    '<html>' +
      '<head>' +
        '<title>' + date.toLocaleString().split(',')[0] + '</title>' + //todo: handle client utc
        '<meta name="created" content="' + date.toISOString() + '" />' + //todo: handle client utc
      '</head>' +
      '<body></body>' +
    '</html>';
  client.api('/me/notes/pages?sectionName=' + 'test1')//sectionName)
    .header('content-type', 'text/html')
    .post(pageHtml, (err, newPage) => {
      if (err) {
        res.status(err.statusCode).send(err);
      }

      // Get the parent section (not returned in a create-page request).            
      client.api(newPage.self)
        .select('id,self,title,createdTime,contentUrl')
        .expand('parentSection(select=id,name)')
        .get((err, page, rawResponse) => {
          if (err) {
            return res.status(err.statusCode).send(err); 
          }
          page.content = '';
          res.status(200).send({ "section": page.parentSection, "pages": [page] });
        });
    });
}

router.use((req, res, next) => {

  // Check that the request contains a valid user token.
  const userToken = req.headers['u-token'];
  const user = (req.user) ? req.user.user : database.users.findOne({ 'userToken' : userToken }); //todo: also validate that the req.user token is the same as the sent user token
  if (!user) {
    res.status(401).send('Invalid user token.');
    return;
  }

  //todo: add check req.isAuthenticated() somewhere

  // Check that the local user account has a mapped Microsoft account.
  if (user.microsoftAccountName)
    next();

  // If no mapped account, send the sign-in url to the client.
  else
    res.set({
      'U-Token': user.userToken,
      'Location': 'http://localhost:3000/connect'
    });
    res.status(401).send('Sign in required.');
});


// Returns the title, createdTime, and body content of the three latest notes.
// Gets the journal (a OneNote section named "<user.displayName>'s journal"). Creates it if it doesn't exist.
// Gets the last three notes (the three most recently created pages).
router.get('/getJournal', (req, res) => {
  const user = (req.user) ? req.user.user : database.users.findOne({ 'username' : 'adarrow' }); //should just need to get this from req
  const sectionName = user.displayName + 's journal'; //todo: encode with apostrophe
  //const accessToken = authHelper.prototype.ensureAuthenticated(req);

  // Initialize the Microsoft Graph SDK client.
  const client = graph.init({
    defaultVersion: 'beta',
    debugLogging: true,
    authProvider: function (done) {
      done(null, authHelper.prototype.ensureAuthenticated(req));
      //done(null, accessToken); 
    }
  });
  
  // Get the last three pages in the journal section.
  client.api('/me/notes/pages')
    .filter('parentSection/name eq \'' + sectionName + '\'')//'Alex Darrow\'s journal'
    //.filter('parentSection/name eq \'' + user.displayName + '\'s journal\'')
    // .filter('parentSection/name eq \'' + user.displayName + '\'\'s journal\'')
    // .filter('parentSection/name eq \'' + user.displayName + '\\\'s journal\'')
    .select('id,self,title,createdTime,contentUrl')
    .expand('parentSection(select=id,name)')
    .orderby('createdTime desc')
    .top(5)
    .get((err, data) => {
      if (err) {
        return res.status(err.statusCode).send(err); //returned err sans status code "Unknown token  " with apostrophe
      }

      // If the journal section exists, get the last three pages. The journal is 
      // created with a page, so there should be at least one.
      const pages = data.value;
      if (pages.length > 0) {
        const parentSection = pages[0].parentSection;
        
        // Get the HTML content of each page.
        async.each(pages, (page, callback) => {
          client.api(page.contentUrl)
            .header('accept', 'text/html') //not working? getting a _proto object only for page content
            .get((err, pageContent, rawResponse) => {
              if (err) {
                return res.status(err.statusCode).send(err);
              }
              //page.content = pageContent;
              page.content = rawResponse.text;
              callback();
            });
          },
          (err) => {
            if (!err)
              return res.status(200).send({ "section": parentSection, "pages": pages });
          }
        );
      }  
      
      // Otherwise create the journal section and the initial page.
      // This should only be required the first time the user accesses the journal.
      else
        createPageInSection(res, client, sectionName);
    });
});

module.exports = router;