/*
 * Copyright (c) Microsoft. All rights reserved. Licensed under the MIT license.
 * See LICENSE in the project root for license information.
 */

'use strict';

let Auth = function () {};
  
Auth.prototype = {
  ensureAuthenticated: function (req) {

    // Check token expiry. If the token is valid for another 5 minutes, we'll use it.
    let user = req.user;       
    let expiration = new Date();
    expiration.setTime((user.tokenExpires - 300) * 1000); 
    if (req.isAuthenticated() && expiration > new Date()) { return true; }
    return false;
  },
  logout: function () { // do we need this for this scenario?

  }
}

module.exports = Auth;