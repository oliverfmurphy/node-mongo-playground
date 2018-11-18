var mongoose = require('mongoose');

// tell mongo which library of promises we want to use
// use the built in promise library and not some 3rd party one
mongoose.Promise = global.Promise;
mongoose.connect('mongodb://localhost:27017/TodoApp');

// create a new Todo model
/*
var Todo = mongoose.model('Todo', {
  text: {
    type: String,
    required: true,
    minLength: 1,
    trim: true
  },
  completed: {
    type: Boolean,
    default: false
  },
  completedAt: {
    type: Number,
    default: null
  }
});
*/

// create a new instance of Todo
// creating an instance is not enough to save it to the database, we have to save it also (below)
/*
var newTodo = new Todo({
  text: 'Cook dinner'
});
*/

// save it to the mongo db
/*
newTodo.save().then((doc) => {
  console.log('Saved todo', doc);
}, (e) => {
  console.log('Unable to save todo');
});
*/

/*
var otherTodo = new Todo({
  text: 'Eat dinner',
  completed: true,
  completedAt: 123
});

otherTodo.save().then((doc) => {
  console.log(JSON.stringify(doc, undefined, 2));
}, (e) => {
  console.log('Unable to save', e);
});
*/

// User
// email - required, trim, string, minlength 1

// create a new User model
var User = mongoose.model('User', {
  email: {
    type: String,
    required: true,
    minLength: 1,
    trim: true
  }
});

var user = new User({
  email: 'tim@tom.com'
});

user.save().then((doc) => {
  console.log(JSON.stringify(doc, undefined, 2));
}, (e) => {
  console.log('Unable to save', e);
});
