
function wxToXml(obj) {
	if (! obj) return '';
	var xml = '<xml>';
	xml += [
		'<ToUserName><![CDATA['+ obj.toUserName +']]></ToUserName>',
		'<FromUserName><![CDATA['+ obj.fromUserName +']]></FromUserName>',
		'<CreateTime>'+ obj.createTime +'</CreateTime>',
		'<MsgType><![CDATA['+ obj.msgType +']]></MsgType>'
	].join('');
	if (obj.msgId) {
		xml += '<MsgId>'+ obj.msgId +'</MsgId>';
	}
	if (obj.msgType === 'text') {
		xml += [
			'<Content><![CDATA['+ obj.content +']]></Content>'
		].join('');
	} else if (obj.msgType === 'image') {
		xml += [
			'<PicUrl><![CDATA['+ obj.picUrl +']]></PicUrl>'
		].join('');
	} else if (obj.msgType === 'voice') {
		xml += [
			'<MediaId><![CDATA['+ obj.mediaId +']]></MediaId>',
			'<Format><![CDATA['+ obj.format +']]></Format>',
			'<Recognition><![CDATA['+ obj.recognition +']]></Recognition>'
		].join('');
	} else if (obj.msgType === 'link') {
		xml += [
			'<Title><![CDATA['+ obj.title +']]></Title>',
			'<Description><![CDATA['+ obj.description +']]></Description>',
			'<Url><![CDATA['+ obj.url +']]></Url>'
		].join('');
	} else if (obj.msgType === 'event') {
		xml += [
			'<Event><![CDATA['+ obj.event +']]></Event>',
			'<EventKey><![CDATA['+ (obj.eventKey || '') +']]></EventKey>'
		].join('');
	} else if (obj.msgType === 'music') {
		xml += [
            '<Music>',
                '<Title><![CDATA['+ obj.music.title +']]></Title>',
                '<Description><![CDATA['+ obj.music.description +']]></Description>',
                '<MusicUrl><![CDATA['+ obj.music.musicUrl +']]></MusicUrl>',
                '<HQMusicUrl><![CDATA['+ obj.music.hqMusicUrl +']]></HQMusicUrl>',
            '</Music>'
		].join('');
	} else if (obj.msgType === 'location') {
		xml += [
			'<Location_X>'+ obj.locationX +'</Location_X>',
			'<Location_Y>'+ obj.locationY +'</Location_Y>',
			'<Scale>'+ obj.scale +'</Scale>',
			'<Label><![CDATA['+ obj.label +']]></Label>'
		].join('');
	} else if (obj.msgType === 'news') {
        var maxCount = 10,
            count = Math.min(obj.articles.length, maxCount);
        xml += '<ArticleCount>'+ count +'</ArticleCount>';
        _.each(obj.articles, function(val) {
            xml += [
                '<Articles>',
                '<item>',
                '<Title><![CDATA['+ val.title +']]></Title>',
                '<Description><![CDATA['+ val.description +']]></Description>',
                '<PicUrl><![CDATA['+ val.picUrl +']]></PicUrl>',
                '<Url><![CDATA['+ val.url +']]></Url>',
                '</item>',
                '</Articles>'
            ].join('');
        });
	}
	xml += '</xml>';
	return xml;
}
function wxToObj(xml) {
    if (! xml) return null;
	try {
		var $xml = $(xml),
			obj = {
				toUserName: getCData($xml.find('ToUserName').html()),
				fromUserName: getCData($xml.find('FromUserName').html()),
				createTime: parseInt($xml.find('CreateTime').html()),
				msgType: getCData($xml.find('MsgType').html())
			}
		if ($xml.find('MsgId').length) {
			obj.msgId = parseInt($xml.find('MsgId').html());
		}
		if (obj.msgType === 'text') {
			_.extend(obj, {
				content: getCData($xml.find('Content').html())
			});
		} else if (obj.msgType === 'image') {
			_.extend(obj, {
				picUrl: getCData($xml.find('PicUrl').html())
			});
		} else if (obj.msgType === 'voice') {
			_.extend(obj, {
				mediaId: getCData($xml.find('MediaId').html()),
				format: getCData($xml.find('Format').html()),
				recognition: getCData($xml.find('Recognition').html())
			});
		} else if (obj.msgType === 'link') {
			_.extend(obj, {
				title: getCData($xml.find('Title').html()),
				description: getCData($xml.find('Description').html()),
				url: getCData($xml.find('Url').html())
			});
		} else if (obj.msgType === 'event') {
			_.extend(obj, {
				event: getCData($xml.find('Event').html()),
				eventKey: getCData($xml.find('EventKey').html())
			});
		} else if (obj.msgType === 'music') {
			_.extend(obj, {
                music: {
                    title: getCData($xml.find('Music Title').html()),
                    description: getCData($xml.find('Music Description').html()),
                    musicUrl: getCData($xml.find('Music MusicUrl').html()),
                    hqMusicUrl: getCData($xml.find('Music HQMusicUrl').html())
                }
			});
		} else if (obj.msgType === 'location') {
			_.extend(obj, {
				locationX: Number($xml.find('Location_X').html()),
				locationY: Number($xml.find('Location_Y').html()),
				scale: Number($xml.find('Scale').html()),
				label: getCData($xml.find('Label').html())
			});
		} else if (obj.msgType === 'news') {
            _.extend(obj, {
                articles: (function() {
                    var ret = [], $articles = $xml.find('Articles');
                    $articles.children('item').each(function(i, el) {
                        var $el = $(el);
                        ret.push({
                            title: getCData($el.find('Title').html()),
                            description: getCData($el.find('Description').html()),
                            picUrl: getCData($el.find('PicUrl').html()),
                            url: getCData($el.find('Url').html())
                        });
                    });
                    return ret;
                })()
            });
		}
		return obj;
	} catch (err) {
        console.error(err);
		return null;
	}
}

function getCData(str){
	if (! str) return '';
	//return str.substring(11, str.length - 5);
	return str.match(/^\s*(<!\-\-|&lt;!)\[CDATA\[([\s\S]*)\]\](&gt;|\-\->)\s*$/)[2];
}
