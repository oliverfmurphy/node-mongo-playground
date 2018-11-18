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

  //deleteMany
  /*
  db.collection('Todos').deleteMany({text : 'another sample task'}).then((result) => {
    console.log(result);
  });
  // result
  /*
  CommandResult {
  result: { n: 3, ok: 1 },
  connection:
  */

  //deleteOne
  /*
  db.collection('Todos').deleteOne({text : 'another sample task'}).then((result) => {
    console.log(result);
  });
  // Result:
  /*
  CommandResult {
  result: { n: 1, ok: 1 },
  connection:
  */


  //findOneAndDelete
  // get the data back as well as deleting it
  db.collection('Todos').findOneAndDelete({completed : true}).then((result) => {
    console.log(result);
  });
  // result
  /*
  { lastErrorObject: { n: 1 },
  value:
   { _id: 5beda6150eb92c9b2184b31e,
     text: 'sample done task',
     completed: true },
  ok: 1 }
  */

  // client.close();
});
