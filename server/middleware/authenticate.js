const {User} = require('./../model/user');

var authenticate = (req, res, next)=>{
    var token = req.header('x-auth');
    User.findByToken(token).then((doc) => {
        if(doc){
           res.user = doc;
           res.token = token;
           next();
        }else{
            return Promise.reject('User Not Found');
        }
    }).catch((e) => {
        res.status(401).send(e);
    });
};

module.exports = {authenticate};
