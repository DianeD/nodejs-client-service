/*
 * Copyright (c) Microsoft. All rights reserved. Licensed under the MIT license.
 * See LICENSE in the project root for license information.
 */

/*
 * This sample uses an open source OAuth 2.0 library that is compatible with the Azure AD v2.0 endpoint.
 * Microsoft does not provide fixes or direct support for this library.
 * Refer to the library’s repository to file issues or for other support.
 * For more information about auth libraries see: 
 * https://azure.microsoft.com/documentation/articles/active-directory-v2-libraries/
 * Library repo:  https://github.com/jaredhanson/passport
 */

'use strict';

const express = require('express');
const session = require('express-session');
const glob = require('glob');
//const fs = require('fs');
const https = require('https');
const uuid = require('uuid');
const logger = require('morgan');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const passport = require('passport');//can I set a users property on this?
const LocalStrategy = require('passport-local').Strategy;
const OIDCStrategy = require('passport-azure-ad').OIDCStrategy;
const Database = require('../app/utils/database');
const authConfig = require('./auth-config');
const methodOverride = require('method-override');

// authentication =================================================================
// Configure the local strategy for use by Passport.
passport.use(new LocalStrategy(
  (username, password, done) => {
    let user = Database.users.findOne({ 'username' : username });
    if (!user || user.password !== password) { return done(null, false); } //todo: add error handling and return message
    return done(null, user);
  }));

let callback = (iss, sub, profile, accessToken, refreshToken, done) => {
	done (null, {
    //todo: update user with tokenInfo and MS account name
		profile,
		accessToken,
		refreshToken
	})
};

// Configure the Azure AD strategy for use by Passport.
passport.use(new OIDCStrategy(authConfig.creds, callback));

passport.serializeUser(function(user, done) {
  done(null, user.id);
});

passport.deserializeUser(function(id, done) {
  let user = Database.users.findOne({ 'id' : id });
  done(null, user);
});

// configuration ===============================================================
module.exports = function(app, config) {
  var env = process.env.NODE_ENV || 'development';
  app.locals.ENV = env;
  app.locals.ENV_DEVELOPMENT = env == 'development';
  
  app.set('views', config.root + '/app/views');
  app.set('view engine', 'pug');
  	
  app.use(logger('dev'));
  app.use(bodyParser.json());
  app.use(bodyParser.urlencoded({
    extended: true
  }));
  app.use(cookieParser());
  app.use(session({
    secret: '12349',
    name: 'graphNodeServiceCookie',
    resave: false,
    saveUninitialized: false,
    cookie: {secure: true} //must comment out to work with local
  }));
  app.use(passport.initialize());
  app.use(passport.session());
  app.use(express.static(config.root + '/public'));
  app.use(methodOverride());

  var controllers = glob.sync(config.root + '/app/controllers/*.js');
  controllers.forEach(function (controller) {
    require(controller)(app);
  });

  app.use(function (req, res, next) {
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
  });
  
  if(app.get('env') === 'development'){
    app.use(function (err, req, res, next) {
      res.status(err.status || 500);
      res.render('error', {
        message: err.message,
        error: err,
        title: 'error'
      });
    });
  }

  app.use(function (err, req, res, next) {
    res.status(err.status || 500);
      res.render('error', {
        message: err.message,
        error: {},
        title: 'error'
      });
  });
};
