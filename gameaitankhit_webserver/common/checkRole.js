const bcrypt = require('bcryptjs');
const config = require('config');

module.exports = (role) => {
    return (req, res, next) => {
        if (req.user) {
            bcrypt.compare(req.user.userName + role + config.get('sercret'), req.user.hash)
                 .then(result => {
                     if (result) {
                         //    console.log(result)
                         return next();
                     }
                    
                     return res.redirect('/');
                 })
        } else {
            return res.redirect('/');
        }
    }
}