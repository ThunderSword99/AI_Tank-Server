const Bot = require('../models/bot');
const bcryptjs = require('bcryptjs');
const multer = require('multer');
const path = require('path');

exports.list = (req, res) => {
    Bot.find({ creator: req.user.id }).exec()
        .then(result => {
            let user = {
                role: req.user.role,
                name: req.user.firstName,
                csrfToken: req.csrfToken()
            }
            res.render('user/bot', { user: user, data: result });
        })
        .catch(err => {
            res.send(err + '');
        })
}

exports.create_post = (req, res) => {
    let bot = new Bot({
        name: Date.now(),
        creator: req.user.id
    })
    bot.save()
        .then(result => {
            let storage = multer.diskStorage({
                destination: (req, file, cb) => {
                    cb(null, './upload/bot')
                },
                filename: (req, file, cb) => {
                    cb(null, bot.id + path.extname(file.originalname));
                }
            })
            const upload = multer({
                storage: storage,
                fileFilter: function (req, file, callback) {
                    var ext = path.extname(file.originalname)
                    if (ext !== '.exe') {
                        return callback(new Error("Only exe" + ''), null)
                    }
                    callback(null, true);
                }
            });
            upload.single('bot')(req, res, async err2 => {
                if (err2) {
                    await Bot.remove(result).exec();
                    return res.json({ error: 'Chỉ được upload file .exe' });
                } else {
                    result.name = req.body.botName;
                    result.isBotSelected = true;
                    await Bot.update({ creator: req.user.id }, { $set: { isBotSelected: false } }, { multi: true }).exec();
                    await result.save();
                    return res.redirect('/user/bot');
                }
            })
        })
        .catch(err => {
            return res.send(err + '');
        })
}

exports.select_post = (req, res) => {
    Bot.update({ creator: req.user.id }, { $set: { isBotSelected: false } }, { multi: true }).exec()
        .then(result => {
            Bot.update({ $and: [{ _id: req.body.id }, { creator: req.user.id }] }, { $set: { isBotSelected: true } }).exec()
                .then(bot => {
                    return res.redirect('/user/bot');
                })
                .catch(err => {
                    return res.json({ error: 'Không tìm thấy Bot!' });
                })
        })
        .catch(err => {
            res.json({ error: 'Không tìm thấy Bot!' });
        })
}