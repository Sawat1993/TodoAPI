const jwt = require('jsonwebtoken');

var data = {
    id: 10
};

var token = jwt.sign(data, 'salt string');
console.log(token);

var decode = jwt.verify(token, 'salt string');
console.log(decode);