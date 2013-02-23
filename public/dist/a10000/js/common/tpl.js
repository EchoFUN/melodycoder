/**
 * @fileverview 前端模板文件
 * @author xukai.ken@gmail.com
 */

define(function(require, exports, module) {
	
	// 评论模板
	exports.commentTPL = '<div class="comment odd" data-rid="#{pid}">\
	    					<div class="avatar">\
	    						<img height="38" width="38" src="">\
	    					</div>\
    						<div class="comment-info">\
	    						<div class="name"><a href="#{webside}">#{author}</a>&nbsp;说：</div>\
	    						<div class="date">#{month}&nbsp;#{date},&nbsp;#{year}&nbsp;at&nbsp;#{hour}:#{minute}</div>\
	    					</div>\
	    					<div class="clear"></div>\
	    					<div class="comment-content">#{comment}</div>\
	    				</div>';
	   
	  exports.dialogTPL = ''; 
	
});