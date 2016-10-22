/*
 * Copyright (c) Microsoft. All rights reserved. Licensed under the MIT license.
 * See LICENSE in the project root for license information.
 */

'use strict';

let AuthHelper = () => {};
  
AuthHelper.prototype = {
  ensureAuthenticated: (req) => {

    // Check token expiry. If the token is valid for another 5 minutes, we'll use it.
    let user = req.user;       
    let expiration = new Date();
    expiration.setTime((user.tokenExpires - 300) * 1000); 
    if (req.isAuthenticated())
      if (expiration > new Date()) { return true; }
      else refreshToken(user) 
    return false;
  },
  refreshToken: (user) => { //make sure passport-azure-ad doesn't already handle this
    passport.authentica
  },
  logout: function () { 
    // don't think we need this for this scenario
    // but include it anyway for completeness
  }
}

module.exports = AuthHelper;