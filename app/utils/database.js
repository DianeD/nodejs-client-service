//https://github.com/techfort/LokiJS/issues/480

'use strict';

let
  loki = require('lokijs'),
  db  = new loki('../models/users.json', {
    autoload: true,
    autoloadCallback: loadDbHandler
  }),
  users
;

function loadDbHandler() {
  users = db.getCollection('users');

  if (users === null) {
    users = db.addCollection('users');
    users.insert({ "id": 1, "username": "adarrow", "displayName": "Alex Darrow", "password": "a"}); //test user
  }

  Database.users = users;
}

let Database = function () {};

module.exports = Database;