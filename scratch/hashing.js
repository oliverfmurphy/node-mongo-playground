const {SHA256} = require('crypto-js');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
var data = {
  id: 10
};

var token = jwt.sign(data, '123abc'); // 2nd parameter is the salt
// console.log(token); // jwt.io
/*
example
eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MTAsImlhdCI6MTU0Mzc4NzUzOX0.HZNEdG
YhXyIhtghfkta0BgTn21dzsSKi7iA-gH5Vmcs
everything before the first dot is the header
in between 1st and 2nd dot is the payload
after the 2nd dot is the hash which lets us verify the payload was not altered
*/

var decoded = jwt.verify(token, '123abc');
console.log('decoded', decoded);

/*
output:
decoded { id: 10, iat: 1543787902 }
iat is the issued at time
*/

/*
var message = 'Iam user number 3'
var hash = SHA256(message).toString();

console.log(`Message: ${message}`);
console.log(`Hash: ${hash}`);

var data = {
  id: 4
};

var token = {
  data,
  hash: SHA256(JSON.stringify(data) + 'somesecret').toString() // + 'somesecret' is the salt
};
// salting the hash means you add something on to the hash that is unique and changes the value

token.data.id = 5;
token.hash = SHA256(JSON.stringify(token.data)).toString();

var resultHash = SHA256(JSON.stringify(token.data) + 'somesecret').toString();
if (resultHash === token.hash) {
  console.log('Data was not changed');
} else {
  console.log('Data was changed, Do not trust!!');
}
*/

// brcypt
// https://www.npmjs.com/package/bcryptjs

var password = '123abc!';

// hash the password
// first salt it, 2 parameters, the first is the number of rounds you want to generate the salt, the second is a callback

bcrypt.genSalt(10, (err, salt) => {
  bcrypt.hash(password, salt, (err, hash) => {
    console.log(hash);
  });
});

var hashedPassword = '$2a$10$vnaYGmgN5V34OBYxGLKloe0ofrB9EnS8jGFJrB8w8YaAtCILveb1u';

bcrypt.compare(password, hashedPassword, (err, res) => {
  console.log(res);
});
