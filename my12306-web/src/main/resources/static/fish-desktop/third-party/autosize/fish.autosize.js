/**
 * autosize automatically adjust textarea height to fit text
 * @class fish.desktop.widget.Autosize
 * @extends fish.desktop.widget
 * <pre>
 *  $(element).autosize(option);
 * </pre>
 */
!function () {
    'use strict';
    var typographyStyles = [
        'letterSpacing',
        'textTransform',
        'wordSpacing',
        'textIndent',
        'whiteSpace'
    ],
        timeout,
        // to keep track which textarea is being mirrored when adjust() is called.
        mirrored,
        // the mirror element, which is used to calculate what size the mirrored element should be.
        mirror = $('<textarea tabindex="-1"/>').data('autosize', true)[0];

    $.widget("ui.autosize", $.ui.formfield,{
        options: {
            /**
             * @cfg {String} className 设置新生成的textarea的样式名，默认是‘’
             */
            className: '',
            /**
             * @cfg {Function} resized 调整高度后的回调函数,参数是event，element
             */
            resized: null
        },

        _create: function () {
            var boxOffset = 0,
                taResize = this.element.css('resize');

            if (this.element.data('autosize')) {
                // exit if autosize has already been applied, or if the textarea is the mirror element.
                return;
            }
            this.element.data('autosize', true);

            boxOffset = this.element.outerHeight() - this.element.height();

            // IE8 and lower return 'auto', which parses to NaN, if no min-height is set.
            this.minHeight = Math.max(parseFloat(this.element.css('minHeight')) - boxOffset || 0, this.element.height());
            this.boxOffset = boxOffset;
            var cssObj = {
                overflow: 'hidden',
                overflowY: 'hidden',
                wordWrap: 'break-word'// horizontal overflow is hidden, so break-word is necessary for handling words longer than the textarea width
            };
            if (taResize === 'vertical') {
                cssObj.resize = 'none';
            } else if (taResize === 'both') {
                cssObj.resize = 'horizontal';
            }
            this.element.css(cssObj);

            this._initMirror();
            this._bindEvents();
            this._adjust();
            // call formfield _create method
            this._super();
        },
        _initMirror: function () {
            var that = this,
                styles = {},
                maxHeight = parseFloat(this.element.css('maxHeight'));

            this.$mirror = $(mirror).css({
                'position': 'absolute',
                'top': '-999px',
                'left': 0,
                'right': 'auto',
                'bottom': 'auto',
                'border': 0,
                'padding': 0,
                '-moz-box-sizing': 'content-box',
                '-webkit-box-sizing': 'content-box',
                'box-sizing': 'content-box',
                'word-wrap': 'break-word',
                'height': 0,
                'min-height': 0,
                'overflow': 'hidden',
                '-webkit-transition': 'none',
                '-moz-transition': 'none',
                'transition': 'none'
            });
            if (this.$mirror.parentNode !== document.body) {
                $(document.body).append(this.$mirror);
            }
            mirrored = this.element;
            $.each(typographyStyles, function (i, val) {
                styles[val] = that.element.css(val);
            });
            this.$mirror.css(styles).attr('wrap', this.element.attr('wrap')).addClass(this.options.className);
            this._setWidth();
        },

        _setWidth: function () {
            var width,
                that = this,
                style = this.element.attr('style');

            if (style) {
                if (this.element.is(':hidden'))
                    width = this._getActual('width');
                else
                    width = parseFloat(this.element.css('width'));
                $.each(['padding-left', 'padding-right', 'border-left-width', 'border-right-width'], function (i, val) {
                    width -= parseFloat(that.element.css(val));
                });
            } else {
                width = this.element.width();
            }

            this.$mirror.css('width', Math.max(width, 0));
        },

        _getActual: function (method) {
            var $target = this.element, styles = [],
                $hidden = $target.parents().addBack().filter(':hidden');
            var style = 'visibility: hidden !important; display: block !important;';
            $hidden.each(function () {
                var $this = $(this);
                var orgStyle = $this.attr('style');
                styles.push(orgStyle);// 存储原本style
                $this.attr('style', orgStyle ? orgStyle + ';' + style : style);
            });

            var actual = $target[method]();
            $hidden.each(function (i) {
                var $this = $(this);
                var tmp = styles[i];
                // 恢复原本style
                if (tmp === undefined) {
                    $this.removeAttr('style');
                } else {
                    $this.attr('style', tmp);
                }
            });

            return actual;
        },

        _bindEvents: function () {
            var ta = this.element[0],
                that = this;
            if ('onpropertychange' in ta) {
                if ('oninput' in ta) {
                    // Detects IE9.  IE9 does not fire onpropertychange or oninput for deletions,
                    // so binding to onkeyup to catch most of those occasions.  There is no way that I
                    // know of to detect something like 'cut' in IE9.
                    this._on(this.element, {
                        'input': '_adjust',
                        'keyup': '_adjust'
                    });
                } else {
                    // IE7 / IE8
                    this._on(this.element, {
                        'propertychange': function (event) {
                            if (event.propertyName === 'value') {
                                that._adjust();
                            }
                        }
                    });
                }
            } else {
                // Modern Browsers
                this._on(this.element, {
                    'input': '_adjust'
                });
            }
        },

        _adjust: function () {
            var height, originalHeight, maxHeight = parseFloat(this.element.css('maxHeight')),
                ta = this.element[0];
            if (mirrored !== this.element) {
                this._initMirror();
            } else {
                this._setWidth();
            }
            if (!ta.value) {
                // If the textarea is empty, copy the placeholder text into
                // the mirror control and use that for sizing so that we
                // don't end up with placeholder getting trimmed.
                mirror.value = (this.element.attr("placeholder") || '');
            } else {
                mirror.value = ta.value;
            }
            mirror.value += '';
            mirror.style.overflowY = ta.style.overflowY;
            originalHeight = parseFloat(ta.style.height) || 0;
            // Setting scrollTop to zero is needed in IE8 and lower for the next step to be accurately applied
            mirror.scrollTop = 0;

            mirror.scrollTop = 9e4;

            // Using scrollTop rather than scrollHeight because scrollHeight is non-standard and includes padding.
            height = mirror.scrollTop;
            if (maxHeight && height > maxHeight) {
                ta.style.overflowY = 'scroll';
                height = maxHeight;
            } else {
                ta.style.overflowY = 'hidden';
                if (height < this.minHeight) {
                    height = this.minHeight;
                }
            }

            height += this.boxOffset;

            if (Math.abs(originalHeight - height) > 1 / 100) {
                ta.style.height = height + 'px';

                // Trigger a repaint for IE8 for when ta is nested 2 or more levels inside an inline-block
                mirror.className = mirror.className;
                this._trigger('resized');
            }
        },

        _destroy: function () {
            clearTimeout(timeout);
            mirrored = null;
            this.$mirror.remove();
            this.element.removeAttr('style');
        },
        /**
         * @method value 取值或者赋值
         * @param  {String} [value] 设置值选中,为空则取控件值
         * @return {String} 控件值,赋值操作则没有返回值
         * @since V3.12.0
         */
        value: function(value) {
            if (fish.isUndefined(value)) {
              return this.element.val();
            } else {
              this.element.val(value);
              this._adjust();
            }
        },
        _onFormClear: function () {
            this.element.val('');
            this._adjust();
        },
        _formSetValue: function (value) {
            this.value(value);
        },
        _formGetValue: function () {
            return this.element.val();
        },

    });

}();
