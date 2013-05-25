/**
 * @fileverview 日志操作相关模块内容
 *
 * @author <a href="mailto:xukai.ken@gmail.com">XU Kai</a>
 * @date 2013.05.24
 *
 */

define(['libs/jquery', 'common/components', 'common/interface'], function(_, compts, i) {

    var Dialog = compts.Dialog;

    var init = function() {

        var respondFormEl = document.getElementById('respond-form');
        var submitEl = _(respondFormEl.submit);

        submitEl.bind('click', function() {
            var authorEl = respondFormEl.author, mailEl = respondFormEl.mail, websideEl = respondFormEl.webside, commentEl = respondFormEl.comment;

            // 校验信息的有效性
            if (_.trim(authorEl.value).length == 0) {
                YYMG._tp.dialog = new Dialog({
                    type : 'error',
                    content : '姓名不能为空！'
                });
                return;
            }
            if (_.trim(mailEl.value).length == 0) {
                YYMG._tp.dialog = new Dialog({
                    type : 'error',
                    content : '邮箱地址不能为空！'
                });
                return;
            }
            if (_.trim(commentEl.value).length == 0) {
                YYMG._tp.dialog = new Dialog({
                    type : 'error',
                    content : '评论内容不能为空！'
                });
                return;
            }

            var params = 'author=' + authorEl.value + '&mail=' + mailEl.value + '&webside=' + websideEl.value + '&comment=' + commentEl.value + '&postId=' + YYMG.pid;
            _.post(i.ADD_COMMENT, params, function() {
                
            }, function() {
                
            });
        });
        _(respondFormEl).bind('submit', function() {
            return false;
        });
    };

    return {
        init : init
    };
});
