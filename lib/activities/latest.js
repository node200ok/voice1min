
var fs = require('fs'),
    _ = require('underscore'),
    latestActivity = module.exports = {},
    config = global.config,
    voiceDir = config.voiceDir,
    pubVoiceDir = config.pubVoiceDir,
    voiceFormat = config.voiceFormat,
    listCount = 8;

latestActivity.welcome = function(reqObj, callback) {
    fs.readdir(voiceDir, function(err, fileList) {
        var text = [
                '【最新歌曲列表】',
                _.reduce(fileList.sort(function(a, b) {
                    return parseInt(b) - parseInt(a);
                }).slice(0, listCount), function(memo, val) {
                    var id = parseInt(val);
                    return memo + (memo && '\n')
                        + id + '.  歌曲 ' + id;
                }, ''),
                '回复编号 - 收听歌曲',
                '回复数字0 - 返回'
            ].join('\n'),
            resExt = {
                msgType: 'text',
                content: text
            };
        callback(resExt);
    });
}
latestActivity.reply = function(reqObj, callback) {
    var msgType = reqObj.msgType;
    if (msgType === 'text') {
        this.replyText(reqObj, callback);
    } else if (msgType === 'voice') {
        this.link('root', 'replyVoice', reqObj, callback)
    } else {
        this.welcome(reqObj, callback);
    }
}
latestActivity.replyText = function(reqObj, callback) {
    var text = reqObj.content;
    if (text === '0') {
        this.link('root', 'welcome', reqObj, callback);
    } else if (isNaN(parseInt(text))) {
        this.welcome(reqObj, callback);
    } else {
        var id = parseInt(text),
            file = id + '.' + voiceFormat;
        if (fs.existsSync(voiceDir + '/' + file)) {
            var resExt = {
                msgType: 'music',
                music: {
                    title: '收听歌曲',
                    description: '歌曲 ' + id,
                    musicUrl: pubVoiceDir + '/' + file,
                    hqMusicUrl: pubVoiceDir + '/' + file
                }
            }
            callback(resExt);
        } else {
            this.welcome(reqObj, callback);
        }
    }
}

