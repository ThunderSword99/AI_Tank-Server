const User = require('../models/user');
const Helper = require('../helpers/Tool');

exports.list = async function(req, res) {
    try {
        let userSort = await User.find({ role: 'user' }).sort({ 'win': -1, 'lose': 1, 'draw': -1 });
        for (let i = 0; i < userSort.length; i++) {
            userSort[i].ratio = (userSort[i].win == (userSort[i].win + userSort[i].lose + userSort[i].draw)) ? 100 : parseInt((userSort[i].win / (userSort[i].win + userSort[i].lose + userSort[i].draw)) * 100);
            userSort[i].botSelected = await Helper.findBotSelectedByUserID(userSort[i]._id.toString());
        }
        let data = {
            userSort: userSort
        }
        let user = null;
        if (req.user) {
            user = {
                role: req.user.role,
                id: req.user.id,
                hasBot: await Helper.findBotSelectedByUserID(req.user.id.toString())
            }
            res.render('aigame/player', { user: user, data: data });
        } else {
            res.render('aigame/player', { user: user, data: data });
        }
    } catch (error) {
        console.log("Error get list user DB: " + error);
        res.render('aigame/player', { user: null, data: { error: "Hiện tại chưa có Player!" } })
    }
}

exports.findPlayer = async function(req, res) {
    let body = req.body;
    if (body) {
        let player = body.player.toString();
        try {
            let result = await User.find({ firstName: player, role: 'user' });
            let data = {
                result: result
            }
            let user = null;
            if (result != "") {
                if (req.user) {
                    user = {
                        role: req.user.role,
                        id: req.user.id
                    }
                    res.render('aigame/player', { user: user, data: data });
                } else {
                    res.render('aigame/player', { user: user, data: data });
                }
            } else {
                res.render('aigame/player', { user: user, data: { error: "Không tìm thấy Player!" } })
            }
        } catch (error) {
            console.log(error);
            res.render('aigame/player', { user: null, data: { error: "Không tìm thấy Player!" } })
        }
    }
}