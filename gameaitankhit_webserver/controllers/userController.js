const User = require('../models/user');
const bcrypt = require('bcryptjs');
const csrf = require('csurf');
const moment = require('moment');;
const config = require('config')

exports.list = (req, res) => {
    User.find({}).exec()
        .then(result => {
            let user = {
                role: req.user.role,
                name: req.user.firstName,
                csrfToken: req.csrfToken()
            }
            return res.render('admin/user/user', { user: user, data: result });
            // res.json(result);
        })
        .catch(err => {
            return res.send(err + '');
        })
}

exports.add_get = async (req, res) => {
    let user = {
        csrfToken: req.csrfToken()
    }
    res.json(user);
}

exports.add_post = async (req, res) => {
    let body = req.body;
    let pass = await bcrypt.hash(body.password, 10);

    let user = new User({
        userName: body.userName,
        password: pass,
        dateOfBirth: body.dateOfBirth,
        studentID: body.studentID,
        email: body.email,
        firstName: body.firstName,
        lastName: body.lastName,
        phoneNumber: body.phoneNumber,
        role: body.role,
        status: true,
        hash: await bcrypt.hash(body.userName + body.role + config.get('sercret'), 10)
    });
    // user.hash = await bcrypt.hash(user.userName + user.role + config.get('sercret'), 10);

    user.save()
        .then(result => {
            res.redirect('/admin/user');
        })
        .catch(err => {
            res.send(err + '');
        })
}

exports.edit_get = (req, res) => {
    let body = req.body;
    User.findById(req.params.id).lean().exec()
        .then(user => {
            user.dateOfBirth = moment(user.dateOfBirth).format('YYYY-MM-DD');
            user.csrfToken = req.csrfToken();
            res.json(user);
        })
        .catch(err => {
            res.json();
        })
}

exports.edit_post = (req, res) => {
    let body = req.body;
    User.findOne({ email: body.email }).exec()
        .then(async user => {
            user.firstName = body.firstName;
            user.lastName = body.lastName;
            user.studentID = body.studentID;
            user.phoneNumber = body.phoneNumber;
            user.role = body.role;
            user.hash = await bcrypt.hash(user.userName + body.role + config.get('sercret'), 10)
            if (body.password != '') {
                user.password = await bcrypt.hash(body.password, 10);
            }
            await user.save();
            res.redirect('/admin/user');
        })
        .catch(err => {
            res.send(err + '');
        })
}

exports.lock_get = async (req, res) => {
    let user = {
        csrfToken: req.csrfToken()
    }
    res.json(user);
}

exports.lock_post = async (req, res) => {
    console.log(req.body);
    User.findById(req.body.id).exec()
        .then(async user => {
            user.status = !user.status;
            await user.save();
            res.redirect('/admin/user');
        })
        .catch(err => {
            res.send(err + '');
        })
}