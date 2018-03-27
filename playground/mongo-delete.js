const { MongoClient, ObjectID } = require('mongodb');

MongoClient.connect('mongodb://localhost:27017', (err, client) => {
    if (err) {
        return console.log('Uable to connect MongoDB');
    }
    console.log('Connected to MongoDb');

    const db = client.db('TodoApp');

    db.collection('Todos').deleteMany({'completed': true}).then((res) => {
        console.log(res.result);
    });

    db.collection('Todos').deleteOne({'completed': true}).then((res) => {
        console.log(res.result);
    });

    db.collection('Todos').findOneAndDelete({'completed': true}).then((res) => {
        console.log(res.result);
    });


    client.close();
});