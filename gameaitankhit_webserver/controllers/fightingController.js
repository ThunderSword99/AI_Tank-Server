const User = require('../models/user');
const Helper = require('../helpers/Tool');

exports.index_get = async(req, res) => {
    try {
        let userList = await User.find().select('_id studentID firstName lastName').sort({ firstName: 1 }).lean();
        let playerlist = [];

        for (let i = 0; i < userList.length; i++) {
            if (await Helper.findBotSelectedByUserID(userList[i]._id.toString()))
                playerlist.push(userList[i]);
        }

        let user = {
            role: req.user.role,
            name: req.user.firstName
        }
        console.log('ok');
        res.render('admin/fighting/fighting', { user: user, playerList: playerlist });
    } catch (err) {
        console.log(err);
        res.send("error");
    }
}