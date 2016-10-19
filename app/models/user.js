'use strict';

function User (opts) {
  if(!opts) opts = {};
  this.id = opts.id || '';
  this.userName = opts.userName || '';
  this.password = opts.password || '';
  this.displayName = opts.displayName || '';
  this.emailAddress = opts.emailAddress || '';
  this.sessionId = opts.sessionId || null;
  this.microsoftAccountName = opts.microsoftAccountName || null;
  this.accessToken = opts.accessToken || null;
  this.tokenExpiry = opts.tokenExpiry || null;
  this.refreshToken = opts.refreshToken || null;
}

module.exports = User;

