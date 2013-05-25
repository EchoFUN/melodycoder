/**
 * @fileverview 前端基本组件库
 * @author xukai.ken@gmail.com
 */

define(['libs/jquery', 'libs/mustache', 'common/tpl'], function(_, mustache, tpl) {

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
        return this;
    };
    
    Dialog.prototype._ready = function() {
        
        // 如果已经存在则删除
        var dialogs = _('.dialog');
        dialogs.remove();
        
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
        if (opts.showClose) {
            close.bind('click', function() {
                dialogEl.remove();
            });
        } else {
            close.remove();
        }
        
        // 设置自动隐藏
        var ah = opts.autoHide;
        if (ah) {
            if (typeof ah == 'number') {
                window.setTimeout(function() {
                    dialogEl.remove();
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
        var button = new Element('a', {'class': 'button', 'href': 'javascript:;'}).update(value);
        if (Object.isFunction(callback)) {
            var self = this;
            button.observe('click', function() {
                callback.call(self);
            });
        }
        
        var footer = this._footerEl;
        footer.appendChild(button);
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
        this._dialogEl.remove();
    };

    return {
        Dialog: Dialog
    }
});
