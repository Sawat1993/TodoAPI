const {User} = require('./../model/user');

var authenticate = (req, res, next)=>{
    console.log('authenticating');
    var token = req.header('x-auth');
    User.findByToken(token).then((doc) => {
        if(doc){
           req.user = doc;
           req.token = token;
           next();
        }else{
            return Promise.reject('User Not Found');
        }
    }).catch((e) => {
        res.status(401).send(e);
    });
};

module.exports = {authenticate};
