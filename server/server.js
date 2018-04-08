require('./config/config');

const express = require('express');
const bodyparser = require('body-parser');
const { ObjectId } = require('mongodb');
const _ = require('lodash');

const { mongoose } = require('./db/db');
const { Todo } = require('./model/todo');
const { User } = require('./model/user');
const { authenticate } = require('./middleware/authenticate');

var port = process.env.PORT;

var app = express();

app.use(bodyparser.json());

app.post('/todos', authenticate, (req, res) => {
    var todo = new Todo({
        text: req.body.text,
        _creator: req.user._id
    });

    todo.save().then((doc) => {
        res.send(doc);
    }, (e) => {
        res.status(400).send(e);
    });

});

app.get('/todos',authenticate, (req, res) => {
    Todo.find({_creator: req.user._id}).then((docs) => {
        res.send({ docs });//creation object around it to add few more properties later
    }, (e) => { res.status(400).send(e); });
});

app.get('/todos/:id', authenticate, (req, res) => {
    var id = req.params.id;

    if (ObjectId.isValid(id)) {
        Todo.findOne({
            _id: id,
            _creator: req.user._id
        }).then((doc) => {
            if (doc) {
                res.send({ doc });//creation object around it to add few more properties later
            } else {
                res.status(404).send({ error: 'Todo does not exists' });
            }
        }, (e) => { res.status(400).send(e); });
    } else { res.status(404).send({ error: 'enter valid id' }); }
});


app.delete('/todos/:id',authenticate, (req, res) => {
    var id = req.params.id;

    if (ObjectId.isValid(id)) {
        Todo.findOneAndRemove({
            _id: id,
            _creator: req.user._id
        }).then((doc) => {
            if (doc) {
                res.send({ doc });//creation object around it to add few more properties later
            } else {
                res.status(404).send({ error: 'Todo does not exists' });
            }
        }, (e) => { res.status(400).send(e); });
    } else { res.status(404).send({ error: 'enter valid id' }); }
});


app.patch('/todos/:id', authenticate,  (req, res) => {
    var id = req.params.id;

    var body = _.pick(req.body, ['text', 'completed']);

    if (_.isBoolean(body.completed) && body.completed === true) {
        body.completedAt = new Date().getTime();
    } else {
        body.completedAt = null;
    }

    if (ObjectId.isValid(id)) {
        Todo.findOneAndUpdate({
            _id: id,
            _creator: req.user._id
        }, { $set: body }, { new: true }).then((doc) => {
            res.send(doc);
        }).catch((e) => {
            res.status(404).send(e);
        });
    } else { res.status(404).send({ error: 'Invalid id' }) }
});

app.post('/users', (req, res) => {
    var body = _.pick(req.body, ['email', 'password']);
    var user = new User(body);

    user.save().then((doc) => {
        return user.generateAuthToken();//we can also call it by doc.generateAuthToken() because doc is alsi instance of user schema
    }).then((token) => {
        res.header('x-auth', token).send(user);
    }).catch((e) => {
        res.status(404).send(e);
    });

});

app.get('/users/me', authenticate, (req, res) => {
    res.send(req.user);
});

app.post('/users/login', (req, res) => {

    User.findByEmail(req.body.email, req.body.password).then((user) => {
        // userObj = new User(user);
        // userObj.generateAuthToken().then((token) => {
        //     res.header('x-auth', token).send(userObj);
        // })//This will create new istance of the model with user details which will be new so isModified will be true and it will hash the password again
        user.generateAuthToken().then((token) => {
            res.header('x-auth', token).send(user);
        })
    }).catch((e) => {
        res.status(404).send(e);
    })
});

// app.delete('users/me/token',authenticate , (req, res) => {
//     req.user.removeToken(req.token).then(() => {
//         res.send();
//     }).catch((e) => {
//         res.status(401).send(e);
//     })
// })

app.delete('/users/me/token', authenticate, (req, res) => {
    req.user.removeToken(req.token).then(() => {
        res.send();
    }).catch((e) => {
        res.status(401).send(e);
    })
})

app.listen(port, () => {
    console.log(`Node started at port ${port}`);
});

module.exports.app = app;