/**
 * 第三方组件，Splitter
 * @class  fish.desktop.widget.Splitter
 *
 * Depends:
 *  jquery.ui.core.js
 *  jquery.ui.mouse.js
 *  jquery.ui.widget.js
 */

!function() {
    'use strict';

    var pxUnitsRegex = /^\d+(\.\d+)?px$/i,
        percentageUnitsRegex = /^\d+(\.\d+)?%$/i,
        NS = ".splitter";

    $.widget("ui.splitter", $.ui.mouse, {
        options: {
            /**
             * @cfg {String} [orientation="horizontal"] 设置水平展开还是垂直展开  horizontal/vertical
             */
            orientation: "horizontal",
            /**
             * pane的属性集合,每一个pane一般都有属性collapsible是否能折叠、size大小
             * @cfg {Array} panes
             * <pre>
             * [{ collapsible: true, size: "290px" }]
             * </pre>
             */
            panes: [],
            /**
             * 闭合pane时触发的事件
             * @event collapse
             * @param {Object} e event对象
             * @param {Element} target 操作对象
             */
            /**
             * 展开pane时触发的事件
             * @event expand
             * @param {Object} e event对象
             * @param {Element} target 操作对象
             */
            /**
             * 拖拽pane分割线时触发的事件
             * @event resize
             * @param {Object} e event对象,e.position为分割线的最终位置(水平方向为left属性+width、垂直方向为top属性+height)
             */
            /**
             * 任意pane大小改变时触发的事件
             * @event layoutChange
             */
        },
        _create: function() {

            var isHorizontal = this.options.orientation.toLowerCase() != "vertical";
            this.orientation = isHorizontal ? "horizontal" : "vertical";
            if (isHorizontal) {
                this.sizingClientProperty = "clientWidth";
                this.sizingProperty = "width";
                this.sizingDomProperty = "outerWidth";
                this.sizingInnerProperty = "innerWidth";
                this.alternateSizingProperty = "height";
                this.positioningProperty = "left";
                this.mousePositioningProperty = "pageX";
            } else {
                this.sizingClientProperty = "clientHeight";
                this.sizingProperty = "height";
                this.sizingDomProperty = "outerHeight";
                this.sizingInnerProperty = "innerHeight";
                this.alternateSizingProperty = "width";
                this.positioningProperty = "top";
                this.mousePositioningProperty = "pageY";
            }
            this.id = this.element.attr("id");
            if (!this.id) {
                this.element.uniqueId();
                this.id = this.element.attr("id");
            }
            //初始化splitter中的各个面板(div)
            this._initPanes();

            this._mouseInit();

            this._resizeHandler = fish.onResize($.proxy(this._resize, this));
        },
        _initPanes: function() {
            var panesConfig = this.options.panes || [];
            var that = this;

            this.element.addClass("ui-splitter")
                .children("div") //目前布局只支持div;默认处理div类型的子节点
                .each(function(i, pane) {
                    // if (pane.nodeName.toLowerCase() != "script") {
                    that._initPane(pane, panesConfig[i]);
                    // }
                });

            this._resize();
        },

        _initPane: function(pane, config) {
            pane = $(pane)
                .attr("role", "group")
                .addClass("ui-pane");

            pane.data("pane", config ? config : {})
                .toggleClass("ui-scrollable", config ? config.scrollable !== false : true);
        },

        _resize: function() {
            // hidden 状态下不执行resize
            if(this.element.is(':hidden'))
                return;

            var that = this,
                element = that.element,
                panes = element.children(".ui-pane"),
                splitBars = element.children(".ui-splitbar"),
                splitBarsCount = splitBars.length,
                totalSize = element[that.sizingProperty]();

            if (splitBarsCount === 0) {
                splitBarsCount = panes.length - 1;
                panes.slice(0, splitBarsCount)
                    .after("<div tabindex='0' class='ui-splitbar'/>");

                that._updateSplitBars();
                splitBars = element.children(".ui-splitbar");
            } else {
                that._updateSplitBars();
            }

            //这里是要从总的宽度(高度)中减掉splitbar宽度(高度)
            //splitbar是position absolute的，也就是说totalSize中并没有包含splitBar的宽度(高度)
            //减去是为了能在排列panel的时候，准确设置panel的宽度,使splitbar不挡住panel
            splitBars.each(function() {
                totalSize -= $(this)[that.sizingDomProperty]();
            });

            var sizedPanesWidth = 0,
                sizedPanesCount = 0,
                freeSizedPanes = $();

            panes.css({
                position: "absolute",
                top: 0
            })[that.sizingProperty](function() {
                var config = $(this).data("pane") || {},
                    size;
                //判断是否存在滚动条，并且要计算滚动条的size
                var scrollbarSize = $(this)[that.sizingInnerProperty]() - $(this)[0][that.sizingClientProperty];

                if (config.collapsed) {
                    size = 0;
                    $(this).css("overflow", "hidden");
                } else if (isFluid(config.size)) {
                    freeSizedPanes = freeSizedPanes.add(this);
                    sizedPanesWidth += scrollbarSize;
                    return;
                } else { // sized in px/%, not collapsed
                    size = parseInt(config.size, 10);

                    if (isPercentageSize(config.size)) {
                        size = Math.floor(size * totalSize / 100);
                    }
                }

                sizedPanesCount++;
                sizedPanesWidth += size;

                return size;
            });

            totalSize -= sizedPanesWidth; //从totalSize中再减去已经确定了size的pane

            var freeSizePanesCount = freeSizedPanes.length,
                freeSizePaneWidth = Math.floor(totalSize / freeSizePanesCount);

            freeSizedPanes.slice(0, freeSizePanesCount - 1)
                .css(that.sizingProperty, freeSizePaneWidth) //平均分宽度
                .end()
                .eq(freeSizePanesCount - 1) //最后一个由总size减去之前的各个size之和
                .css(that.sizingProperty, totalSize - (freeSizePanesCount - 1) * freeSizePaneWidth);

            var sum = 0;
            if (freeSizePanesCount === 0) {
                //当所有panel的宽度(高度)都设置了，这个时候最有一个没有折叠的panel就需要把所有的宽度都
                //包含进去(因为可能存在配置里面设置的宽度和实际的宽度存在偏差)
                var lastNonCollapsedPane = panes.filter(function() {
                    return !(($(this).data("pane") || {}).collapsed);
                }).last();

                //当最后一个panel先收起来，然后拖动前一个panel的边框改变大小，再对最后一个panel进行展开的操作
                //这个时候，totalSize就会小于0(因为前一个panel在当前panel折叠的时候变大了)，此时需要对前一个panel的大小进行调整
                if (totalSize < 0 && lastNonCollapsedPane[0] == panes.last()[0]) {
                    var last2ndpanel = panes.eq(-2);
                    last2ndpanel[that.sizingProperty](totalSize + last2ndpanel[that.sizingDomProperty]());
                } else {
                    lastNonCollapsedPane[that.sizingProperty](totalSize + lastNonCollapsedPane[that.sizingDomProperty]());
                }
            }

            //这个地方的children包含splitbar
            element.children("div")
                .css(that.alternateSizingProperty, element[that.alternateSizingProperty]())
                .each(function(i, child) {
                    // if (child.tagName.toLowerCase() != "script") {
                    $(child).css(that.positioningProperty, Math.floor(sum) + "px");
                    sum += $(child)[that.sizingDomProperty]();
                    // }
                });

            that._detachEvents();
            that._attachEvents();

            that._trigger("layoutChange");
        },

        _updateSplitBars: function() {
            var that = this;
            this.element.children(".ui-splitbar").each(function() {
                var splitbar = $(this),
                    previousPane = splitbar.prev(".ui-pane").data("pane"),
                    nextPane = splitbar.next(".ui-pane").data("pane");
                that._updateSplitBar(splitbar, previousPane, nextPane);
            });
        },

        _updateSplitBar: function(splitbar, previousPane, nextPane) {
            var catIconIf = function(iconType, condition) {
                    return condition ? "<div class='icon " + iconType + "' />" : "";
                },
                orientation = this.orientation,
                draggable = (previousPane.resizable !== false) && (nextPane.resizable !== false),
                prevCollapsible = previousPane.collapsible,
                prevCollapsed = previousPane.collapsed,
                nextCollapsible = nextPane.collapsible,
                nextCollapsed = nextPane.collapsed;

            splitbar.addClass("ui-splitbar ui-splitbar-" + orientation) // ui-state-default
                .attr("role", "separator")
                .attr("aria-expanded", !(prevCollapsed || nextCollapsed))
                .removeClass("ui-splitbar-" + orientation + "-hover")
                .toggleClass("ui-splitbar-draggable-" + orientation,
                    draggable && !prevCollapsed && !nextCollapsed)
                .toggleClass("ui-splitbar-static-" + orientation, !draggable && !prevCollapsible && !nextCollapsible)
                .html(
                    catIconIf("ui-collapse-prev", prevCollapsible && !prevCollapsed && !nextCollapsed) + catIconIf("ui-expand-prev", prevCollapsible && prevCollapsed && !nextCollapsed) + catIconIf("ui-resize-handle", draggable) + catIconIf("ui-collapse-next", nextCollapsible && !nextCollapsed && !prevCollapsed) + catIconIf("ui-expand-next", nextCollapsible && nextCollapsed && !prevCollapsed));
        },
        _attachEvents: function() {
            var that = this,
                orientation = that.orientation;

            // do not use delegated events to increase performance of nested elements
            that.element.children(".ui-splitbar-draggable-" + orientation)
                .on("mousedown" + NS, function(e) {
                    e.currentTarget.focus();
                })
                .on("focus" + NS, function(e) {
                    $(e.currentTarget).addClass("ui-state-focused");
                })
                .on("blur" + NS, function(e) {
                    $(e.currentTarget).removeClass("ui-state-focused");
                })
                .on("mouseenter" + NS, function() {
                    $(this).addClass("ui-splitbar-" + orientation + "-hover");
                })
                .on("mouseleave" + NS, function() {
                    $(this).removeClass("ui-splitbar-" + orientation + "-hover");
                })
                .on("mousedown" + NS, function() {
                    that._panes().append("<div class='ui-splitter-overlay ui-overlay' />");
                })
                .on("mouseup" + NS, function() {
                    that._panes().children(".ui-splitter-overlay").remove();
                })
                .end()
                .children(".ui-splitbar")
                .on("dblclick" + NS, $.proxy(that._togglePane, that))
                .children(".ui-collapse-next, .ui-collapse-prev").on("click" + NS, that._arrowClick("collapse")).end()
                .children(".ui-expand-next, .ui-expand-prev").on("click" + NS, that._arrowClick("expand")).end()
                .end();
        },

        _detachEvents: function() {
            var that = this;

            that.element.children(".ui-splitbar-draggable-" + that.orientation).off(NS).end()
                .children(".ui-splitbar").off("dblclick" + NS)
                .children(".ui-collapse-next, .ui-collapse-prev, .ui-expand-next, .ui-expand-prev").off(NS);
        },

        // _triggerAction: function(type, pane) {
        //     this[type](pane[0]);
        //     this._trigger(type, null, pane[0]);
        // },
        // 双击收缩
        _togglePane: function(e) {
            var that = this,
                target = $(e.target),
                arrow;

            if (target.closest(".ui-splitter")[0] != that.element[0]) {
                return;
            }

            arrow = target.children(".icon:not(.ui-resize-handle)");

            if (arrow.length !== 1) {
                return;
            }

            if (arrow.is(".ui-collapse-prev")) {
                this["collapse"](target.prev());
            } else if (arrow.is(".ui-collapse-next")) {
                this["collapse"](target.next());
            } else if (arrow.is(".ui-expand-prev")) {
                this["expand"](target.prev());
            } else if (arrow.is(".ui-expand-next")) {
                this["expand"](target.next());
            }
        },
        /**
         * @method toggle
         * 原来的panle如果是展开的，则收起指定的panel；反之则展开panel
         * @param{selector} pane  传入一个选择器，表示要操作的panel
         * @param{boolean} triggerCallback  是否要触发回调，不传入的时候默认触发回调
         */
        toggle: function(pane, triggerCallback, expand) {
            var that = this,
                paneConfig,
                triggerType;

            pane = that.element.find(pane);
            paneConfig = pane.data("pane");

            if (!expand && !paneConfig.collapsible) {
                return;
            }

            if (arguments.length < 3) {
                expand = paneConfig.collapsed === undefined ? false : paneConfig.collapsed;
            }

            paneConfig.collapsed = !expand;
            triggerType = paneConfig.collapsed ? "collapse" : "expand";
            if (paneConfig.collapsed) {
                pane.css("overflow", "hidden");
            } else {
                pane.css("overflow", "");
            }

            fish.resize(this.element[0], true);

            if (triggerCallback != false) {
                that._trigger(triggerType, null, pane[0]);
            }
        },
        /**
         * @method collapse
         * 收起指定的panel
         * @param{selector} pane  传入一个选择器，表示要操作的panel
         * @param{boolean} triggerCallback  是否要触发回调，默认触发;如果指定的panel已经是收起的，再次调用的时候，不会触发回调
         */
        collapse: function(pane, triggerCallback) {
            triggerCallback = triggerCallback === undefined ? true : triggerCallback;
            this.toggle(pane, triggerCallback, false);
        },
        /**
         * @method expand
         * 展开指定的panel
         * @param{selector} pane  传入一个选择器，表示要操作的panel
         * @param{boolean} triggerCallback  是否要触发回调，默认触发;如果指定的panel已经是收起的，再次调用的时候，不会触发回调
         */
        expand: function(pane, triggerCallback) {
            triggerCallback = triggerCallback === undefined ? true : triggerCallback;
            this.toggle(pane, triggerCallback, true);
        },
        _arrowClick: function(arrowType) {
            var that = this;

            return function(e) {
                var target = $(e.target),
                    pane;

                if (target.closest(".ui-splitter")[0] != that.element[0]) {
                    return;
                }

                if (target.is(".ui-" + arrowType + "-prev")) {
                    pane = target.parent().prev();
                } else {
                    pane = target.parent().next();
                }
                that[arrowType](pane);
            };
        },
        _panes: function() {
            return this.element.children(".ui-pane");
        },

        _mouseCapture: function(e) {
            var mouseCapture = false,
                $target = $(e.target);

            if ($(e.target).is(".ui-splitbar-draggable-vertical") || $(e.target).is(".ui-splitbar-draggable-horizontal")) {
                mouseCapture = true;
            }

            return mouseCapture;
        },
        _mouseStart: function(e) {
            var that = this;
            var splitbar = that.splitbar = $(e.target).is(".ui-resize-handle") ? $(e.target).parent() : $(e.target);

            //这里取的position是相对于上层元素的position，没有取相对于document的位置偏移(offset)
            that._initialElementPosition = splitbar.position()[that.positioningProperty];
            that._initialMousePosition = e[that.mousePositioningProperty];

            //创建显示拖动位置的div
            //创建拖动时候的提示框，传入的参数应该是触发鼠标start事件时候的splitbar???
            that.hint = $("<div class='ui-ghost-splitbar ui-ghost-splitbar-" + that.orientation + "' />") // ui-state-default
                .css(that.alternateSizingProperty, splitbar[that.alternateSizingProperty]());
            that.hint.css({
                    position: "absolute"
                })
                .css(that.positioningProperty, that._initialElementPosition)
                .toggleClass("ui-restricted-size-" + that.orientation || "")   //, position == maxPosition || position == minPosition
                .appendTo(that.element);

            var previousPane = splitbar.prev(),
                nextPane = splitbar.next(),
                previousPaneConfig = previousPane.data("pane"),
                nextPaneConfig = nextPane.data("pane"),
                prevBoundary = parseInt(previousPane.css(that.positioningProperty), 10),
                nextBoundary = parseInt(nextPane.css(that.positioningProperty), 10) + nextPane[that.sizingDomProperty]() - splitbar[that.sizingDomProperty](),
                totalSize = parseInt(that.element[that.sizingProperty](), 10),
                toPx = function(value) {
                    var val = parseInt(value, 10);
                    return (isPixelSize(value) ? val : (totalSize * val) / 100) || 0;
                },
                prevMinSize = toPx(previousPaneConfig.min),
                prevMaxSize = toPx(previousPaneConfig.max) || nextBoundary - prevBoundary,
                nextMinSize = toPx(nextPaneConfig.min),
                nextMaxSize = toPx(nextPaneConfig.max) || nextBoundary - prevBoundary;

            that.previousPane = previousPane;
            that.nextPane = nextPane;
            that._maxPosition = Math.min(nextBoundary - nextMinSize, prevBoundary + prevMaxSize);
            that._minPosition = Math.max(prevBoundary + prevMinSize, nextBoundary - nextMaxSize);
        },

        _mouseDrag: function(e) {
            var that = this,
                maxPosition = that._maxPosition,
                minPosition = that._minPosition,

                //当前的位置=原来的位置 + 鼠标移动距离
                currentPosition = that._initialElementPosition + (e[that.mousePositioningProperty] - that._initialMousePosition),
                position;

            position = minPosition !== undefined ? Math.max(minPosition, currentPosition) : currentPosition;
            that.position = position = maxPosition !== undefined ? Math.min(maxPosition, position) : position;

            if (that.hint) {
                that.hint.css(that.positioningProperty, position);
            }

            that.resizing = true;
            that._trigger("resize", $.extend(e, {
                position: position
            }));
        },
        _mouseStop: function(e) {
            //鼠标停止拖拽，移除hint，标志位重置
            var that = this;
            if (that.hint) {
                that.hint.remove();
            }
            that.resizing = false;


            that._panes().children(".ui-splitter-overlay").remove();

            var ghostPosition = that.position,
                previousPane = that.splitbar.prev(),
                nextPane = that.splitbar.next(),
                previousPaneConfig = previousPane.data("pane"),
                nextPaneConfig = nextPane.data("pane"),
                previousPaneNewSize = ghostPosition - parseInt(previousPane.css(that.positioningProperty), 10),
                nextPaneNewSize = parseInt(nextPane.css(that.positioningProperty), 10) + nextPane[that.sizingDomProperty]() - ghostPosition - that.splitbar[that.sizingDomProperty](),
                fluidPanesCount = that.element.children(".ui-pane").filter(function() {
                    return isFluid($(this).data("pane").size);
                }).length;

            if (!isFluid(previousPaneConfig.size) || fluidPanesCount > 1) {
                if (isFluid(previousPaneConfig.size)) {
                    fluidPanesCount--;
                }

                previousPaneConfig.size = previousPaneNewSize + "px";
            }

            if (!isFluid(nextPaneConfig.size) || fluidPanesCount > 1) {
                nextPaneConfig.size = nextPaneNewSize + "px";
            }

            fish.resize(this.element[0], true);
        },

        _destroy: function() {
            fish.offResize(this._resizeHandler);

            //移除额外样式
            var $el = $(this.element);
            $el.removeClass('ui-splitter');
            $el.children('.ui-splitbar').remove();
            $el.children('.ui-pane').removeClass('ui-pane');
        }
    });

    function isPercentageSize(size) {
        return percentageUnitsRegex.test(size);
    }

    function isPixelSize(size) {
        return pxUnitsRegex.test(size) || /^\d+$/.test(size);
    }

    function isFluid(size) {
        return !isPercentageSize(size) && !isPixelSize(size);
    }
}();