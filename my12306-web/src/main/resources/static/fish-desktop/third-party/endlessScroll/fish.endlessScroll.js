/**
 * @class fish.desktop.widget.EndlessScroll
 * @extends fish.desktop.widget
 * @since V2.0.0
 * @author shi.pengyan
 * 第三方组件，无限滚动加载
 * <pre>
 //初始化控件
 $(element).endlessScroll(option);
 //调用控件上的方法
 $(element).endlessScroll(method);
 * </pre>
 */
!function () {
  $.widget('ui.endlessScroll', {

    options: {
      /**
       * @cfg {Integer} pagesToKeep=null  当此参数不为空时，超过此数目的项将被移除
       */
      pagesToKeep: null,
      /**
       * @cfg {Integer} inflowPixels=50 元素到达边界多少像素时触发事件
       */
      inflowPixels: 50,

      /**
       * @cfg {Boolean} fireOnce=true 是否只有在当前事件完成后再触发
       */
      fireOnce: true,

      /**
       * @cfg {Integer} fireDelay=150 延迟触发的事件
       */
      fireDelay: 150,
      /**
       * @cfg {String} loader='Loading...' 加载时显示的文字，中文语言时显示‘加载中...’;英文时显示‘Loading’
       */
      loader: fish.getResource('endlessScroll.loading'),
      /**
       * @cfg {String | Function} content='' 加载的内容
       * String：直接显示内容
       * Function：返回指定的内容，例如
       * <pre>
       *   content: function (fireSequence, pageSequence, scrollDirection) {
       *       return '<li>' + pageSequence + '</li>';
       * }
       * </pre>
       */
      content: '',
      /**
       * @cfg {Selector} 带插入内容的选择器，元素内部第一个
       */
      insertBefore: null,
      /**
       * @cfg {Selector} 带插入内容的选择器，元素内部最后一个
       */
      insertAfter: null,
      /**
       * @cfg {Integer} intervalFrequency=250 触发间隔时间（ms）
       */
      intervalFrequency: 250,
      /**
       * @cfg {Boolean} ceaseFireOnEmpty=true 当返回内容为‘’时终止触发
       */
      ceaseFireOnEmpty: true,
      /**
       * @cfg {Function} 重置内部计数器
       * <pre>
       *   resetCounter: function (fireSequence, pageSequence, scrollDirection) {
       *       return true;
       * }
       * </pre>
       */
      resetCounter: function () {
        return false;
      },
      /**
       * @cfg {Function} 触发滚动后回调函数
       * <pre>
       *   callback: function (fireSequence, pageSequence, scrollDirection) {
       *      ...
       *   }
       * </pre>
       */
      callback: $.noop,
      /**
       * @cfg {Function} 是否终止触发时的回调函数,返回值:true,终止触发，否则继续
       *
       * <pre>
       *   ceaseFire: function (fireSequence, pageSequence, scrollDirection) {
       *      ...
       *      return true;
       *   }
       * </pre>
       *
       */
      ceaseFire: function () {
        return false;
      }
    },

    _create: function () {
      var self = this;

      this.pagesStack = [0];
      this.scrollDirection = 'next';
      this.firing = true;
      this.fired = false;
      this.fireSequence = 0;
      this.pageSequence = 0;
      this.nextSequence = 1;
      this.prevSequence = -1;
      this.lastScrollTop = 0; // pageYOffset
      this.didScroll = false;
      this.isScrollable = true;
      this.content = '';
      this.lastContent = 'dummy';
      this.innerWrap = $('.ui-endless-scroll-inner-wrap', this.element);
      this._setInsertPositionsWhenNecessary();

      this.element.scroll(function () {
        self._detectScrollDirection();
      });

      this._run();
    },

    _run: function () {
      var self = this;

      function timer() {
        if (!self._shouldTryFiring()) {
          return;
        }
        if (self._ceaseFireWhenNecessary()) {
          return;
        }
        if (!self._shouldBeFiring()) {
          return;
        }
        self._resetFireSequenceWhenNecessary();
        self._acknowledgeFiring();
        self._insertLoader();
        if (self._hasContent()) {
          self._showContent();
          self._fireCallback();
          self._cleanUpPagesWhenNecessary();
          self._delayFiringWhenNecessary();
        }
        self._removeLoader();
        self.lastContent = self.content;
      }

      setInterval(timer, this.options.intervalFrequency);
    },

    _setInsertPositionsWhenNecessary: function () {
      //this.element.selector is null

      //var container = "" + this.element.selector + " div.ui-endless-scroll-inner-wrap";

      var container = 'div.ui-endless-scroll-inner-wrap';
      if (!this.options.insertBefore) {
        this.options.insertBefore = container + " div:first";
      }
      if (!this.options.insertAfter) {
        this.options.insertAfter = container + " div:last";
      }
    },

    _detectScrollDirection: function () {
      this.didScroll = true;

      var currentScrollTop = this.element.scrollTop();
      if (currentScrollTop > this.lastScrollTop) {
        this.scrollDirection = 'next';
      } else {
        this.scrollDirection = 'prev';
      }
      this.lastScrollTop = currentScrollTop;
    },

    _shouldTryFiring: function () {
      var shouldTryOrNot = this.didScroll && this.firing === true;
      if (shouldTryOrNot) {
        this.didScroll = false;
      }
      return shouldTryOrNot;
    },

    _ceaseFireWhenNecessary: function () {
      if (this.options.ceaseFireOnEmpty === true && this.lastContent === '' ||
        this.options.ceaseFire.apply(this.element, [this.fireSequence, this.pageSequence, this.scrollDirection])) {
        this.firing = false;
        return true;
      } else {
        return false;
      }
    },

    _wrapContainer: function (target) {
      if (this.innerWrap.length === 0) {
        this.innerWrap = $(target).wrapInner('<div class="ui-endless-scroll-content" data-page="0" />')
          .wrapInner('<div class="ui-endless-scroll-inner-wrap" />').find('.ui-endless-scroll-inner-wrap');
      }
    },

    _scrollableAreaMargin: function (innerWrap, $target) {
      var margin;
      switch (this.scrollDirection) {
        case 'next':
          margin = innerWrap.height() - $target.height() <= $target.scrollTop() + this.options.inflowPixels;
          if (margin) {
            $target.scrollTop(innerWrap.height() - $target.height() - this.options.inflowPixels);
          }
          break;

        case 'prev':
          margin = $target.scrollTop() <= this.options.inflowPixels;
          if (margin) {
            $target.scrollTop(this.options.inflowPixels);
          }
      }
      return margin;
    },

    _calculateScrollableCanvas: function () {
      if (this.element[0] === document || this.element[0] === window) {
        this._wrapContainer("body");
        return this.isScrollable = this._scrollableAreaMargin($(document), $(window));
      } else {
        this._wrapContainer(this.element);
        return this.isScrollable = this.innerWrap.length > 0 && this._scrollableAreaMargin(this.innerWrap, this.element);
      }
    },

    _shouldBeFiring: function () {
      this._calculateScrollableCanvas();
      return this.isScrollable && (this.options.fireOnce === false || (this.options.fireOnce === true && this.fired !== true));
    },

    _resetFireSequenceWhenNecessary: function () {
      if (this.options.resetCounter.apply(this.element) === true) {
        return this.fireSequence = 0;
      }
    },

    _acknowledgeFiring: function () {
      this.fired = true;
      this.fireSequence++;
      switch (this.scrollDirection) {
        case 'next':
          this.pageSequence = this.nextSequence++;
          break;
        case 'prev':
          this.pageSequence = this.prevSequence--;
          break;
      }
    },

    _insertContent: function (content) {
      switch (this.scrollDirection) {
        case 'next':
          $(this.options.insertAfter).after(content);
          break;
        case 'prev':
          $(this.options.insertBefore).before(content);
          break;
      }
    },

    _insertLoader: function () {
      this._insertContent('<div class="ui-endless-scroll-loader">' + this.options.loader + '</div>');
    },

    _removeLoader: function () {
      $('.ui-endless-scroll-loader', this.element).fadeOut(function () {
        $(this).remove();
      });
    },

    _hasContent: function () {
      if (typeof this.options.content === 'function') {
        this.content = this.options.content.apply(this.element, [this.fireSequence, this.pageSequence, this.scrollDirection]);
      } else {
        this.content = this.options.content;
      }
      return this.content !== false;
    },

    _showContent: function () {
      this._insertContent('<div class="ui-endless-scroll-content" data-page="' + this.pageSequence + '">' + this.content + '</div>');
    },

    _fireCallback: function () {
      this.options.callback.apply(this.element, [this.fireSequence, this.pageSequence, this.scrollDirection]);
    },

    _cleanUpPagesWhenNecessary: function () {
      var pageToRemove;
      if (!(this.options.pagesToKeep >= 1)) {
        return;
      }
      switch (this.scrollDirection) {
        case 'next':
          this.pagesStack.push(this.pageSequence);
          break;
        case 'prev':
          this.pagesStack.unshift(this.pageSequence);
      }
      if (this.pagesStack.length > this.options.pagesToKeep) {
        switch (this.scrollDirection) {
          case 'next':
            pageToRemove = this.prevSequence = this.pagesStack.shift();
            break;
          case 'prev':
            pageToRemove = this.nextSequence = this.pagesStack.pop();
        }
      }
      this._removePage(pageToRemove);
      this._calculateScrollableCanvas();
    },

    _removePage: function (page) {
      return $(".ui-endless-scroll-content[data-page='" + page + "']", this.element).remove();
    },

    _delayFiringWhenNecessary: function () {
      var self = this;
      if (this.options.fireDelay > 0) {
        var $tempMarker = $('<div id="ui-endless-scroll-marker"></div>');
        $('body').after($tempMarker);
        $tempMarker.fadeTo(this.options.fireDelay, 1, function () {
          $tempMarker.remove();
          self.fired = false;
        });
      } else {
        this.fired = false;
      }
    }
  });

}();