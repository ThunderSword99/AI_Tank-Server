    var io = require('socket.io-client');
var config = require('config');
const { exec } = require('child_process');
const fs = require('fs');
var gamePort = 50000;

var socket = io.connect("http://" + config.get('host') + ":" + config.get('port') + "/", {
    reconnection: true
});

socket.on('connect', function(data) {
    console.log('connected to WebServer!');
});

socket.on('serversend', function(data) {
    console.log('seversend!');
});

socket.on('newGame', function(data) {

    console.log('newGame data received!');

    const runningPort = (++gamePort).toString();

    if (runningPort == 60000)
        runningPort = 50000;

    console.log('set port ' + runningPort + ' for game with id ' + data.gameId);
    console.log('exec sever for game with id ' + data.gameId);
    socket.emit('gameStarted', { gameId: data.gameId, gamePort: runningPort });
    exec('node Server.js -gid ' + data.gameId + ' -p ' + runningPort + ' -k 30 11 -r Replay/' + data.gameId + '.grl', { cwd: __dirname + "/Pack/Server", shell: true, windowsHide: false }, function(err, stdout, stderr) {
        if (err) {
            console.log(err);
            socket.emit('gameOver', { gameId: data.gameId, code: 9, message: 'error when execute server.js' });
        } else {
            if (fs.existsSync('./Pack/Server/Result/' + data.gameId)) {
                fs.readFile('./Pack/Server/Result/' + data.gameId, "utf8", function(err, content) {
                    if (err) {
                        socket.emit('gameOver', { gameId: data.gameId, code: 9, message: 'error when read result file' });
                    } else {

                        let replay = ([1, 2, 3, 4].indexOf(parseInt(content)) != -1) ? fs.readFileSync('./Pack/Server/Replay/' + data.gameId + '.grl') : {};

                        socket.emit('gameOver', { gameId: data.gameId, code: content, replay: replay });
                    }
                });
            } else {
                socket.emit('gameOver', { gameId: data.gameId, code: 9, message: 'error when execute server.js' });
            }
        }
    });

    let p1;
    let p2;
    try {
        p1 = (data.player1.id.toString() + '_' + Date.now() + '.exe').toString();
        p2 = (data.player2.id.toString() + '_' + Date.now() + '.exe').toString();
    } catch (err) {
        console.log(err);
    }

    var p1wstream = fs.createWriteStream(__dirname + '/Bots/' + p1);

    p1wstream.on('finish', function(err) {
        if (err) {
            console.log('error on writing player1' + ' with game id ' + data.gameId);
            console.log(err);
        } else {
            console.log('exec p1 in game with id ' + data.gameId);
            exec('PsExec64.exe -l -w "' + __dirname + '\\Bots" "' + __dirname + '\\Bots\\' + p1 + '" -h 127.0.0.1 -p ' + runningPort + ' -k 30', {}, (err, stdin, stderr) => {
                if (err) {
                    console.log('p1 err: ' + err);
                    socket.emit('gameOver', { gameId: data.gameId, code: 9, message: 'error when exec p1' });
                } else
                    console.log('p1' + ' with game id ' + data.gameId + ' is closed');
            });
        }
    });
    p1wstream.write(data.player1.data);
    p1wstream.end();

    var p2wstream = fs.createWriteStream(__dirname + '/Bots/' + p2);

    p2wstream.on('finish', function(err) {
        if (err) {
            console.log('error on writing player2' + ' with game id ' + data.gameId);
            console.log(err);
        } else {
            console.log('exec p2 in game with id ' + data.gameId);
            exec('PsExec64.exe -l -w "' + __dirname + '\\Bots" ' + __dirname + '\\Bots\\' + p2 + ' -h 127.0.0.1 -p ' + runningPort + ' -k 11', {}, (err, stdin, stderr) => {
                if (err) {
                    console.log('p2 err: ' + err);
                    socket.emit('gameOver', { gameId: data.gameId, code: 9, message: 'error when exec p2' });
                } else
                    console.log('p2' + ' with game id ' + data.gameId + ' is closed');
            });
        }
    });
    p2wstream.write(data.player2.data);
    p2wstream.end();

    //   socket.emit('gameOver', { winner: "TEAM1", replay: new Buffer("asbc") });
});