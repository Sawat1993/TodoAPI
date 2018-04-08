const {SHA256} =require('crypto-js');

var msg = 'I am swatantra';

var hash = SHA256(msg).toString();
console.log(hash);

var hash = SHA256(msg).toString();
console.log(hash);

var data = {
    id: 4
};

var token = {
    data,
    hash: SHA256(JSON.stringify(data) + 'some salt').toString()
};


if(token.hash === SHA256(JSON.stringify(token.data) + 'some salt').toString()){
    console.log('Valid Data');
}else{
    console.log('Invalid Data');
}

//if some person has udated data in the backend and generate new hash,he will not have salt string
token.data = 5;
token.hash = SHA256(JSON.stringify(data)).toString();

if(token.hash === SHA256(JSON.stringify(token.data) + 'some salt').toString()){
    console.log('Valid Data');
}else{
    console.log('Invalid Data');
}