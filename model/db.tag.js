/**
 * @fileoverview 系统中关于标签的操作
 * @version 2012.10.03
 */

// 标签大小限制
var tagsLimit = 10;

exports.getWidgetTags = function(callback) {
	var Tag = db.models.Tag;
	Tag.find().exec(function(error, oriTags) {
		var tags = [];
		for (var i = 0; i < oriTags.length; i++) {
			_t = oriTags[i];
			var _has = false;
			for (var j = 0; j < tags.length; j++) {
				if (tags[j].title.trim() == _t.title.trim()) {
					_has = true; 
					if (tags[j].counter < tagsLimit)
						tags[j].counter++;
				}
			}
			if (!_has) {
				tags.push({
					title : _t.title,
					counter : 1
				})
			}
		}
		callback(error, tags);
	});
}
