const expect = require('expect');
const request = require('supertest');
const {ObjectID} = require('mongodb');

const {app} = require('./../server');
const {Todo} = require('./../models/todo');

console.log('server.test.js env [', process.env.NODE_ENV, '], PORT [', process.env.PORT, '], MONGODB_URI [', process.env.MONGODB_URI || '].');

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

// add a testing lifecycle method
beforeEach((done) => {
  console.log('Oli temp 1');
  // make sure the db is empty by removing all the records
  // pass in an empty object to Todo.remove which will wipe all of our todos
  /*
  Todo.remove({}).then(() => done());
  */

  // empty the array then insert todos from the array above
  Todo.remove({}).then(() => {
    console.log('Oli temp 2');
    return Todo.insertMany(todos);
   }).then(() => done());
});

// create describe block and add test cases
describe('POST /todos', () => {
  // first test verifies that when we send the appropriated data everything goes as expected
  // takes done argument as this is going to be an asynchronous test
  // have to specify done otherwise the test will not work as expected
  it('should create a new todo', (done) => {
    var text = 'Test todo text';
console.log('Oli temp 3');
    // make GET request through supertest
    request(app)
      .post('/todos') // set up a post request
      .send({text}) // send data with the request, object gets converted to JSON by supertest
      // now make assertions about the request
      .expect(200)
      // custom expect assertion
      .expect((res) => {
        expect(res.body.text).toBe(text);
      })
      // call end to wrap things up
      // want to check what got stored in mongodb, instead of passing in done we pass in a function
      // function is called with an error and a response
      .end((err, res) => {
        if (err) {
          // if error exists pass it into done. this will wrap up the test printing the error to the screen
          // returning it stops the function execution
          console.log('Oli temp 4');
          return done(err);
        }

        // fetch all the todos and then execute a then callback and make some assertions about that
        // Todo.find().then((todos) => {
        //Find the todos that match the text
        Todo.find({text}).then((todos) => {
          expect(todos.length).toBe(1); // assume to be a length of 1
          expect(todos[0].text).toBe(text); // assume the first and only record to be equal to text
          console.log('Oli temp 5');
          done();
        }).catch((e) => done(e)); // catch any errors that may occur inside of our callback
      });
  });

  it('should not create a Todo with invalid body data', (done) => {
    // make GET request through supertest
    request(app)
      .post('/todos') // set up a post request
      .send({}) // send empty object with the request
      // now make assertions about the request
      .expect(400)
      // call end to wrap things up
      // want to check what got stored in mongodb, instead of passing in done we pass in a function
      // function is called with an error and a response
      .end((err, res) => {
        if (err) {
          // if error exists pass it into done. this will wrap up the test printing the error to the screen
          // returning it stops the function execution
          return done(err);
        }

        // fetch all the todos and then execute a then callback and make some assertions about that
        Todo.find().then((todos) => {
          expect(todos.length).toBe(2); // assume to be a length of 2
          done();
        }).catch((e) => done(e)); // catch any errors that may occur inside of our callback
      });
  });

  describe('GET /todos', () => {
    it('should get all todos', (done) => {
      request(app)
        .get('/todos')
        // make assertions about what comes back
        .expect(200)
        .expect((res) => {
          expect(res.body.todos.length).toBe(2);
        })
        .end(done);
    });
  });

  describe('GET /todos/:id', () => {
    // we need the ids so we will create the ids above in the test case
    it('should return todo doc', (done) => {
      request(app)
        // convert the object ID to a string using toHexString()
        .get(`/todos/${todos[0]._id.toHexString()}`)
        .expect(200)
        .expect((res) => {
          expect(res.body.todo.text).toBe(todos[0].text)
        })
        .end(done)
    });

    it('should return 404 if todo not found', (done) => {
      // convert the object ID to a string using toHexString()
      var hexId = new ObjectID().toHexString();
      request(app)
        .get(`/todos/${hexId}`)
        .expect(404)
        .end(done)
    });

    it('should return 404 for non object IDs', (done) => {
      request(app)
        .get(`/todos/123abc`)
        .expect(404)
        .end(done)
    });
  });

  describe('DELETE /todos/:id', () => {
    it('should remove a todo', (done) => {
      // get the Id of the second object in the array
      var hexId = todos[1]._id.toHexString();

      request(app)
        .delete(`/todos/${hexId}`)
        .expect(200)
        // custome expect call
        .expect((res) => {
          expect(res.body.todo._id).toBe(hexId);
        })
        .end((err, res) => {
          if (err) {
            return done(err);
          }

          // query database using findById toNotExist
          Todo.findById(hexId).then((todo) => {
            expect(todo).toBeFalsy();
            done();
          }).catch((e) => done(e));
        });
    });

    it('should return 404 if todo not found', (done) => {
    // convert the object ID to a string using toHexString()
    var hexId = new ObjectID().toHexString();
    request(app)
      .delete(`/todos/${hexId}`)
      .expect(404)
      .end(done);
    });

    it('should return 404 if object id is invalid', (done) => {
      request(app)
        .delete(`/todos/123abc`)
        .expect(404)
        .end(done);
    });

  });

  describe('PATCH /todos/:id', () => {
    it ('should update the todo', (done) => {
      // grab id of first item
      var hexId = todos[0]._id.toHexString();
      var text = 'Test PATCH #1';


      // make GET request through supertest
      request(app)
        // convert the object ID to a string using toHexString()
        .patch(`/todos/${hexId}`)
        .send({text,
              completed: true}) // send data with the request, object gets converted to JSON by supertest
        .expect(200)
        .expect((res) => {
          expect(res.body.todo.text).toBe(text);
          expect(res.body.todo.completed).toBe(true);
          expect(typeof res.body.todo.completedAt).toBe('number');
        })
        .end(done);
    });

    it ('should clear completedAt when todo is not completed', (done) => {
      // grab id of second item
      // update the text, set completed to false
      // 200
      // text is changed, completed is false, completedAt is null (toNotExist)

      // grab id of second item
      var hexId = todos[1]._id.toHexString();
      var text = 'Test PATCH #2';

      // make GET request through supertest
      request(app)
        // convert the object ID to a string using toHexString()
        .patch(`/todos/${hexId}`)
        .send({text,
              completed: false}) // send data with the request, object gets converted to JSON by supertest
        .expect(200)
        .expect((res) => {
          expect(res.body.todo.text).toBe(text);
          expect(res.body.todo.completed).toBe(false);
          expect(res.body.todo.completedAt).toBeFalsy();
        })
        .end(done)
    });

  });

});
