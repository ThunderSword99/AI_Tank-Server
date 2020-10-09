const Match = require('../models/match');
const User = require('../models/user');
const Bot = require('../models/bot');
const config = require('config');
const fs = require('fs');
const Helper = require('../helpers/Tool');
const gameServerBridge = require('../game-server-bridge');
const gameStartedNotification = require('../game-started-notification');

exports.detail_get = async function(req, res) {
    let params = req.params;
    if (params) {
        try {
            let match = await Match.findById(params.id);

            let bot1;
            let bot2;

            bot1 = await Bot.findById(match.botOne);
            bot2 = await Bot.findById(match.botTwo);

            let user1;
            let user2;

            user1 = await User.findById(bot1.creator);
            user2 = await User.findById(bot2.creator);

            if (match.status == "pending") {
                res.render('aigame/matches', { user: null, data: { error: "Trận đấu chưa bắt đầu!" } });
            } else {
                let data;
                if (match.status == "started") {
                    data = {
                        g_replayFileName: "",
                        g_serverPort: config.get('liveStream.port'),
                        g_serverHost: "document.domain",
                        g_myGameID: params.id,
                        team1: user1.firstName,
                        team2: user2.firstName,
                    }
                    res.render('user/indexGame', { data: data });
                }
                if (match.status == "finished") {
                    data = {
                        g_replayFileName: match.result.replay,
                        g_serverPort: "",
                        g_serverHost: "",
                        g_myGameID: "",
                        team1: user1.firstName,
                        team2: user2.firstName,
                    }
                    res.render('user/indexGame', { data: data });
                }
            }
        } catch (error) {
            console.log("Error get match DB: " + error);
            res.send("Không thể lấy dữ liệu của trận đấu!");
        }
    }
}

exports.list_get = async function(req, res) {
    try {
        let matchs = await Match.find().populate({ path: 'botOne', populate: [{ path: 'creator' }] }).populate({ path: 'botTwo', populate: [{ path: 'creator' }] }).sort({ createdTime: -1 });
        for (var i = 0; i < matchs.length; i++) {

            if (matchs[i].challenger == 1) {
                matchs[i].challengerName = matchs[i].botOne.creator.lastName + " " + matchs[i].botOne.creator.firstName + " (P1)";
                matchs[i].opponent = matchs[i].botTwo.creator.lastName + " " + matchs[i].botTwo.creator.firstName + " (P2)";
            } else {
                matchs[i].challengerName = matchs[i].botTwo.creator.lastName + " " + matchs[i].botTwo.creator.firstName + " (P2)";
                matchs[i].opponent = matchs[i].botOne.creator.lastName + " " + matchs[i].botOne.creator.firstName + " (P1)";
            }

            if (matchs[i].result.code == 1) {
                matchs[i].winner = matchs[i].botOne.creator.lastName + " " + matchs[i].botOne.creator.firstName;
            } else if (matchs[i].result.code == 2) {
                matchs[i].winner = matchs[i].botTwo.creator.lastName + " " + matchs[i].botTwo.creator.firstName;
            } else if (matchs[i].result.code == 3) {
                matchs[i].winner = "Hòa";
            } else if (matchs[i].result.code == 4) {
                matchs[i].winner = "Hòa";
            } else if (matchs[i].result.code == 5) {
                matchs[i].winner = matchs[i].botOne.creator.lastName + " " + matchs[i].botOne.creator.firstName + (" (Do team 2 chọn nhiều tank hơn cho phép)");
            } else if (matchs[i].result.code == 6) {
                matchs[i].winner = matchs[i].botTwo.creator.lastName + " " + matchs[i].botTwo.creator.firstName + (" (Do team 1 chọn nhiều tank hơn cho phép)");
            } else if (matchs[i].result.code == 7) {
                matchs[i].winner = matchs[i].botTwo.creator.lastName + " " + matchs[i].botTwo.creator.firstName + (" (Do team 1 đặt tank ở vị trí bị cấm)");
            } else if (matchs[i].result.code == 8) {
                matchs[i].winner = matchs[i].botOne.creator.lastName + " " + matchs[i].botOne.creator.firstName + (" (Do team 2 đặt tank ở vị trí bị cấm)");
            } else if (matchs[i].result.code == 9) {
                matchs[i].winner = "Error!";
            } else {
                matchs[i].winner = "None";
            }
        }

        let data = {
            matchs: matchs,
            error: false
        }
        let user = null;
        if (req.user) {
            user = {
                role: req.user.role
            };
            res.render('aigame/matches', { user: user, data: data });
        } else {
            res.render('aigame/matches', { user: user, data: data });
        }

    } catch (error) {
        console.log("Error get list matcch DB: " + error);
        res.render('aigame/matches', { user: null, data: { error: "Chưa có trận đấu nào diễn ra!" } })
    }
}

