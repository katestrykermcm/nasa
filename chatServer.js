// Initial code copied from arijitdasgupta's node_chat project: https://github.com/arijitdasgupta/node_chat



// SETUP

var http = require('http');
var fs = require('fs');
var websocket = require('websocket');

const PORT = 7777;
const BASE_URI = process.env.BASE_URI || '';

clients = [];
users = [];

var server = http.createServer(function(request, response) {
    var URL = request.url;
    //console.log((new Date()) + ' Received request for ' + URL);

    // Serving all files
    if (URL === BASE_URI + '/'){
        // Homepage
        fs.readFile('index.html', 'utf8', function(err, data){
            console.log(new Date() + " Homepage served");
            response.write(data);
            response.end();
        });
    }
    else if (URL === BASE_URI + '/jquery.js'){
        fs.readFile('jquery.js', 'utf8', function(err, data){
            if(err){
                console.log(err);
                return;
            }
            //console.log(URL + " served at " + new Date());
            response.write(data);
            response.end();
        });
    }
    else if (URL === BASE_URI + '/socket.js'){
        fs.readFile('socket.js', 'utf8', function(err, data){
            if(err){
                console.log(err);
                return;
            }
            //console.log(URL + " served at " + new Date());
            response.write(data);
            response.end();
        });
    }
    else if (URL === BASE_URI + '/d3/d3.js'){
        fs.readFile('d3/d3.js', 'utf8', function(err, data){
            if(err){
                console.log(err);
                return;
            }
            //console.log(URL + " served at " + new Date());
            response.write(data);
            response.end();
        });
    }
    else if (URL === BASE_URI + '/readme.json'){
        fs.readFile('readme.json', 'utf8', function(err, data){
            if(err){
                console.log(err);
                return;
            }
            //console.log(URL + " served at " + new Date());
            response.write(data);
            response.end();
        });
    }
    else if (URL === BASE_URI + '/dataviz.js'){
        fs.readFile('dataviz.js', 'utf8', function(err, data){
            if(err){
                console.log(err);
                return;
            }
            //console.log(URL + " served at " + new Date());
            response.write(data);
            response.end();
        });
    }
    // 3 microphone images
    else if (URL === BASE_URI + '/mic.gif'){
        var img = fs.readFileSync('./mic.gif');
        response.writeHead(200, {'Content-Type': 'image/gif' });
        response.end(img, 'binary');
    }
    else if (URL === BASE_URI + '/mic-animate.gif'){
        var img = fs.readFileSync('./mic-animate.gif');
        response.writeHead(200, {'Content-Type': 'image/gif' });
        response.end(img, 'binary');
    }
    else if (URL === BASE_URI + '/mic-slash.gif'){
        var img = fs.readFileSync('./mic-slash.gif');
        response.writeHead(200, {'Content-Type': 'image/gif' });
        response.end(img, 'binary');
    }
    else if (URL === BASE_URI + '/favicon.ico'){
        fs.readFile('favicon.ico', 'binary', function(err, data){
            if(err){
                console.log(err);
                return;
            }
            //console.log(URL + " served at " + new Date());
            response.write(data);
            response.end();
        });
    }
    else if (URL === BASE_URI + '/stylesheet.css'){
        // Stylesheet
        fs.readFile('stylesheet.css', 'utf8', function(err, data){
            if(err){
                console.log(err);
                return;
            }
            //console.log(URL + " served at " + new Date());
            response.write(data);
            response.end();
        });
    }
    else{
        response.write('Nothing here!');
        response.end();
    }
});

server.listen(PORT, function() {
    console.log((new Date()) + ` Server is listening on port ${PORT}`);
});



// DURING CHAT

var WebSocketServer = websocket.server;

wsServer = new WebSocketServer({
    httpServer: server,
    autoAcceptConnections: false
});

wsServer.on('request', function(request) {

    var connection = request.accept('chat-protocol', request.origin);
    var sender = 'Server';
    var message = 'Someone joined the chat';

    json_data = JSON.stringify({'message': message, 'sender': sender});

    for (var i = 0; i < clients.length; i++){
        clients[i].sendUTF(json_data);
    }

    console.log('Broadcasted from admin');

    var client_index = clients.push(connection) - 1;
    console.log('New user connected from: ' + request.origin);
    users[client_index] = 'Anonymous';
    connection.on('message', function(message) {
        if (message.type === 'utf8') {
            var data = eval('(' + message.utf8Data + ')');
            var message = data['message'];
            var sender = data['sender'];
            if (sender == 'Server'){
                sender = 'ServerWannabe';
            }
            users[client_index] = sender;
            json_data = JSON.stringify({'message': message, 'sender': sender});
            var test_str = message.replace(/^\s+|\s+$/g,'');
            if(test_str != ''){
                for (var i = 0; i < clients.length; i++){
                    clients[i].sendUTF(json_data);
                }
                console.log('- ' + sender + ':  ' + message); // Broadcasted
            }
        }
        // Never happened in my testing?
        else if (message.type === 'binary') {
            console.log('DOES THIS EVER HAPPEN? Received Binary Message of ' + message.binaryData.length + ' bytes');
            connection.sendBytes(message.binaryData);
        }
    });
    
    // If user leaves chat
    connection.on('close', function(reasonCode, description) {
        clients.splice(client_index, 1);
        leaving_user = users.splice(client_index, 1)[0]

        
        var message = leaving_user + ' has ended OIS communication.';
        var sender = 'Server';
        json_data = JSON.stringify({'message': message, 'sender': sender});
        for (var i = 0; i < clients.length; i++){
            clients[i].sendUTF(json_data);
        }
        console.log('User ' + leaving_user + ' left chat by disconnecting at: ' + connection.remoteAddress);
    });
});

