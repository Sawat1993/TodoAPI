const { MongoClient, ObjectID } = require('mongodb');

MongoClient.connect('mongodb://localhost:27017', (err, client) => {
    if (err) {
        return console.log('Uable to connect MongoDB');
    }
    console.log('Connected to MongoDb');

    const db = client.db('TodoApp');

    db.collection('Todos').findOneAndUpdate({'completed': false},{$set: {completed: true}},{returnOriginal: false}).then((res) => {
        console.log(res);
    })


    client.close();
});