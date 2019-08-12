/**
 * @class fish.desktop.widget.PageSideBar PageSideBar
 * 第三方组件，页面边控制条
 * <pre>
 *  $('.pagesidebar').pagesidebar({data:data});
 * </pre>
 */

! function () {
    'use strict';

    $.widget('ui.pagesidebar', {
        animationSpeed: '300',
        options: {
            /**
             * @cfg {Number} 宽度
             */
            width: 200,
            /**
             * @cfg {Number} 缩起来的宽度
             */
            minWidth: 50,
            /**
             * @cfg {Array} 数据源
             */
            data: [],
            /**
             * @cfg {Boolean} [openFirst=false] 自动打开第一个菜单，如果第一个为目录则，打开子菜单中第一个;
             * 如果location.hash已经有值则忽略openFirst参数
             */
            openFirst: false,
            /**
             * @cfg {Boolean} [autoScroll=true] 显示时是否滚动到指定的菜单
             */
            autoScroll: true,
            /**
             * @cfg {String} [position=left] 边框位置
             */
            position: 'left', //left or right
            /**
             * @cfg {String} [customClass=''] 自定义样式，默认为空
             */
            customClass: '',
            /**
             * @cfg {Object} [icons] 菜单项图标配置
             * collapse：收缩图标，默认值："glyphicon glyphicon-menu-right" <br>
             * expand：展开图标，默认值："glyphicon glyphicon-menu-down" <br>
             * toggle: 切换图标，默认值："glyphicon glyphicon-align-justify"
             * @since V3.12.0
             */
            icons: {
                collapse: "glyphicon glyphicon-menu-right",
                expand: "glyphicon glyphicon-menu-down",
                toggle: "glyphicon glyphicon-align-justify"
            },
            /**
             * @cfg {Boolean} [showToggleBtn=true] 是否显示切换图标，默认是true
             * @since V3.12.0
             */
            showToggleBtn: true,
            /**
             * @cfg {String} [children="children"] 保存子节点数据的属性名称,默认是“children”
             * @since V3.12.0
             */
            children: "children",
            /**
             * @cfg {String} [subMenuMode="vertical"]菜单折叠状态下，子菜单展示类型，支持vertical 和inline两种模式，默认是vetical
             * @since V3.14.0
             */
            subMenuMode: "vertical",
            //event
            /**
             * @event expand pagesidebar隐藏与显示
             */
            expand: $.noop,
            /**
             * @event slideUp pagesidebar菜单向上收起事件
             */
            slideUp: $.noop,
            /**
             * @event slideDown pagesidebar菜单向下展开事件
             */
            slideDown: $.noop,
            /**
             * @event select pagesidebar菜单选中事件
             */
            select: $.noop
        },

        _create: function () {
            this._createUI();
            this._bindEvents();
            this._action();
        },
        /**
         * 创建骨架
         */
        _createUI: function () {
            var data = this.options.data,
                $el = this.element;
            if (!$el.hasClass("ui-sidebar-wrapper")) {
                $el.addClass('ui-sidebar-wrapper ' + this.options.customClass);

                var $sidebar = $('<div class="ui-sidebar"></div>');
                this.$menus = $('<ul class="ui-sidebar-menu"></ul>');

                //create toggle button
                if (this.options.showToggleBtn) {
                  $sidebar.append('<div class="ui-sidebar-toggler-wrapper"><span class="' + this.options.icons.toggle + ' ui-sidebar-toggler"></span></div>');
                }

                //create menu
                if (!fish.isEmpty(this.options.data)) {
                  this._recursive(this.options.data, this.$menus);
                  this.$menus.find(".arrow").addClass(this.options.icons.collapse);
                  this.$menus.find(".top-item").hide();
                }

                $el.append($sidebar.append(this.$menus));
            }
            this._setWidth();
            this._setPosition();
        },
        // 递归生成html
        _recursive: function(items,$menus) {
            var self = this,
                hash = location.hash,
                children = this.options.children;

            fish.each(items, function(item) {
                var $li = $("<li></li>");
                if (item.hash) {
                    if (hash === item.hash) {
                        $li.addClass("active");
                    }
                } else {
                    item.hash = "javascript:;";
                }
                var $a = $("<a href=" + item.hash + "></a>").data("data-menu-item", item);
                if (item.icon) {
                    $a.append('<span class="' + item.icon + '"></span>');
                }
                $a.append('<span class="title" title="' + item.title + '">' + item.title + '</span>');
                $li.append($a);
                if (item[children]) {
                    $a.append('<span class="arrow"></span>');
                }
                var $subMenu;
                if ($menus.is(".ui-sidebar-menu")) {
                    $li.append('<ul class="sub-menu"></ul>');
                    $subMenu = $li.find(".sub-menu");
                    var $topItem = $("<a href=" + item.hash + "></a>").data("data-menu-item", item);
                    $topItem.append('<span class="title" title="' + item.title + '">' + item.title + "</span>");
                    $subMenu.append("<li class='top-item'></li>");
                    $subMenu.find(".top-item").append($topItem);
                } else {
                    if (item[children]) {
                        $a.append('<span class="arrow"></span>');
                        $li.append('<ul class="sub-menu"></ul>');
                    }
                }
                $subMenu = $li.find(".sub-menu");
                if (item[children] && $subMenu.length > 0) {
                    self._recursive(item[children], $subMenu);
                }
                $menus.append($li);
            });
        },

        /**
         * 绑定事件
         * @private
         */
        _bindEvents: function () {
            var self = this,
                $el = this.element,
                $toggleBtn = $el.find('.ui-sidebar-toggler'),
                $sidebar = $el.find('.ui-sidebar'),
                slideOffeset = -200;
            this.$menus = $el.find('.ui-sidebar-menu');

            //toggle按钮
            if (this.options.showToggleBtn) {
              this._on($toggleBtn, { click: function(e) {
                  var $body = $("body");
                  self.$menus
                      .find(".arrow")
                      .removeClass(self.options.icons.expand)
                      .addClass(self.options.icons.collapse);
                  if ($body.hasClass("ui-sidebar-closed")) {
                    self.$menus.find(".sub-menu").removeAttr("style");
                      $body.removeClass("ui-sidebar-closed");
                      $(".sub-menu", self.element).find(".top-item").hide();
                      self.$menus.removeClass("ui-sidebar-menu-closed");
                      $el.css("width", self.options.width);
                      self._trigger("expand", null, { expand: true, $el: $el });
                      if (self._isInlineMode()) {
                          self._destroyInlineMenu();
                      }
                      self._off(self.$menus, "mouseenter mouseleave");
                      self._detectHash();
                  } else {
                      $body.addClass("ui-sidebar-closed");
                      self.$menus.addClass("ui-sidebar-menu-closed");
                      $(".sub-menu", self.element).find(".top-item").show();
                      $(".sub-menu", self.element).removeAttr("style");
                      $el.css("width", self.options.minWidth);
                      if (self._isInlineMode()) {
                        self._createInlineMenu();
                      }
                      self._off(self.$menus, "mouseenter mouseleave");
                      self._on(self.$menus, { "mouseenter >li": function(e) {
                              self.$menus.find(".sub-menu").hide();
                              var $this = $(e.currentTarget),
                                  $subMenu = $this.children(".sub-menu");
                              $this.addClass("pagesidebar-item-over");
                              if ($("body").hasClass("ui-sidebar-closed") && !$subMenu.is(":visible")) {
                                  var position = { my: "left top", at: "right top", collision: "fit flip", of: $this };
                                  $subMenu.show().css("position", "absolute").position(position);
                              }
                              e.preventDefault();
                              e.stopPropagation();
                          },
                          "mouseleave": function(e) {
                            clearTimeout(this.timer);
                            this.timer = fish.delay(function() {
                                $(e.currentTarget).find(".pagesidebar-item-over").removeClass("pagesidebar-item-over");
                                if (self.$menus.hasClass("ui-sidebar-menu-closed")) {
                                    var $this = $(e.currentTarget),
                                        $subMenu = $this.find(".sub-menu").filter(":visible");
                                    if ($subMenu.length > 0) {
                                        $subMenu.hide();
                                    }
                                }
                            }, 300);
                          } 
                        });
                      self._trigger("expand", null, { expand: false, $el: $el });
                  }
                } });
            }
            this.events = {
                'click a': function (e) {
                    var $this = $(e.currentTarget),
                        checkElement = $this.next(),
                        $arrow = $this.find('.arrow'),
                        collapseIcon = self.options.icons.collapse,
                        expandIcon = self.options.icons.expand,
                        autoScroll = self.options.autoScroll;
                    self._trigger('select', e, $this.data('data-menu-item'));
                    if (checkElement.is('.sub-menu') && checkElement.is(':visible') && checkElement.children().not('.top-item').length >= 1) {
                        checkElement.slideUp(this.animationSpeed, function () {
                            $arrow.removeClass(expandIcon).addClass(collapseIcon);
                            if (autoScroll === true) {
                                scrollTo($this, slideOffeset);
                            }
                            self._trigger('slideUp', null, {
                                $el: $el
                            });
                        });
                        if (!self.fromLocate && checkElement.children(".active").length === 1) {
                            $this.parent("li").addClass("active");
                        }
                    }
                    else if ((checkElement.is('.sub-menu')) && (!checkElement.is(':visible')) && checkElement.children().not('.top-item').length >= 1) {
                        //Get the parent menu
                        var parent = $this.parents('ul').first();
                        var ul = parent.find('ul:visible').slideUp(this.animationSpeed, function() {
                            var $activeElement = $(this).find('.active');
                            if ($activeElement.length > 0) {
                                $(this).parent().addClass("active");
                            }
                        });
                        //Get the parent li
                        var parent_li = $this.parent("li");

                        checkElement.slideDown(this.animationSpeed, function () {
                            $arrow.removeClass(collapseIcon).addClass(expandIcon);
                            if (autoScroll === true) {
                                scrollTo($this, slideOffeset);
                            }
                            self._trigger('slideDown', null, {
                                $el: $el
                            });
                        });
                        var selector = '.' + expandIcon.split(" ")[1];
                        parent.find(selector).removeClass(expandIcon).addClass(collapseIcon);
                        if (!self.fromLocate) {
                            parent_li.removeClass("active");
                        }
                    }
                    else {
                        if (!self.fromLocate) {
                            self.$menus.find(".active").removeClass("active");
                            $this.parent("li").addClass("active");
                        }

                    }
                    self.fromLocate = false;
                }
            }
            this._on(this.$menus, this.events);
        },
        _action: function () {
            this._openFirst();
            this._detectHash();
        },
        /**
         * 判断是否自动打开第一个菜单，如果第一个菜单为目录，则打开子菜单中的第一个
         * @private
         */
        _openFirst: function () {
            if (this.options.openFirst !== true) {
                return;
            }
            if (fish.isEmpty(this.options.data)) {
                return;
            }
            //已经有hash
            if (location.hash.length > 1) {
                return;
            }

            var $el = this.element,
                $sidebar = $el.find('.ui-sidebar'),
                $sidebarMenu = $el.find('.ui-sidebar-menu');
            //查找一级菜单
            var $firstA = $sidebar.find('ul.ui-sidebar-menu>li>a:eq(0)');
            var hash = $firstA[0]['hash'];
            if (hash.charAt(0) === '#') {
                location.hash = hash;
                $firstA.parent().addClass('active');
            } else {
                var $secondA = $sidebar.find('ul.ui-sidebar-menu>li>ul.sub-menu>li>a:eq(0)');
                var hash = $secondA[0]['hash'];
                if (hash.charAt(0) === '#') {
                    location.hash = hash;
                }
                $secondA.parent().addClass('active');
            }
        },

        /**
         * 检测当前的页面的hash
         * @private
         */
        _detectHash: function () {
            var self = this;
            var hash = location.hash;
            if (hash && hash.length > 1) {
                setTimeout(function () {
                    self.locate(hash);
                }, 100);
            }
        },

        /**
         * 动态支持属性设置
         * @param key
         * @param value
         * @private
         */
        _setOption: function (key, value) {
            this._super(key, value);
            switch (key) {
                case 'position':
                    this._setPosition();
                case 'width':
                    this._setWidth();
            }

        },

        /**
         * 固定控件
         * @private
         */
        _setWidth: function () {
            this.element.css("width", this.options.width);
        },
        /**
         * 设置边框位置
         * @private
         */
        _setPosition: function () {
            if (this.options.position === 'right') {
                $('body').removeClass("ui-sidebar-left").addClass('ui-sidebar-right');
            } else {
                $("body").removeClass("ui-sidebar-right").addClass('ui-sidebar-left');
            }
        },


        /**
         * 菜单滚动条显示
         * @private
         */
        _setScroll: function () {
            var self = this,
                $el = this.element,
                $sidebarMenu = $el.find('.ui-sidebar-menu');
            if ($sidebarMenu.data('ui-slim-scroll-init')) {
                //
                $sidebarMenu.slimScroll({
                    destroy: true
                });
            }
            //var autoHeight = Math.min($sidebarMenu[0].scrollHeight, document.body.scrollHeight);
            var autoHeight = $sidebarMenu[0].scrollHeight;

            $sidebarMenu.slimScroll({
                allowPageScroll: true, // allow page scroll when the element scroll is ended
                size: '7px',
                position: 'right',
                height: autoHeight,
                alwaysVisible: false,
                railVisible: true,
                disableFadeOut: true
            });
            $sidebarMenu.data('ui-slim-scroll-init', true);

        },
        /**
         * 定位右边菜单
         */
        locate: function (hash) {
            var self = this;
            var $li = this.$menus.find('.active');
            this.fromLocate = true;
            if ($li.is(":hidden")) {
                var parents = $li.parents("li");
                parents.each(function(index, li) {
                    var target = $(li).children("a");
                    target.click();
                });
            } else {
                $li.children("a").click();
            }
        },

        /**
         * 销毁组件，由widget.js destroy方法调用
         * 清空节点和样式
         * @private
         */
        _destroy: function () {
            var self = this,
                $el = self.element,
                $sidebarMenu = $el.find('.ui-sidebar-menu');
            if ($sidebarMenu.data('ui-slim-scroll-init')) {
                $sidebarMenu.slimScroll({
                    destroy: true
                });
            }

            $el.removeClass('ui-sidebar-wrapper').removeClass(this.options.customClass).empty();
            $('body').removeClass('ui-sidebar-left ui-sidebar-right');
            $('body').removeClass('ui-sidebar-closed');
        },

        /**
         * 收缩状态下创建inline menu
         * @private
         */
        _createInlineMenu: function() {
            var self = this;
            this._off(this.$menus, "click mouseleave>li");
            fish.each(this.$menus.children("li"), function(li) {
                var subMenu = $(li).children(".sub-menu");
                if (subMenu.children().length > 1) {
                    subMenu.addClass("pagesidebar-menu");
                    subMenu.menu();
                }
            });
            this._on(this.$menus, {
                'click a': function(e){
                    var $this = $(e.currentTarget),
                        checkElement = $this.next();
                    if (checkElement.length === 0) {
                        self.$menus.find(".active").removeClass("active");
                        $this.parents("li").addClass("active");
                        self._trigger('select', e, $this.data('data-menu-item'));
                    }
                    e.stopPropagation();
                }
            });
        },
        /**
         * 展开状态下销毁inline menu
         * @private
         */
        _destroyInlineMenu: function() {
            this._off(this.$menus, "click");
            var $pagesidebarMenu = this.$menus.find(".pagesidebar-menu");
            $pagesidebarMenu.menu("destroy");
            $pagesidebarMenu.removeClass("pagesidebar-menu");
            this.$menus.find(".sub-menu").hide();
            this._on(this.$menus, this.events);
        },
        _isInlineMode: function() {
            return this.options.subMenuMode === "inline"? true : false;
        }
    });

    function scrollTo(el, offeset) {
        var pos = (el && el.size() > 0) ? el.offset().top : 0;

        if (el) {
            pos = pos + (offeset ? offeset : -1 * el.height());
        }

        $('html,body').animate({
            scrollTop: pos
        }, 'slow');
    }
}();