exports.newGame = async function(req, res) {

    if (req.isAuthenticated() && req.user.role == "user") {

        let newMatch = Match({ status: "pending" });

        let newGameData = {};
        let p1;
        let p2;
        newGameData.gameId = newMatch._id.toString();

        var id1 = req.params.id; // id user opponent
        var id2 = req.user.id; // id user challenger
        let bot1;
        let bot2;
        try {
            bot1 = await Helper.getBotByUserID(id1);
            bot2 = await Helper.getBotByUserID(id2);
            p1 = 'upload/bot/' + bot1._id.toString() + '.exe';
            p2 = 'upload/bot/' + bot2._id.toString() + '.exe';
        } catch (error) {
            console.log(error);
        }

        if (bot1 && bot2) {
            try {
                if ((Math.floor(Math.random() * 2) + 1) == 1) {
                    newGameData.player1 = { id: bot1._id.toString(), data: fs.readFileSync(p1) };
                    newGameData.player2 = { id: bot2._id.toString(), data: fs.readFileSync(p2) };
                    newMatch.botOne = bot1._id.toString();
                    newMatch.botTwo = bot2._id.toString();
                    newMatch.challenger = 2;
                    await newMatch.save();
                } else {
                    newGameData.player1 = { id: bot2._id.toString(), data: fs.readFileSync(p2) };
                    newGameData.player2 = { id: bot1._id.toString(), data: fs.readFileSync(p1) };
                    newMatch.botOne = bot2._id.toString();
                    newMatch.botTwo = bot1._id.toString();
                    newMatch.challenger = 1;
                    await newMatch.save();
                }

                console.log('newGame, data: ');
                console.log(newGameData);
                gameServerBridge.newGame(newGameData);

            } catch (err) {
                console.log(err);
            }
        }
        await newMatch.save();
        res.redirect('/match');
    } else {
        res.redirect('/match');
    }
}


