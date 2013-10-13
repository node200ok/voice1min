
var fs = require('fs'),
    _  = require('underscore'),
    wxVoiceThief = require('../wx-voice-thief'),
    voiceDir, pubVoiceDir,
    config = global.config,
    voiceFormat = config.voiceFormat,
    minSeconds = config.minSeconds,
    delaySteal = 2000,
    rootActivity = module.exports = {};

var welcomeText = [
        '欢迎来到【一分钟歌声】',
        '回复数字1 - 随机听',
        '回复数字2 - 最新歌曲列表',
        '回复'+ minSeconds +'秒以上语音 - 送上你的歌声'
    ].join('\n');

rootActivity.init = function(options) {
    voiceDir = options.voiceDir;
    var app = options.app,
        hostUrl = options.hostUrl,
        publicDir = options.publicDir,
        wxAccount = options.wxAccount;
    pubVoiceDir = voiceDir.replace(publicDir, hostUrl);
    wxVoiceThief.init({
        wxAccount: wxAccount
    });

    // manage voice
    app.get('/voice/list', function(req, res, next) {
        fs.readdir(voiceDir, function(err, fileList) {
            res.send(fileList);
        });
    });
}
rootActivity.welcome = function(reqObj, callback) {
    var resExt = {
        msgType: 'text',
        content: welcomeText
    }
	callback(resExt);
}
rootActivity.reply = function(reqObj, callback) {
    var msgType = reqObj.msgType;
	if (msgType === 'text') {
		this.replyText(reqObj, callback);
	} else if (msgType === 'voice') {
		this.replyVoice(reqObj, callback);
	} else {
		this.welcome(reqObj, callback);
	}
}
rootActivity.replyText = function(reqObj, callback) {
	var text = reqObj.content;
	if (text === '1') {
		fs.readdir(voiceDir, function(err, fileList) {
            if (! fileList.length) {
                resExt = {
                    msgType: 'text',
                    content: '暂无歌曲'
                }
                callback(resExt);
                return;
            }
            var file = _.sample(fileList, 1)[0],
                id = parseInt(file);
                resExt = {
                    msgType: 'music',
                    music: {
                        title: '随机听',
                        description: '歌曲 ' + id,
                        musicUrl: pubVoiceDir + '/' + file,
                        hqMusicUrl: pubVoiceDir + '/' + file
                    }
                }
            callback(resExt);
        });
	} else if (text === '2') {
		this.link('latest', 'welcome', reqObj, callback);
	} else {
		this.welcome(reqObj, callback);
	}
}
rootActivity.replyVoice = function(reqObj, callback) {
    // delay to steal
    setTimeout(function() {
        var resExt;
        wxVoiceThief.steal(reqObj.createTime, function(err, media) {
            if (err) {
                console.error(err);
                resExt = {
                    msgType: 'text',
                    content: [
                        'Sorry~ 歌声未入列',
                        '请向我们反应以寻求人工处理',
                        'QQ: 273942569 - 杰英'
                    ].join('\n')
                }
            } else if (media['play_length'] < 1000 * minSeconds)  {
                resExt = {
                    msgType: 'text',
                    content: '你的歌声不足'+ minSeconds + '秒'
                }
            } else {
                var id = media['id'],
                    file = id + '.' + voiceFormat,
                    filePath = voiceDir + '/' + file;
                resExt = {
                    msgType: 'music',
                    music: {
                        title: '你提交了歌曲',
                        description: Math.floor(media['play_length'] / 1000) + '″  歌曲 ' + id,
                        musicUrl: pubVoiceDir + '/' + file,
                        hqMusicUrl: pubVoiceDir + '/' + file
                    }
                }
                fs.existsSync(filePath) || fs.writeFile(filePath, media['data'], function() {
                    console.log('saved voice: ' + file);
                });
            }
            callback(resExt);
        });
    }, delaySteal);
}

