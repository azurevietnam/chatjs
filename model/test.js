var restify = require('restify');
var server = restify.createServer();
var db = require('./db.js');

function create_user(req, res) {
	var arr = [];
    for (var i = 0; i < 20; i++) {
    	var user = {
            name: 'nhung'+i,
            email: i+'nhung@gmail.com',
            password: '1'
        };
    	arr.push(user);
    }
    var count = 0;
	var a =  function(){
		 db.create_user(arr[count], function(records) {
            // res.send(records);
            console.log(count);
            count++;
        });
	}
	var myvar = setInterval(function(){
		if(count<20){
            	a();
         }else{
         	stopInterval(myvar);
         }
	},1000);
	 function stopInterval(myvar){
	 	clearInterval(myvar)
	 }
 	
};

function create_channel(req, res) {
    var date = new Date();
    date = date.toISOString();
    var channel = {
        user: [req.params.id1, req.params.id2],
        ctime: date
    };
    db.create_channel(channel, function(records) {
        res.send(records);
    });
};
// server.get('/create-user/:name/:email/:password', create_user);
server.get('/create-channel/:id1/:id2', create_channel);
server.listen(84, function() {
    console.log("listen 84");
})