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
const path = require('path');
//const favicon = require('serve-favicon');
const logger = require('morgan');
//var cookieParser = require('cookie-parser');
const https = require('https');
const bodyParser = require('body-parser');
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const OIDCStrategy = require('passport-azure-ad').OIDCStrategy;
const Database = require('./utils/database');
const config = require('./utils/config');
const uuid = require('uuid');

// Configure the local strategy for use by Passport.
passport.use(new LocalStrategy(
  (username, password, done) => {
    const user = Database.users.findOne({ 'username' : username });
    if (!user || user.password !== password) { return done(null, false); }

    // User found. Save userToken and return the user.
    user.userToken = uuid.v4();
    Database.users.update(user);
    return done(null, user);
  }));

//let callback = (req, iss, sub, profile, accessToken, refreshToken, expires_in, done) => {  
//let callback = (iss, sub, profile, accessToken, refreshToken, done) => {
let callback = (token, done) => {
  let user = req.user;
  if (!!profile && !!accessToken && !!refreshToken && !!expires_in) {
    user.microsoftAccountName = profile._json.preferred_username;
    user.accessToken = accessToken;
    user.refreshToken = refreshToken;
    user.tokenExpires = Math.floor((Date.now() / 1000) + expires_in.expires_in);
  }
  Database.users.update(user);
	done(null, {
    user
	})
};

//  *   function(token, done) {
//  *     User.findById(token.sub, function (err, user) {
//  *       if (err) { return done(err); }
//  *       if (!user) { return done(null, false); }
//  *       return done(null, user, token);
//  *     });
//  *   }

// Configure the Azure AD strategy for use by Passport.
passport.use(new OIDCStrategy(config.creds, callback));

passport.serializeUser((user, done) => {
  let id = user.id || user.user.id;
  done(null, id);
});

passport.deserializeUser(function(id, done) {
  let user = Database.users.findOne({ 'id' : id });
  //if (err) { return done(err); }
  done(null, user);
});

const home = require('./routes/index');
const graph = require('./routes/graph-api');

const app = express();

const env = process.env.NODE_ENV || 'development';
app.locals.ENV = env;
app.locals.ENV_DEVELOPMENT = env == 'development';

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

// app.use(favicon(__dirname + '/public/img/favicon.ico'));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
  extended: true
  
}));
//app.use(cookieParser());
app.use(session({
  secret: '12349',
  name: 'graphNodeServiceCookie',
  resave: false,
  saveUninitialized: false,
  //cookie: {secure: true} //while working with http in development
}));
app.use(passport.initialize());
app.use(passport.session());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', home);
app.use('/graph', graph);
app.use('/graph', router);

/// catch 404 and forward to error handler
app.use(function(req, res, next) {
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
});

/// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
    app.use(function(err, req, res, next) {
        res.status(err.status || 500);
        res.render('error', {
            message: err.message,
            error: err,
            title: 'error'
        });
    });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
        message: err.message,
        error: {},
        title: 'error'
    });
});


module.exports = app;
