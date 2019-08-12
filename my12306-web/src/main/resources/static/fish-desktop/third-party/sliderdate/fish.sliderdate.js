/**
 * 第三方组件，日期滑块组件
 * @class fish.desktop.widget.SliderDate
 * @extends fish.desktop.widget
 * @author huang.xinghui <huang.xinghui5@zte.com.cn>
 * <pre>
 *   $(element).sliderdate(option);
 * </pre>
 */
!function () {
    "use strict";

    var template = '<button type="button" class="slider-minus">' +
        '<i class="glyphicon glyphicon-triangle-left"></i>' +
        '</button>' +
        '<div></div>' +
        '<button type="button" class="slider-plus">' +
        '<i class="glyphicon glyphicon-triangle-right"></i>' +
        '</button>',
        tooltipTemplate = '<div class="tooltip top in" role="tooltip">' +
            '<div class="tooltip-arrow"></div>' +
            '<div class="tooltip-inner"></div>' +
            '</div>',
        util = fish.dateutil,
        viewMode = {
            day: {
                format: 'yyyy-mm-dd',
                parseFormat: 'yyyy-mm-dd'
            },
            month: {
                format: 'yyyy-mm',
                parseFormat: 'yyyy-mm'
            }
        };

    $.widget('ui.sliderdate', {
        options: {
            /**
             * @cfg {String|Date} [startDate=''] 选择的开始时间
             *
             */
            startDate: '',
            /**
             * @cfg {String|Date} [endDate=''] 选择的结束时间
             *
             */
            endDate: '',
            /**
             * @cfg {String} [viewType='day'] 滑动类型，默认是日，可选值为day/month
             *
             */
            viewType: 'day',
            /**
             * @cfg {String} [format='yyyy/mm/dd'] 日期展示格式
             *
             */
            format: '',
            /**
             * @cfg {String} [value=''] 选中日期，固定格式为yyyy-mm-dd，默认为开始时间
             *
             */
            value: ''
        },

        _create: function () {
            this.element.addClass('slider-date');
            this.element.append(template);

            var mode = viewMode[this.options.viewType];
            this.parseFormat = mode.parseFormat;

            if (!this.options.format)
                this.options.format = mode.format;

            this.options.startDate = util.parse(this.options.startDate, this.parseFormat);
            this.options.endDate = util.parse(this.options.endDate, this.parseFormat);
            this.options.value = util.parse(this.options.value, this.parseFormat);

            if (!this.options.value)
                this.options.value = new Date(this.options.startDate);

            var diff, value;

            if (this.options.viewType === 'day') {
                diff = util.diffDays(this.options.endDate, this.options.startDate);
                value = util.diffDays(this.options.value, this.options.startDate);
            } else {
                diff = util.diffMonths(this.options.endDate, this.options.startDate);
                value = util.diffMonths(this.options.value, this.options.startDate);
            }

            this.slider = this.element.find('div').slider({
                min: 0,
                max: diff,
                value: value,
                change: $.proxy(this._onChange, this),
                slide: $.proxy(this._updateTips, this)
            }).data('ui-slider');

            this.element.find('.ui-slider-handle').append(tooltipTemplate);
            this._updateTips();
            this._placeTips();

            this._on({
                'click .slider-minus': 'minus',
                'click .slider-plus': 'plus'
            })
        },

        _onChange: function (e) {
            this.element.find('.tooltip-inner').text(this.getFormattedDate());
            this._trigger('change', e, this.value());
        },

        _updateTips: function () {
            this.element.find('.tooltip-inner').text(this.getFormattedDate());
        },

        _placeTips: function () {
            var $tooltip = this.element.find('.tooltip');
            var w = ($tooltip.parent().width() - $tooltip.outerWidth()) / 2;
            var h = -$tooltip.outerHeight();

            $tooltip.css({
                top: h,
                left: w
            });
        },

        minus: function (e) {
            var value = this.slider.value() - 1;
            this.slider._slide(e, 0, value);
        },

        plus: function (e) {
            var value = this.slider.value() + 1;
            this.slider._slide(e, 0, value);
        },

        getFormattedDate: function (format) {
            if (format === undefined)
                format = this.options.format;

            var date;
            if (this.options.viewType === 'day')
                date = util.addDays(this.options.startDate, this.slider.value());
            else
                date = util.addMonths(this.options.startDate, this.slider.value());
            return util.format(date, format);
        },

        /**
         * @method value 赋值或者取值，取值返回规定格式yyyy-mm-dd的字符串，赋值传递相同规定格式字符串或者日期对象
         */
        value: function (value) {
            var date;
            if (arguments.length === 0) {
                return this.getFormattedDate(this.parseFormat);
            }
            else {
                date = util.parse(value, this.parseFormat);

                if (this.options.viewType === 'day')
                    this.slider.value(util.diffDays(date, this.options.startDate));
                else
                    this.slider.value(util.diffMonths(date, this.options.startDate));
            }
        }
    })
}();