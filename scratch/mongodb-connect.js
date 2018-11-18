// pull the mongo client out of the library which lets you connect to a mongo server
// const MongoClient = require('mongodb').MongoClient;

// object destructuring. allows us pull off more things from MongoDB
const {MongoClient, ObjectID} = require('mongodb');

// e.g.
/*
var obj = new ObjectID(); // create a new instance of ObjectID
console.log(obj);
*/

// connect to the database
// 2nd parameter is a callback function which will fire after the functions has succeeded or failed
// mongodb:// -> use the mongodb protocol
// localhost:27017 -> host/port
// TodoApp - name of the database - we dont have to create a database first before we start using it. However mongo wont create the database until we start adding stuff to it
// err - error arguement - will exist if an error exists, otherwise it wont
// db - db object
MongoClient.connect('mongodb://localhost:27017/TodoApp', (err, client) => {
  // handle any errors
  if (err){
    // use return to prevent the rest of the code from executing
    return console.log('Unable to connecto to MongoDB server.');
  };

  console.log('Connected to MondgoDB server');
  const db = client.db('TodoApp');
  // insert a new record into a collection
  // add a record to the toDos collection - the only arguement is the string name for the collection you want to insert into
  // you dont need to create the collection in advance
  // insertOne takes 2 parameters, first the key value pairs we want to have on our document & the second a callback function that fires when things fail or go well
  /*
  db.collection('Todos').insertOne({
    text: 'Something to do',
    completed: false
  }, (err, result) => {
    // error handler
    if (err) {
      return console.log('Unable to insert todo', err);
    };

    console.log(JSON.stringify(result.ops, undefined, 2));
  });
  */

  db.collection('Users').insertOne({
    // _id: 123, // if for some reason you wanted to specify the _id
    name: 'Oliver Murphy',
    age: 38,
    location: 'Dublin'
  }, (err, result) => {
    // error handler
    if (err) {
      return console.log('Unable to insert todo', err);
    };

    //console.log(JSON.stringify(result.ops, undefined, 2));
    //console.log(JSON.stringify(result.ops[0]._id, undefined, 2));
    console.log(JSON.stringify(result.ops[0]._id.getTimestamp(), undefined, 2));
  });

  // object destructuring lets you pull out properties from an object using variables
  // e.g.
  /*
  var user = {name: 'andrew', age: 25};
  var {name} = user;
  console.log(name);
  */

  // close the connection to the server
  client.close();
});
