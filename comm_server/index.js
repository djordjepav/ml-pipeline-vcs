var express = require('express');
var bodyParser = require('body-parser');
var app = express();
var http = require('http').Server(app);
var io = require('socket.io')(http, {
    origins: ["http://localhost:3000"],

    // handlePreflightRequest: (req, res) => {
    //     res.writeHead(200, {
    //         "Access-Control-Allow-Origin": "http://localhost:3000",
    //         "Access-Control-Allow-Methods": "GET,POST",
    //         "Access-Control-Allow-Headers": "my-custom-header",
    //         "Access-Control-Allow-Credentials": true
    //     });
    //     res.end();
    // }
});
var cors = require('cors')

var corsOptions = {
    origins: ["http://localhost:3000"],
}

app.use(cors())


var redis = require('redis');
var client = '';
client = redis.createClient('redis://127.0.0.1:6379');

// // Redis Client Ready
// client.once('ready', function () {
//     // Flush Redis DB
//     // client.flushdb();
// });

var port = process.env.PORT || 8080;

// Start the Server
http.listen(port, function () {
    console.log('Server Started. Listening on *:' + port);
});

// Express Middleware
app.use(express.static('public'));
app.use(bodyParser.urlencoded({
    extended: true
}));


var chat_rooms = [];

// API - Join Chat
app.post('/join', cors(corsOptions), function (req, res) {

    var flowId = req.body.flowId;
    var username = req.body.username;
    var room = undefined;

    room = chat_rooms.find(room => room.id === flowId);

    if (room === undefined) {
        room = {
            id: flowId,
            chatters: [username],
            chat_messages: []
        }
        chat_rooms.push(room);

        var key = "flow" + flowId + "_chatters";
        client.set(key, JSON.stringify(room.chatters));

        res.send({
            'room': room,
            'status': 'OK'
        })

    } else {
        if (room.chatters.indexOf(username) === -1) {
            room.chatters.push(username);

            var key = "flow" + flowId + "_chatters";
            client.set(key, JSON.stringify(room.chatters));
            res.send({
                'room': room,
                'status': 'OK'
            })
        } else {
            res.send({
                'status': 'FAILED'
            });

        }
    }
});

// API - Leave Chat
app.post('/leave', function (req, res) {

    var flowId = req.body.flowId;
    var username = req.body.username;
    var room = undefined;

    room = chat_rooms.find(room => room.id === flowId);

    room.chatters.splice(room.chatters.indexOf(username),1);

    var key = "flow" + flowId + "_chatters";

    client.set(key, JSON.stringify(chatters));
    res.send({
        'status': 'OK'
    });
});

// API - Send + Store Message
app.post('/send_message', function (req, res) {
    var username = req.body.username;
    var message = req.body.message;
    var flowId = req.body.flowId;
    var room = undefined;

    room = chat_rooms.find(room => room.id === flowId);

    if (room == undefined) {
        res.send({
            'status': 'FAILED'
        })
    }
    else {
        if (room.chatters.indexOf(username) === -1) {
            res.send({
                'status': 'FAILED'
            });
        }
        else {
            room.chat_messages.push({
                'sender': username,
                'message': message
            });

            var key = "flow" + flowId + "_chat_messages";
            client.set(key, JSON.stringify(room.chat_messages));

            res.send({
                'message': {
                    'sender': username,
                    'message': message,
                },
                'status': 'OK'
            });
        }
    }
});

// API - Get Messages
app.get('/get_messages', function (req, res) {
     
    var flowId = req.query.flowId;

    var key = "flow" + flowId + "_chat_messages";
    var chat_messages = [];
   
    client.get(key, function (err, reply) {
        if (reply) {
           
            chat_messages = JSON.parse(reply);
            console.log(chat_messages);
            res.send(chat_messages);
        }
    })
});

// API - Get Chatters
app.get('/get_chatters', cors(corsOptions), function (req, res) {

    var flowId = req.query.flowId;

    var key = "flow" + flowId + "_chatters";
    var chatters = [];

    client.get(key, function (err, reply) {
        if (reply) {
            chatters = JSON.parse(reply);
            //console.log(chatters);
            res.send(chatters);
        }
    });
});

// Socket Connection
// UI Stuff
io.on('connection', function (socket) {

    // Fire 'receive' event for updating Message list in UI
    socket.on('message', function (data) {
        io.emit('receive', data);
    });

    // Fire 'new_chatters' for updating Chatter List in UI
    socket.on('join_chatter', function (data) {
        io.emit('new_chatters', data);
    });

});