const express = require('express');
const session = require('express-session');
const path = require('path');
const favicon = require('serve-favicon');
const logger = require('morgan');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const passport = require('passport');
var flash=require("connect-flash");
const LocalStrategy = require('passport-local');
const config = require('config');
const db = require('./common/database');

db.getConnection();

var app = express();
app.set('views', './views');
app.set('view engine', 'ejs');
app.use(express.static(path.join(__dirname, 'public')));

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(flash());
app.use(cookieParser());
// app.use(logger('dev'));
app.use(session({
    secret: config.get('sercret'),
    saveUninitialized: true,
    resave: true,
    cookie: {
        maxAge: 1000 * 60 * 60
    }
}));

app.use(passport.initialize());
app.use(passport.session());


var index = require('./routes/index');
app.use('/', index);

app.use((req, res, nex) => {
    let err = new Error('Not found!!!');
    err.status = 404;
    res.send(err + '');
})

module.exports = app;