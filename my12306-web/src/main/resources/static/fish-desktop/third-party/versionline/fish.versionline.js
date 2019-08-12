/**
 * 第三方组件，版本发布时间滑块组件
 * @class fish.desktop.widget.Versionline
 * @extends fish.desktop.widget
 * @author miaocunzhi
 * <pre>
 *   $(element).versionline(option);
 * </pre>
 */
!function () {
    "use strict";
    var util = fish.dateutil;

    $.widget('ui.versionline', {
        options: {
            /**
             * 需要处理的节点的标识
             * @cfg {String} keyName 删除节点和修改节点需要的标识，为对应的属性名,默认title
             */
            keyName: 'title',
            /**
             * 自定义样式名
             * @cfg {String} versionlineClass 自定义样式名
             */
            versionlineClass: '',
            /**
             * 时间轴展示方向
             * @cfg {String} orientation 设置时间轴展示方向，horizontal/vertical。
             */
            orientation: "horizontal",
            /**
             * 版本节点
             * @cfg {Array} versionNodes 对象数组
             * @cfg {String} versionNodes.title 版本展示标题
             * @cfg {String} versionNodes.effectTime 版本发布日期
             * @cfg {String} versionNodes.status 版本状态，默认released，可选retired，released，draft，也可自定义（同时也是状态样式名，自定义样式的时候可用）
             * @cfg {Boolean} versionNodes.editable 当前节点时间是否可编辑（若未定义，则版本轴只展示不可编辑）
             * @cfg {String} versionNodes.expiryTime 最后版本的到期时间（当前节点为最后版本节点生效）
             */
            versionNodes: [],
            /**
             * 版本轴时间展示格式, 推荐使用viewType
             * @cfg {String} format
             */
            format: null,
            /**
             *  @cfg {String|Date} 版本轴上到达的时间，默认为当前时间
             */
            arrivedTime: null,

            /**
             * 编辑节点时间时，日期时间控件时间类型:日期格式date与时间格式time;默认值为date
             * @cfg {String} 日期时间控件时间类型，默认值为date
             */
            viewType: 'date',
            /**
             * 时间值改变时触发的事件
             * @event change
             * @param  {Event} e 事件对
             * @param  {Object} nodeData 值发生改变的版本节点的节点信息
             */
            change: null, //改变事件
            /**
             * 编辑版本轴上节点时间前绑定的事件,返回Promise对象。可用于确认是否修改提示等
             * @event  beforeEditVersionNode
             * @param  {Event} e 事件
             * @param  {Object} nodeData 需要编辑时间的版本节点的节点信息
             */
            beforeEditVersionNode: null
        },


        _create: function () {
            this.startTime = 0;
            // 由于日期时间展示格式由portal数据库配置决定，因此需要获取配置的日期时间格式
            this.parseFormat = this.options.format || fish.config.get('dateParseFormat.' + this.options.viewType);
            this.displayFormat = fish.config.get('dateDisplayFormat.' + this.options.viewType);
            this._sort();
            this._detectOrientation();

            this.element.addClass("ui-versionline ui-versionline-" + this.orientation + " " + this.options.versionlineClass);

            this._refresh();

        },

        _refresh: function () {
            this._createRange();
            this._createHandles();
            this._refreshValue();
        },

        _createHandles: function () {
            var that = this;
            var i, handleCount,
                options = this.options,
                handle = "<span class='ui-versionline-handle'></span>",
                handles = [];

            if (this.isHasDraft) {
                handleCount = (options.versionNodes && (options.versionNodes.length - 1)) || 0;
            } else {
                handleCount = (options.versionNodes && options.versionNodes.length) || 0;
            }

            for (i = 0; i < handleCount; i++) {
                handles.push(handle);
            }

            if (this.handles) {
                this.handles.remove();
            }

            this.handles = [];
            this.handles = $(handles.join("")).appendTo(this.element);

            this.handle = this.handles.eq(0);

            this.handles.each(function(i) {
                var thisHandle = this;
                $(this).data("ui-versionline-handle-index", i);
                var status = options.versionNodes[i].status ? options.versionNodes[i].status : "released";
                $(this).addClass(status);
                $(this).html('<span class="ui-versionline-handle-' + that.orientation + '-tips"></span>');
                if (options.versionNodes[i].editable == true) {
                    $(this).on("mouseenter", function(){
                        var editIcon = '<span class="glyphicon glyphicon-pencil"></span>';
                        $(this).addClass('editable');
                        $(editIcon).appendTo($(this));
                        if(options.versionNodes[i][options.keyName] == 'expiryTime' && options.versionNodes[i].effectTime){
                            var removeIcon = '<span class="glyphicon glyphicon-remove"></span>';
                            $(removeIcon).appendTo($(this));
                            $('.glyphicon-remove').on('click', function(e){
                                that._triggerAsync("beforeEditVersionNode", e, options.versionNodes[i]).then(function() {
                                    that.setValue(options.versionNodes[i][options.keyName], {
                                        effectTime:""
                                    });
                                });

                                return false;
                            });
                        }
                        if(!options.versionNodes[i].effectTime){
                            if(that.orientation == "horizontal"){
                                $(thisHandle).find('.glyphicon-pencil').eq(0).css('right','-18px');
                                $(thisHandle).find('.glyphicon-remove').eq(0).css('right','-35px');
                            }else{
                                $(thisHandle).find('.glyphicon-pencil').eq(0).css('right','-35px');
                                $(thisHandle).find('.glyphicon-remove').eq(0).css('right','-55px');
                            }

                        }
                    });
                    $(this).on("mouseleave", function(){
                        $(this).removeClass('editable');
                        $(thisHandle).find('.glyphicon').remove();
                        $(thisHandle).find('.glyphicon').off();
                    });
                    $(this).on("click", function(e) {
                        that._triggerAsync("beforeEditVersionNode", e, options.versionNodes[i]).then(function() {
                            that.createDatetimepicker(thisHandle, i)
                            $(this).off();
                        }.bind(this));

                        return false;
                    });
                }

            });
        },

        _createRange: function () {
            var that = this;
            var options = this.options,
                classes = "";

            if (this.ranges) {
                $.each(this.ranges, function(i, n) {
                    n.remove();
                });
            }
            this.ranges = [];
            $.each(this.options.versionNodes, function(i, n) {
                if (n[that.options.keyName] != "expiryTime") {
                    var status = n.status ? n.status : "released";
                    var statusTitle = status.replace(/^\S/, function(s) {
                        return s.toUpperCase();
                    });
                    that.ranges.push($('<div class="ui-versionline-range ' + status + '-range"><span class="ui-versionline-title">' + n.title + '</span><span class="ui-versionline-status">' + statusTitle + '</span></div>').appendTo(that.element));
                }
            });
        },

        _destroy: function () {
            this.options.versionNodes = [];
            this.handles.remove();
            if (this.ranges) {
                $.each(this.ranges, function(i, n) {
                    n.remove();
                });
            }

            this.element.removeClass("ui-versionline ui-versionline-horizontal ui-versionline-vertical"); // ui-widget ui-widget-content ui-corner-all
        },

        destroy: function(){
            this._destroy();
        },

        clearVersion: function(){
            this.options.versionNodes = [];
            this._refresh();
        },

        _detectOrientation: function () {
            this.orientation = (this.options.orientation === "vertical") ? "vertical" : "horizontal";
        },


        _change: function (event, index) {
            var varsionNode;
            if(fish.isObject(index)){
                varsionNode = index;
            }else{
                varsionNode = this.getVersionNodes()[index];
            }
            this._trigger("change", event, varsionNode);
        },


        //按时间排序
        _sort: function (){
            var that = this;
            var values = [],
            versionNodes = this.options.versionNodes;
            $.each(versionNodes, function(i, n) {
                if (n[that.options.keyName] == "expiryTime") {
                    versionNodes.splice(i, 1);
                    return false;
                }
            });
            $.each(versionNodes, function(i, n) {
                if (n.effectTime) {
                    values.push({
                      time: util.parse(n.effectTime, that.parseFormat).getTime(),
                      title: n.title
                    });
                }
            });
            //排序
            values.sort(function(a, b) {
                return a - b;
            });

            //将处理后的versionNodes重新赋值
            var sortChildren = [];
            $.each(versionNodes, function(i, n) {
                if (n.effectTime && (n.status == "retired" || n.status == "released" || !n.status)) {
                    $.each(values, function(j, m) {
                        if (util.parse(n.effectTime, that.parseFormat).getTime() == m.time && m.title === n.title) {
                            sortChildren[j] = n;
                        }
                    });
                }
            });

            // 若最后一个版本的状态为非retired,released,空，则取前一个版本，否则取最后一个版本,作为单独节点
            this.lastVersion = sortChildren[sortChildren.length - 1];
            if (this.lastVersion.status && this.lastVersion.status != "retired" && this.lastVersion.status != "released") {
                this.lastVersion = sortChildren[sortChildren.length - 2];
            }
            var expiryTime = {
                effectTime: this.lastVersion.expiryTime || "",
                editable: this.lastVersion.editable || (this.lastVersion.editable === false && this.lastVersion.status !== "retired" && 
                    (!this.lastVersion.expiryTime || this.lastVersion.expiryTime > util.format(new Date(), that.parseFormat))),
                status: this.lastVersion.status
            }
            expiryTime[this.options.keyName] = "expiryTime";
            sortChildren.push(expiryTime);

            //将草稿放入数据中
            this.isHasDraft = false;
            $.each(versionNodes, function(i, n) {
                if (n.status && n.status != "retired" && n.status != "released") {
                    sortChildren.push(n);
                    that.isHasDraft = true;
                    return false;
                }
            });

            this.options.versionNodes = sortChildren;
        },

        /**
         * 获取versionNodes
         * @returns {Array} 不包括截止节点
         */

        getVersionNodes: function(){
            var that = this;
            var values = this.options.versionNodes.slice(0);
            $.each(values, function(i, n) {
                if (n[that.options.keyName] == "expiryTime") {
                    values.splice(i, 1);
                    return false;
                }
            });
            return values;
        },

        _refreshValue: function () {
            var that = this;
            var rangeWidth, valPercent,
                oRange = this.options.ranges,
                o = this.options,
                _set = {},
                num = 0;
            var now = new Date();
            if (this.options.arrivedTime) {
                now = util.parse(this.options.arrivedTime, this.parseFormat);
            }

            if (this.options.versionNodes && this.options.versionNodes.length) {
                num = this.options.versionNodes.length - 1;
                rangeWidth = 100 / num;
                this.handles.each(function(i) {
                    valPercent = i * rangeWidth;
                    var width = rangeWidth;
                    _set[that.orientation === "horizontal" ? "left" : "bottom"] = valPercent + "%";
                    var showDate = util.displayDate(that.options.versionNodes[i].effectTime, that.parseFormat, that.displayFormat);
                    if (!showDate) {
                        showDate = "--";
                    }
                    var nextDate = that.options.versionNodes[i + 1] ? that.options.versionNodes[i + 1].effectTime : undefined;
                    var time = showDate.split(" ")[1];
                    $(this).find('.ui-versionline-handle-' + that.orientation + '-tips').html(showDate.split(" ")[0] +  (time ? ("<br>" +time) : ""));
                    $(this).css(_set);
                    if (that.ranges[i]) {
                        if (that.orientation === "horizontal") {
                            if ((showDate != "--") && (util.parse(showDate, that.parseFormat) < now)) {
                                if ((nextDate && (util.parse(nextDate, that.parseFormat) > now)) || (that.options.versionNodes[i + 1] && !nextDate)) {
                                    that.ranges[i].find("span").css("width", $(that.element).width() * rangeWidth / 100 + "px");
                                    width = width / 2;
                                    that.ranges[i].css("height", "3px");
                                } else {
                                    that.ranges[i].css("height", "3px");
                                }
                            } else {
                                that.ranges[i].css("height", 0);
                            }
                            that.ranges[i].css({
                                left: valPercent + "%",
                                width: width + "%"
                            });
                        } else {
                            if ((showDate != "--") && (util.parse(showDate, that.parseFormat) < now)) {
                                if ((nextDate && (util.parse(nextDate, that.parseFormat) > now)) || (that.options.versionNodes[i + 1] && !nextDate)) {
                                    that.ranges[i].find("span").eq(0).css("top", "-7%");
                                    that.ranges[i].find("span").eq(1).css("top", 0);
                                    width = width / 2;
                                    that.ranges[i].css("width", "3px");
                                } else {
                                    that.ranges[i].css("width", "3px");
                                }
                            } else {
                                that.ranges[i].css("width", 0);
                            }
                            that.ranges[i].css({
                                bottom: valPercent + "%",
                                height: width + "%"
                            });
                        }
                    }
                });
            }
        },


        /**
         * 添加versionNodes
         * @param {Array} arr 添加的版本节点数组
         * @param {String} arr.title 版本节点的标题
         * @param {String} arr.effectTime 版本发布的时间
         */
        addVersionNodes: function(arr, position){
            var that = this;
            if (!this.element.hasClass('ui-versionline')) {
                return false;
            }
            if ($.isArray(arr)) {
                $.each(arr, function(i, n) {
                    if (n.effectTime) {
                        that.options.versionNodes.push(n);
                    }
                });
            }
            that._sort();
            that._refresh();
        },

         /**
         * 修改节点，
         * @param {String} key keyName对应属性的值
         * @param {Object} opts 修改节点的数据
         */
        setValue: function(key, opts){
            var that = this;

            if(key == "expiryTime"){
                this.lastVersion.expiryTime = opts.effectTime;
                that._change(null, this.lastVersion);
            }else{
                $.each(this.options.versionNodes, function(i, n) {
                    if (n[that.options.keyName] == key) {
                        $.each(opts, function(name, value) {
                            n[name] = value;
                        });
                        that._change(null, i);
                        return false;
                    }
                });
            }
            that._sort();
            that._refresh();
        },

        /**
         * 删除节点，
         * @param {String} key keyName对应属性的值
         */
        deleteVersion: function(key){
            var that = this;
            $.each(this.options.versionNodes, function(i, n) {
                if (n[that.options.keyName] == key) {
                    that.options.versionNodes.splice(i, 1);
                    that._sort();
                    that._refresh();
                    return false;
                }
            });
        },

        createDatetimepicker: function(thisHandle, i){
            var o = this.options,
                that = this;
            var dateDemo = '<input type="text" class="changedate" style="height:0;margin-top:-3px">';
            $(dateDemo).appendTo($(thisHandle));
            var nowDate = o.versionNodes[i].effectTime;
            var startDate;
            for (var j = (i - 1); j > -1; j--) {
                if (o.versionNodes[j].effectTime) {
                    startDate = o.versionNodes[j].effectTime;
                    break;
                }
            }
            //var startDate = o.versionNodes[i - 1] ? o.versionNodes[i - 1].effectTime : "";
            if (startDate) {
                if((new Date() > util.parse(startDate, that.parseFormat)) && (o.versionNodes[i][o.keyName] == "expiryTime")){
                    startDate = new Date();
                }
                startDate = util.format(util.addDays(util.getStartOfDay(util.parse(startDate, that.parseFormat)), 1), that.parseFormat);
            }
            var endDate = o.versionNodes[i + 1] ? o.versionNodes[i + 1].effectTime : "";
            if (endDate) {
                endDate = util.format(util.addDays(util.getStartOfDay(util.parse(endDate, that.parseFormat)), -1), that.parseFormat);
            }
            $('.changedate').datetimepicker({
                buttonIcon: '',
                startDate: startDate,
                endDate: endDate,
                orientation: {
                    x: 'auto',
                    y: 'bottom'
                },
                format: o.format,
                viewType: o.viewType,
                hide: function(e, value) {
                    $(thisHandle).removeClass('editable');
                    $(thisHandle).find('.glyphicon-pencil').eq(0).remove();
                    $('.changedate').datetimepicker("destroy");
                    if ($('.changedate')) {
                        $('.changedate').remove();
                    }
                    that.setValue(o.versionNodes[i][o.keyName], {
                        effectTime: util.format(value.date, that.parseFormat)
                    })
                }
            });
            $(".changedate").datetimepicker("value", util.parse(nowDate, that.parseFormat));
            $('.changedate').datetimepicker("show");
        }
    });
}();