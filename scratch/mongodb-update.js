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

  // mongoDB update operators
  // https://docs.mongodb.com/manual/reference/operator/update/

  //findOneAndUpdate
  db.collection('Todos').findOneAndUpdate({
    _id: new ObjectID('5beb05703ecbf3d6786eec44')
  }, {
    $set: {
      completed: true
    }
  }, {
    // return the updated document not the original document
    returnOriginal: false
  }).then((result) => {
    console.log(result);
  });
  // result:
  /*
  { lastErrorObject: { n: 1, updatedExisting: true },
  value:
   { _id: 5beb05703ecbf3d6786eec44,
     text: 'Something to do',
     completed: true },
  ok: 1 }
  */

  db.collection('Users').findOneAndUpdate({
    _id: new ObjectID('5beb074c832558ce52945c88')
  }, {
    $set: {
      name: 'Paddy New'
    },
    $inc: {
      age: 1
    }
  }, {
    // return the updated document not the original document
    returnOriginal: false
  }).then((result) => {
    console.log(result);
  });

  // client.close();
});
