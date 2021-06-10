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

const subscriber = redis.createClient('redis://127.0.0.1:6379');

subscriber.on("message",function(channel,message) {
    console.log(channel);
    console.log("on" + message);
    io.emit('log', message);
})


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


//API - Subscribe to redis channel for log
app.post('/subscribe', cors(corsOptions), function (req,res ) {

    var flowId = req.body.flowId;

    subscriber.subscribe("flow_flow" + flowId, (error,message) => {
        if(error){
            console.log(error);
            res.send({
                'status': 'FAILED'
            });
        }
        else {
            console.log("sub on channel " + message);
            res.send({
                'status': 'OK'
            });
        }
    });
})


// API - Join Chat
app.post('/join', cors(corsOptions), function (req, res) {

    var flowId = req.body.flowId;
    var username = req.body.username;

    var chetters_key = "flow" + flowId + "_chatters";
    var room_chatters = [];

   


    client.get(chetters_key, function (err, reply) {
        if (reply) {
            room_chatters = JSON.parse(reply);;
        }

        if(room_chatters.find(chatter => chatter === username)) {
            res.send({
                'status': 'FAILED'
            });
        }
        else {
            room_chatters.push(username);
            client.set(chetters_key, JSON.stringify(room_chatters));
            res.send({
                'status': 'OK'
            });
        }
    });
});

// API - Leave Chat
app.post('/leave', function (req, res) {

    var flowId = req.body.flowId;
    var username = req.body.username;

    var chetters_key = "flow" + flowId + "_chatters";
    var room_chatters = [];


    client.get(chetters_key, function (err, reply) {
        if (reply) {
            room_chatters = JSON.parse(reply);
        }

        if(room_chatters.find(chatter => chatter === username)) {

            room_chatters.splice(room_chatters.indexOf(username),1);
            client.set(chetters_key, JSON.stringify(room_chatters));
            res.send({
                'status': 'OK'
            });
        }
        else {
            res.send({
                'status': 'FAILED'
            });
        }
    });
});

// API - Send + Store Message
app.post('/send_message', function (req, res) {
    var username = req.body.username;
    var message = req.body.message;
    var flowId = req.body.flowId;

    
    var chetters_key = "flow" + flowId + "_chatters";
    var room_chatters = [];

    var messages_key = "flow" + flowId + "_chat_messages";
    var room_messages = [];

    client.get(chetters_key, function (err, reply) {
        if (reply) {
            room_chatters = JSON.parse(reply);
        }

        if(room_chatters.find(chatter => chatter === username)) {

            client.get(messages_key, function(err,reply) {
                if(reply) {
                    room_messages = JSON.parse(reply);
                }

                room_messages.push({
                    'sender': username,
                    'message': message
                })

                client.set(messages_key, JSON.stringify(room_messages));
                res.send({
                    'message': {
                        'sender': username,
                        'message': message,
                    },
                    'status': 'OK'
                });
            })
        }
        else {
            res.send({
                'status': 'FAILED'
            });
        }
    });


});

// API - Get Messages
app.get('/get_messages', function (req, res) {
     
    var flowId = req.query.flowId;

    var key = "flow" + flowId + "_chat_messages";
    var chat_messages = [];
   
    client.get(key, function (err, reply) {
        if (reply) {
            chat_messages = JSON.parse(reply);
            res.send(chat_messages);
        }
    })
});

// API - Get Chatters
app.get('/get_chatters', cors(corsOptions), function (req, res) {

    var flowId = req.query.flowId;
    var username = req.query.username;

    console.log(username);

    var key = "flow" + flowId + "_chatters";
    var chatters = [];
    var active = false;

    client.get(key, function (err, reply) {
        if (reply) {
            chatters = JSON.parse(reply);

            if(chatters.find(chatter => chatter === username))
                active = true;

            res.send({
                'chatters': chatters,
                'active': active,
                'status': 'OK'
            });
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

    socket.on('leave_chatter', function(data) {
        io.emit('delete_chatter', data);
    })

    socket.on('add_team', function(data) {
        io.emit('new_team', data);
    })

});