const { ObjectId } = require('mongodb');
const jwt = require('jsonwebtoken');

const { Todo } = require('./../../model/todo');
const { User } = require('./../../model/user');

var todoArr = [{ _id: new ObjectId(), text: 'test1' }, { _id: new ObjectId(), text: 'test2' }];

var populateTodos = (done) => {
    Todo.remove({}).then(() => {
        return Todo.insertMany(todoArr);
    }).then(() => done());
};//runs before each test case

module.exports = {
    populateTodos,
    todoArr
};