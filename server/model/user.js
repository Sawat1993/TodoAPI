const mongoose = require('mongoose');
const validator = require('validator');
const jwt = require('jsonwebtoken');
const _ = require('lodash');

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

UserSchema.methods.toJSON = function(){
    var user = this;
    //var userObject = user.toObject();

    return _.pick(user, ['_id','email'])
}//overriding toJSON method called by mongoose whenever we do translation from object to json

UserSchema.methods.generateAuthToken = function() {
    var user = this;
    console.log(user.email);
    var access = 'auth';
    var token = jwt.sign({_id: user._id.toHexString(), access}, 'salt text').toString();

    user.token.push({access, token});

    return user.save().then(() => token);
};

var User = mongoose.model('User', UserSchema);

module.exports.User = User;