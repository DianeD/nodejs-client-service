/*
 * Copyright (c) Microsoft. All rights reserved. Licensed under the MIT license.
 * See LICENSE in the project root for license information.
 */

'use strict';

const config = require('./config');
//const passport = require('passport');

let authHelper = () => {
  refreshToken = (user) => { //make sure passport-azure-ad doesn't already handle this
    let token = user.refreshToken;
      //passport.authenticate();//make sure this updates access token, refresh token, and expiration
  }
};
  
authHelper.prototype = {
  ensureAuthenticated: (req) => {

    // Check token expiry. If the token is valid for another 5 minutes, we'll use it.
    let user = req.user;       
    let expiration = new Date();
    expiration.setTime((user.tokenExpires - 300) * 1000); 
    if (req.isAuthenticated())
      if (expiration > new Date()) { return true; }
      else this.refreshToken(user) 
    return false;
  },
  refreshAccessToken: (req) => {
    var stop = '';
  }
}

module.exports = authHelper;