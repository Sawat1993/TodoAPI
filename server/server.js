const express = require('express');
const bodyparser = require('body-parser');

const {mongoose} = require('./db/db');
const {Todo} = require('./model/todo');
const {User} = require('./model/user');

var app = express();

app.use(bodyparser.json());

app.post('/todos',(req, res) => {
    var todo = new Todo(req.body);

    todo.save().then((doc) => {
        res.send(doc);
    },(e) => {
        res.status(400).send(e);
    });

});

app.get('/todos',(req,res) => {
    Todo.find().then((docs) => {
        res.send({docs});//creation object around it to add few more properties later
    },(e) => {res.send(e);})
});

app.listen(3000);

module.exports.app = app;