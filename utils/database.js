/*
 * Copyright (c) Microsoft. All rights reserved. Licensed under the MIT license.
 * See LICENSE in the project root for license information.
 */

/*
 * https://github.com/techfort/LokiJS/issues/480
 */

'use strict';

let
  loki = require('lokijs'),
  db  = new loki('../models/users.json', { //not sure how this file is being used
    autoload: true,
    autoloadCallback: loadDbHandler
  }),
  users
;

function loadDbHandler() {
  users = db.getCollection('users');

  if (users === null) {
    users = db.addCollection('users');
    users.insert({ "id": "a733a26a-8d2d-4d84-b974-9e3d5bae74e8", "username": "adarrow", "displayName": "Alex Darrow", "password": "pass@word1"}); //insert a test user
  }

  database.users = users;
}

let database = function () {};

module.exports = database;