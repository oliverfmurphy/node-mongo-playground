const mongoose = require('mongoose');
const validator = require('validator');
const jwt = require('jsonwebtoken');
const _ = require('lodash');
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
    require: true,
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
