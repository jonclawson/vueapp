"use strict";

console.log('1.0 ')
const Promise = require("bluebird");
const sqlite3 = require("sqlite3");
const path = require('path');
module.exports = {
  up: function() {
    return new Promise(function(resolve, reject) {
      let db = new sqlite3.Database('./database/app.db');
      db.run(`PRAGMA foreign_keys = ON`);
      db.serialize(function() {
        db.run(`CREATE TABLE if not exists users (
          id INTEGER PRIMARY KEY,
          name TEXT,
          email TEXT,
          company_name TEXT,
          password TEXT
        )`);

        db.run(`CREATE TABLE if not exists stories (
          id INTEGER PRIMARY KEY,
          title TEXT,
          body LONGTEXT
        )`);
        console.log(' up')

      });
      db.close();
    });
  },
  
  down: function() {
    return new Promise(function(resolve, reject) {
      let db = new sqlite3.Database("./database/app.db");
      db.serialize(function() {
        // db.run(`DROP TABLE stories if exists`);
        // db.run(`DROP TABLE users if exists`);
        console.log(' down')
      });
      db.close();
    });
  }
};
