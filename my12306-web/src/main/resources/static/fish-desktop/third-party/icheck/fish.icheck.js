/**
 * 第三方组件，checkbox组件
 * @class fish.desktop.widget.ICheck
 * @extends fish.desktop.widget
 * <pre>
 *   $(element).icheck();
 * </pre>
 */
!function() {
    'use strict';
    $.widget("ui.icheck", $.ui.formfield, {
        _create: function() {
            var type = this.element.attr('type');
            var className = type === 'checkbox' ? 'icheckbox' : 'iradio';
            this.$helper = $('<ins class="icheck-helper"/>');
            if(!this.element.parent().is("label")){
                this.$parent = this.element.wrap('<label><div class="' + className + '"></div></label>').parent();
            }else{
                this.$parent = this.element.wrap('<div class="' + className + '"></div>').parent();
            }
            this.$helper.appendTo(this.$parent);
            this._update();
            this._delegateEvent();
            this._super();
        },
        _delegateEvent: function() {
            this._on(this.element, {
                'change': '_onChange'
            });
        },

        _setOption: function(key, value) {
            this._super(key, value);

            if (key === 'disabled') {
                this.element.attr(key, value);
                this.$parent.toggleClass('disabled', value);
            }
        },

        _destroy: function() {
            this.$helper.remove();
            this.element.unwrap();
        },

        _update: function() {
            this.$parent[this.element.prop('checked') ? 'addClass' : 'removeClass']('checked');
        },

        _onChange: function() {
            var type = this.element.attr('type'),
                checked;

            if (type === 'radio') {
                this._offOtherCheck();
                checked = true;
            } else {
                checked = this.element.prop('checked');
                this.$parent.removeClass('indeterminate');
            }
            this.$parent.toggleClass('checked', checked);
            this._pagePoint({eventType: 'change'})
        },

        _offOtherCheck: function() {
            var that = this,
                $form,
                inputs;

            $form = this.element.closest('form');
            inputs = 'input[name="' + this.element.attr('name') + '"]';
            inputs = $form.length ? $form.find(inputs) : $(inputs);
            inputs.each(function() {
                if (this != that.element[0] && $(this).data('ui-icheck')) {
                    $(this).icheck('uncheck');
                }
            });
        },
        /**
         * 设置为选中状态
         * @method  check
         */
        check: function() {
            var checked = this.element.prop('checked'),
                type = this.element.attr('type'),
                name = this.element.attr('name');

            if (!checked) {
                if (type === 'radio' && name) {
                    this._offOtherCheck();
                } else {
                    this.element.prop('indeterminate', false);
                }
                this.element.prop('checked', true);
            }

            this.$parent.removeClass('indeterminate').addClass('checked');
        },
        /**
         * 设置为不选中状态
         * @method  uncheck
         */
        uncheck: function() {
            var checked = this.element.prop('checked');

            if (checked) {
                this.element.prop('checked', false);
            }

            this.$parent.removeClass('checked');
        },
        /**
         * 设置为不定态（icheck共有3种状态）
         * @method  indeterminate
         */
        indeterminate: function() {
            var indeterminate = this.element.prop('indeterminate');

            if (!indeterminate) {
                this.element.prop('indeterminate', true);
                this.element.prop('checked', false);
            }

            this.$parent.removeClass('checked').addClass('indeterminate');
        },
        /**
         * 取消不定状态（icheck共有3种状态）
         * @method  determinate
         */
        determinate: function() {
            var indeterminate = this.element.prop('indeterminate');

            if (indeterminate) {
                this.element.prop('indeterminate', false);
            }

            this.$parent.removeClass('indeterminate');
        },
        /**
         * 判断当前是否处于选中状态
         * @method  isChecked
         * @return {Boolean}
         */
        isChecked: function() {
            var checked = this.element.prop('checked');
            if (checked) {
                return true;
            }
            return false;
        },

        _onFormClear: function () {
            this.uncheck();
        },
        _formSetValue: function (value) {
            var res = fish.map(value, function (v) {
                return fish.isNumber(v) ? String(v) : v;
            });
            if(res.indexOf(this.element.val()) !== -1) {
                this.check();
            } else {
                this.uncheck();
            }
        }
    });
}();