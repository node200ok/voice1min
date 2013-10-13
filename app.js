
var http = require('http'),
	fs = require('fs'),
	_ = require('underscore'),
	express = require('express'),
	mongodb = require('mongodb'),
	mode = (process.argv && process.argv[2]) || 'bae', // 运行模式
	config = global.config = require('./config/')(mode),
	app = global.app = express(),
	wxbase = require('./lib/wxbase/');

app.configure(function() {
	// 确保目录存在
	_.each(['publicDir', 'voiceDir'], function(val) {
		fs.existsSync(config[val]) || fs.mkdir(config[val]);
	});
	
	app.set('env', config.env);
	app.use(express.favicon());
	app.use(express.bodyParser({uploadDir: config.tmpDir}));
	app.use(require('./lib/rawbody'));
});

// 使用 wxbase
wxbase({
	app: app,
	wxPath: config.wxPath,
	wxToken: config.wxToken,
	wxHandler: require('./lib/my-wx-handler').init({
		app: app,
		hostUrl: config.hostUrl,
		publicDir: config.publicDir,
		voiceDir: config.voiceDir,
		wxAccount: config.wxAccount
	}),
	wxValidPost: config.wxValidPost
});

app.use(express.static(config.publicDir));

var mongo = config.mongo,
    db = new mongodb.Db(mongo.dbname, new mongodb.Server(mongo.host, mongo.port, {}), {w: 1});
db.open(function(err, db) {
    if (! mongo.username) {
        onDbInit(db);
    } else {
        db.authenticate(mongo.username, mongo.password, function(err, result) {
            if (! result) {
                db.close();
                throw new Error('Authenticate Failed');
                return;
            } else {
                onDbInit(db);
            }
        });
    }
});

function onDbInit(db) {
    global.db = db;
    http.createServer(app).on('error', function(err) {
        throw new Error('Port ' + config.port + ' Occupied');
    }).listen(config.port, function() {
        console.log('Listening on port ' + config.port);
    });
}

