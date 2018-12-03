var {User} = require('../models/user');

// middleware function
var authenticate = (req, res, next) => {
  var token = req.header('x-auth');

  // take the token value and find the appropriate value returning it inside your promise callbacks
  User.findByToken(token).then((user) => {
    // if no user then
    if (!user) {
      // by returning a rejected promise here we call the catch(e) below
      return Promise.reject();
    }

    // modify the request object
    // set to user we just found
    req.user = user;
    // set token to the token up aboves
    req.token = token;

    // need to call next so code below will execute
    next();

  }).catch((e) => {
    // send back a 401 as they did not authenticate correctly
    res.status(401).send();
    // dont call next() as we dont want the below code to execute if we got an exception
  });
};

module.exports = {authenticate};
