/**
 * @class fish.desktop.widget.Slidertime
 * 第三方组件，slidertime 滑动时间选择器
 * <pre>
 *   $('#slidertime').slidertime();
 * </pre>
 */

!function() {

    $.widget("ui.slidertime", {
        options: {
            /**
             * 默认开始时间，必传
             * format "2015-6-1 8:00"
             * @cfg {String} startDate = "2015/06/01 08:00"
             */
            startDate: "",
            /**
             * 默认结束时间，必传
             * format "2015-10-1 17:00"
             * @cfg {String} endDate = "2015/10/01 17:00"
             */
            endDate: "",
            /**
             * 最小可选时间，必传
             * format "2015-1-1"
             * @cfg {String} min = "2015/01/01"
             */
            min: "",
            /**
             * 最大可选时间，必传
             * format "2016-1-1"
             * @cfg {String} max = "2016/01/01"
             */
            max: "",
            /**
             * 时间选择类型
             * date|time date为只能选择天 time可选时/分 默认为time
             * @cfg {String} viewType = "date" || "time"
             */
            viewType: "time",
            /**
             * 展示方式 垂直或者水平 默认水平
             * vertical || horizontal
             * @cfg {String} orientation = "vertical" || "horizontal"
             */
            orientation: "horizontal",
            /**
             * 触发日滑动选择事件
             * @cfg {Function} sliderDate
             */
            sliderDate: $.noop,
            /**
             * 触发开始时间（时/分）滑动选择事件
             * @cfg {Function} sliderStartHour
             */
            sliderStartHour: $.noop,
            /**
             * 触发结束时间（时/分）滑动选择事件
             * @cfg {Function} sliderEndHour
             */
            sliderEndHour: $.noop
        },
        _create: function() {
            this.options.months = fish.getResource('datetimepicker.monthsShort');
            this.options.format = this.options.viewType == 'time' ? "yyyy-mm-dd hh:ii" : "yyyy-mm-dd";
            this.options.min = fish.dateutil.parse(this.options.min,"yyyy-mm-dd");
            this.options.max = fish.dateutil.parse(this.options.max,"yyyy-mm-dd");
            this.options.startDate = fish.dateutil.parse(this.options.startDate,this.options.format);
            this.options.endDate = fish.dateutil.parse(this.options.endDate,this.options.format);
            //验证传入的日期是否有效
            if (!this.options.min || !this.options.max || !this.options.startDate || !this.options.endDate) {
                throw new Error('date is incorrect');
            }
            if (this.options.endDate < this.options.startDate || this.options.max < this.options.endDate) {
                throw new Error('end date is incorrect');
            }
            if (this.options.max < this.options.min) {
                throw new Error('max date is incorrect');
            }
            if (this.options.min > this.options.startDate) {
                throw new Error('start date is incorrect');
            }
            //渲染选择到日的slider
            this._drawDaySlider();
            if (this.options.viewType === "time") {
                //渲染开始时间（时/分）slider
                this._drawStartHourSlider();
                //渲染结束时间（时/分）slider
                this._drawEndHourSlider();
            }
        },
        _destroy: function() {
            this.element.find(".ui-slider").slider('destroy');
            this.element.children().remove();
        },
        _format: function(date) {
            date = fish.dateutil.format(date, this.options.format);
            return date;
        },
        _parse: function(date) {
            date = fish.dateutil.parse(date, this.options.format);
            return date;
        },
        _drawDaySlider: function() {
            var minYear = this.options.min.getFullYear();
            var maxYear = this.options.max.getFullYear();
            var diffYear = maxYear - minYear;
            // mark year
            var months = this.options.months;
            var days = [31, 28, 31, 30, 30, 30, 31, 31, 30, 31, 30, 31];
            var accDays = 0;
            var differDays = (this.options.max - this.options.min) / (24 * 60 * 60 * 1000);
            var dateEle = $("<div id='ui-slidertime-day'></div>");
            dateEle.appendTo(this.element);
            if (this.options.orientation === 'vertical') {
                dateEle.addClass('ui-slidertime-day-vertical');
            }
            var $this = this;
            $("#ui-slidertime-day").slider({
                range: true,
                min: 0,
                max: differDays,
                step: 1,
                orientation: $this.options.orientation,
                values: [($this.options.startDate - $this.options.min) / (24 * 60 * 60 * 1000), ($this.options.endDate - $this.options.min) / (24 * 60 * 60 * 1000)],
                slide: function(e, ui) {
                    var startDate = $this._pos2date(Math.floor(ui.values[0]));
                    startDate.setHours($this.options.startDate.getHours());
                    startDate.setMinutes($this.options.startDate.getMinutes());
                    var endDate = $this._pos2date(Math.floor(ui.values[1]));
                    endDate.setHours($this.options.endDate.getHours());
                    endDate.setMinutes($this.options.endDate.getMinutes());
                    $this.options.startDate = startDate;
                    $this.options.endDate = endDate;
                    $this._trigger("sliderDate", '',{
                        'values': $this._getValue()
                    });
                }
            });

            for (var i = 0; i < diffYear + 1; i++) {
                var startMonNo = 0;
                var endMonNo = 12;
                if (i === 0) {
                    startMonNo = this.options.min.getMonth();
                    if (diffYear === 0) {
                        endMonNo = this.options.max.getMonth() + 1;
                    } else {
                        endMonNo = 12;
                    }
                } else {
                    startMonNo = 0;
                    if (i === diffYear) {
                        endMonNo = this.options.max.getMonth() + 1;
                    } else {
                        endMonNo = 12;
                    }
                }
                // // add year marker
                var yearEle = $("<div><span>" + (minYear + i) + "</span></div>")
                    .appendTo(this.element.find("#ui-slidertime-day"));
                if (this.options.orientation === 'vertical') {
                    yearEle.addClass('ui-slidertime-mark-year-vertical ui-corner-all');
                    yearEle.find('span').addClass('ui-slidertime-y-marker-vertical');
                    yearEle.css({
                        top: accDays / differDays >= 1 ? '0%' : 100 - accDays / differDays * 100 + '%'
                    });
                    yearEle.find('span').addClass('ui-slidertime-y-marker');
                } else {
                    yearEle.addClass('ui-slidertime-mark-year ui-corner-all');
                    yearEle.find('span').addClass('ui-slidertime-y-marker');
                    yearEle.css({
                        left: accDays / differDays > 1 ? '100%' : accDays / differDays * 100 + '%'
                    });
                }

                var sum = 0;
                for (var j = startMonNo; j < endMonNo; j++) {
                    if (j != startMonNo) {
                        var last = $("<div><span class='ui-slidertime-m-marker'>" + months[j] + "</span></div>")
                            .appendTo(this.element.find("#ui-slidertime-day"));
                        if (this.options.orientation === 'vertical') {
                            last.addClass('ui-slidertime-mark-month-vertical ui-corner-all');
                            last.css({
                                top: 1 - (sum + accDays) / differDays > 1 ? '100%' : 100 - (sum + accDays) / differDays * 100 + '%'
                            });
                            last.find('span').addClass('ui-slidertime-m-marker-vertical');
                        } else {
                            last.addClass('ui-slidertime-mark-month ui-corner-all');
                            last.css({
                                left: (sum + accDays) / differDays > 1 ? '100%' : (sum + accDays) / differDays * 100 + '%'
                            });
                            last.find('span').addClass('ui-slidertime-m-marker');
                        }
                    }
                    if (j === 1 && this._isLeapYear(minYear + i)) {
                        sum += 29; // is leap year
                    } else {
                        sum += days[j];
                    }
                }
                accDays += sum;
            }
        },
        _drawStartHourSlider: function() {
            var $this = this;
            var startEle = $("<div id='ui-slidertime-starthour'></div>");
            startEle.appendTo(this.element);
            if (this.options.orientation === 'vertical') {
                startEle.addClass('ui-slidertime-starthour-vertical');
            } else {
                startEle.addClass('ui-slidertime-starthour');
            }

            $("#ui-slidertime-starthour").slider({
                range: this.options.orientation == "vertical" ? 'min' : '',
                min: 0,
                max: 1440,
                step: 1,
                orientation: $this.options.orientation,
                value: $this.options.startDate.getHours() * 60,
                slide: function(e, ui) {
                    var hoursMins = $this._pos2Hour(ui.value);
                    var startDate = $this.options.startDate;
                    startDate.setHours(hoursMins.hours);
                    startDate.setMinutes(hoursMins.minutes);
                    $this.options.startDate = startDate;
                    $this._trigger("sliderStartHour", '',{
                        'values': $this._getValue()
                    });
                }
            });
            for (var i = 0; i <= 24;) {
                var displayHour = i === 0 ? 'AM' : i === 12 ? 'PM' : i === 24 ? '23:59' : i + ':00';
                if (this.options.orientation !== 'vertical') {
                    var last = $("<div><span>" + displayHour + "</span></div>")
                        .appendTo(this.element.find("#ui-slidertime-starthour"));
                    last.addClass('ui-slidertime-mark-hour ui-corner-all');
                    last.css({
                        left: i / 24 > 1 ? '100%' : i / 24 * 100 + '%'
                    });
                    last.find('span').addClass('ui-slidertime-h-marker');
                }
                i += 3;
            }
        },
        _drawEndHourSlider: function() {
            var $this = this;
            var endEle = $("<div id='ui-slidertime-endhour'></div>");
            endEle.appendTo(this.element);
            if (this.options.orientation === 'vertical') {
                endEle.addClass('ui-slidertime-endhour-vertical');
            } else {
                endEle.addClass('ui-slidertime-endhour');
            }

            $("#ui-slidertime-endhour").slider({
                range: this.options.orientation == "vertical" ? 'min' : '',
                min: 0,
                max: 1440,
                step: 1,
                orientation: $this.options.orientation,
                value: $this.options.endDate.getHours() * 60,
                slide: function(e, ui) {
                    var hoursMins = $this._pos2Hour(ui.value);
                    var endDate = $this.options.endDate;
                    endDate.setHours(hoursMins.hours);
                    endDate.setMinutes(hoursMins.minutes);
                    $this.options.endDate = endDate;
                    $this._trigger("sliderEndHour", null,{
                        'values': $this._getValue()
                    });
                }
            });
            for (var i = 0; i <= 24;) {
                var displayHour = i === 0 ? 'AM' : i === 12 ? 'PM' : i === 24 ? '23:59' : i + ':00';
                var last = $("<div><span>" + displayHour + "</span></div>")
                    .appendTo(this.element.find("#ui-slidertime-endhour"));
                if (this.options.orientation === 'vertical') {
                    last.addClass('ui-slidertime-mark-hour-vertical ui-corner-all');
                    last.css({
                        top: 1 - i / 24 > 1 ? '0%' : 100 - i / 24 * 100 + '%'
                    });
                    last.find('span').addClass('ui-slidertime-h-marker-vertical');
                } else {
                    last.addClass('ui-slidertime-mark-hour ui-corner-all');
                    last.css({
                        left: i / 24 > 1 ? '100%' : i / 24 * 100 + '%'
                    })
                    last.find('span').addClass('ui-slidertime-h-marker');
                }
                i += 3;
            }
        },
        _isLeapYear: function(y) {
            return ((y % 4 == 0) && (y % 100 != 0)) || (y % 400 == 0) ? true : false;
        },
        //将滑动步数转换为日期（天）
        _pos2date: function(daysFromMin) {
            var min = new Date(this.options.min);
            min.setDate(min.getDate() + daysFromMin);
            return min;
        },
        //将滑动步数转换为时、分
        _pos2Hour: function(hoursFromMin) {
            var hours = Math.floor(hoursFromMin / 60);
            var minutes = hoursFromMin - (hours * 60);
            if (hours == 24) {
                hours = 23;
                minutes = "59";
            } else {
                hours = hours;
                minutes = minutes;
            }
            return {
                hours: hours,
                minutes: minutes
            };
        },
        _getStartDate: function() {
            return fish.dateutil.format(this.options.startDate,this.options.format);
        },
        _getEndDate: function() {
            return fish.dateutil.format(this.options.endDate,this.options.format);
        },
        _getValue: function() {
            return [this._getStartDate(), this._getEndDate()];
        },
        /**
         * 获取选择的开始时间
         * @method getStartDate
         * @chainable
         * @return {Object} jQuery Object
         */
        getStartDate: function() {
            return this._getStartDate();
        },
        /**
         * 获取选择的结束时间
         * @method getEndDate
         * @chainable
         * @return {Object} jQuery Object
         */
        getEndDate: function() {
            return this._getEndDate();
        },
        /**
         * 获取选择的开始和结束时间
         * @method getValue
         * @chainable
         * @return {Object} jQuery Object
         */
        getValue: function() {
            return this._getValue();
        }
    });
}();
