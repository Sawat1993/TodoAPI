const { ObjectId } = require('mongodb');
const { Todo } = require('./../server/model/todo');
const { mongoose } = require('./../server/db/db');

var id = '6abcb8fa63c1d71cece1cd24';

if (!ObjectId.isValid(id)) {
    console.log('Invalid Id');
}

Todo.find({
    _id: id
}).then((doc) => {
    console.log(doc);
}, (e) => {
    console.log(e);
});

Todo.findOne({
    _id: id
}).then((doc) => {
    console.log(doc);
}, (e) => {
    console.log(e);
});

Todo.findById(id).then((doc) => {
    if (doc) { console.log(doc); } else { console.log('Unable to find Todo'); }
}, (e) => {
    console.log(e);
});