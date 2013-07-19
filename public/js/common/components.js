/**
 * @fileverview 前端基本组件库
 * @author xukai.ken@gmail.com
 */

define(['l/jquery', 'l/mustache', 'c/tpl'], function(_, mustache, tpl) {

    var Dialog = function(opts) {
        var dopts = {
            top : undefined,
            left : undefined,
            autoHide: undefined,
            title : '提示',
            frameTPL : tpl.dialogTPL,
            content : '',
            showClose : true
        }

        opts = _.extend(dopts, opts);
        this._opts = opts;
        this._ready();
        this._constructFrame();
        return YYMG._tp.dialog = this;
    };
    
    Dialog.prototype._ready = function() {
        
        // 如果已经存在则删除
        var dialog = YYMG._tp.dialog;
        dialog && dialog.close();
        
        this._dialogEl = document.createElement('div');
        this._dialogEl.className = 'dialog';
    };

    Dialog.prototype._constructFrame = function() {
        var opts = this._opts;

        var dialogEl = _(this._dialogEl);
        
        var frameHTML = mustache.render(opts.frameTPL, {
            title : opts.title,
            content:　opts.content
        });

        dialogEl.html(frameHTML);
        
        _(document.body).append(dialogEl);
        this.resetPos();
        
        // 获取footer部分
        this._footerEl = dialogEl.find('.dialog-footer');
        
        // 设置关闭按钮
        var close = this._closeEl = dialogEl.find('.close');                
        var self = this;
        if (opts.showClose) {
            close.bind('click', function() {
                self.close();
            });
        } else {
            close.remove();
        }
        
        // 设置自动隐藏
        var ah = opts.autoHide;
        if (ah) {
            if (typeof ah == 'number') {
                this.autoHide = window.setTimeout(function() {
                    self.close();
                }, ah * 1000);
            }
        }
    };
    
    Dialog.prototype.setWidth = function() {
        return this;  
    };
    
    Dialog.prototype.setContent = function() {
        return this;  
    };
    
    Dialog.prototype.addButton = function() {
        var button = document.createElement('a');
        button.className = 'button';
        button.href = 'javascript:;';
        
        if (typeof callback == 'function') {
            var self = this;
            button.bind('click', function() {
                callback.call(self);
            });
        }
        
        this._footerEl.append(button);
        return this;
    };
    
    Dialog.prototype.resetPos = function() {
        var dialogEl = _(this._dialogEl);

        var _diaW = dialogEl.css('width'), _diaH = dialogEl.css('height');

        var vp = _(window);
        var left = this._opts.left || (vp.width() - parseInt(_diaW)) / 2, top = this._opts.top || vp.scrollTop() + (vp.height() - parseInt(_diaH)) / 2;
        dialogEl.css({
            top : top + 'px',
            left : left + 'px'
        });
        return this;
    };
    
    Dialog.prototype.close = function() {
        _(this._dialogEl).remove();
        this.autoHide && clearTimeout(this.autoHide);
        YYMG._tp.dialog = null;
    };

    return {
        Dialog: Dialog
    }
});
