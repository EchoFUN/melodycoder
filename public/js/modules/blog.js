/**
 * @fileverview 日志操作相关模块内容
 *
 * @author <a href="mailto:xukai.ken@gmail.com">XU Kai</a>
 * @date 2013.05.24
 *
 */

define(['l/jquery', 'c/components', 'c/interface', 'c/tpl', 'l/mustache'], function(_, compts, i, tpl, mustache) {

    var Dialog = compts.Dialog;

    var init = function() {

        var respondFormEl = document.getElementById('respond-form');
        var submitEl = respondFormEl.submit, authorEl = respondFormEl.author, mailEl = respondFormEl.mail, websideEl = respondFormEl.webside, commentEl = respondFormEl.comment;

        _(submitEl).bind('click', function() {

            // 校验信息的有效性
            var verifyMessage;
            var check = function() {
                if (verifyMessage) {
                    new Dialog({
                        type : 'error',
                        content : verifyMessage
                    });
                    return true;
                }
                return false;
            };

            if (_.trim(authorEl.value).length === 0) {
                verifyMessage = '姓名不能为空！';
                if (check())
                    return;
            }
            if (_.trim(mailEl.value).length === 0) {
                verifyMessage = '邮箱地址不能为空！';
                if (check())
                    return;
            }
            if (_.trim(commentEl.value).length === 0) {
                verifyMessage = '评论不能为空！';
                if (check())
                    return;
            }

            // 通过验证，准备数据发送信息
            _.post(i.ADD_COMMENT, _(respondFormEl).serialize() + '&postId=' + YYMG.pid, function() {
            }, 'json').done(function(r) {
                if (r.status.code == 1) {
                    if (r.data.isApproved) {
                
                        // 插入数据
                        var date = new Date(r.data.time), m = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Spt', 'Oct', 'Nov', 'Dec'];
                        var view = {
                            pid : YYMG.pid,
                            author : authorEl.value,
                            comment : commentEl.value,
                            month : m[date.getMonth()],
                            date : date.getDate(),
                            year : date.getFullYear(),
                            hour : date.getHours(),
                            minute : date.getMinutes()
                        };
                        var targetHTML = mustache.render(tpl.commentTPL, view);
                        _(document.getElementById('comment-list')).append(targetHTML);
                    } else {
                        new Dialog({
                            content : '评论成功！需要管理员审核才能显示！'
                        });
                    }
                } else {
                    new Dialog({
                        type : 'error',
                        content : r.status.content
                    });
                }
            });
        });

        _(respondFormEl).bind('submit', function() {
            return false;
        });

        _(document.getElementById('comment-list')).delegate('.comment-item', 'mouseover', function() {
            _(this).find('.reply-comment').show();
        }).delegate('.comment-item', 'mouseout', function() {
            _(this).find('.reply-comment').hide();
        }).delegate('.reply-comment a', 'click', function() {
            var self = _(this), cmtItemEl = self.parent().parent();
            var cmtData = cmtItemEl.attr('data-reply');
            
            try {
                cmtData = eval('(' + cmtData + ')');
            } catch (e) {
                new Dialog({
                    type : 'error',
                    content : '数据解析错误！'
                });
                return;
            }

            var name = cmtData.name;
            commentEl.value += '@' + name + ' ';
        });
    };

    return {
        init : init
    };
});
