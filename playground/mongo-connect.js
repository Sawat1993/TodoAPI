//const MongoClient = require('mongodb').MongoClient;
const { MongoClient, ObjectID } = require('mongodb');//object decouppling

var obj = new ObjectID();
console.log(obj);

var test = { name: 'sawat', age: 25 };
var { name } = test;
console.log(name);//object decouppling advantage decouple multiple object inside one object

MongoClient.connect('mongodb://localhost:27017', (err, client) => {
    if (err) {
        return console.log('Uable to connect MongoDB');
    }
    console.log('Connected to MongoDb');

    const db = client.db('TodoApp');

    // db.collection('Todos').insertOne({
    //     text: 'Some random text',
    //     completed: false
    // },(err,res) => {
    //     if(err){ return console.log('Uanle to insert'); }

    //     console.log(JSON.stringify(res.ops,undefined,2));
    // });

    db.collection('Users').insertOne({
        name: 'Sawatantra chauhan',
        age: 24,
        location: 'Mumbai'
    }, (err, res) => {
        if (err) { return console.log('Uanle to insert'); }
        console.log(JSON.stringify(res.ops, undefined, 2));
    });
    client.close();
});