
var path = require('path'),
    hostUrl = 'http://voice1min.duapp.com',
    rootDir = path.resolve(__dirname, '..'),
    publicDir = rootDir + '/public',
    voiceDir = publicDir + '/voice',
    pubVoiceDir = voiceDir.replace(publicDir, hostUrl);

module.exports = {
    hostUrl: hostUrl,
    rootDir: rootDir,
    publicDir: publicDir,
    voiceDir: voiceDir,
    pubVoiceDir: pubVoiceDir,
    voiceFormat: 'mp3',
    minSeconds: 20,
    wxPath: '/wx',
    wxToken: 'whahax',
    wxAccount: require('../private/wx-account')	// private
}
