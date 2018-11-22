const expect = require('expect');
const request = require('supertest');

const{app} = require('./../server');
const{Todo} = require('./../models/todo');

// add a testing lifecycle method
// make sure the db is empty
beforeEach((done) => {
  // pass in an empty object to Todo.remove which will wipe all of our todos
  Todo.remove({}).then(() => done());
});

// create describe block and add test cases
describe('POST /todos', () => {
  // first test verifies that when we send the appropriated data everything goes as expected
  // takes done argument as this is going to be an asynchronous test
  // have to specify done otherwise the test will not work as expected
  it('should create a new todo', (done) => {
    var text = 'Test todo text';

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
          return done(err);
        }

        // fetch all the todos and then execute a then callback and make some assertions about that
        Todo.find().then((todos) => {
          expect(todos.length).toBe(1); // assume to be a length of 1
          expect(todos[0].text).toBe(text); // assume the first and only record to be equal to text
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
          expect(todos.length).toBe(0); // assume to be a length of 0 as we are sending in bad data
          done();
        }).catch((e) => done(e)); // catch any errors that may occur inside of our callback
      });
  });
});
