var express = require('express')
  , app = express()
  , server = exports.server = require('http').createServer(app)
  , io = require('socket.io').listen(server);

server.listen(process.env.PORT);

app.set('trust proxy', true);
app.use('/static', express.static(__dirname + '/public'));

app.get('/', function (req, res) {
    res.sendfile(__dirname + '/index.html');
});

io.sockets.on('connection', function (socket) {

    socket.on('routeMe', function (data) {
        if (data !== null) {
            console.log('session cookie set to: ' + data);
            socket.emit('clearGameSessionCookie');
        } else {
            console.log('session cookie not set, setting');
            socket.emit('setGameSessionCookie', 'testing1234');
        }
    });

    // Subscribe to notifications about the list of available games
    socket.on('subscribeGameList', function (data, callback) {
        socket.join('gamelist');
    });

    socket.on('unsubscribeGameList', function (data, callback) {
        socket.leave('gamelist');
    });

    socket.on('newGame', function (data, callback) {
        if (!data || typeof data !== typeof {}) { callback("Invalid data"); return; }
        if (!data.name) { callback("Invalid data"); return; }
        if (!data.password) { callback("Invalid data"); return; }
        if (!data.playerCount) { callback("Invalid data"); return; }

        // Using GameListingProvider create and persist a new game listing

        // Send a notification indicating that this game has been created to
        // all clients subscribing to game list events

        callback();
    });

    socket.on('listGames', function (data, callback) {
        // Get a list of active games from GameListingProvider and send back to client in callback
        callback();
    });
});

