// pull the mongo client out of the library which lets you connect to a mongo server
// const MongoClient = require('mongodb').MongoClient;

// object destructuring. allows us pull off more things from MongoDB
const {MongoClient, ObjectID} = require('mongodb');

MongoClient.connect('mongodb://localhost:27017/TodoApp', (err, client) => {
  // handle any errors
  if (err){
    // use return to prevent the rest of the code from executing
    return console.log('Unable to connecto to MongoDB server.');
  };

  console.log('Connected to MondgoDB server');
  const db = client.db('TodoApp');

  // toArray, instead of having a cursor we have an array of the documents. returns a promise
  //query all records
  /*
  db.collection('Todos').find().toArray().then((docs) => {
    // when things go right
    console.log('Todos');
    console.log(JSON.stringify(docs, undefined, 2));
  }, (err) => {
    // when things go wrong
    console.log('Unable to fetch todos', err);
  });
  */

  //query records for a particular _id
  // {completed: false}
  /*
  db.collection('Todos').find({
    _id: new ObjectID('5beda3dc0eb92c9b2184b2dc')
  }).toArray().then((docs) => {
    // when things go right
    console.log('Todos');
    console.log(JSON.stringify(docs, undefined, 2));
  }, (err) => {
    // when things go wrong
    console.log('Unable to fetch todos', err);
  });
  */

  //count all records
  db.collection('Todos').find().count().then((count) => {
    // when things go right
    console.log(`Todos count: ${count}`);
  }, (err) => {
    // when things go wrong
    console.log('Unable to fetch todos', err);
  });

  // count of Users records matching a certain name
  db.collection('Users').find({name: 'Oliver Murphy'}).count().then((count) => {
    // when things go right
    console.log(`Users count: ${count}`);
  }, (err) => {
    // when things go wrong
    console.log('Unable to fetch Users', err);
  });

  // print of Users records matching a certain name
  db.collection('Users').find({name: 'Oliver Murphy'}).toArray().then((docs) => {
    // when things go right
    console.log(JSON.stringify(docs, undefined, 2));
  }, (err) => {
    // when things go wrong
    console.log('Unable to fetch Users', err);
  });

  // client.close();
});
