var app = require('express')();
var http = require('http').Server(app);
var io = require('socket.io')(http);
var db = require('./model/db.js');

app.get('/', function(req, res) {
    res.sendfile(__dirname + '/index.html');
});

io.on('connection', function(socket) {
    socket.on('chat message', function(msg) {
        if(msg.controller_message == "open_channel_user"){
            // mo kenh cua chinh minh
            open_channel_user(msg);
        }else if(msg.controller_message == "chat_simple"){
            opensocket(msg);    
        }else{
            io.emit('chat message',msg);
        }
        
    });
    function open_channel_user(msg){
        socket.on(msg.id,function(msg){
            io.emit(msg.id,msg);
        })
    }
    function opensocket(msg) {
            socket.on(msg.channel, function(msg) {
                // gui ve kenh 
                io.emit(msg.channel, msg);
                // gui truc tiep ve kenh cua nguoi ban
                io.emit(msg.friend_id,msg);
                // luu vao collection message
                db.insert_message(msg,function(records){
                })
            });
    }
});
http.listen(82, function() {
    console.log("listening on : 82");
});