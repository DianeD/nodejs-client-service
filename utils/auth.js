/*
 * Copyright (c) Microsoft. All rights reserved. Licensed under the MIT license.
 * See LICENSE in the project root for license information.
 */

'use strict';

// const authConfig = require('../../config/auth-config');
// const querystring = require('querystring');
// const request = require('superagent');
const Database = require('../utils/database'); //how can I update using passport from here? //why do I need to set this?

let Auth = function () {};
  
Auth.prototype = {
  ensureAuthenticated: function (req) {
    if (req.isAuthenticated()) { return true; } //todo: add expiry check
    return false;
  },
  updateTokenInfo(user, tokenInfo, microsoftAccountName) {
    user.accessToken = tokenInfo.access_token;
    user.refreshToken = tokenInfo.refresh_token;
    user.tokenExpires = Math.floor((Date.now() / 1000) + tokenInfo.expires_in);
    if (microsoftAccountName) {
      user.microsoftAccountName = microsoftAccountName;
    };
    Database.users.update(user);
  },
  logout: function () {

  }
}

module.exports = Auth;