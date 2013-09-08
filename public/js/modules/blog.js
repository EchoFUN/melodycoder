/**
 * @fileverview 日志操作相关模块内容
 *
 * @author <a href="mailto:xukai.ken@gmail.com">XU Kai</a>
 * @date 2013.05.24
 *
 */

define(['l/jquery', 'c/components', 'c/interface', 'c/tpl', 'l/mustache', 'c/utils'], function(_, compts, i, tpl, mustache, utils) {

  var Dialog = compts.Dialog;

  var init = function() {

    var respondFormEl = document.getElementById('respond-form');
    var submitEl = respondFormEl.submit, authorEl = respondFormEl.author, mailEl = respondFormEl.mail, websideEl = respondFormEl.webside, commentEl = respondFormEl.comment;

    _(submitEl).bind('click', function() {

      // 校验信息的有效性，包括了昵称，网站和邮箱
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

      var author = _.trim(authorEl.value), email = _.trim(mailEl.value), comment = _.trim(commentEl.value);
      if (author.length === 0) {
        verifyMessage = '姓名不能为空！';
        if (check())
          return;
      } else {
        if (!utils.regs.NICKNAME.test(author))
          verifyMessage = '姓名格式不正确！';
        if (check())
          return;
      }
      
      if (email.length === 0) {
        verifyMessage = '邮箱地址不能为空！';
        if (check())
          return;
      } else {
        if (!utils.regs.EMAIL.test(email))
          verifyMessage = '邮箱格式不正确！';
        if (check())
          return;
      }
      
      if (comment.length === 0) {
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
              author : r.data.author,
              comment : r.data.content,
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
