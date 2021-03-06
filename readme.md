-- install the library
npm install mongodb --save


Object ID - 12 byte value
1-4:	Timestamp
5-7	Machine identifiers
8-9	Process identifier
10-12	Counter
You can specify an _id property if you want


Node MongoDB native
https://github.com/mongodb/node-mongodb-native

http://mongodb.github.io/node-mongodb-native/2.2/api/index.html

cursor
http://mongodb.github.io/node-mongodb-native/2.2/api/Cursor.html

collection
http://mongodb.github.io/node-mongodb-native/2.2/api/Collection.html

mongodDB update operators
https://docs.mongodb.com/manual/reference/operator/update/

mongoose
mongoosejs.com

npm install mongoose -- save
npm install body-parser --save
npm install express --save
npm install mongodb --save
npm install lodash --save

install postman
https://www.getpostman.com/download?platform=win64


npm install express

// take a string and transforms it into JSON
npm install body-parse

npm install expect mocha nodemon supertest --save-dev

// kicks off our test suite
npm run test-watch


// Expect
https://jestjs.io/docs/en/expect.html
https://github.com/mjackson/expect
https://www.npmjs.com/package/expect

Heroku
start script in package.json tells heroku how to start the application
set up an engines property to tell Heroku what version of node to use
set up a database with a heroku add on

commands
heroku create
// we want the mlab add-on
// https://elements.heroku.com/addons/mongolab

// get a  list of all the configuration variables for your application
heroku config
output:
$ heroku config
 »   Warning: heroku update available from 7.15.1 to 7.18.9
=== fierce-mesa-74593 Config Vars
MONGODB_URI: mongodb://heroku_w9jqdnrm:teuoi8ino0ombnebo4hjb40ol6@ds119304.mlab.com:19304/heroku_w9jqdnrm

MONGODB_URI is the process.env that the app uses on Heroku

// when you create a heroku application it automatically adds a heroku remote
git push heroku master


// shows you the server logs for your application
heroku logs

https://fierce-mesa-74593.herokuapp.com


NODE_ENV
process.env.NODE_ENV
heroku sets process.env.NODE_ENV === 'production' by default
// production when we run our on heroku
// test when we run our app through mocha
// development environment when we run our app locally

in package.json
"test": "export NODE_ENV=test || SET \"NODE_ENV=test\" && mocha server/**/*.test.js",
export is for linux/osx/unix, SET is for Windows

// validator
// https://www.npmjs.com/package/validator
npm install validator --save


// hashing
npm install crypto-js --save
// not used in the application, used in the scratch examples


JWT JSON Web Token
npm install jsonwebtoken --save
www.jwt.io

bcrypt
https://www.npmjs.com/package/bcryptjs
npm install bcryptjs --save


mongoose middleware
https://mongoosejs.com/docs/middleware.html


// heroku commands to set environment variables in production
heroku config

// heroku config:set takes a key value pair
heroku config:set NAME=Oliver

// heroku config:get lets us get environment variable values
heroku config:get NAME

// heroku config:unset removes an environment variable
heroku config:unset NAME

// set our JWTSIGN environment variable
heroku config:set JWT_SECRET=lajfojifd897jilkjadlf027okajop02eradlf

heroku config:get MONGODB_URI
 »   Warning: heroku update available from 7.15.1 to 7.18.9
mongodb://heroku_w9jqdnrm:teuoi8ino0ombnebo4hjb40ol6@ds119304.mlab.com:19304/heroku_w9jqdnrm
where
mongodb is the protocol
://
heroku_w9jqdnrm is the username
:
teuoi8ino0ombnebo4hjb40ol6 is the password
@
ds119304.mlab.com is the address
:
19304 is the port
/
heroku_w9jqdnrm the database
