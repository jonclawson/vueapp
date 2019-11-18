"use strict";

console.log('1.1')

const Promise = require("bluebird");
const sqlite3 = require("sqlite3");
const path = require('path');
module.exports = {
  up: function() {
    return new Promise(function(resolve, reject) {
      let db = new sqlite3.Database('./database/app.db');
      db.run(`PRAGMA foreign_keys = ON`);
      db.serialize(function() {
        db.run(`ALTER TABLE stories ADD COLUMN favorite BOOLEAN`);
        console.log(' up')

      });
      db.close();
    });
  },
  
  down: function() {
    return new Promise(function(resolve, reject) {
      let db = new sqlite3.Database("./database/app.db");
      db.serialize(function() {
        db.run(`CREATE TABLE if not exists stories (
            id INTEGER PRIMARY KEY,
            title TEXT,
            body LONGTEXT
          )`);
        console.log(' down')
      });
      db.close();
    });
  }
};
