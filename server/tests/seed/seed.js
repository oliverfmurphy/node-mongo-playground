const {ObjectID} = require('mongodb');
const jwt = require('jsonwebtoken');

const {Todo} = require('./../../models/todo');
const {User} = require('./../../models/user');

const userOneId = new ObjectID();
const userTwoId = new ObjectID();

// the array of users we add as our seed data
const users = [{
  // user with authentication tokens
  _id: userOneId,
  email: 'userone@example.com',
  password: 'useronepassword',
  tokens: [{
    access: 'auth',
    token: jwt.sign({_id: userOneId, access: 'auth'}, 'abc123').toString()
  }]
}, {
  // user without authentication tokens
  _id: userTwoId,
  email: 'usertwo@example.com',
  password: 'usertwopassword',
}]

// make up an array of dummy todos
const todos = [{
    _id: new ObjectID(),
    text: 'First test todo'
  }, {
    _id: new ObjectID(),
    text: 'Second test todo',
    completed: true,
    completedAt: 333
}];


const populateTodos = (done) => {
  // make sure the db is empty by removing all the records
  // pass in an empty object to Todo.remove which will wipe all of our todos
  /*
  Todo.remove({}).then(() => done());
  */

  // empty the array then insert todos from the array above
  Todo.remove({}).then(() => {
    return Todo.insertMany(todos);
   }).then(() => done());
};

const populateUsers = (done) => {
  User.remove({}).then(() => {
    // .save returns a promise
    var userOne = new User(users[0]).save();
    var userTwo = new User(users[1]).save();

    // Promise.all takes an array of promises, and .then() callback does not fire until all the promises are resolved
    return Promise.all([userOne, userTwo])
  }).then(() => done());
};

module.exports = {todos, populateTodos, users, populateUsers};
