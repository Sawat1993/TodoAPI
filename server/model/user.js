const mongoose = require('mongoose');
const validator = require('validator');
const jwt = require('jsonwebtoken');
const _ = require('lodash');
const bcrypt =require('bcryptjs');

var UserSchema = new mongoose.Schema({
    email: {
        type: String,
        required: true,
        trim: true,
        minLength: 1,
        unique: true,
        validate: {
            validator: validator.isEmail,//can be written as validator: (value) => {return validator.isEmail(value)}
            message: '{VALUE} is not a valid Email ID.'
        }
    },
    password: {
        type: String,
        required: true,
        minLength: 6
    },
    token: [{
        access: {
            type: String,
            required: true
        },
        token: {
            type: String,
            required: true
        }
    }
    ]//for complex schema
});

UserSchema.methods.toJSON = function () {
    var user = this;
    //var userObject = user.toObject();

    return _.pick(user, ['_id', 'email'])
}//overriding toJSON method called by mongoose whenever we do translation from object to json

UserSchema.methods.generateAuthToken = function () {//instance method
    var user = this;
    var access = 'auth';
    var token = jwt.sign({ _id: user._id.toHexString(), access }, 'salt text').toString();

    user.token.push({ access, token });

    return user.save().then(() => token);
};

UserSchema.statics.findByToken = function (token) {//module method
    var decode;
    var User = this;//refering to module

    try {
        decode = jwt.verify(token, 'salt text');
    } catch (e) {
        return Promise.reject('Invalid token');
    }
    console.log(decode);
    return User.findOne({
       '_id': decode._id,
        'token.access': decode.access,
        'token.token': token
    });
};

UserSchema.pre('save', function(next){
    var user = this;

    if(user.isModified('password')){
        bcrypt.genSalt(10, (err, salt) => {
            bcrypt.hash(user.password, 10, (err, hash) => {
               user.password = hash;
               next();
            })
        });
    }else {
    next();
    }
});

var User = mongoose.model('User', UserSchema);

module.exports.User = User;