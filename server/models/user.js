const mongoose = require('mongoose');
const validator = require('validator');
const jwt = require('jsonwebtoken');
const _ = require('lodash');
const bcrypt = require('bcryptjs');

// User
// email - required, trim, string, minlength 1

// UserSchema stores the schema for the user
// Schema constructor function takes an object and on that object we define all the attributes for our document
var UserSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    minLength: 1,
    trim: true,
    unique: true, // cant have 2 documents in the same collection with the same email address
    // https://mongoosejs.com/docs/validation.html#custom-validators
    validate: {
      /*
      validator: (value) => {
        return validator.isEmail(value);
      },
      */
      validator: validator.isEmail,
      message: '{VALUE} is not a valid email'
    }
  },
  password: {
    type: String,
    required: true,
    minlength: 6
  },
  tokens: [{
    access: {
      type: String,
      required: true
    },
    token: {
      type: String,
      required: true
    }
  }]
});

// over-ride method to control what is sent back when a mongoose model is converted into a JSON value
UserSchema.methods.toJSON = function () {
  var user = this;
  // user.toObject is responsible for taking your mongoose variable and converting it into a regular object where only the properties
  // available on the document exist
  var userObject = user.toObject();

  return _.pick(userObject, ['_id', 'email']); // means we leave off the password and the tokens array which should not be returned
};

// add instance methods. instance methods have access to the individual document
// not using an arrow function as arrow functions do not bind a "this" keyword. We need a "this" keyword for our methods
// because the "this" keyword stores the individual document
UserSchema.methods.generateAuthToken = function () {
  // instance methods get called with the individual documents, so lower case user
  var user = this;
  // access token
  var access = 'auth';
  // use ES6 to get the variable access i.e. access: access
  var token = jwt.sign({_id: user._id.toHexString(), access}, 'abc123').toString();

  // user.tokens is empty by default. .push() => push on a new object with these properties - some problems across mongodb versions
  // so we use .concat instead which does the same thing
  // user.tokens.push({access, tokens})
  // update the local user model
  user.tokens = user.tokens.concat([{access, token}]);

  // save it, which returns a promise. in order to let server js return on to the promise we return it here
  return user.save().then(() => {
    return token;
  });
};

// instance method
UserSchema.methods.removeToken = function (token) {
  // $pull lets you remove items from an array that match certain criteria
  var user = this;

  return user.update({
    // pull any token in the array that equals token. not just the token property, the entire object
    $pull: {
      tokens: {
        token: token
      }
    }
  });
};

// .statics means everything you add on to it turns into a model method instead of an instance method
UserSchema.statics.findByToken = function (token) {
  // model methods get called with the model as the this binding
  var User = this;

  var decoded; // create undefined variable because jwt.verify() throws an error if anything goes wrong, so we want to be able to catch the
  // error and do something with it

  try {
    decoded = jwt.verify(token, 'abc123');
  } catch (e) {
    // return a promise that is always going to  reject
    // instead of creating a promise and rejecting it straight away we can call return Promise.reject();
    /*
    return new Promise((resolve, reject) => {
      reject();
    });
    */
    return Promise.reject(); // can pass in text as well if we want which could be used in the (e)
  }

  // we are going to add a return statement so we can add some chaining
  return User.findOne({
    // find a user where the _id and the token property match
    '_id': decoded._id,
    'tokens.token': token,
    'tokens.access': 'auth'
  })


};

// https://mongoosejs.com/docs/middleware.html
// want to run code before a given event, i.e. before the save event
// have to provide the next argument and have to call it inside your function
UserSchema.pre('save', function (next) {
  var user = this;

  // check if the password has been modified
  if (user.isModified('password')) {
    // hash 7 salt the password
    bcrypt.genSalt(10, (err, salt) => {
      bcrypt.hash(user.password, salt, (err, hash) => {
        console.log(hash);
        user.password = hash;
        next();
      });
    });
  } else {
    // call next() and move on
    next();
  }
});

// UserSchema.statics for a model model method instead of an instance method
UserSchema.statics.findByCredentials = function (email, password) {
  var User = this;

  return User.findOne({email}).then((user) => {
    // if we dont get a user we dont want to compare passwords as there is no password to compare
    // if no user return a rejected promise
    if (!user) {
      return Promise.reject();
    }

    // bcrypt only support callbacks not promises, we want to use promises so we implement like this, returning a new promise
    return new Promise((resolve, reject) => {
      // use bcrypt.compare to compare password and user.password
      bcrypt.compare(password, user.password, (err, res) => {
        if (res) {
          console.log('resolve user.');
          resolve(user);
        } else {
          console.log('rejecting: password', password, 'password', user.password)
          reject();
        }
      });
    });
  });
};

// create a new User model
var User = mongoose.model('User', UserSchema);

// mongoose validation
// https://mongoosejs.com/docs/validation.html

/*
{
  email: 'tim@tom.com',
  password: 'abc123',
  tokens: [{
    access: 'auth',
    token: 'akldfjlskjfsklurlekjlsk'
  }]
}
*/

module.exports = {User};
