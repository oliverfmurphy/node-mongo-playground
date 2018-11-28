var mongoose = require('mongoose');

// tell mongo which library of promises we want to use
// use the built in promise library and not some 3rd party one
mongoose.Promise = global.Promise;
// mongoose.connect('mongodb://localhost:27017/TodoApp');
// if process.env.MONGODB_URI exists then use it, otherwise use localhost
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/TodoApp');


module.exports = {mongoose};
/*
module.exports = {
  mongoose: mongoose
};
*/
