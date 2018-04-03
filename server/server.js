require('./config/config');

const express = require('express');
const bodyparser = require('body-parser');
const { ObjectId } = require('mongodb');
const _ = require('lodash');

const { mongoose } = require('./db/db');
const { Todo } = require('./model/todo');
const { User } = require('./model/user');

var port = process.env.PORT;

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


app.patch('/todos/:id', (req, res) => {
    var id = req.params.id;

    var body = _.pick(req.body, ['text', 'completed']);

    if (_.isBoolean(body.completed) && body.completed === true) {
        body.completedAt = new Date().getTime();
    } else {
        body.completedAt = null;
    }

    if (ObjectId.isValid(id)) {
        Todo.findByIdAndUpdate(id, { $set: body }, { new: true }).then((doc) => {
            res.send(doc);
        }).catch((e) => {
            res.status(404).send(e);
        });
    } else { res.status(404).send({error: 'Invalid id'})}
});

app.post('/users', (req, res) => {
    var body = _.pick(req.body, ['email', 'password']);
    var user  = new User(body);

    user.save().then((doc) => {
        console.log(user);
        return user.generateAuthToken();
    }).then((token) => {
        res.header('x-auth', token).send(user);
    }).catch((e) => {
        console.log(e);
        res.status(404).send(e);
    });

});

module.exports.app = app;