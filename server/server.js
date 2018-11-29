const _ = require('lodash');
const express = require('express');
const bodyParser = require('body-parser');
const {ObjectID} = require('mongodb');

var {mongoose} = require('./db/mongoose');
var {Todo} = require('./models/todo');
var {User} = require('./models/user');

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
/*
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
*/


var app = express();
// a variable that may or not be set, will be set if the app is running on heroku and wont be set if it is running locally
const port = process.env.PORT || 3000;

app.use(bodyParser.json());

// post
app.post('/todos', (req, res) => {
  console.log(req.body);
  var todo = new Todo({
    text: req.body.text
  });

  todo.save().then((doc) => {
    res.send(doc);
  }, (e) => {
    // send a http 400 response
    console.log(e);
    res.status(400).send(e);
  });
});

// get all todos
app.get('/todos', (req, res) => {
  Todo.find().then((todos) => {
    // {todos} is the todos array
    res.send({todos});
  }, (e) => {
    res.status(400).send(e);
  });
});

// GET /todos/12345 etc.
// we need to get a URL parameter, :id creates an id variable on the request object so we can access the variable
app.get('/todos/:id', (req, res) => {
  // send back the request params object
  // res.send(req.params)

  var id = req.params.id
  // validate the Id using isValid
  if (!ObjectID.isValid(id)) {
    console.log('Todo ID not valid');
    // 404 if Id not found - send back an empty body
    return res.status(404).send();
  };

  // findById
  // gets a single document by Id, returns null if not found
  Todo.findById(id).then((todo) => {
    if (!todo) {
     // if no todo - the call did succeed but there was no related call in the collection - send back an empty body
      return res.status(404).send();
    }
    console.log('Todo By Id', todo);
    // success
    // if todo - send it back
    // res.status(200).send(JSON.stringify(todo, undefined, 2));
    // respond with an object that has a todos property and that is the array
    res.send({todo});

  }).catch((e) => {
    // exception if the object Id is invalid
    // 400 - request not valid & send empty body back
    console.log(e);
    return res.status(400).send(e);
  });

});

// create a delete route
app.delete('/todos/:id', (req, res) => {
  var id = req.params.id

  // validate the Id using isValid
  if (!ObjectID.isValid(id)) {
    console.log('Todo ID not valid');
    // 404 if Id not found - send back an empty body
    return res.status(404).send();
  };

  // remove document by Id
  // the callback gets the document back
  Todo.findByIdAndRemove(id).then((todo) => {
    if (!todo) {
     // if no todo - the call did succeed but there was no related call in the collection - send back an empty body
      return res.status(404).send();
    };
    // print the todo to the console
    console.log('todo');
    // respond with an object that has a todos property and that is the array
    res.send({todo}); // equivalent to res.send({todo: todo});
  }).catch((e) => {
    // exception if the object Id is invalid
    // 400 - request not valid & send empty body back
    console.log(e);
    return res.status(400).send(e);
  });
});

// PATCH method for updates
app.patch('/todos/:id', (req, res) => {
  var id = req.params.id;
  // pick takes an array of properties that you want to pull off if they exist
  // if the text property exists then pull that off of request body adding it to body
  var body = _.pick(req.body, ['text', 'completed']);

  // validate the Id using isValid
  if (!ObjectID.isValid(id)) {
    console.log('Todo ID not valid');
    // 404 if Id not found - send back an empty body
    return res.status(404).send();
  };

  // if body.completed is a Boolean and that boolean is true then..
  if (_.isBoolean(body.completed) && body.completed) {
    body.completedAt = new Date().getTime();
  } else {
    body.completed = false;
    body.completedAt = null;
  }

  Todo.findByIdAndUpdate(id, {$set: body}, {new: true}).then((todo) => {
    if (!todo) {
      return res.status(404).send();
    };

    res.send({todo});

  }).catch((e) => {
    res.status(400).send();
  })

});

app.listen(port, () => {
  console.log(`Started on port ${port}`);
});

// set the app object equal to the app variable using the ES6 syntax
module.exports = {app};
