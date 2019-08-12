/**
 * raterstar Widget
 * @class fish.desktop.widget.Raterstar
 * <pre>
 *   $(element).raterstar(option);
 * </pre>
 */
!function() {
    'use strict';

    $.widget('ui.raterstar', {
        options: {
            /**
             * @cfg {Boolean} disabled=false 是否禁用，默认不禁用
             */
            disabled: false,
            /**
             * @cfg {Number} min=1 最小值，默认1
             */
            min: 1,
            /**
             * @cfg {Number} max=5 最大值，默认5
             */
            max: 5,
            /**
             * @cfg {Number} step=1 移动的步长，默认1
             */
            step: 1,
            /**
             * @cfg {Number} value=null，初始值
             */
            value: null,

            /**
             * @cfg {String} image='img/star.gif' 自定义图标
             */
            image: null,
            /**
             * @cfg {Number} width=25 默认图片宽度
             */
            width: 25,
            /**
             * @cfg {Number} height=25 默认图片高度
             */
            height: 25,
            /**
             * @cfg {Function} 自定义提示信息
             * @param value 当前选中的参数值
             */
            titleFormat: null,
            /**
             * @cfg {Number} zIndex=1000 默认z-index
             */
            zIndex: 1000
        },
        _create: function() {
            this._initUI();
            this._initEvent();
        },

        _initUI: function() {
            var opt = this.options;
            // 主容器
            var $container = $('<ul class="ui-rater-star"></ul>');
            $container.css({
                height: opt.height,
                width: (opt.width * opt.step) * (opt.max - opt.min + opt.step) / opt.step
            });
            if (opt.image) {
                $container.css('background-image', 'url(' + opt.image + ')');
            }


            // 当前选中的
            var $item = $('<li class="ui-rater-star-item-current"></li>');
            if (opt.image) {
                $item.css('background-image', 'url(' + opt.image + ')');
            }
            $item.css('height', opt.height);
            $item.css('width', 0);
            $item.css('z-index', opt.zIndex + opt.max / opt.step + 1);
            if (opt.value) {
                $item.css('width', ((opt.value - opt.min) / opt.step + 1) * opt.step * opt.width);
            }

            $container.append($item);

            // 星星
            if (!!!opt.disabled) { // 是否能更改
                for (var value = opt.min; value <= opt.max; value += opt.step) {
                    $item = $('<li class="ui-rater-star-item"></li>');

                    if (typeof opt.titleFormat == 'function') {
                        $item.attr('title', opt.titleFormat(value));
                    } else {
                        $item.attr('title', value);
                    }
                    $item.css('height', opt.height);
                    $item.css('width', (value - opt.min + opt.step) * opt.width);
                    $item.css('z-index', opt.zIndex + (opt.max - value) / opt.step + 1);
                    if (opt.image) {
                        $item.css('background-image', 'url(' + opt.image + ')');
                    }
                    $container.append($item);
                }
            }
            this.element.append($container);
        },

        _initEvent: function() {
            var self = this,
                $el = self.element,
                opt = this.options;
            var $container = self.element.find('.ui-rater-star');

            if (!!!opt.disabled) {
                $container.mouseover(function() {
                    if (opt.disabled) {
                        return;
                    }
                    $(this).find('.ui-rater-star-item-current').hide();
                }).mouseout(function() {
                    if (opt.disabled) {
                        return;
                    }
                    $(this).find('.ui-rater-star-item-current').show();
                })
            }

            // 添加鼠标悬停/点击事件
            $container.find('.ui-rater-star-item').mouseover(function() {
                if (opt.disabled) {
                    return;
                }
                $(this).attr('class', 'ui-rater-star-item-hover');
            }).mouseout(function() {
                if (opt.disabled) {
                    return;
                }
                $(this).attr('class', 'ui-rater-star-item');
            }).click(
                function() {
                    if (opt.disabled) {
                        return;
                    }
                    var $this = $(this);
                    $this.prevAll('.ui-rater-star-item-current').css('width', $this.width());

                    var star_count = (opt.max - opt.min) + opt.step;
                    var current_number = $this.prevAll('.ui-rater-star-item').size() + 1;
                    var current_value = opt.min + (current_number - 1) * opt.step;
                    $el.data('ui-value', current_value);
                    var data = {
                        value: current_value,
                        number: current_number,
                        count: star_count,
                        min: opt.min,
                        max: opt.max
                    };

                    // 处理回调事件
                    self._trigger('afterClick', null, data);
                }); // end click

        },

        /**
         *@method enable
         *启用
         */
        enable: function() {
            this.options.disabled = false;
        },
        /**
         * @method disable
         * 禁用
         */
        disable: function() {
            this.options.disabled = true;
        },
        /**
         * @method value
         * 取/赋值
         * @param {Number} value
         * @returns {*}
         */
        value: function(value) {
            var self = this,
                $el = self.element,
                opt = this.options;
            var $container = self.element.find('.ui-rater-star');
            if (value == null) {
                //如果直接取ui-rater-star-item-current会有误差
                return $el.data('ui-value');
            }
            $el.data('ui-value', value);
            $container.find('.ui-rater-star-item-current').css('width', ((value - opt.min) / opt.step + 1) * opt.step * opt.width);
        },

        _destroy: function() {
            this.element.find('.ui-rater-star').off();
            this.element.find('.ui-rater-star-item').off();
            this.element.empty();
        }

    });
}();
