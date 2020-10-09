var io = require('socket.io')();
const Match = require('./models/match');
const User = require('./models/user');
const Bot = require('./models/bot');
const LiveStream = require('./live-stream');
const gameStartedNotification = require('./game-started-notification');
const fs = require('fs');

io.on('connection', async function(socket) {
    console.log('connected to gameServer with client id:', socket.client.id);
    socket.on('gameOver', async function(data) {
        console.log("Game Over");
        let match = await Match.findById(data.gameId);

        if ([1, 2, 3, 4].indexOf(parseInt(data.code)) != -1) {
            var gameReplay = fs.createWriteStream(__dirname + '/public/Replays/' + data.gameId + ".grl");

            gameReplay.on('finish', function(err) {
                if (err) {
                    console.log("Error save file Replay: ", err);
                } else {
                    console.log("Save replay completed");
                }
            });
            gameReplay.write(data.replay);
            gameReplay.end();
            match.result.replay = "/Replays/" + data.gameId + ".grl";

        }
        let bot1;
        let bot2;
        let user1;
        let user2;
        try {
            bot1 = await Bot.findById(match.botOne);
            bot2 = await Bot.findById(match.botTwo);

            user1 = await User.findById(bot1.creator);
            user2 = await User.findById(bot2.creator);
        } catch (error) {
            console.log(error);
        }

        if (data.code == 1) {
            bot1.win += 1;
            user1.win += 1;
            bot2.lose += 1;
            user2.lose += 1;
        } else if (data.code == 2) {
            bot1.lose += 1;
            user1.lose += 1;
            bot2.win += 1;
            user2.win += 1;
        } else if (data.code == 3) {
            bot1.draw += 1;
            user1.draw += 1;
            bot2.draw += 1;
            user2.draw += 1;
        } else if (data.code == 4) {
            bot1.draw += 1;
            user1.draw += 1;
            bot2.draw += 1;
            user2.draw += 1;
        } else if (data.code == 5) {
            bot1.lose += 1;
            user1.lose += 1;
            bot2.win += 1;
            user2.win += 1;
        } else if (data.code == 6) {
            bot1.win += 1;
            user1.win += 1;
            bot2.lose += 1;
            user2.lose += 1;
        } else if (data.code == 7) {
            bot1.lose += 1;
            user1.lose += 1;
            bot2.win += 1;
            user2.win += 1;
        } else if (data.code == 8) {
            bot1.win += 1;
            user1.win += 1;
            bot2.lose += 1;
            user2.lose += 1;
        } else if (data.code == 9) {
            match.result.message = data.message;
        }
        await bot1.save();
        await bot2.save();
        await user1.save();
        await user2.save();
        match.result.code = data.code;
        match.status = "finished";
        await match.save();
        LiveStream.removeStream(data.gameId);
    });
    socket.on('gameStarted', async function(data) {
        console.log("Game Started: " + data.gameId);
        let sk = gameStartedNotification.getResponseInstance(data.gameId);
        if (sk)
            sk.json({ status: "ok", data: data.gameId });
        let match = await Match.findById(data.gameId);
        match.status = "started";
        await match.save();
        console.log('a game started with id: ' + data.gameId + ' port ' + data.gamePort);
        LiveStream.addStream(data.gameId, data.gamePort);
    });
});

exports.newGame = function(newGameData) {
    io.emit("newGame", newGameData);
}

exports.attach = function(server) {
    io.attach(server);
}