const { MongoClient, ObjectID } = require('mongodb');

MongoClient.connect('mongodb://localhost:27017', (err, client) => {
    if (err) {
        return console.log('Uable to connect MongoDB');
    }
    console.log('Connected to MongoDb');

    const db = client.db('TodoApp');

    db.collection('Todos').find({'completed': false}).toArray().then((doc) => {
        console.log(doc);
    },(err) => {
        console.log(err);
    });

    db.collection('Todos').find().count().then((count) => {
        console.log(count);
    },(err) => {
        console.log(err);
    });

    client.close();
});