exports.fight_by_admin_post = async function(req, res) {

    if (req.isAuthenticated() && req.user.role == "admin") {

        let newMatch = Match({ status: "pending" });

        let newGameData = {};
        let p1;
        let p2;
        newGameData.gameId = newMatch._id.toString();

        var id1 = req.body.player2; // id user opponent
        var id2 = req.body.player1; // id user challenger

        if (id1 == id2) {
            res.json({ status: "error", message: "Hai đối thủ trùng nhau!" });
            return;
        }

        let bot1;
        let bot2;
        try {
            bot1 = await Helper.getBotByUserID(id1);
            bot2 = await Helper.getBotByUserID(id2);
            p1 = 'upload/bot/' + bot1._id.toString() + '.exe';
            p2 = 'upload/bot/' + bot2._id.toString() + '.exe';
        } catch (error) {
            console.log(error);
        }

        if (bot1 && bot2) {
            try {
                if ((Math.floor(Math.random() * 2) + 1) == 1) {
                    newGameData.player1 = { id: bot1._id.toString(), data: fs.readFileSync(p1) };
                    newGameData.player2 = { id: bot2._id.toString(), data: fs.readFileSync(p2) };
                    newMatch.botOne = bot1._id.toString();
                    newMatch.botTwo = bot2._id.toString();
                    newMatch.challenger = 2;
                    await newMatch.save();
                } else {
                    newGameData.player1 = { id: bot2._id.toString(), data: fs.readFileSync(p2) };
                    newGameData.player2 = { id: bot1._id.toString(), data: fs.readFileSync(p1) };
                    newMatch.botOne = bot2._id.toString();
                    newMatch.botTwo = bot1._id.toString();
                    newMatch.challenger = 1;
                    await newMatch.save();
                }

                console.log('newGame, data: ');
                console.log(newGameData);
                gameServerBridge.newGame(newGameData);
                gameStartedNotification.setResponseInstance(newMatch._id.toString(), res);

            } catch (err) {
                console.log(err);
            }
        }
        await newMatch.save();

    } else {
        res.json({ status: "error", message: "Lỗi quyền truy cập hoặc bạn chưa đăng nhập!" });
    }
}

exports.fight_back = async function(req, res) {
    if (req.isAuthenticated() && req.user.role == "admin") {
        let match = await Match.findById(req.params.id);
        match.status = "pending";

        let newGameData = {};
        let p1;
        let p2;
        newGameData.gameId = match._id.toString();

        let bot1;
        let bot2;
        try {
            bot1 = await Bot.findById(match.botOne);
            bot2 = await Bot.findById(match.botTwo);
            let user1 = await User.findById(bot1.creator);
            let user2 = await User.findById(bot2.creator);
            p1 = 'upload/bot/' + bot1._id.toString() + '.exe';
            p2 = 'upload/bot/' + bot2._id.toString() + '.exe';
            console.log(match.result.code);
            if (match.result.code == 1) {
                bot1.win -= 1;
                user1.win -= 1;
                bot2.lose -= 1;
                user2.lose -= 1;
            } else if (match.result.code == 2) {
                bot1.lose -= 1;
                user1.lose -= 1;
                bot2.win -= 1;
                user2.win -= 1;
            } else if (match.result.code == 3) {
                bot1.draw -= 1;
                user1.draw -= 1;
                bot2.draw -= 1;
                user2.draw -= 1;
            } else if (match.result.code == 4) {
                bot1.draw -= 1;
                user1.draw -= 1;
                bot2.draw -= 1;
                user2.draw -= 1;
            } else if (match.result.code == 5) {
                bot1.lose -= 1;
                user1.lose -= 1;
                bot2.win -= 1;
                user2.win -= 1;
            } else if (match.result.code == 6) {
                bot1.win -= 1;
                user1.win -= 1;
                bot2.lose -= 1;
                user2.lose -= 1;
            } else if (match.result.code == 7) {
                bot1.lose -= 1;
                user1.lose -= 1;
                bot2.win -= 1;
                user2.win -= 1;
            } else if (match.result.code == 8) {
                bot1.win -= 1;
                user1.win -= 1;
                bot2.lose -= 1;
                user2.lose -= 1;
            } else if (match.result.code == 9) {
                match.result.message = "";
            }
            await bot1.save();
            await bot2.save();
            await user1.save();
            await user2.save();
        } catch (error) {
            console.log(error);
        }

        if (bot1 && bot2) {
            try {
                newGameData.player1 = { id: bot1._id.toString(), data: fs.readFileSync(p1) };
                newGameData.player2 = { id: bot2._id.toString(), data: fs.readFileSync(p2) };
                await match.save();

                console.log('newGame, data: ');
                console.log(newGameData);
                gameServerBridge.newGame(newGameData);

            } catch (err) {
                console.log(err);
            }
        }
        res.redirect('/match');
    } else {
        res.redirect('/match');
    }
}