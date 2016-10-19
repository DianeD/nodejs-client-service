'use strict';

const express = require('express'),
  config = require('./config/config'),
  fs = require('fs'),
  https = require('https');

const app = express();

require('./config/express')(app, config);

app.listen(config.port, function () {
  console.log('Express server listening on port ' + config.port);
});