/**
 * 第三方组件，圆形进度条插件
 * @class fish.desktop.widget.Knob
 * @extends fish.desktop.widget
 * <pre>
 *  $(element).knob(option);
 * </pre>
 */
!function () {
    'use strict';

    $.widget("ui.knob", {
        canvas: null,
        min: 0,
        options: {
            /**
             * 设置进度条最大值，默认是100
             * @cfg {Number} max=100
             */
            max: 100,
            cursor: false,
            thickness: '.3',
            /**
             * 设置进度条宽度，默认是200
             * @cfg {Number} width=200
             */
            width: 200,
            /**
             * 设置是否展示进度值，默认是true
             * @cfg {Boolean} displayValue=true
             */
            displayValue: true,
            /**
             * 设置进度条填充色，默认是#87ceeb
             * @cfg {String} fgColor=#87ceeb
             */
            fgColor: '#87ceeb',
            /**
             * 设置进度条背景色，默认是#eee
             * @cfg {String} bgColor=#eee
             */
            bgColor: '#eee',
            /**
             * @cfg {Number} [value=0] 进度条的当前值。
             */
            value: 0

        },

        _create: function () {
            var opt = this.options;
            var c = $('<canvas width="' + opt.width + '" height="' + opt.width + '"></canvas>'),
                wd = $('<div style=width:' + opt.width + 'px;"></div>');

            this.element.wrap(wd).before(c);

            if (this.options.displayValue) {
                this.element.css({
                    'width': opt.width / 2,
                    'margin-top': (opt.width * 5 / 13),
                    'margin-left': -(3 * opt.width / 4),
                    'font-size': opt.width / 5
                }).html(this.options.value);
            } else {
                this.element.hide();
            }
            this.canvas = c;
            this._setValue(c, this.options.value);
        },

        _setValue: function (c, _v) {
            var v = null,
                ctx = c[0].getContext("2d"),
                a = Math.PI * 0.0001,
                PI2 = 2 * Math.PI,
                mx, my, x, y;
            var opt = this.options;

            if (null != _v) {
                if (v == _v) return;
                v = _v;
                this._trigger('change', null, {knob: this.element});
                a = (_v - this.min) * PI2 / (opt.max - this.min);
                this._draw(a, _v, ctx);

                if (_v === this.options.max) {
                    this._trigger("complete", null, {knob: this.element});
                }
            } else {
                var b = a = Math.atan2(mx - x, -(my - y - opt.width / 2));
                (a < 0) && (b = a + PI2);
                _v = Math.round(b * (opt.max - this.min) / PI2) + this.min;
                return (_v > opt.max) ? opt.max : _v;
            }

        },

        _destroy: function () {
            this.element.removeClass("knob").removeAttr('style').unwrap();
            this.canvas.remove();
        },

        _draw: function (angle, value, ctx) {
            var sa = 1.5 * Math.PI,
                ea = sa + angle,
                opt = this.options,
                r = opt.width / 2,
                lw = r * opt.thickness;

            ctx.clearRect(0, 0, opt.width, opt.width);
            ctx.lineWidth = lw;

            opt.cursor && (sa = ea - 0.3) && (ea = ea + 0.3);

            ctx.beginPath();
            ctx.strokeStyle = opt.fgColor;
            ctx.arc(r, r, r - lw, sa, ea, false);
            ctx.stroke();

            ctx.beginPath();
            ctx.strokeStyle = opt.bgColor;
            ctx.arc(
                r, r, r - lw, sa, (value == this.min && !opt.cursor) ? sa + 0.0001 : ea, true
            );
            ctx.stroke();
        },
        value: function (newValue) {
            if (newValue === undefined) {
                return parseInt(this.options.value, 10);
            }
            var v = this._constrainedValue(newValue);
            this.element.html(v);
            this.options.value = v;
            this._setValue(this.canvas, this.options.value);
        },
        _constrainedValue: function (newValue) {
            if (newValue === undefined) {
                newValue = this.options.value;
            }

            this.indeterminate = newValue === false;

            // sanitize value
            if (typeof newValue !== "number") {
                newValue = 0;
            }

            return this.indeterminate ? false :
                Math.min(this.options.max, Math.max(this.min, newValue));
        },
        _setOptions: function (options) {
            // Ensure "value" option is set after other values (like max)
            var value = options.value;
            delete options.value;

            this._super(options);

            this.options.value = this._constrainedValue(value);
            this._setValue(this.canvas, this.options.value);
        },

        _setOption: function (key, value) {
            if (key === "max") {
                // Don't allow a max less than min
                value = Math.max(this.min, value);
            }
            this._super(key, value);
        }

    });

}();
/**
 * 当进度条的值发生改变的时候触发。
 * @event change
 *
 */
/**
 * 当进度条到达最大值时触发
 * @event  complete
 */
