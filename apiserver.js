var restify = require('restify');
var server = restify.createServer();
var db = require('./model/db.js');
var value_false = 'ilovenhung@';

function set_access_control_allow_origin(res) {
    // Website you wish to allow to connect
    res.setHeader('Access-Control-Allow-Origin', '*');
    // Request methods you wish to allow
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');
    // Request headers you wish to allow
    res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type');
    // Set to true if you need the website to include cookies in the requests sent
    // to the API (e.g. in case you use sessions)
    res.setHeader('Access-Control-Allow-Credentials', true);
};

function login(req, res) {
    set_access_control_allow_origin(res);
    db.check_login(req.params.email, req.params.password, function(docs) {
        res.send(docs);
    });
};

function signup(req, res) {
    set_access_control_allow_origin(res);
    var user = {
        name: req.params.name,
        email: req.params.email,
        password: req.params.password
    };
    db.check_email(user.email, function(value) {
        if (value == 0) {
            db.create_user(user, function(docs) {
                res.send(docs);
            })
        } else {
            res.send("failed");
        }
    })
};

function searchemail(req, res) {
    set_access_control_allow_origin(res);
    db.search_email(req.params.email, function(docs) {
        res.send(docs);
    });
};
var res_channel;

function checkchannel(req, res) {
    set_access_control_allow_origin(res);
    db.search_channel(req.params.id1, req.params.id2, function(docs) {
        if (docs == value_false) {
            // create channel
            create_channel(req.params.id1, req.params.id2, function(records) {
                res.send(records[0]._id);
            })
        } else {
            res.send(docs[0]._id);
        }
    })
};

function create_channel(id1, id2, callback) {
    var date = new Date();
    date = date.toISOString();
    var channel = {
        user: [id1, id2],
        ctime: date
    };
    db.create_channel(channel, function(records) {
        return callback(records);
    });
};

function add_friend(req, res) {
    set_access_control_allow_origin(res);
    db.check_friend(req.params.id1, req.params.id2, function(value) {
        if (value == 0) {
            // khong tim thay 
            db.add_friend(req.params.id1, req.params.id2, function(records) {
                res.send(records);
            });
        } else {
            res.send("friended");
        }
    });

};

function check_friend(req, res) {
    set_access_control_allow_origin(res);
    db.check_friend(req.params.id1, req.params.id2, function(value) {
        res.send("" + value);
    })
};

function list_friend(req, res) {
    set_access_control_allow_origin(res);
    db.list_friend(req.params.id, function(docs) {
        var result = [];
        var item;
        for (var i = 0; i < docs.length; i++) {
            item = {
                "id": docs[i]._id,
                "name": docs[i].name,
                "email": docs[i].email
            }
            result.push(item);
            
        }
         res.send(result);
    });
};
function message_old(req,res){
    set_access_control_allow_origin(res);
    db.select_message(req.params.n,req.params.p,req.params.channel_id,function(data){
        res.send(data);
    })
};

server.get('/login/:email/:password', login);
server.get('/signup/:email/:name/:password', signup);
server.get('/searchemail/:email', searchemail);
server.get('checkchannel/:id1/:id2', checkchannel);
server.get('/check_friend/:id1/:id2', check_friend);
server.get('/add_friend/:id1/:id2', add_friend);
server.get('/list_friend/:id', list_friend);
server.get('/message_old/:n/:p/:channel_id',message_old);
server.listen(83, function() {
    console.log("data listenning port 83");
});