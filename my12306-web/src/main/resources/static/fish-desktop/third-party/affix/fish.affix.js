!function() {

    'use strict';

    /**
     * 第三方组件，Affix Widget
     * @class fish.desktop.widget.Affix
     * <pre>
     *   $(element).affix(option);
     * </pre>
     */
    $.widget("ui.affix", {
        options: {
            /**
             * Pixels to offset from screen when calculating position of scroll.
             * If a single number is provided, the offset will be applied in both top and bottom directions.
             * To provide a unique, bottom and top offset just provide an object offset: { top: 10 } or offset: { top: 10, bottom: 5 }.
             * Use a function when you need to dynamically calculate an offset.
             * @cfg {Object} offset=0
             */
            offset: 0,
            /**
             * Specifies the target element of the affix.
             * @cfg {selector} target=window type:selector | node | jQuery element
             */
            target: window

        },

        _create: function() {
            this.$target = $(this.options.target)
                .on('scroll', $.proxy(this._checkPosition, this)) //.bs.affix.data-api
                .on('click', $.proxy(this._checkPositionWithEventLoop, this)); //TODO IE8下window不能响应chick事件,这里先忽略

            this.$element = $(this.element);
            this.pinnedOffset = null;
            this._checkPosition();
        },
        _getPinnedOffset: function() {
            if (!this.pinnedOffset) {
                this.$element.removeClass('affix affix-top affix-bottom').addClass('affix');
                var scrollTop = this.$target.scrollTop();
                var position = this.$element.offset();
                this.pinnedOffset = position.top - scrollTop;
            }
            return this.pinnedOffset;
        },

        _checkPositionWithEventLoop: function() {
            setTimeout($.proxy(this._checkPosition, this), 1);
        },

        _checkPosition: function() {
            if (!this.$element.is(':visible')) return;

            var scrollHeight = $(document).height();
            var scrollTop = this.$target.scrollTop();
            var position = this.$element.offset();
            var offset = this.options.offset;
            var offsetTop = offset.top;
            var offsetBottom = offset.bottom;

            if (typeof offset !== 'object') offsetBottom = offsetTop = offset;
            if (typeof offsetTop === 'function') offsetTop = offset.top(this.$element);
            if (typeof offsetBottom === 'function') offsetBottom = offset.bottom(this.$element);

            var affix = this.unpin != null && (scrollTop + this.unpin <= position.top) ? false :
                offsetBottom != null && (position.top + this.$element.height() >= scrollHeight - offsetBottom) ? 'bottom' :
                    offsetTop != null && (scrollTop <= offsetTop) ? 'top' : false;

            if (this.affixed === affix) return;
            if (this.unpin != null) this.$element.css('top', '');

            var affixType = 'affix' + (affix ? '-' + affix : '');

            if (!this._trigger(affixType)) return;

            // var e = $.Event(affixType) //+ '.bs.affix'

            // this.$element.trigger(e)

            // if (e.isDefaultPrevented()) return

            this.affixed = affix;
            this.unpin = affix === 'bottom' ? this._getPinnedOffset() : null;

            this.$element
                .removeClass('affix affix-top affix-bottom')
                .addClass(affixType);

            this._trigger(affixType.replace('affix', 'affixed'));

            // .trigger($.Event(affixType.replace('affix', 'affixed')))

            if (affix === 'bottom') {
                this.$element.offset({
                    top: scrollHeight - this.$element.height() - offsetBottom
                });
            }
        }

    });


    /**
     * This event fires immediately before the element has been affixed.
     * @event affix
     */
    /**
     * This event is fired after the element has been affixed.
     * @event affixed
     */
    /**
     * This event fires immediately before the element has been affixed-top.
     * @event affix-top
     */
    /**
     * This event is fired after the element has been affixed-top.
     * @event affixed-top
     */
    /**
     * This event fires immediately before the element has been affixed-bottom.
     * @event affix-bottom
     */
    /**
     * This event is fired after the element has been affixed-bottom.
     * @event affixed-bottom
     */

}();
