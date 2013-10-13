
var fs = require('fs'),
    Client = require('../lib/client'),
    client = new Client('voice1min.duapp.com'),
    config = require('../config/')('local');


var files = [
    "5905.mp3",
    "5582.mp3",
    "5810.mp3",
    "6119.mp3",
    "5656.mp3",
    "5969.mp3",
    "5968.mp3",
    "5802.mp3"
]

files.forEach(function(file, i) {
    client.get('/voice/' + file, {}, {}, function(err, res, buf) {
        if (! buf) return;
        var path = config.voiceDir + '/' + file;
        fs.existsSync(path) || fs.writeFile(path, buf, function() {
            console.log('downed: ' + file);
        });
    });
});