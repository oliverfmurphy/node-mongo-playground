const expect = require('expect');
const request = require('supertest');
const {ObjectID} = require('mongodb');

const {app} = require('./../server');
const {Todo} = require('./../models/todo');
const {User} = require('./../models/user');
const {todos, populateTodos, users, populateUsers} = require('./seed/seed');

console.log('server.test.js env [', process.env.NODE_ENV, '], PORT [', process.env.PORT, '], MONGODB_URI [', process.env.MONGODB_URI || '].');

// if you see TypeError: expect(...).toExist is not a function
// it because the expect assertion library has changed ownership. It was handed over to the Jest team, who in their infinite wisdom,
// created a new API. You must now use 'toBeTruthy()' instead of 'toExist()'.

// if you see an error like TypeError: expect(...).toNotBe is not a function
// you need to use expect(X).not.toBe(Y); instead

// if you see an error like TypeError: expect(...).toInclude is not a function
// you must use toMatchObject(...) instead of toInclude


// add a testing lifecycle method
beforeEach(populateUsers);
beforeEach(populateTodos);

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
        // Todo.find().then((todos) => {
        // Find the todos that match the text
        Todo.find({text}).then((todos) => {
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
          expect(todos.length).toBe(2); // assume to be a length of 2
          done();
        }).catch((e) => done(e)); // catch any errors that may occur inside of our callback
      });
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
        expect(res.body.todo.text).toBe(todos[0].text);
      })
      .end(done);
  });

  it('should return 404 if todo not found', (done) => {
    // convert the object ID to a string using toHexString()
    var hexId = new ObjectID().toHexString();
    request(app)
      .get(`/todos/${hexId}`)
      .expect(404)
      .end(done);
  });

  it('should return 404 for non object IDs', (done) => {
    request(app)
      .get(`/todos/123abc`)
      .expect(404)
      .end(done);
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
      .end(done);
  });

});

describe('GET /users/me', () => {
  it('should return a user if authenticated', (done) => {
    request(app)
      .get('/users/me')
      // set a header in super test
      .set('x-auth', users[0].tokens[0].token)
      .expect(200)
      // custom expect function
      .expect((res) => {
        expect(res.body._id).toBe(users[0]._id.toHexString());
        expect(res.body.email).toBe(users[0].email);
      })
      .end(done);
  });

  it('should return 401 if not authenticated', (done) => {
    // dont provide an x-auth token and expect a 401
    // the body should be equal to an empty object, need to use toEqual() and not toBe()
    request(app)
      .get('/users/me')
      .expect(401)
      // custom expect function
      .expect((res) => {
        expect(res.body).toEqual({});
      })
      .end(done);
  });

});

describe('POST /users', () => {
  it('should create a user', (done) => {
    var email = 'example@example.com';
    var password = '123xyz!';

    request(app)
      .post('/users')
      .send({email, password})
      .expect(200)
      .expect((res) => {
        // because x-auths has a hyphen we cannot use .notation as it would be invalid, have to use brackets instead
        expect(res.headers['x-auth']).toBeTruthy();
        expect(res.body._id).toBeTruthy();
        expect(res.body.email).toBe(email);
      })
      .end((err) => {
        if (err) {
          return done(err);
        }

        // see if we can find a user
        User.findOne({email}).then((user) => {
          expect(user).toBeTruthy();
          // expect the password to be different as it should have been hashed
          expect(user.password).not.toBe(password);
          done();
        }).catch((e) => {
          done(e);
        });

      });
  });

  it('should return validation errors if request invalid', (done) => {
    // expect a 400 back if invalid email and invalid password
    request(app)
      .post('/users')
      .send({
        email: 'and',
        password: '123'
      })
      .expect(400)
      .end(done);
  });

  it('should not create user if email in use', (done) => {
    // expect a 400 response
    request(app)
      .post('/users')
      .send({
        email: users[0].email,
        password: 'Password123!'
      })
      .expect(400)
      .end(done);
  });
});

describe('POST /users/login', () => {
  it('should login user and return auth token', (done) => {
    request(app)
      .post('/users/login')
      .send({
        email: users[1].email,
        password: users[1].password
      })
      .expect(200)
      // verify that an x-auth token was sent back as a header
      .expect((res) => {
        expect(res.headers['x-auth']).toBeTruthy();
      })
      // call end and set up custom async function so we can query the database
      .end((err, res) => {
        if (err) {
          return done(err);
        }

        User.findById(users[1]._id).then((user) => {
          // assert that the x-auth token that came back was added into the tokens array
          expect(user.tokens[0]).toMatchObject({
            access: 'auth',
            token: res.headers['x-auth']
          });
          done();
        }).catch((e) => done(e));
      });
  });

  it('should reject invalid login', (done) => {
    request(app)
      .post('/users/login')
      .send({
        email: users[1].email,
        password: 'notavalidpassword'
      })
      .expect(400)
      // verify that an x-auth token was not sent back as a header
      .expect((res) => {
        expect(res.headers['x-auth']).toBeFalsy();
      })
      // call end and set up custom async function so we can query the database
      .end((err, res) => {
        if (err) {
          return done(err);
        }

        User.findById(users[1]._id).then((user) => {
          // assert that the length of the array is 0
          expect(user.tokens.length).toBe(0);
          done();
        }).catch((e) => done(e));
      });
  });
});

describe('DELETE /users/me/token', () => {
  it('should remove auth token on logout', (done) => {
    // make a DELETE request
    // set x-auth equal to token
    // 200
    // Find user and verify tokens array has length of zero
    request(app)
      .delete('/users/me/token')
      .set('x-auth', users[0].tokens[0].token)
      .expect(200)
      // call end and set up custom async function so we can query the database
      .end((err, res) => {
        if (err) {
          return done(err);
        }

        User.findById(users[0]._id).then((user) => {
          // assert that the length of the array is 0
          expect(user.tokens.length).toBe(0);
          done();
        }).catch((e) => done(e));
      });
  });
});
