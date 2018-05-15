var app = require('express')();
var http = require('http').Server(app);
var io = require('socket.io')(http);

/*app.get('/', function(request, response) {
    response.sendFile(__dirname + '/index.html');
});*/

var users = [];

io.on('connection', function(socket) {
    users[socket.id] = socket.id;
    console.log(users[socket.id] + ' connected');
    var connectedMessage = { name: users[socket.id] };
    io.emit('user connected', connectedMessage);
    
    socket.on('chat message', function(message) {
        console.log(users[socket.id] + ': ' + message);
        var chatMessage = { name: users[socket.id], message: message };
        io.emit('chat message', chatMessage);
    });

    socket.on('name', function(message) {
        var oldName = users[socket.id];
        users[socket.id] = message;
        console.log(oldName + ' became ' + users[socket.id]);
        var nameMessage = { oldName: oldName, newName: users[socket.id] };
        io.emit('name', nameMessage);
    });

    socket.on('disconnect', function() {
        console.log(users[socket.id] + ' disconnected');
        var disconnectMessage = { name: users[socket.id] };
        io.emit('user disconnected', disconnectMessage);
    });
});

http.listen(3000, function() {
    console.log('Listening on port localhost:3000');
});