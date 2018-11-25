const {ObjectID} = require('mongodb');

const {mongoose} = require('./../server/db/mongoose');
const {Todo} = require('./../server/models/todo');
const {User} = require('./../server/models/user');

var TodoId = '6bf83324ad8cb86b6ce0e05a';
var UserId = '5bf1d4859f71b10c111b3614';

if (!ObjectID.isValid(TodoId)) {
  console.log('Todo ID not valid');
};

// https://mongoosejs.com/docs/queries.html

// finds an array of documents, returns an empty array if not found
Todo.find({
  // doesn't require you to pass in object, mongoose does it for you
  // we pass in a string and mongoose converts it to an Object id and then it runs the query so we dont have to manually convert our string
  // into an object id
  _id: TodoId
}).then((todos) => {
  console.log('Todos', todos);
});

// gets a single document, returns null if not found
Todo.findOne({
  _id: TodoId
}).then((todo) => {
  console.log('Todo', todo);
});

// gets a single document by Id, returns null if not found
Todo.findById(TodoId).then((todo) => {
  if (!todo) {
    return console.log('Id not found');
  }
  console.log('Todo By Id', todo);
}).catch((e) => {
  // excpetion if the object Id is invalid
  console.log(e);
});

// query the users collection using promises
//User.findById
// case where user is found, not found, and any errors
User.findById(UserId).then((user) => {
  if (!user) {
    return console.log('User not found');
  }
  console.log(JSON.stringify(user, undefined, 2));
}, (e) => {
  // excpetion if the object Id is invalid
  console.log(e);
});
