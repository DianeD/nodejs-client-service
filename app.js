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
const router = express.Router();
const session = require('express-session');
const logger = require('morgan');
const cookieParser = require('cookie-parser');
const https = require('https');
const bodyParser = require('body-parser');
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const OIDCStrategy = require('passport-azure-ad').OIDCStrategy;
const database = require('./utils/database');
const config = require('./utils/config');
const uuid = require('uuid');

// Configure the local strategy for local db access by Passport.
passport.use(new LocalStrategy(
  (username, password, done) => {
    const user = database.users.findOne({ 'username' : username });
    if (!user || user.password !== password)
      return done(null, false);

    // User found, so add a userToken.
    user.userToken = uuid.v4();
    database.users.update(user);
    return done(null, user);
  }));

let callback = (req, iss, sub, profile, accessToken, refreshToken, done) => {
  // does double hop
  // need some way to get username or userToken
  const user = database.users.findOne({ 'displayName': profile.displayName });
  if (user) {
    user.microsoftAccountName = profile._json.preferred_username;
    user.accessToken = accessToken;
    user.refreshToken = refreshToken;
    user.tokenExpires = profile._json.exp;
  }
  database.users.update(user);
	done(null, { user })
};

// Configure the Azure AD strategy for use by Passport.
passport.use(new OIDCStrategy(config.creds, callback));

passport.serializeUser((user, done) => {
  let id = user.id || user.user.id;
  done(null, id);
});

passport.deserializeUser(function(id, done) {
  let user = database.users.findOne({ 'id' : id });
  done(null, user);
});

const index = require('./routes/index');
const graph = require('./routes/graph-api');

const app = express();

const env = process.env.NODE_ENV || 'development';
app.locals.ENV = env;
app.locals.ENV_DEVELOPMENT = env == 'development';

app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
  extended: true
}));
app.use(cookieParser());
app.use(session({
  secret: '12349',///what should these be?
  name: config.cookieName,
  resave: false,
  saveUninitialized: false,
  //cookie: {secure: true} //while working with http in development todo: test https
}));
app.use(passport.initialize());
app.use(passport.session());

app.use('/', index);
app.use('/graph', graph);

/// catch 404 and forward to error handler
app.use(function(req, res, next) {
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
});

// error handlers
// development error handler
if (app.get('env') === 'development') {
    app.use(function(err, req, res, next) {
      res.status(err.status || 500);
      res.send(err.stack || '');
    });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
  res.status(err.status || 500);
  res.send(err.message);
});

module.exports = app;
