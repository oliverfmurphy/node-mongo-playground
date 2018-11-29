const {ObjectID} = require('mongodb');

const {mongoose} = require('./../server/db/mongoose');
const {Todo} = require('./../server/models/todo');
const {User} = require('./../server/models/user');

// remove mll documents
// we dont get a result back saying what docs were removed, we just get told how many were removed
/*
Todo.remove({}).then((result) => {
  console.log(result);
});
*/

// find one and remove
// we get information back about the document that was being removed
// takes in the query object
/*
Todo.findOneAndRemove({_id: '5bfc245b5fbdb263c4195d8e'}).then((todo) => {
  // print the todo to the console
  console.log('todo');
});
*/

// remove document by Id
// the callback gets the document back
Todo.findByIdAndRemove('5bfc245b5fbdb263c4195d8e').then((todo) => {
  // print the todo to the console
  console.log('todo');
});
