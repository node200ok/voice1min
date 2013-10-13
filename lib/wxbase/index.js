
var _ = require('underscore'),
    wxParser = require('./parser'),
	wxValid = require('./valid');

module.exports = function(options) {
	var app = options.app,
		wxPath = options.wxPath,
		wxToken = options.wxToken,
		wxHandler = options.wxHandler,
		wxValidPost = options.wxValidPost;
	wxValid.init({
		wxToken: wxToken
	});

	app.get(wxPath, wxValid.valid);
	if (wxValidPost) {
		app.post(wxPath, wxValid.valid);
	}
	app.post(wxPath, function(req, res, next) {
		try {
			var reqXml = req.rawBody,
				reqObj = wxParser.toObj(reqXml);
			if (! reqObj) {
				throw new Error('No ReqObj');
			}
			var resObj = {
                    toUserName: reqObj.fromUserName,
                    fromUserName: reqObj.toUserName,
                    createTime: new Date().getTime()
                }
            wxHandler.handle(reqObj, function(resExt) {
                if (resExt) {
                    _.extend(resObj, resExt);
                } else {
                    resObj = null;
                }
				var resXml = wxParser.toXml(resObj);
				res.send(resXml);
			});
		} catch (err) {
            console.error(err);
			res.send('');
		}
	});
}
