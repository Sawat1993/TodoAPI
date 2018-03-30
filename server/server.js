const express = require('express');
const bodyparser = require('body-parser');
const { ObjectId } = require('mongodb');

const { mongoose } = require('./db/db');
const { Todo } = require('./model/todo');
const { User } = require('./model/user');

var port = process.env.PORT || 3000;

var app = express();

app.use(bodyparser.json());

app.post('/todos', (req, res) => {
    var todo = new Todo(req.body);

    todo.save().then((doc) => {
        res.send(doc);
    }, (e) => {
        res.status(400).send(e);
    });

});

app.get('/todos', (req, res) => {
    Todo.find().then((docs) => {
        res.send({ docs });//creation object around it to add few more properties later
    }, (e) => { res.status(400).send(e); });
});

app.get('/todos/:id', (req, res) => {
    var id = req.params.id;

    if (ObjectId.isValid(id)) {
        Todo.findById(id).then((doc) => {
            if (doc) {
                res.send({ doc });//creation object around it to add few more properties later
            } else {
                res.status(404).send({ error: 'Todo does not exists' });
            }
        }, (e) => { res.status(400).send(e); });
    } else { res.status(404).send({ error: 'enter valid id' }); }
});

app.listen(port, () => {
    console.log(`Node started at port ${port}`);
});

app.delete('/todos/:id', (req, res) => {
    var id = req.params.id;

    if (ObjectId.isValid(id)) {
        Todo.findByIdAndRemove(id).then((doc) => {
            if (doc) {
                res.send({ doc });//creation object around it to add few more properties later
            } else {
                res.status(404).send({ error: 'Todo does not exists' });
            }
        }, (e) => { res.status(400).send(e); });
    } else { res.status(404).send({ error: 'enter valid id' }); }
});

module.exports.app = app;