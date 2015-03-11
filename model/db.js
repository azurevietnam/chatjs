var mongo = require('mongodb');
var ObjectId = require('mongoose').Types.ObjectId;
Db = mongo.Db;
Server = mongo.Server;
var server = new Server('127.0.0.1', 27017, {
    w: -2,
    journal: false,
    fsync: false,
    safe: false
});
var server1 = new Server('127.0.0.1', 27017, {
    w: -2,
    journal: false,
    fsync: false,
    safe: false
});
var server2 = new Server('127.0.0.1', 27017, {
    w: -2,
    journal: false,
    fsync: false,
    safe: false
});
var server3 = new Server('127.0.0.1', 27017, {
    w: -2,
    journal: false,
    fsync: false,
    safe: false
});
var server4 = new Server('127.0.0.1', 27017, {
    w: -2,
    journal: false,
    fsync: false,
    safe: false
});
var dbmessage = new Db('chatjs', server);
var dbchannel = new Db('chatjs', server1);
var dbuser = new Db('chatjs', server2);
var dbgroup = new Db('chatjs', server3);
var dbfriends = new Db('chatjs', server4);
var value_false = 'ilovenhung@';
module.exports = {
    // create user
    // user:{ name,email,password}
    create_user: function(user, callback) {
        dbuser.open(function(err, dbuser) {
            if (!err) {
                dbuser.collection('user', function(err, collection) {
                    if (!err) {
                        collection.insert(user, {
                            w: 1
                        }, function(err, records) {
                            dbuser.close();
                            if (!err) {
                                return callback(records);
                            } else {
                                console.log(err);
                                return err;
                            }


                        })
                    } else {
                        console.log(5);
                        console.log(err);
                        return err;
                    }
                })
            } else {
                console.log(err);
            }
        })

    },
    //create channel
    create_channel: function(channel, callback) {
        dbchannel.open(function(err, db) {
            if (!err) {
                db.collection('channel', function(err, collection) {
                    if (!err) {
                        collection.insert(channel, {
                            w: 1
                        }, function(err, records) {
                            if (!err) {
                                return callback(records);
                            } else {
                                console.log(err);
                            }
                            db.close();
                        })
                    }
                })
            } else {
                console.log(err);
            }
        });
    },
    create_group: function(channel, callback) {
        dbgroup.open(function(err, db) {
            if (!err) {
                db.collection('group', function(err, collection) {
                    collection.insert(channel, {
                        w: 1
                    }, function(err, records) {
                        db.close();
                        if (!err) {
                            return callback(records);
                        } else {
                            console.log(err);
                        }

                    })
                })
            } else {
                console.log(err);
            }
        });
    },
    insert_message: function(message, callback) {
        dbmessage.open(function(err, db) {
            if (!err) {
                db.collection('messages', function(err, collection) {
                    if (!err) {
                        var date = new Date();
                        date = date.toISOString();
                        var item = {
                            "channel": message.channel,
                            "user": message.id,
                            "message": message.message,
                            "ctime": date
                        }
                        collection.insert(item, {
                            w: 1
                        }, function(err, records) {
                            db.close();
                            if (!err) {
                                return callback(records);
                            } else {
                                console.log(err);
                            }

                        })
                    }
                })
            }
        })
    },
    // check login
    check_login: function(email, password, callback) {
        dbuser.open(function(err, db) {
            if (!err) {
                db.collection('user', function(err, collection) {
                    if (!err) {
                        var query = {
                            'email': email,
                            'password': password
                        };
                        collection.find(query).toArray(function(err, docs) {
                            db.close();
                            if (!err) {
                                if (docs.length > 0) {
                                    var result = {
                                        'id': docs[0]._id,
                                        'name': docs[0].name,
                                        'email': docs[0].email
                                    };
                                    return callback(result);
                                } else {
                                    return callback("ilovenhung@");
                                }
                            } else {
                                console.log(err);
                            }

                        })
                    }
                })
            }
        });
    },
    //search email
    search_email: function(email, callback) {
        dbuser.open(function(err, db) {
            if (!err) {
                db.collection('user', function(err, collection) {
                    var query = {
                        'email': {
                            $regex: email,
                            $options: "$i"
                        }
                    };
                    collection.find(query).toArray(function(err, docs) {
                        db.close();
                        if (!err) {
                            if (docs.length > 0) {
                                var result = [];
                                var obj;
                                for (var i = 0; i < docs.length; i++) {
                                    obj = {
                                        'id': docs[i]._id,
                                        'name': docs[i].name,
                                        'email': docs[i].email
                                    }
                                    result.push(obj);
                                }
                                // var result = {'id':docs[0]._id,'name':docs[0].name};
                                return callback(result);
                            } else {
                                return callback(value_false);
                            }
                        } else {
                            console.log(err);
                        }
                    })
                })
            }
        })
    },
    // tim kiem kenh
    search_channel: function(id1, id2, callback) {
        dbchannel.open(function(err, db) {
            if (!err) {
                db.collection('channel', function(err, collection) {
                    var query = {
                        'user': [id1, id2]
                    };
                    collection.find(query).toArray(function(err, docs) {
                        // db.close();
                        if (!err) {
                            if (docs.length > 0) {
                                db.close();
                                return callback(docs);
                            } else {
                                var query = {
                                    'user': [id2, id1]
                                };
                                collection.find(query).toArray(function(err, docs1) {
                                    db.close();
                                    if (docs1.length > 0) {
                                        return callback(docs1);
                                    } else {
                                        return callback(value_false);
                                    }
                                })
                            }
                        } else {
                            console.log(err);
                        }
                    })
                });
            } else {
                console.log(err);
            }
        })
    },
    //check friend
    check_friend: function(id1, id2, callback) {
        dbfriends.open(function(err, db) {
            if (!err) {
                db.collection('friends', function(err, collection) {
                    if (!err) {
                        var query = {
                            "user_id1": id1,
                            "user_id2": id2
                        };
                        collection.find(query).toArray(function(err, docs) {
                            if (!err) {
                                if (docs.length > 0) {
                                    db.close();
                                    return callback(1);
                                } else {
                                    var query1 = {
                                        "user_id1": id2,
                                        "user_id2": id1
                                    };
                                    collection.find(query1).toArray(function(err, docs1) {
                                        db.close();
                                        if (!err) {
                                            if (docs1.length > 0) {
                                                return callback(1);
                                            } else {
                                                return callback(0);
                                            }
                                        } else {
                                            console.log(err);
                                        }
                                    });
                                }
                            } else {
                                console.log(err);
                            }
                        })
                    } else {
                        console.log(err);
                    }
                })
            }
        })
    },
    //add friend
    add_friend: function(id1, id2, callback) {
        dbfriends.open(function(err, db) {
            if (!err) {
                db.collection('friends', function(err, collection) {
                    if (!err) {
                        var date = new Date();
                        date = date.toISOString();
                        collection.insert({
                            "user_id1": id1,
                            "user_id2": id2,
                            "ctime": date
                        }, {
                            w: 1
                        }, function(err, records) {
                            db.close();
                            if (!err) {
                                return callback(records);
                            } else {
                                console.log(err);
                            }
                        });
                    } else {
                        console.log(err);
                    }
                })
            } else {
                console.log(err);
            }
        })
    },
    list_friend: function(id, callback) {
        dbfriends.open(function(err, db) {
            if (!err) {
                db.collection('friends', function(err, collection) {
                    if (!err) {
                        var query = {
                            $or: [{
                                "user_id1": id
                            }, {
                                "user_id2": id
                            }]
                        };
                        collection.find(query).limit(10).toArray(function(err, docs) {
                            db.close();
                            if (!err) {
                                // user_id1: 1,
                                // user_id2: 2

                                //select name
                                dbuser.open(function(err, dbuser) {
                                    if (!err) {
                                        var friends = [];
                                        var userid;
                                        var count = 0;
                                        for (var i = 0; i < docs.length; i++) {
                                            if (docs[i].user_id1 == id) {
                                                userid = docs[i].user_id2;
                                            } else {
                                                userid = docs[i].user_id1;
                                            }
                                            dbuser.collection('user', function(err, collection1) {
                                                if (!err) {
                                                    var query = {
                                                        "_id": new ObjectId(userid)
                                                    };
                                                    (function(userid) {
                                                        collection1.find(query).toArray(function(err, docs1) {
                                                            if (!err) {
                                                                if (docs1.length > 0) {
                                                                    if (!err) {
                                                                        friends.push(docs1[0]);
                                                                    } else {
                                                                        console.log(err);
                                                                    }
                                                                }
                                                                count++;
                                                                if (count == docs.length) {
                                                                    dbuser.close();
                                                                    return callback(friends);
                                                                }
                                                            } else {
                                                                console.log(err);
                                                            }
                                                        })
                                                    })(userid);

                                                }
                                            })
                                        }


                                    } else {
                                        console.log(err);
                                    }
                                }) // end dbuser

                            } else {
                                console.log(err);
                            }
                        })
                    } else {
                        console.log(err);
                    }
                })
            } else {
                console.log(err);
            }
        })

    },
    check_email: function(email, callback) {
        dbuser.open(function(err, db) {
            db.collection("user", function(err, collection) {
                var query = {
                    "email": email
                }
                collection.find(query).toArray(function(err, docs) {
                    db.close();
                    if (!err) {
                        if (docs.length > 0) {
                            return callback("1");
                        } else {
                            return callback("0");
                        }
                    } else {
                        console.log(err);
                    }

                })
            })
        })
    },
    // select message: n message, to message p
    select_message: function(n, p, channel, callback) {
        dbmessage.open(function(err, db) {
            db.collection("messages", function(err, collection) {
                if (!err) {
                    var query = {
                        "channel": channel
                    };
                    var option = {
                        "limit":n,
                        "skip":p
                    };
                    collection.find(query).toArray(err, function(data) {
                        db.close();
                        if (!err) {
                            return callback(data);
                        } else {
                            console.log(err);
                        }
                    })
                } else {
                    console.log(err);
                }

            })
        })
    }

}