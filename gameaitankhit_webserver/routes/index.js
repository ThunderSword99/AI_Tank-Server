var express = require('express');
var router = express.Router();
var gameServerBridge = require('../game-server-bridge');
const checkRole = require('../common/checkRole');

router.use('/', require('./object/indexRoute'));

router.use('/match', require('./object/matchRoute'));
router.use('/player', require('./object/playerRoute'));
router.use('/user/bot', checkLogin, checkRole('user'), require('./object/botRoute'));
router.use('/admin/user', checkLogin, checkRole('admin'), require('./object/userRoute'))
router.use('/admin/article', checkLogin, checkRole('admin'), require('./object/articleRoute'));
router.use('/admin/fighting', checkLogin, checkRole('admin'), require('./object/fightingRoute'));

function checkLogin(req, res, next) {
    if (req.isAuthenticated()) {
        next();
    } else
        res.redirect('/');
}

module.exports = router;