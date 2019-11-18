const path = require("path");
const Umzug = require("umzug");

const readline = require('readline').createInterface({
  input: process.stdin,
  output: process.stdout
})
const migration = process.argv[3]
const exp = migration ? new RegExp(`${migration.replace(/\./g, '\.')}$`) : /\.js$/
let umzug = new Umzug({
  logging: function() {
    console.log.apply(null, arguments);
  },
  migrations: {
    path: `./database/migrations`,
    pattern: exp
  },
  upName: "up",
  downName: "down"
});

function logUmzugEvent(eventName) {
  return function(name, migration) {
    console.log(`${name} ${eventName}`);
  };
}
umzug.on("migrating", logUmzugEvent("migrating"));
umzug.on("migrated", logUmzugEvent("migrated"));
umzug.on("reverting", logUmzugEvent("reverting"));
umzug.on("reverted", logUmzugEvent("reverted"));

// this will run your migrations

const up = () => umzug.up().then(console.log("all migrations up"));

// down not working? 
const down = () => umzug.down().then(console.log("all migrations down"));
const going = action => {
  switch (action) {
    case 'down':
      down()
      break;
    case 'up':
      up()
      break;
    default:
      up()
  }
}

const action = process.argv[2] || undefined
if (action) {
  going(action)
}
else {
  readline.question(`Going up or down?`, (action) => {
    console.log(`Going ${action}!`)
    going(action)
    readline.close()
  })
}
