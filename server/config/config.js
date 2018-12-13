// if we are on test process.env.NODE_ENV will be set in package.json, if we are in production it will be set by Heroku and
// we are setting it to development here manually
var env = process.env.NODE_ENV || 'development';

if (env === 'development' || env === 'test') {
  // load in a separate json file which is not part of the git repo
  // when you require JSON it automatically parses it into a Javascript object
  var config = require('./config.json');
  console.log(config);

  // store just the config variables for the current environment
  // when you want to use a variable to access a property you need to use bracket notation
  var envConfig = config[env];

  // Object.keys() takes an object, gets all the keys and returns them in an array
  // forEach loops through an arrays items
  Object.keys(envConfig).forEach((key) => {
    process.env[key] = envConfig[key];
  });
}

/* moved to config.json
if (env === 'development') {
  process.env.PORT = 3000;
  // process.env.MONGODB_URI = 'mongodb://localhost:27017/TodoApp';
  // use 127.0.0.1 instead of localhost to prevent  Error: Timeout of 2000ms exceeded. For async tests and hooks, ensure "done()" is called; if returning a Promise, ensure it resolves.
  process.env.MONGODB_URI = 'mongodb://127.0.0.1:27017/TodoApp';
  process.env.NODE_ENV = 'development';
} else if (env === 'test') {
  process.env.PORT = 3000;
  // process.env.MONGODB_URI = 'mongodb://localhost:27017/TodoAppTest'; // Test database
  // use 127.0.0.1 instead of localhost to prevent  Error: Timeout of 2000ms exceeded. For async tests and hooks, ensure "done()" is called; if returning a Promise, ensure it resolves.
  process.env.MONGODB_URI = 'mongodb://127.0.0.1:27017/TodoAppTest'; // Test database
  process.env.NODE_ENV = 'development';
}

console.log('config env [', env, '], PORT [', process.env.PORT, '], MONGODB_URI [', process.env.MONGODB_URI, '].');
*/
