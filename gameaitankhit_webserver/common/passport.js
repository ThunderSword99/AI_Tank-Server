const passport = require('passport');
const LocalStrategy = require('passport-local');

passport.serializeUser((user, done) => {
    done(null, user.id);
})

passport.deserializeUser((userId, done) => {
    User.findById(userId, (err, user) => {
        done(err, user);
    })
})

passport.use(new LocalStrategy(
    (username, password, done) => {
        User.findOne({ userName: username }).exec((err, user) => {
            if (err) return done(null, false);
            if (user) {
                bcrypt.compare(password, user.passWord, (err, b) => {
                    if (err) return console.log(err);
                    if (b) {
                        return done(null, user);
                    } else {
                        return done(null, false);
                    }
                })
            }

        })
    }
))
