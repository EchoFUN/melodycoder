/**
 * @fileverview 前端模板文件
 * @author xukai.ken@gmail.com
 */

define(function(require, exports, module) {
	
	// 评论模板
	exports.commentTPL = '<div class="comment-item" data-rid="#{pid}">\
			    			<div class="reply-comment right">\
			    				<a href="javascript:;">回复</a>\
			    			</div>\
			    			<div class="avatar"><img height="38" width="38" src="http://cdn.v2ex.com/static/img/avatar_normal.png"></div>\
			    			<div class="comment-info">\
			    				<div class="name"><a href="#{webside}">#{author}</a>&nbsp;说：</div>\
	    						<div class="date">#{month}&nbsp;#{date},&nbsp;#{year}&nbsp;at&nbsp;#{hour}:#{minute}</div>\
			    			</div>\
			    			<div class="clear"></div>\
			    			<div class="comment-content">#{comment}</div>\
			    		</div>';
	   
	  exports.dialogTPL = '<div class="normal">\
	                           <div class="dialog-title">\
	                               <a href="javascript:;" class="title left">{{title}}</a>\
	                               <a href="javascript:;" class="close right">关闭</a>\
	                           </div>\
	                           <div class="dialog-content">{{content}}</div>\
	                           <div class="dialog-footer" ></div>\
	                       </div>'; 
});