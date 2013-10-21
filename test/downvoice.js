
var fs = require('fs'),
    Client = require('../lib/client'),
    client = new Client('voice1min.duapp.com'),
    config = require('../config/')('local');


var files = [
    "5656.mp3",
    "6358.mp3",
    "6773.mp3",
    "6774.mp3",
    "6810.mp3",
    "6809.mp3",
    "6398.mp3",
    "6871.mp3",
    "6119.mp3",
    "5969.mp3",
    "6354.mp3",
    "5905.mp3",
    "6771.mp3",
    "6555.mp3",
    "6437.mp3",
    "6772.mp3",
    "6374.mp3",
    "6876.mp3",
    "6740.mp3",
    "6733.mp3",
    "5810.mp3",
    "6399.mp3",
    "6843.mp3",
    "6870.mp3",
    "5802.mp3",
    "5968.mp3",
    "5582.mp3",
    "6557.mp3",
    "6875.mp3",
    "6364.mp3",
    "7045.mp3",
    "7075.mp3",
    "7096.mp3",
    "7099.mp3",
    "7100.mp3",
    "7204.mp3",
    "7205.mp3",
    "7359.mp3",
    "7360.mp3",
    "7386.mp3"
]

files.forEach(function(file, i) {
    client.get('/voice/' + file, {}, {}, function(err, res, buf) {
        if (! buf) return;
        var path = config.voiceDir + '/' + file;
        fs.existsSync(path) || fs.writeFile(path, buf, function(err) {
            if (err) throw err;
            console.log('downed: ' + file);
        });
    });
});