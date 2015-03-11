var appController = angular.module('appController', []);
var http = "http://localhost:83/";
checklogin();
var channel;
var conntentmessage = [];
var arrchanel = [];
var value_false = 'ilovenhung@';
var friend_id = 0;


function checklogin() {
    if (!localStorage.name || !localStorage.id || !localStorage.email) {
        localStorage.name = "";
        window.location = "#/login";
    }
};
appController.controller('homeController', ['$scope', '$http',
    function($scope, $http, $apply) {
        // kiem tra xem dang nhap chua
        checklogin();
        // hien ten
        $scope.yourname = localStorage.name;
        // thoat tai khoan
        $scope.logout = function() {
            localStorage.removeItem('name');
            localStorage.removeItem('id');
            localStorage.removeItem('email');
            checklogin();
        };

        // ket noi socket
        var socket = io.connect('http://127.0.0.1:82');
        // tu dong mo kenh nguoi dung (dung id nguoi dung lam kenh);
        var send_channel_user = {
            "controller_message": "open_channel_user",
            "id": localStorage.id
        };
        socket.emit('chat message', send_channel_user);
        // lang nghe socket cua
        listen_me();
        // show list ban
        list_friend();
        // show list friend
        function list_friend() {
            var url_list_friend = http + "list_friend/" + localStorage.id;
            $http.get(url_list_friend)
                .success(function(data, status, headers, config) {
                    $scope.listfriend = data;
                })
                .error(function() {

                })
        };

        // function chon kenh, lang nghe kenh, truyen id kenh va ten ban
        function selected_channel(channel_id, name_friend) {
            $scope.friend = name_friend;
            channel = channel_id;
            //check friend 
            check_friend(friend_id);
            if (conntentmessage[channel] != null) {
                $scope.messages = conntentmessage[channel];

            } else {
                //get message old

                conntentmessage[channel] = [];
                $scope.messages = conntentmessage[channel];
                socket.on(channel, function(objectmessage) {
                    conntentmessage[channel].push(objectmessage);
                    $scope.$apply(function() {
                        $scope.messages = conntentmessage[channel];
                    })
                });
            }

        };
        //get message old
        function message_old(channel_id,n,p,callback){
            var url_message_old = http 
        }
        //check friend
        $scope.add_friend_show = "false";

        function check_friend(friend_id) {
            var url_check_friend = http + "check_friend/" + localStorage.id + "/" + friend_id;
            var stt = "true";
            $http.get(url_check_friend)
                .success(function(data) {
                    if (data == "1") {
                        stt = true;
                    } else {
                        stt = false;
                    }
                    $scope.add_friend_show = stt;
                })
                .error(function() {

                })
        };
        // ket ban
        $scope.add_friend = function() {
            var url_add_friend = http + "add_friend/" + localStorage.id + "/" + friend_id;
            $http.get(url_add_friend)
                .success(function(data) {
                    if (data != "friended") {
                        $scope.add_friend_show = "false";
                        list_friend();
                    }
                })
                .error(function() {

                })
        };

        // chat
        $scope.user = {};
        var item = {};
        $scope.submituser = function() {
            if (friend_id != 0) {
                item = {
                    "controller_message": "chat_simple",
                    "channel": channel,
                    "id": localStorage.id,
                    "name": localStorage.name,
                    "email": localStorage.email,
                    "message": $scope.user.message,
                    "friend_id": friend_id
                };
                // gui kenh chat len server de server mo socket
                if (arrchanel[channel] != 1) {
                    socket.emit('chat message', item);
                    arrchanel[channel] = 1;
                }
                // gui message len khi server da mo xong socket
                socket.emit(channel, item);
                $scope.user.message = "";

                //edit notification
                notification_edit(channel);
            }
        };


        //search ban bang email
        $scope.search = "";
        $scope.submitsearch = function() {
            $scope.listpeople = "";
            var urlsearch = http + "searchemail/" + $scope.search;
            $http.get(urlsearch)
                .success(function(data) {
                    if (data == value_false) {
                        $scope.notfound = "not found";
                    } else {
                        $scope.listpeople = data;
                    }
                })
                .error(function(data) {

                })

        };

        // chon ban chat khi search
        $scope.selectpeople = function(id, name) {
            //chat voi nguoi nay
            var url_search_channel = http + "checkchannel/" + localStorage.id + "/" + id;
            $http.get(url_search_channel)
                .success(function(data, status, headers, config) {
                    if (data.length != 0) {
                        friend_id = id;
                        selected_channel(data, name);
                    } else {
                        alert('loi he thong');
                    }
                })
        };
        // Lang nghe kenh cua chinh minh de nhan tin nhan cua nguoi khac
        // tao 1 mang de chua nhung nguoi nhan den
        // khi nguoi dung nhan den, xoa item cu, push item moi
        var arr_listen_me = [];
        var arr_index_arr_listen_me = [];
        var index_arr_listen_me;
        var count_arr_listen_me = [];

        function listen_me() {
            socket.on(localStorage.id, function(data) {
                index_arr_listen_me = arr_index_arr_listen_me.indexOf(data.channel);
                if (index_arr_listen_me > -1) {
                    arr_listen_me.splice(index_arr_listen_me, 1);
                    arr_index_arr_listen_me.splice(index_arr_listen_me, 1);
                }
                if (count_arr_listen_me[data.channel]) {
                    count_arr_listen_me[data.channel] += 1;
                } else {
                    count_arr_listen_me[data.channel] = 1;
                }
                arr_listen_me.push({
                    "data": data,
                    "count": count_arr_listen_me[data.channel]
                });
                arr_index_arr_listen_me.push(data.channel);
                $scope.$apply(function() {
                    $scope.friends = arr_listen_me;
                })
                // luu tin nhan vao conntentmessage[channel]
                if(conntentmessage[data.channel]== null){
                    conntentmessage[data.channel] = [];
                    conntentmessage[data.channel].push(data);
                    socket.on(data.channel, function(objectmessage) {
                    conntentmessage[data.channel].push(objectmessage);
                    $scope.$apply(function() {
                        $scope.messages = conntentmessage[data.channel];
                    })
                });
                }

            })
        };
        //cap nhat notification
        var index_notifi;

        function notification_edit(channel_id) {
            index_notifi = arr_index_arr_listen_me.indexOf(channel_id);
            if (count_arr_listen_me[channel_id] && arr_listen_me[index_notifi]) {
                count_arr_listen_me[channel_id] = 0;
                arr_listen_me[index_notifi].count = 0;
            }
        }
        // khi nguoi dung chon ban chat o new_friend
        $scope.new_friend = function(channel_id, name, friendid) {
            friend_id = friendid;
            notification_edit(channel_id);
            selected_channel(channel_id, name);
        };

    }

]);

appController.controller('loginController', ['$scope', '$http',
    function($scope, $http) {

        $scope.user = {};
        $scope.submituser = function() {
            var url = http + "login/" + $scope.user.email + "/" + $scope.user.password;
            $http.get(url)
                .success(function(data, status, headers, config) {
                    if (data != value_false) {
                        localStorage.name = data.name;
                        localStorage.id = data.id;
                        localStorage.email = data.email;
                        window.location = "#/";
                    } else {
                        $scope.loginfailed = "Đăng nhập thất bại";
                    }
                })
                .error(function(data, status, headers, config) {

                });
        }
    }
]);
appController.controller('signupController', ['$scope', '$http',
    function($scope, $http) {
        $scope.usersign = {};
        $scope.submitusersign = function() {
            var url = http + "signup/" + $scope.usersign.email + "/" + $scope.usersign.name + "/" + $scope.usersign.password;
            $http.get(url)
                .success(function(data, status, headers, config) {
                    if (data == "failed") {
                        $scope.status = "Failed! Email has existed";
                    } else {
                        localStorage.name = $scope.usersign.name;
                        localStorage.id = data;
                        window.location = "#/";
                    }
                })
                .error(function(data, status, headers, config) {

                });
        }
    }
]);