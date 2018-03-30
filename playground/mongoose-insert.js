const { ObjectId } = require('mongodb');
const { Todo } = require('./../server/model/todo');
const { mongoose } = require('./../server/db/db');


Todo.insertMany([{text:1},{_id:'5abe358a81cae711005ee831',text:2}]).then((doc) => {
    console.log('added');
},(e) => {console.log(e);});

var todo = new Todo({_id:new ObjectId(),text:222},{_id:new ObjectId(),text:111});
todo.save().then((doc) => {
    if (doc) { console.log(doc); } else { console.log('Unable to find Todo'); }
}, (e) => {
    console.log(e);
});//will insert only one