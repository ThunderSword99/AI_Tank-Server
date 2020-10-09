const config = require('config');
const streamList = new Map();

// proxyServer.on('upgrade', function(req, socket, head) {
//     matchId = getMatchId(req.url);
//     req.url = "/";
//     console.log('port ' + streamList[matchId] + ' for gameId ' + matchId);
//     proxy.ws(req, socket, head, {
//         target: {
//             host: config.get('gameServer.ip'),
//             port: streamList[matchId]
//         }
//     });
// });

var http = require('http'),
    httpProxy = require('http-proxy');
proxy = httpProxy.createProxyServer({});

function getMatchId(url) {
    return url.substring(url.indexOf('/') + 1);
}

var proxy = new httpProxy.createProxyServer();
var proxyServer = http.createServer(function (req, res) {
    proxy.web(req, res);
});

proxyServer.on('upgrade', function (req, socket, head) {
    //   console.log(req);
    matchId = getMatchId(req.url);
    req.url = "/";
    //   console.log('port ' + streamList.get(matchId) + ' for gameId ' + matchId);
    proxy.ws(req, socket, head, {
        target: {
            host: config.get('gameServer.ip'),
            port: streamList.get(matchId)
        }
    });
});

proxy.on('error', function (e) {
    console.log(e);
});

exports.start = function (port) {
    proxyServer.listen(port);
    console.log('live stream sever started on ' + port);
}

exports.addStream = function (gameId, gamePort) { streamList.set(gameId.toString(), gamePort.toString()) };

exports.removeStream = function (gameId) { streamList.delete(gameId.toString()) };
