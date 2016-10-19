'use strict';

const authConfig = require('../../config/auth-config');
const querystring = require('querystring');
const request = require('superagent');
const passport = require('passport');
//const Database = require('../utils/database');

let Auth = function () {};
  
Auth.prototype = {
  // ensureAuthenticated: function (req) {
  //   if (req.isAuthenticated()) { return true; }
  //   return false;
  // },
  getAccessToken: function(user) {
    let accessToken = user.accessToken;

    // Check access token expiry. 
    // If the token is expired or about to expire (within five minutes), get a new one.     
    let tokenValidUntil = new Date();
    tokenValidUntil.setTime((user.tokenExpires - 300) * 1000); 
    // if (user.tokenExpires <= tokenValidUntil) {
    //   accessToken = this.refreshAccessToken(user);
    // }
    return accessToken; //need to await if refresh 
  },
  login: function(req, res, loginHint) {
    var authorizeUrl = authConfig.params.authority + authConfig.params.authorizeEndpoint
      + '?client_id=' + authConfig.params.appId
      + '&response_type=' + authConfig.params.responseType
      + '&redirect_uri=' + authConfig.params.redirectUrl
      + '&scope=' + authConfig.params.scope
    if (loginHint) { authorizeUrl += authorizeUrl + '&login_hint=' + loginHint; }
    res.redirect(authorizeUrl);
  },
  getTokenFromCode: function(req, res) {
    let self = this;
    let res1 = res;
    let user = req.user;
    //let user = Database.users.findOne({ 'sessionId' : req.sessionID });
    const postData = querystring.stringify({
      client_id: authConfig.params.appId,
      code: req.query.code,
      redirect_uri: authConfig.params.redirectUrl,
      grant_type: 'authorization_code',
      client_secret: authConfig.params.appSecret
    });

     request
      .post(authConfig.params.authority + authConfig.params.tokenEndpoint)      
      .send(postData)
      .type('application/x-www-form-urlencoded')
      .set('Content-Length', Buffer.byteLength(postData))
      .end(function(err, res){
        if (!err) {
          let tokenInfo = res.body;        
          let segments = tokenInfo.id_token.split('.');
          let microsoftAccountName = self.decodeJwt(segments[1]).preferred_username;

          // Store the user's Microsoft account name.
          // Store token information and then redirect to /journal.
          self.updateTokenInfo(user, tokenInfo, microsoftAccountName);
          res1.redirect('/graph');
        } else res1.render('error', { message: err.message, error: err })
    });
  },
  // validateIssuer: function() {

  // },
  // refreshAccessToken: function (currentUser) {
  //   let self = this;
  //   let user = currentUser;
  //   const postData = querystring.stringify({
  //     client_id: authConfig.params.appId,
  //     refresh_token: currentUser.refreshToken,
  //     redirect_uri: authConfig.params.redirectUrl,
  //     grant_type: 'refresh_token',
  //     client_secret: authConfig.params.appSecret
  //   });

  //    request
  //     .post(authConfig.params.authority + authConfig.params.tokenEndpoint)      
  //     .send(postData)
  //     .type('application/x-www-form-urlencoded')
  //     .set('Content-Length', Buffer.byteLength(postData))
  //     .end(function(err, res){
  //       if (!err) {
  //         let userInfo = res.body;
  //         self.updateTokenInfo(user, userInfo);
  //         return userInfo.access_token;
  //       } else res1.render('err', { error: err })
  //     });
  // },
  updateTokenInfo(user, tokenInfo, microsoftAccountName) {
    user.accessToken = tokenInfo.access_token;
    user.refreshToken = tokenInfo.refresh_token;
    user.tokenExpires = Math.floor((Date.now() / 1000) + tokenInfo.expires_in);
    if (microsoftAccountName) {
      user.microsoftAccountName = microsoftAccountName;
    };
    passport.prototype.users.update(user);
    // Database.users.update(user);
  },
  decodeJwt: function (segment) {
    var buffer = new Buffer(segment, 'base64');
    return JSON.parse(buffer);
  },
  logout: function () {

  }
}

module.exports = Auth;