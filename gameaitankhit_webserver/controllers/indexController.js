const User = require('../models/user');
const Article = require('../models/article');
const Active = require('../models/active');
const bcrypt = require('bcryptjs');
const passport = require('passport');
const LocalStrategy = require('passport-local');
const moment = require('moment');
const config = require('config');

exports.regulation_get = (req, res) => {
    if (req.isAuthenticated()) {
        let user = {
            role: req.user.role,
            name: req.user.firstName
        }
        if (req.user.role == 'admin') {
            res.render('regulation', { user: user });
        } else {
            res.render('regulation', { user: user });
        }
    } else {
        res.render('regulation', { user: null });
    }
}

exports.index_get = async (req, res) => {
    let article = await Article.find({}).sort({ createTime: -1 }).populate('creator').limit(3).lean();

    article.forEach(element => {
        element.modifiedTime = moment(element.modifiedTime).format('DD/MM/YYYY HH:mm:ss');
    });

    if (req.isAuthenticated()) {
        let user = {
            role: req.user.role,
            name: req.user.firstName,
            username: req.user.userName
        }
        if (req.user.role == 'admin') {
            res.render('admin/index', { user: user, article: article });
        } else {
            res.render('user/index', { user: user, article: article });
        }
    } else {
        res.render('client/login', { user: null, article: article });
    }
}

exports.active_get = async (req, res) => {
    Active.findById(req.params.id)
        .then(async active => {
            let user = await User.findById(active.userID);
            user.status = true;
            await user.save();
            console.log('actived user ' + user.id);
            await Active.findByIdAndRemove(active.id);
            let article = await Article.find({}).sort({ createTime: -1 }).populate('creator').limit(3).lean();
            res.render('client/signup', { user: null, article: article, msg: 'Kích hoạt tài khoản thành công, đăng nhập để tiếp tục!' });
        })
        .catch(err => {
            res.send('404');
        })
}

exports.create_get = async (req, res) => {
    let article = await Article.find({}).sort({ createTime: -1 }).populate('creator').limit(3).lean();

    article.forEach(element => {
        element.modifiedTime = moment(element.modifiedTime).format('DD/MM/YYYY HH:mm:ss');
    });

    if (!req.isAuthenticated()) {
        res.render('client/signup', { user: null, article: article, msg: '' });
    } else {
        res.redirect('/');
    }
}

exports.create_post = async (req, res) => {
    if (!req.isAuthenticated()) {
        let body = req.body;
        let user = new User({
            userName: body.username,
            password: await bcrypt.hash(body.password, 10),
            dateOfBirth: body.birthDate,
            studentID: body.studentId,
            email: body.email,
            firstName: body.firstName,
            lastName: body.lastName,
            phoneNumber: body.phone,
            status: true,
            hash: 'mm'
        });
        user.hash = await bcrypt.hash(user.userName + user.role + config.get('sercret'), 10);
        await user.save();

        // let active = new Active({
        //     userID: user.id
        // })

        // await active.save();

        // let activeLink = req.protocol + '://' + req.headers.host + '/active/' + active.id;

        // require('../common/mailer')(user.email, activeLink);

        // console.log('registered user ' + user.id)

        let article = await Article.find({}).sort({ createTime: -1 }).populate('creator').limit(3).lean();
        res.render('client/login', { user: null, article: article, msg: 'Đăng ký thành công, vui lòng đăng nhập để tiếp tục!' });

    } else {
        res.redirect('/');
    }
}

exports.logout = (req, res) => {
    req.logOut();
    res.redirect('/');
}

exports.login = passport.authenticate('local', {
    failureRedirect: '/',
    successRedirect: '/',
    failureFlash: true
});

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
                bcrypt.compare(password, user.password)
                    .then(result => {
                        if (result) {
                            if (!user.status) {
                                return done(null, false, { msg: 'Vui lòng kiểm tra email và kích hoạt tài khoản!' });;
                            }
                            return done(null, user, { msg: '' });
                        }
                        return done(null, false, { msg: 'Tài khoản hoặc mật khẩu không đúng!' });
                    })
            }
            else {
                return done(null, false, { msg: 'Tài khoản hoặc mật khẩu không đúng!' });
            }
        })
    }
))