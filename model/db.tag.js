/**
 * @fileoverview 系统中关于标签的操作
 * @version 2012.10.03
 */

exports.getWidgetTags = function(callback) {
	var Tag = db.models.Tag;
	Tag.find().exec(function(error, oriTags) {
		var tags = [];
		for (var i = 0; i < oriTags.length; i++) {
			_t = oriTags[i];
			var _has = false;
			for(var j=0; j<tags.length; j++) {
				if(tags[j].title == _t.title) {
					;
				}
			}
		}
		callback(tags);
	});
}
