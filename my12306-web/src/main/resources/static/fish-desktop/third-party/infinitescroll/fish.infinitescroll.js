/**
 * 第三方组件，滚动加载更多
 * @class fish.desktop.widget.infinitescroll
 * @extends fish.desktop.widget
 * @author zhang.wei
 * @since V3.13.0
 */

!function() {
    "use strict";
    $.widget('ui.infinitescroll', {
        options: {
            /**
             * @cfg {String} domClass='infinitescroll-down'
             * 加载区域样式名
             */
            domClass: 'infinitescroll-down',
            /**
             * @cfg {String} domLoad='<div class="infinitescroll-load">加载中...</div>'
             * 加载更多模版,中文语言时显示‘加载中...’;英文时显示‘Loading’
             */
            domLoad: "",
            /**
             * @cfg {String} emptyrecords="无数据显示",
             * 没有数据时，展示的提示语,中文语言时显示‘无数据显示’;英文时显示‘No records to view’
             */
            emptyrecords: "",
            /**
             * @cfg {Function} loadData=null
             * 请求数据的回掉函数
             */
            loadData : null,
            /**
             * @cfg {Number} scrollThrottle=400
             * 等待执行滚动事件的时间，单位是毫秒
             */
            scrollThrottle: 400,
        },

        _create: function() {
            this.isEmpty = false,
            this.loading = false,
            this.element.append("<div class=" + this.options.domClass + ">");
            this.$domDown = $("." + this.options.domClass);
            this._delegateEvents();
        },

        _init: function() {
            this._scrollWindowHeight = this.element.height();
            this._scrollContentHeight = this.element[0].scrollHeight;
            if (!this.options.emptyrecords) {
                this.options.emptyrecords = fish.getResource("common.emptyrecords");
            }
            if (!this.options.domLoad) {
                this.options.domLoad = '<div class="infinitescroll-load">' + fish.getResource("common.loading") + "</div>";
            }
        },

        _delegateEvents: function() {
            var self = this;
            this._on(this.element,{
                'scroll': fish.debounce(function(e){
                    self._scrollTop = self.element.scrollTop();

                    // 滚动页面触发加载数据
                    if (!self.loading && self._scrollContentHeight <= self._scrollWindowHeight + self._scrollTop) {
                        self.loading = true;
                        self._loadDown();
                        e.preventDefault();
                        e.stopPropagation();
                    }
                },this.options.scrollThrottle)
            });
        },

        _loadDown: function() {
            this.$domDown.html(this.options.domLoad);
            if (fish.isFunction(this.options.loadData)) {
              this.options.loadData.call(this);
            }
        },

        noData: function() {
            this.isEmpty = true;
        },

        resetLoad: function() {
            var self = this;
            this.loading = false;
            this._scrollContentHeight = this.element[0].scrollHeight;
            if (this.isEmpty) {
                this.$domDown.html('<div class="infinitescroll-noData">' + this.options.emptyrecords + '</div>');
                _.delay(function() {
                    self.$domDown.html("");
                }, 1000);
            }
        },

        _destroy: function() {
            this.$domDown.remove();
        }
    });
}();
