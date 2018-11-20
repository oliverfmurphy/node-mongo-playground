var mongoose = require('mongoose');

// User
// email - required, trim, string, minlength 1

// create a new User model
var User = mongoose.model('User', {
  email: {
    type: String,
    required: true,
    minLength: 1,
    trim: true
  }
});

module.exports = {User};
