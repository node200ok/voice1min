
var _ = require('underscore'),
	taffy = require('taffy'),
    db = global.db;

var activities = taffy(require('./activities/')),
	users = taffy([]),
    rootActivity = activities({
        name: 'root'
    }).first();

exports.init = function(options) {
	if (! rootActivity) {
		throw new Error('RootActivity Not Found');
	}
    activities({}).each(function(val) {
        val.link = link;
    });
    rootActivity.init(options);

    var app = options.app;
	// manage users
	app.get('/list_users', function(req, res, next) {
		res.send(users({}).get());
	});
	app.get('/clear_users', function(req, res, next) {
		users({}).remove();
		res.send(users({}).get());
	});
	return this;
}

exports.handle = function(reqObj, callback) {
	var msgType = reqObj.msgType,
        username = reqObj.fromUserName,
		user = users({
			username: username
		}).first();
	if (! user) {
		user = {
			username: username,
			inActivity: rootActivity.name
		}
		users.insert(user);
	}

    if (msgType === 'event') {
        handleEvent(reqObj, callback);
    } else {
        var activity = activities({
            name: user.inActivity
        }).first() || rootActivity;
        activity.reply(reqObj, callback);
    }
}

function link(name, method, reqObj, callback) {
    users({
        username: reqObj.fromUserName
    }).first().inActivity = name;
    activities({
        name: name
    }).first()[method](reqObj, callback);
}

function handleEvent(reqObj, callback) {
    var event = reqObj.event;
    if (event === 'subscribe') {
        rootActivity.welcome(reqObj, callback);
    } else if (event === 'unsubscribe') {
        users({
            username: reqObj.fromUserName
        }).remove();
        callback(null);
    } else {
        callback(null);
    }
}


