/**
 * 第三方组件，文字滚动
 * @class fish.desktop.widget.TextScroll
 * @author zhang.xiaofei10@zte.com.cn
 */

! function() {
    "use strict";

    $.widget('ui.textscroll', {
        options: {
            speed: 40, //滚动速度,值越大速度越慢
            rowHeight: 24 //每行的高度
        },

        _create: function() {
            this.element.find("ul").addClass("ts-ul");
            this.element.find("li").addClass("ts-li");
            this.element.find("li:even").addClass("ts-lieven");
        },

        _init: function() {
            this.timerId = null;
            //标志，记录用户是否手动调用了startScroll和stopScroll方法
            this.userFlag = false;
            this.isScrolling = false;
            this._delegateEvents();
            this.startScroll();
            this.userFlag = false; //控件自己处理滚动的，不算标志

            this.totalHeight = 0;
            var els = this.element.find("ul").find("li");
            if (els && els.length) {
                this.totalHeight = parseInt((els.length + 3) * this.options.rowHeight);
            }
        },

        _delegateEvents: function() {
            this._on({
                'mouseenter': '_stopScroll',
                'mouseleave': '_startScroll'
            });
        },

        _startScroll: function() {
            if (this.userFlag) return;
            this.startScroll();
            this.userFlag = false; //控件自己处理滚动的，不算标志
        },
        _stopScroll: function() {
            if (this.userFlag) return;
            this.stopScroll();
            this.userFlag = false; //控件自己处理滚动的，不算标志
        },

        _updatePosition: function(obj, step) {
            var me = this;
            var $el = me.element;
            var $ul = $el.find("ul");
            $ul.animate({
                marginTop: '-=1'
            }, 0, function() {
                var mt = Math.abs(parseInt($ul.css("margin-top")));
                if (mt > me.totalHeight) {
                    $ul.css("margin-top", $el.height());
                }
            });
        },
        /**
         *@method  startScroll
         */
        startScroll: function() {
            if (this.isScrolling) {
                return;
            }
            var me = this;
            me.userFlag = true;
            this.isScrolling = true;
            var $el = me.element;
            me.timerId = setInterval(function() {
                if ($el.find("ul").height() <= $el.height()) {
                    clearInterval(me.timerId);
                } else {
                    me._updatePosition();
                }
            }, me.options.speed);
        },
        /**
         *@method stopScroll
         */
        stopScroll: function() {
            this.userFlag = true;
            this.isScrolling = false;
            clearInterval(this.timerId);
        }
    });
}();
