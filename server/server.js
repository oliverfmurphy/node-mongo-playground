require('./config/config');

const _ = require('lodash');
const express = require('express');
const bodyParser = require('body-parser');
const {ObjectID} = require('mongodb');

var {mongoose} = require('./db/mongoose');
var {Todo} = require('./models/todo');
var {User} = require('./models/user');
var {authenticate} = require('./middleware/authenticate');

console.log('server.js env [', process.env.NODE_ENV, '], PORT [', process.env.PORT, '], MONGODB_URI [', process.env.MONGODB_URI, '].');

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
// a variable that may or not be set, will be set if the app is running on heroku and we are setting it up above when running locally
const port = process.env.PORT; // set above

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
    return res.status(400).send();
  });

});

// create a delete route
app.delete('/todos/:id', (req, res) => {
  var id = req.params.id;

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
    res.status(400).send();
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

// POST /users
// use pick to pick off email and password
app.post('/users', (req, res) => {
  console.log(req.body);

  // pick takes an array of properties that you want to pull off if they exist
  // if the email & password property exists then pull that off of request body adding it to body
  var body = _.pick(req.body, ['email', 'password']);
  /*
  var user = new User({
    email: body.email,
    password: body.password
  });
  */
  var user = new User(body); // equivalent to the above

  // model methods are call on the User object
  // User.findByToken
  // instance methods are called on an individual user
  // user.generateAuthToken

  user.save().then(() => {
    // we can return it as we know we are expecting a chained promise
    return user.generateAuthToken();
  }).then((token) => {
    // when you prefix a header with x- it means you are creating a custom header
    res.header('x-auth', token).send(user);
  }).catch((e) => {
    // send a http 400 response
    console.log(e);
    res.status(400).send(e);
  });
});


// private route, authenticate is the function above
app.get('/users/me', authenticate, (req, res) => {
  // send back the user which is available on req.user
  res.send(req.user);
});


// cant use middleware as we dont have a token, we are trying to get one when we login
app.post('/users/login', (req, res) => {
  console.log(req.body);

  // pick takes an array of properties that you want to pull off if they exist
  // if the email & password property exists then pull that off of request body adding it to body
  var body = _.pick(req.body, ['email', 'password']);

  // if there is no user the catch case is going to get fired
  User.findByCredentials(body.email, body.password).then((user) => {
    console.log('user found');
    // generate a new token and send it back
    return user.generateAuthToken().then((token) => {
      console.log('Sending back user..');
      res.header('x-auth', token).send(user);
    });
  }).catch((e) => {
    console.log('user not found!!');
    console.log('email', body.email, 'password', body.password)
    res.status(400).send();
  });
});

app.listen(port, () => {
  console.log(`Started on port ${port}`);
});

// set the app object equal to the app variable using the ES6 syntax
module.exports = {app};
