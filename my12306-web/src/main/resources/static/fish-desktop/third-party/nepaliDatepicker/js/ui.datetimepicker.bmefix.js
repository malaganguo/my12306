(function ($) {
    function matchDateFormat(dateformat) {
        dateformat = dateformat.replace(":mm", ":ii");
        dateformat = dateformat.replace("mm:", "ii:");
        dateformat = dateformat.replace("m:", "i:");
        if (-1 != dateformat.indexOf("MMMMM")) {
            dateformat = dateformat.replace("MMMMM", "MM")
        } else {
            if (-1 != dateformat.indexOf("MMM")) {
                dateformat = dateformat.replace("MMM", "M")
            } else {
                dateformat = dateformat.replace("MM", "mm");
                dateformat = dateformat.replace("M", "m")
            }
        }
        if (-1 != dateformat.indexOf("yyyy")) {
            dateformat = dateformat.replace("yyyy", "yy")
        } else { }
        return dateformat
    }
    function NepaliDatepicker() {
        this.debug = false;
        this._nextId = 0;
        this._inst = [];
        this._curInst = null;
        this._disabledInputs = [];
        this._nepaliDatepickerShowing = false;
        this._inDialog = false;
        this.regional = [];
        this.regional[""] = {
            clearText: "Clear",
            clearStatus: "Erase the current date",
            closeText: "Close",
            closeStatus: "Close without change",
            prevText: "&#x3c;Prev Month",
            prevYearText: "&#x3c;Prev Year",
            okLabel: "OK",
            cancelLabel: "Cancel",
            prevStatus: "Show the previous month",
            nextText: "Next Month&#x3e;",
            nextYearText: "Next Year&#x3e;",
            nextStatus: "Show the next month",
            currentText: "Today",
            currentStatus: "Show the current month",
            monthNames: ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"],
            monthNamesShort: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"],
            defaultMonthNames: ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"],
            defaultMonthNamesShort: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"],
            monthStatus: "Show a different month",
            yearStatus: "Show a different year",
            weekHeader: "Wk",
            weekStatus: "Week of the year",
            dayNames: ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"],
            dayNamesShort: ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"],
            dayNamesMin: ["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"],
            dayStatus: "Set DD as first week day",
            dateStatus: "Select DD, M d",
            dateFormat: "mm/dd/yy",
            dateFormatHeader: "mm/yy",
            displaytime: false,
            locale: 'ne',
            firstDay: 0,
            initStatus: "Select a date",
            isRTL: false,
            pickertitle: "local",
            enableDsl: true,
            dslChecked: true
        };
        this._defaults = {
            showOn: "focus",
            showAnim: "show",
            defaultDate: null,
            appendText: "",
            buttonText: "...",
            buttonImage: "../../dist/fish-desktop/third-party/nepaliDatepicker/image/icon_calendar.gif",
            buttonImageOnly: true,
            // buttonImage: "",
            // buttonImageOnly: false,
            closeAtTop: false,
            closeHide: true,
            mandatory: false,
            hideIfNoPrevNext: false,
            changeMonth: true,
            changeYear: true,
            yearRange: "-10:+10",
            changeFirstDay: false,
            showOtherMonths: true,
            showWeeks: false,
            calculateWeek: this.iso8601Week,
            shortYearCutoff: "+10",
            showStatus: false,
            statusForDate: this.dateStatus,
            minDate: null,
            maxDate: null,
            speed: "normal",
            beforeShowDay: null,
            beforeShow: null,
            onSelect: null,
            onClose: null,
            numberOfMonths: 1,
            stepMonths: 1,
            rangeSelect: false,
            rangeSeparator: " - "
        };
        $.extend(this._defaults, this.regional[""]);
        this._nepaliDatepickerDiv = $('<div id="nepaliDatepicker_div"></div>')
    }
    $.extend(NepaliDatepicker.prototype, {
        markerClassName: "hasDatepicker",
        log: function () {
            if (this.debug) {
                console.log.apply("", arguments)
            }
        },
        _register: function (inst) {
            var id = this._nextId++;
            this._inst[id] = inst;
            return id
        },
        _getInst: function (id) {
            return this._inst[id] || id
        },
        setDefaults: function (settings) {
            var temp = settings.dateFormat;
            if (temp) {
                settings.dateFormat = matchDateFormat(temp)
            }
            temp = settings.localDateFormat;
            if (temp) {
                settings.localDateFormat = matchDateFormat(temp)
            }
            extendRemove(this._defaults, settings || {});
            return this
        },
        _attachDatepicker: function (target, settings) {
            settings = settings || {};
            var inlineSettings = null;
            for (attrName in this._defaults) {
                var attrValue = target.getAttribute("date:" + attrName);
                if (attrValue) {
                    inlineSettings = inlineSettings || {};
                    try {
                        inlineSettings[attrName] = eval(attrValue)
                    } catch (err) {
                        inlineSettings[attrName] = attrValue
                    }
                }
            }
            var nodeName = target.nodeName.toLowerCase();
            var instSettings = inlineSettings ? $.extend(settings, inlineSettings) : settings;
            if (nodeName == "input") {
                var inst = (inst && !inlineSettings ? inst : new NepaliDatepickerInstance(instSettings, false));
                this._connectDatepicker(target, inst);
                $(target).bind("paste", function () {
                    return false
                });
                var provide_chars = " 0123456789";
                if (inst._settings.dateFormat) {
                    provide_chars += inst._settings.dateFormat
                }
                if (inst._settings.timeFormat) {
                    provide_chars += inst._settings.timeFormat
                }
                var re = /[mydhis]/gim;
                provide_chars = provide_chars.replace(re, "");
                provide_chars = provide_chars.replace(/\-/gim, "\\-");
                provide_chars = provide_chars.replace(/\//gim, "\\/");
                provide_chars = provide_chars.replace(/\./gim, "\\.")
            } else {
                if (nodeName == "div" || nodeName == "span") {
                    var inst = new NepaliDatepickerInstance(instSettings, true);
                    this._inlineDatepicker(target, inst)
                }
            }
        },
        _destroyDatepicker: function (target) {
            var nodeName = target.nodeName.toLowerCase();
            var calId = target._calId;
            target._calId = null;
            var $target = $(target);
            if (nodeName == "input") {
                $target.siblings(".nepaliDatepicker_append").replaceWith("").end().siblings(".nepaliDatepicker_trigger").replaceWith("").end().removeClass(this.markerClassName).unbind("focus", this._showDatepicker).unbind("keydown", this._doKeyDown).unbind("keypress", this._doKeyPress);
                var wrapper = $target.parents(".nepaliDatepicker_wrap");
                if (wrapper) {
                    wrapper.replaceWith(wrapper.html())
                }
            } else {
                if (nodeName == "div" || nodeName == "span") {
                    $target.removeClass(this.markerClassName).empty()
                }
            }
            if ($("input[_calId=" + calId + "]").length == 0) {
                this._inst[calId] = null
            }
        },
        _enableDatepicker: function (target) {
            target.disabled = false;
            $(target).siblings("button.nepaliDatepicker_trigger").each(function () {
                this.disabled = false
            }).end().siblings("img.nepaliDatepicker_trigger").css({
                opacity: "1.0",
                cursor: ""
            });
            this._disabledInputs = $.map(this._disabledInputs, function (value) {
                return (value == target ? null : value)
            })
        },
        _disableDatepicker: function (target) {
            target.disabled = true;
            $(target).siblings("button.nepaliDatepicker_trigger").each(function () {
                this.disabled = true
            }).end().siblings("img.nepaliDatepicker_trigger").css({
                opacity: "0.5",
                cursor: "default"
            });
            this._disabledInputs = $.map($.nepaliDatepicker._disabledInputs, function (value) {
                return (value == target ? null : value)
            });
            this._disabledInputs[$.nepaliDatepicker._disabledInputs.length] = target
        },
        _isDisabledDatepicker: function (target) {
            if (!target) {
                return false
            }
            for (var i = 0; i < this._disabledInputs.length; i++) {
                if (this._disabledInputs[i] == target) {
                    return true
                }
            }
            return false
        },
        _changeDatepicker: function (target, name, value) {
            var settings = name || {};
            if (typeof name == "string") {
                settings = {};
                settings[name] = value
            }
            if (inst = this._getInst(target._calId)) {
                extendRemove(inst._settings, settings);
                this._updateDatepicker(inst)
            }
        },
        _setDateDatepicker: function (target, date, endDate) {
            if (inst = this._getInst(target._calId)) {
                inst._setDate(date, endDate);
                this._updateDatepicker(inst)
            }
        },
        _getDateDatepicker: function (target) {
            var inst = this._getInst(target._calId);
            return (inst ? inst._getDate() : null)
        },
        _doKeyDown: function (e) {
            var inst = $.nepaliDatepicker._getInst(this._calId);
            if ($.nepaliDatepicker._nepaliDatepickerShowing) {
                switch (e.keyCode) {
                    case 9:
                        $.nepaliDatepicker._hideDatepicker(null, "");
                        break;
                    case 13:
                        $.nepaliDatepicker._selectDay(inst, inst._selectedMonth, inst._selectedYear, inst._selectedHour, inst._selectedMinute, inst._selectedSecond, $("td.nepaliDatepicker_daysCellOver", inst._nepaliDatepickerDiv)[0]);
                        return false;
                        break;
                    case 27:
                        $.nepaliDatepicker._hideDatepicker(null, inst._get("speed"));
                        break;
                    case 33:
                        $.nepaliDatepicker._adjustDate(inst, (e.ctrlKey ? -1 : -inst._get("stepMonths")), (e.ctrlKey ? "Y" : "M"));
                        break;
                    case 34:
                        $.nepaliDatepicker._adjustDate(inst, (e.ctrlKey ? +1 : +inst._get("stepMonths")), (e.ctrlKey ? "Y" : "M"));
                        break;
                    case 35:
                        if (e.ctrlKey) {
                            $.nepaliDatepicker._clearDate(inst)
                        }
                        break;
                    case 36:
                        if (e.ctrlKey) {
                            $.nepaliDatepicker._gotoToday(inst)
                        }
                        break;
                    case 37:
                        if (e.ctrlKey) {
                            $.nepaliDatepicker._adjustDate(inst, -1, "D")
                        }
                        break;
                    case 38:
                        if (e.ctrlKey) {
                            $.nepaliDatepicker._adjustDate(inst, -7, "D")
                        }
                        break;
                    case 39:
                        if (e.ctrlKey) {
                            $.nepaliDatepicker._adjustDate(inst, +1, "D")
                        }
                        break;
                    case 40:
                        if (e.ctrlKey) {
                            $.nepaliDatepicker._adjustDate(inst, +7, "D")
                        }
                        break
                }
            } else {
                if (e.keyCode == 36 && e.ctrlKey) {
                    $.nepaliDatepicker._showDatepicker(this)
                }
            }
        },
        _doKeyPress: function (e) {
            var inst = $.nepaliDatepicker._getInst(this._calId);
            var chars = $.nepaliDatepicker._possibleChars(inst._get("dateFormat"));
            var chr = String.fromCharCode(e.charCode == undefined ? e.keyCode : e.charCode);
            return e.ctrlKey || (chr < " " || !chars || chars.indexOf(chr) > -1)
        },
        _connectDatepicker: function (target, inst) {
            var input = $(target);
            if (input.is("." + this.markerClassName)) {
                return
            }
            input.attr('readonly',true);
            var appendText = inst._get("appendText");
            var isRTL = inst._get("isRTL");
            if (appendText) {
                if (isRTL) {
                    input.before('<span class="nepaliDatepicker_append">' + appendText)
                } else {
                    input.after('<span class="nepaliDatepicker_append">' + appendText)
                }
            }
            var showOn = inst._get("showOn");
            if (showOn == "focus" || showOn == "both") {
                input.focus(this._showDatepicker)
            }
            if (showOn == "button" || showOn == "both") {
                if (input.disabled) {
                    return
                }
                var buttonText = inst._get("buttonText");
                var dv = input.closest(".bc_border");
                var trigger = dv.next();
                trigger.attr({
                    title: buttonText
                });
                var buttonImage = inst._get("buttonImage");
                var trigger = $(inst._get("buttonImageOnly") ? ($(inst._get("useInFish") ? $('<span class="input-group-addon clear-input-icon-right">').append($("<img>").addClass("nepaliDatepicker_trigger").attr({
                    src: buttonImage,
                    alt: buttonText,
                    title: buttonText
                })) : $("<img>").addClass("nepaliDatepicker_trigger").attr({
                    src: buttonImage,
                    alt: buttonText,
                    title: buttonText
                }))) : $("<button>").addClass("nepaliDatepicker_trigger").attr({
                    type: "button"
                }).html(buttonImage != "" ? $("<img>").attr({
                    src: buttonImage,
                    alt: buttonText,
                    title: buttonText
                }) : buttonText));
                if (isRTL) {
                    input.before(trigger)
                } else {
                    input.after(trigger)
                }
                trigger.click(function () {
                    if ($.nepaliDatepicker._nepaliDatepickerShowing && $.nepaliDatepicker._lastInput == target) {
                        $.nepaliDatepicker._hideDatepicker()
                    } else {
                        $.nepaliDatepicker._showDatepicker(target)
                    }
                })
            }
            input.addClass(this.markerClassName).keydown(this._doKeyDown).keypress(this._doKeyPress).bind("setData.nepaliDatepicker", function (event, key, value) {
                inst._settings[key] = value
            }).bind("getData.nepaliDatepicker", function (event, key) {
                return inst._get(key)
            });
            input[0]._calId = inst._id
        },
        _inlineDatepicker: function (target, inst) {
            var input = $(target);
            if (input.is("." + this.markerClassName)) {
                return
            }
            input.addClass(this.markerClassName).append(inst._nepaliDatepickerDiv).bind("setData.nepaliDatepicker", function (event, key, value) {
                inst._settings[key] = value
            }).bind("getData.nepaliDatepicker", function (event, key) {
                return inst._get(key)
            });
            input[0]._calId = inst._id;
            this._updateDatepicker(inst)
        },
        _inlineShow: function (inst) {
            var numMonths = inst._getNumberOfMonths();
            inst._nepaliDatepickerDiv.width(numMonths[1] * $(".nepaliDatepicker", inst._nepaliDatepickerDiv[0]).width())
        },
        _dialogDatepicker: function (input, dateText, onSelect, settings, pos) {
            var inst = this._dialogInst;
            if (!inst) {
                inst = this._dialogInst = new NepaliDatepickerInstance({}, false);
                this._dialogInput = $('<input type="text" size="1" style="position: absolute; top: -100px;"/>');
                this._dialogInput.keydown(this._doKeyDown);
                $("body").append(this._dialogInput);
                this._dialogInput[0]._calId = inst._id
            }
            extendRemove(inst._settings, settings || {});
            this._dialogInput.val(dateText);
            this._pos = (pos ? (pos.length ? pos : [pos.pageX, pos.pageY]) : null);
            if (!this._pos) {
                var browserWidth = window.innerWidth || document.documentElement.clientWidth || document.body.clientWidth;
                var browserHeight = window.innerHeight || document.documentElement.clientHeight || document.body.clientHeight;
                var scrollX = document.documentElement.scrollLeft || document.body.scrollLeft;
                var scrollY = document.documentElement.scrollTop || document.body.scrollTop;
                this._pos = [(browserWidth / 2) - 100 + scrollX, (browserHeight / 2) - 150 + scrollY]
            }
            this._dialogInput.css("left", this._pos[0] + "px").css("top", this._pos[1] + "px");
            inst._settings.onSelect = onSelect;
            this._inDialog = true;
            this._nepaliDatepickerDiv.addClass("nepaliDatepicker_dialog");
            this._showDatepicker(this._dialogInput[0]);
            if ($.blockUI) {
                $.blockUI(this._nepaliDatepickerDiv)
            }
            return this
        },
        _showDatepicker: function (input) {
            if (input.disabled) {
                return
            }
            $(input).keydown(this._doKeyDown);
            input = input.target || input;
            if (input.nodeName.toLowerCase() != "input") {
                input = $("input", input.parentNode)[0]
            }
            if ($.nepaliDatepicker._isDisabledDatepicker(input) || $.nepaliDatepicker._lastInput == input) {
                return
            }
            var inst = $.nepaliDatepicker._getInst(input._calId);
            var beforeShow = inst._get("beforeShow");
            extendRemove(inst._settings, (beforeShow ? beforeShow.apply(input, [input, inst]) : {}));
            $.nepaliDatepicker._hideDatepicker(null, "");
            $.nepaliDatepicker._lastInput = input;
            inst._setDateFromField(input);
            if ($.nepaliDatepicker._inDialog) {
                input.value = ""
            }
            inst._rangeStart = null;
            $.nepaliDatepicker._updateDatepicker(inst);
            if (!inst._inline) {
                var speed = inst._get("speed");
                inst.poper.show($(input));
                $.nepaliDatepicker._afterShow(inst);
                $.nepaliDatepicker._nepaliDatepickerShowing = true;
                if (speed == "") {
                    postProcess()
                }
                $.nepaliDatepicker._curInst = inst
            }
        },
        _updateDatepicker: function (inst) {
            jBME.titleTipsPoper.hide();
            inst._nepaliDatepickerDiv.empty().append(inst._generateDatepicker());
            $("table.nepaliDatepicker").tips();
            var df = inst._get("dateFormat");
            var tf = df.split(" ")[1];
            if (!tf || tf == "" || tf == "undefined") {
                tf = "HH:mm:ss"
            }
            if (inst._get("displaytime")) {
                $("div.nepaliDatepicker_timepicker").find("input:eq(0)").timePicker({
                    onchange: function (val) {
                        $.nepaliDatepicker._selectTimeFull(inst, val)
                    },
                    containerStyle: "absolute",
                    timeFormat: tf
                })
            }
            var numMonths = inst._getNumberOfMonths();
            if (numMonths[0] != 1 || numMonths[1] != 1) {
                inst._nepaliDatepickerDiv.addClass("nepaliDatepicker_multi")
            } else {
                inst._nepaliDatepickerDiv.removeClass("nepaliDatepicker_multi")
            }
            if (inst._get("isRTL")) {
                inst._nepaliDatepickerDiv.addClass("nepaliDatepicker_rtl")
            } else {
                inst._nepaliDatepickerDiv.removeClass("nepaliDatepicker_rtl")
            }
            var input = $(".nepaliDatepicker_dsl input", inst._nepaliDatepickerDiv);
            var i = this
        },
        _afterShow: function (inst) {
            var numMonths = inst._getNumberOfMonths();
            inst._nepaliDatepickerDiv.width(numMonths[1] * $(".nepaliDatepicker", inst._nepaliDatepickerDiv[0])[0].offsetWidth)
        },
        setDsl: function (b) {
            var input = $(".nepaliDatepicker_dsl input", inst._nepaliDatepickerDiv);
            input.attr("checked", true)
        },
        _findPos: function (obj) {
            while (obj && (obj.type == "hidden" || obj.nodeType != 1)) {
                obj = obj.nextSibling
            }
            var position = $(obj).offset();
            return [position.left, position.top]
        },
        _hideDatepicker: function (input, speed) {
            var inst = this._curInst;
            if (!inst) {
                return
            }
            var rangeSelect = inst._get("rangeSelect");
            if (rangeSelect && this._stayOpen) {
                this._selectDate(inst, inst._formatDateTime(inst._currentDay, inst._currentMonth, inst._currentYear, inst._currentHour, inst.currentMinute, inst.currentSecond))
            }
            this._stayOpen = false;
            if (this._nepaliDatepickerShowing) {
                inst.poper.hide();
                speed = (speed != null ? speed : inst._get("speed"));
                var showAnim = inst._get("showAnim");
                inst._nepaliDatepickerDiv[(showAnim == "slideDown" ? "slideUp" : (showAnim == "fadeIn" ? "fadeOut" : "hide"))](speed, function () {
                    $.nepaliDatepicker._tidyDialog(inst)
                });
                if (speed == "") {
                    this._tidyDialog(inst)
                }
                var onClose = inst._get("onClose");
                if (onClose) {
                    onClose.apply((inst._input ? inst._input[0] : null), [inst._getDate(), inst])
                }
                this._nepaliDatepickerShowing = false;
                this._lastInput = null;
                inst._settings.prompt = null;
                if (this._inDialog) {
                    this._dialogInput.css({
                        position: "absolute",
                        left: "0",
                        top: "-100px"
                    });
                    if ($.blockUI) {
                        $.unblockUI();
                        $("body").append(this._nepaliDatepickerDiv)
                    }
                }
                this._inDialog = false
            }
            this._curInst = null
        },
        _tidyDialog: function (inst) {
            inst._nepaliDatepickerDiv.removeClass("nepaliDatepicker_dialog").unbind(".nepaliDatepicker");
            $(".nepaliDatepicker_prompt", inst._nepaliDatepickerDiv).remove()
        },
        _checkExternalClick: function (event) {
            if (!$.nepaliDatepicker._curInst) {
                return
            }
            var $target = $(event.target);
            if (($target.parents("#nepaliDatepicker_div").length == 0) && ($target.attr("class") != "nepaliDatepicker_trigger") && $.nepaliDatepicker._nepaliDatepickerShowing && !($.nepaliDatepicker._inDialog && $.blockUI)) {
                $.nepaliDatepicker._hideDatepicker(null, "")
            }
        },
        _adjustDate: function (id, offset, period) {
            var inst = this._getInst(id);
            inst._adjustDate(offset, period);
            this._updateDatepicker(inst)
        },
        _gotoToday: function (id) {
            var date = new Date();
            var inst = this._getInst(id);
            inst._selectedDay = date.getDate();
            inst._drawMonth = inst._selectedMonth = date.getMonth();
            inst._drawYear = inst._selectedYear = date.getFullYear();
            inst._drawHour = inst._selectedHour = date.getHours();
            inst._drawMinute = inst._selectedMinute = date.getMinutes();
            inst._drawSecond = inst._selectedSecond = date.getSeconds();
            this._adjustDate(inst)
        },
        _selectMonthYear: function (id, select, period) {
            var selectclass = $(select).attr("class");
            var inst = this._getInst(id);
            inst._selectingMonthYear = false;
            var calendric = parseInt(inst._get("calendric"));
            if (inst._get('locale') == 'ne') {
                var lDate = gregorianToLocal(calendric, inst._drawYear, (inst._drawMonth + 1), inst._selectedDay);
                var gdate;
                // inst[period == "M" ? "_drawMonth" : "_drawYear"] = ;
                if (period == "M") {
                    gdate = localToGregorian(calendric, lDate.year, select.options[select.selectedIndex].value - 0 + 1, lDate.day);
                } else {
                    gdate = localToGregorian(calendric, select.options[select.selectedIndex].value - 0, lDate.month, lDate.day);
                }
                inst._selectedDay = gdate.day;
                inst._drawMonth = inst._selectedMonth = gdate.month - 1;
                inst._drawYear = inst._selectedYear = gdate.year;
            }
            else
                inst[period == "M" ? "_drawMonth" : "_drawYear"] = select.options[select.selectedIndex].value - 0;
            this._adjustDate(inst);
            $("." + selectclass).focus()
        },
        _selectTime: function (id, select, period) {
            var inst = this._getInst(id);
            inst._selectingMonthYear = false;
            var periodStr;
            if (period == "S") {
                periodStr = "_drawSecond"
            } else {
                if (period == "M") {
                    periodStr = "_drawMinute"
                } else {
                    periodStr = "_drawHour"
                }
            }
            inst[periodStr] = select.options[select.selectedIndex].value - 0;
            this._adjustDate(inst);
            this._doNotHide = true;
            $("td.nepaliDatepicker_currentDay").each(function () {
                $.nepaliDatepicker._selectDay(inst, inst._selectedMonth, inst._selectedYear, inst._selectedHour, inst._selectedMinute, inst._selectedSecond, $(this))
            });
            this._doNotHide = false
        },
        _selectTimeFull: function (inst, timeStr) {
            var timeArr = timeStr.split(":");
            inst._drawHour = inst._selectedHour = timeArr[0] - 0;
            inst._drawMinute = inst._selectedMinute = timeArr[1] - 0;
            inst._drawSecond = inst._selectedSecond = timeArr[2] - 0
        },
        _clickMonthYear: function (id) {
            var inst = this._getInst(id);
            inst._selectingMonthYear = !inst._selectingMonthYear
        },
        _clickTime: function (id) {
            var inst = this._getInst(id);
            if (inst._input && inst._selectingTime && !fish.browser.msie) {
                inst._input[0].focus()
            }
            inst._selectingTime = !inst._selectingTime
        },
        _changeFirstDay: function (id, day) {
            var inst = this._getInst(id);
            inst._settings.firstDay = day;
            this._updateDatepicker(inst)
        },
        _selectDay: function (id, month, year, hour, minute, second, td) {
            if ($(td).is(".nepaliDatepicker_unselectable")) {
                return
            }
            var inst = this._getInst(id);
            var rangeSelect = inst._get("rangeSelect");
            if (rangeSelect) {
                if (!this._stayOpen) {
                    $(".nepaliDatepicker td").removeClass("nepaliDatepicker_currentDay");
                    $(td).addClass("nepaliDatepicker_currentDay")
                }
                this._stayOpen = !this._stayOpen
            }
            inst._selectedDay = inst._currentDay = $("a", td).attr("value");
            inst._selectedMonth = inst._currentMonth = month;
            inst._selectedYear = inst._currentYear = year;
            var selectedDay = inst._currentDay;
            var selectedMonth = inst._currentMonth;
            var selectedYear = inst._currentYear;
            var lDate;
            if (inst._selectedYear > 1893 && inst._selectedYear < 2044 && inst._get("calendric")) {
                var calendric = parseInt(inst._get("calendric"));
                var lDate = gregorianToLocal(calendric, year, (month + 1), inst._currentDay)
            }
            if (inst._get("displaytime")) {
                inst._selectedHour = inst._currentHour = hour;
                inst._selectedMinute = inst._currentMinute = minute;
                inst._selectedSecond = inst._currentSecond = second;
                this._updateDatepicker(inst);
                if (inst._selectedYear > inst._drawYear) {
                    $.nepaliDatepicker._adjustDate(id, 1, "M")
                } else {
                    if (inst._selectedYear < inst._drawYear) {
                        $.nepaliDatepicker._adjustDate(id, -1, "M")
                    } else {
                        if (inst._selectedMonth > inst._drawMonth) {
                            $.nepaliDatepicker._adjustDate(id, 1, "M")
                        } else {
                            if (inst._selectedMonth < inst._drawMonth) {
                                $.nepaliDatepicker._adjustDate(id, -1, "M")
                            }
                        }
                    }
                }
                if ($(td).is(":not('.nepaliDatepicker_today')") && $(td).is(":not('.nepaliDatepicker_currentDay')")) {
                    return
                }
            } else {
                inst._selectedHour = inst._currentHour = 0;
                inst._selectedMinute = inst._currentMinute = 0;
                inst._selectedSecond = inst._currentSecond = 0
            }
            if (inst._get('locale') !== 'ne')
                this._selectDate(id, inst._formatDateTime(selectedDay, selectedMonth, selectedYear, inst._currentHour, inst._currentMinute, inst._currentSecond));
            else {
                localDay = lDate.day;
                localMonth = lDate.month;
                localYear = lDate.year
                var titleStr = $.nepaliDatepicker.formatDate(inst._get("dateFormat").split(" ")[0], new Date(localYear, localMonth - 1, localDay), inst._getFormatConfig(), true);
                this._selectDate(id, titleStr);
            }

            if (this._stayOpen) {
                inst._endDay = inst._endMonth = inst._endYear = null;
                inst._rangeStart = new Date(inst._currentYear, inst._currentMonth, inst._currentDay);
                this._updateDatepicker(inst)
            } else {
                if (rangeSelect) {
                    inst._endDay = inst._currentDay;
                    inst._endMonth = inst._currentMonth;
                    inst._endYear = inst._currentYear;
                    inst._selectedDay = inst._currentDay = inst._rangeStart.getDate();
                    inst._selectedMonth = inst._currentMonth = inst._rangeStart.getMonth();
                    inst._selectedYear = inst._currentYear = inst._rangeStart.getFullYear();
                    inst._rangeStart = null;
                    if (inst._inline) {
                        this._updateDatepicker(inst)
                    }
                }
            }
        },
        _clearDate: function (id) {
            var inst = this._getInst(id);
            if (inst._get("mandatory")) {
                return
            }
            this._stayOpen = false;
            inst._endDay = inst._endMonth = inst._endYear = inst._rangeStart = null;
            this._selectDate(inst, "")
        },
        _selectDate: function (id, dateStr) {
            var inst = this._getInst(id);
            dateStr = (dateStr != null ? dateStr : inst._formatDateTime());
            if (inst._rangeStart) {
                dateStr = inst._formatDateTime(inst._rangeStart) + inst._get("rangeSeparator") + dateStr
            }
            if (inst._input) {
                inst._input.val(dateStr)
            }
            var onSelect = inst._get("onSelect");
            if (onSelect) {
                onSelect.apply((inst._input ? inst._input[0] : null), [dateStr, inst])
            } else {
                if (inst._input) {
                    inst._input.trigger("change")
                }
            }
            if (inst._inline) {
                this._updateDatepicker(inst)
            } else {
                if (!this._stayOpen) {
                    if (!this._doNotHide) {
                        this._hideDatepicker(null, inst._get("speed"));
                        this._lastInput = inst._input[0];
                        if (typeof (inst._input[0]) != "object") {
                            inst._input[0].focus()
                        }
                        this._lastInput = null
                    }
                }
            }
            jBME.titleTipsPoper.hide()
        },
        _selectDateByButton: function (id, day, year, month) {
            var inst = this._getInst(id);
            this._selectDate(id, inst._formatDateTime(day, year, month, inst._selectedHour, inst._selectedMinute, inst._selectedSecond))
        },
        _selectNow: function (id, day, year, month) {
            var now = new Date();
            var inst = this._getInst(id);
            if (inst._get('locale') !== 'ne')
                this._selectDate(id, inst._formatDateTime(now.getDate(), now.getMonth(), now.getFullYear(), inst._selectedHour, inst._selectedMinute, inst._selectedSecond))
            else if (inst._get('locale') == 'ne' && inst._selectedYear > 1893 && inst._selectedYear < 2044 && inst._get("calendric")) {
                var calendric = parseInt(inst._get("calendric"));
                var lDate = gregorianToLocal(calendric, now.getFullYear(), (now.getMonth() + 1), now.getDate())
                localDay = lDate.day;
                localMonth = lDate.month;
                localYear = lDate.year
                var titleStr = $.nepaliDatepicker.formatDate(inst._get("dateFormat").split(" ")[0], new Date(localYear, localMonth - 1, localDay), inst._getFormatConfig(), true);
                this._selectDate(id, titleStr);
            }
        },
        _toggleLocale: function (id) {
            var inst = this._getInst(id);
            if (inst._settings['locale'] !== undefined) {
                inst._settings['locale'] = inst._settings['locale'] == 'ne' ? 'en' : 'ne';
            }
            else
                $.nepaliDatepicker._defaults['locale'] = $.nepaliDatepicker._defaults['locale'] == 'ne' ? 'en' : 'ne';

            this._updateDatepicker(inst);
        },
        noWeekends: function (date) {
            var day = date.getDay();
            return [(day > 0 && day < 6), ""]
        },
        iso8601Week: function (date) {
            var checkDate = new Date(date.getFullYear(), date.getMonth(), date.getDate(), (date.getTimezoneOffset() / -60));
            var firstMon = new Date(checkDate.getFullYear(), 1 - 1, 4);
            var firstDay = firstMon.getDay() || 7;
            firstMon.setDate(firstMon.getDate() + 1 - firstDay);
            if (firstDay < 4 && checkDate < firstMon) {
                checkDate.setDate(checkDate.getDate() - 3);
                return $.nepaliDatepicker.iso8601Week(checkDate)
            } else {
                if (checkDate > new Date(checkDate.getFullYear(), 12 - 1, 28)) {
                    firstDay = new Date(checkDate.getFullYear() + 1, 1 - 1, 4).getDay() || 7;
                    if (firstDay > 4 && (checkDate.getDay() || 7) < firstDay - 3) {
                        checkDate.setDate(checkDate.getDate() + 3);
                        return $.nepaliDatepicker.iso8601Week(checkDate)
                    }
                }
            }
            return Math.floor(((checkDate - firstMon) / 86400000) / 7) + 1
        },
        dateStatus: function (date, inst) {
            return $.nepaliDatepicker.formatDate(inst._get("dateStatus"), date, inst._getFormatConfig())
        },

        getValue: function (id) {
            $input = $(id)
            var inst = $.nepaliDatepicker._inst[$input[0]._calId];
            if (inst._get('locale') !== 'ne')
                return $input.val();
            else {
                var dateFormat = inst._get("dateFormat");
                var dates = inst._input ? inst._input.val().split(inst._get("rangeSeparator")) : null;
                var defaultDate,datel,dateg,dateStr=inst._input.val();
                var date = defaultDate = inst._getDefaultDate();
                
                if (dates.length > 0) {
                    var settings = inst._getFormatConfig();
                    if (dates.length > 1) {
                        date = $.nepaliDatepicker.parseDate(dateFormat, dates[1], inst.settings, true) || defaultDate;
                    }
                    try {
                        datel = $.nepaliDatepicker.parseDate(dateFormat, dates[0], inst.settings, true) || defaultDate;
                        dateg = localToGregorian(inst._get('calendric'), datel.year, datel.month, datel.day);
                        date = new Date(dateg.year, dateg.month - 1, dateg.day);
                    } catch (e) {
                        $.nepaliDatepicker.log(e);
                        date = defaultDate
                    }
                    dateStr = $.nepaliDatepicker.formatDate(inst._get("dateFormat").split(" ")[0], date, inst._getFormatConfig());
                   
                }
                return dateStr;
            }

        },

        setValue: function (id,date) {
            $input = $(id)
            var inst = $.nepaliDatepicker._inst[$input[0]._calId];
         
            if (inst._get('locale') !== 'ne'){
                var dateStr =$.nepaliDatepicker.formatDate(inst._get("dateFormat").split(" ")[0], date, inst._getFormatConfig());
                $input.val(dateStr);
            }
            else {
                var dateFormat = inst._get("dateFormat");
                var dates = inst._input ? inst._input.val().split(inst._get("rangeSeparator")) : null;
                var defaultDate,datel,dateg,dateStr=inst._input.val();
                var date = defaultDate = inst._getDefaultDate();

                var localDate = gregorianToLocal(inst._get('calendric'), date.getFullYear(), date.getMonth() + 1, date.getDate());
                var dateStr =$.nepaliDatepicker.formatDate(inst._get("dateFormat").split(" ")[0], new Date(localDate.year, localDate.month - 1, localDate.day), inst._getFormatConfig(), true);
                $input.val(dateStr);
            }
        },
        parseDate: function (format, value, settings, isLocal) {
            if (format == null || value == null) {
                throw "Invalid arguments"
            }
            value = (typeof value == "object" ? value.toString() : value + "");
            if (value == "") {
                return null
            }
            var shortYearCutoff = (settings ? settings.shortYearCutoff : null) || this._defaults.shortYearCutoff;
            var dayNamesShort = (settings ? settings.dayNamesShort : null) || this._defaults.dayNamesShort;
            var dayNames = (settings ? settings.dayNames : null) || this._defaults.dayNames;
            var monthNamesShort = (settings ? settings.monthNamesShort : null) || this._defaults.monthNamesShort;
            var monthNames = (settings ? settings.monthNames : null) || this._defaults.monthNames;
            var year = -1;
            var month = -1;
            var day = -1;
            var hour = -1;
            var minute = -1;
            var second = -1;
            var literal = false;
            var lookAhead = function (match) {
                var matches = (iFormat + 1 < format.length && format.charAt(iFormat + 1) == match);
                if (matches) {
                    iFormat++
                }
                return matches
            };
            var getNumber = function (match) {
                lookAhead(match);
                var size = (match == "y" ? 4 : 2);
                var num = 0;
                while (size > 0 && iValue < value.length && value.charAt(iValue) >= "0" && value.charAt(iValue) <= "9") {
                    num = num * 10 + (value.charAt(iValue++) - 0);
                    size--
                }
                if (size == (match == "y" ? 4 : 2)) {
                    throw "Missing number at position " + iValue
                }
                return num
            };
            var getName = function (match, shortNames, longNames) {
                var names = (lookAhead(match) ? longNames : shortNames);
                var size = 0;
                for (var j = 0; j < names.length; j++) {
                    size = Math.max(size, names[j].length)
                }
                var name = "";
                var iInit = iValue;
                while (size > 0 && iValue < value.length) {
                    name += value.charAt(iValue++);
                    for (var i = 0; i < names.length; i++) {
                        if (name == names[i]) {
                            return i + 1
                        }
                    }
                    size--
                }
                throw "Unknown name at position " + iInit
            };
            var checkLiteral = function () {
                if (value.charAt(iValue) != format.charAt(iFormat)) {
                    throw "Unexpected literal at position " + iValue
                }
                iValue++
            };
            if (isLocal) {
                format = format.replace(/m/g, "M")
            }
            var iValue = 0;
            for (var iFormat = 0; iFormat < format.length; iFormat++) {
                if (literal) {
                    if (format.charAt(iFormat) == "'" && !lookAhead("'")) {
                        literal = false
                    } else {
                        checkLiteral()
                    }
                } else {
                    switch (format.charAt(iFormat)) {
                        case "h":
                            hour = getNumber("h");
                            break;
                        case "H":
                            hour = getNumber("H");
                            break;
                        case "i":
                            minute = getNumber("i");
                            break;
                        case "s":
                            second = getNumber("s");
                            break;
                        case "d":
                            day = getNumber("d");
                            break;
                        case "D":
                            getName("D", dayNamesShort, dayNames);
                            break;
                        case "m":
                            month = getNumber("m");
                            break;
                        case "M":
                            month = getName("M", monthNamesShort, monthNames);
                            break;
                        case "y":
                            year = getNumber("y");
                            break;
                        case "'":
                            if (lookAhead("'")) {
                                checkLiteral()
                            } else {
                                literal = true
                            }
                            break;
                        default:
                            checkLiteral()
                    }
                }
            }
            if (year < 100) {
                year += new Date().getFullYear() - new Date().getFullYear() % 100 + (year <= shortYearCutoff ? 0 : -100)
            }
            var date;
            if (second != -1 && hour != -1 && minute != -1) {
                date = new Date(year, month - 1, day, hour, minute, second)
            } else {
                date = new Date(year, month - 1, day)
            }
            if (date.getFullYear() != year || date.getMonth() + 1 != month || date.getDate() != day) {
                throw "Invalid date"
            }
            return !isLocal ? date : { year: year, month: month, day: day }
        },
        parseTime: function (format, value) {
            var thisArray = value.split(":");
            var hour = thisArray[0] == undefined ? "00" : thisArray[0];
            var minute = thisArray[1] == undefined ? "00" : thisArray[1];
            var second = thisArray[2] == undefined ? "00" : thisArray[2];
            return new Date(1970, 1, 1, hour, minute, second)
        },
        formatDate: function (format, date, settings, isLocal, isMonthNum) {
            if (!date) {
                return ""
            }
            var dayNamesShort = (settings ? settings.dayNamesShort : null) || this._defaults.dayNamesShort;
            var dayNames = (settings ? settings.dayNames : null) || this._defaults.dayNames;
            var monthNamesShort = (settings ? settings.monthNamesShort : null) || this._defaults.monthNamesShort;
            var monthNames = (settings ? settings.monthNames : null) || this._defaults.monthNames;
            var lookAhead = function (match) {
                var matches = (iFormat + 1 < format.length && format.charAt(iFormat + 1) == match);
                if (matches) {
                    iFormat++
                }
                return matches
            };
            var formatNumber = function (match, value) {
                return (lookAhead(match) && value < 10 ? "0" : "") + value
            };
            var formatName = function (match, value, shortNames, longNames) {
                return (lookAhead(match) ? longNames[value] : shortNames[value])
            };

            if (isLocal && !isMonthNum) {
                format = format.replace(/m/g, "M")
            }
            var output = "";
            var literal = false;
            if (date) {
                for (var iFormat = 0; iFormat < format.length; iFormat++) {
                    if (literal) {
                        if (format.charAt(iFormat) == "'" && !lookAhead("'")) {
                            literal = false
                        } else {
                            output += format.charAt(iFormat)
                        }
                    } else {
                        switch (format.charAt(iFormat)) {
                            case "h":
                                output += formatNumber("h", date.getHours());
                                break;
                            case "H":
                                output += formatNumber("H", date.getHours());
                                break;
                            case "i":
                                output += formatNumber("i", date.getMinutes());
                                break;
                            case "s":
                                output += formatNumber("s", date.getSeconds());
                                break;
                            case "d":
                                output += formatNumber("d", date.getDate());
                                break;
                            case "D":
                                output += formatName("D", date.getDay(), dayNamesShort, dayNames);
                                break;
                            case "m":
                                month = isLocal && isMonthNum ? date.getMonth() : date.getMonth() + 1
                                output += formatNumber("m", month);
                                break;
                            case "M":
                                output += formatName("M", date.getMonth(), monthNamesShort, monthNames);
                                break;
                            case "y":
                                output += (lookAhead("y") ? date.getFullYear() : (date.getYear() % 100 < 10 ? "0" : "") + date.getYear() % 100);
                                break;
                            case "'":
                                if (lookAhead("'")) {
                                    output += "'"
                                } else {
                                    literal = true
                                }
                                break;
                            default:
                                output += format.charAt(iFormat)
                        }
                    }
                }
            }
            return output
        },
        formatYearMonth: function (format, dateStr) { },
        _possibleChars: function (format) {
            var chars = "";
            var literal = false;
            for (var iFormat = 0; iFormat < format.length; iFormat++) {
                if (literal) {
                    if (format.charAt(iFormat) == "'" && !lookAhead("'")) {
                        literal = false
                    } else {
                        chars += format.charAt(iFormat)
                    }
                } else {
                    switch (format.charAt(iFormat)) {
                        case "d" || "m" || "y":
                            chars += "0123456789";
                            break;
                        case "D" || "M":
                            return null;
                        case "'":
                            if (lookAhead("'")) {
                                chars += "'"
                            } else {
                                literal = true
                            }
                            break;
                        default:
                            chars += format.charAt(iFormat)
                    }
                }
            }
            return chars
        }
    });
    function NepaliDatepickerInstance(settings, inline) {
        if (settings.dateFormat) {
            settings.dateFormat = matchDateFormat(settings.dateFormat)
        }
        if (settings.localFormat) {
            settings.localFormat = matchDateFormat(settings.localFormat)
        }
        this._id = $.nepaliDatepicker._register(this);
        this._selectedDay = 0;
        this._selectedMonth = 0;
        this._selectedYear = 0;
        this._selectedHour = 0;
        this._selectedMinute = 0;
        this._selectedSecond = 0;
        this._drawMonth = 0;
        this._drawYear = 0;
        this._drawHour = 0;
        this._drawMinute = 0;
        this._drawSecond = 0;
        this._input = null;
        this._inline = inline;
        this._nepaliDatepickerDiv = (!inline ? $.nepaliDatepicker._nepaliDatepickerDiv : $('<div id="nepaliDatepicker_div_' + this._id + '" class="nepaliDatepicker_inline">'));
        if (!this._nepaliDatepickerDiv.parent().is("body")) {
            $(document.body).append($.nepaliDatepicker._nepaliDatepickerDiv);
            $(document).mousedown($.nepaliDatepicker._checkExternalClick)
        }
        this.poper = new jBME.Poper($(this._nepaliDatepickerDiv));
        this.poper.mask = true;
        var poper = this.poper;
        this.poper.wrapperFunc = function () {
            var jqWrapper = poper.createShadowWrapper();
            jqWrapper.addClass("bf_shadow_datetime");
            return jqWrapper
        }
            ;
        this._settings = extendRemove(settings || {});
        if (inline) {
            this._setDate(this._getDefaultDate())
        }
        return
    }
    $.extend(NepaliDatepickerInstance.prototype, {
        _get: function (name) {
            return this._settings[name] !== undefined ? this._settings[name] : $.nepaliDatepicker._defaults[name]
        },
        _setDateFromField: function (input) {
            this._input = $(input);

            if (this._get('locale') !== 'ne') {

                var dateFormat;
                dateFormat = this._get("dateFormat");
                var dates = this._input ? this._input.val().split(this._get("rangeSeparator")) : null;
                this._endDay = this._endMonth = this._endYear = null;
                var date = defaultDate = this._getDefaultDate();
                if (dates.length > 0) {
                    var settings = this._getFormatConfig();
                    if (dates.length > 1) {
                        date = $.nepaliDatepicker.parseDate(dateFormat, dates[1], settings) || defaultDate;
                        this._endDay = date.getDate();
                        this._endMonth = date.getMonth();
                        this._endYear = date.getFullYear()
                    }
                    try {
                        date = $.nepaliDatepicker.parseDate(dateFormat, dates[0], settings) || defaultDate
                    } catch (e) {
                        $.nepaliDatepicker.log(e);
                        date = defaultDate
                    }
                }
            }
            else {

                var dateFormat;
                dateFormat = this._get("dateFormat");
                var dates = this._input ? this._input.val().split(this._get("rangeSeparator")) : null;
                this._endDay = this._endMonth = this._endYear = null;
                var date = defaultDate = this._getDefaultDate();
                if (dates.length > 0) {
                    var settings = this._getFormatConfig();
                    if (dates.length > 1) {
                        date = $.nepaliDatepicker.parseDate(dateFormat, dates[1], settings, true) || defaultDate;
                        this._endDay = date.getDate();
                        this._endMonth = date.getMonth();
                        this._endYear = date.getFullYear()
                    }
                    try {
                        datel = $.nepaliDatepicker.parseDate(dateFormat, dates[0], settings, true) || defaultDate;
                        dateg = localToGregorian(this._get('calendric'), datel.year, datel.month, datel.day);
                        date = new Date(dateg.year, dateg.month - 1, dateg.day);
                    } catch (e) {
                        $.nepaliDatepicker.log(e);
                        date = defaultDate
                    }
                }
            }
            this._selectedDay = date.getDate();
            this._drawMonth = this._selectedMonth = date.getMonth();
            this._drawYear = this._selectedYear = date.getFullYear();
            this._drawHour = this._selectedHour = date.getHours();
            this._drawMinute = this._selectedMinute = date.getMinutes();
            this._drawSecond = this._selectedSecond = date.getSeconds();
            this._currentDay = (dates[0] ? date.getDate() : 0);
            this._currentMonth = (dates[0] ? date.getMonth() : 0);
            this._currentYear = (dates[0] ? date.getFullYear() : 0);
            this._adjustDate();
            if (this._get('local') == 'ne') {
                var localDate = gregorianToLocal(this._get('calendric'), date.getFullYear(), date.getMonth() + 1, this._selectedDay);
                this._local_selectedDay = localDate.day;
                this._local_drawMonth = this._local_selectedMonth = localDate.month - 1;
                this._local_drawYear = this._local_selectedYear = localDate.year;
                this._local_drawHour = this._local_selectedHour = date.getHours();
                this._local_drawMinute = this._local_selectedMinute = date.getMinutes();
                this._local_drawSecond = this._local_selectedSecond = date.getSeconds();
                this._local_currentDay = (localDate.day ? localDate.day : 0);
                this._local_currentMonth = (localDate.month ? localDate.month - 1 : 0);
                this._local_currentYear = (localDate.year ? localDate.year : 0);
            }
        },
        _getDefaultDate: function () {
            var date = this._determineDate("defaultDate", new Date());
            var minDate = this._getMinMaxDate("min", true);
            var maxDate = this._getMinMaxDate("max");
            date = (minDate && date < minDate ? minDate : date);
            date = (maxDate && date > maxDate ? maxDate : date);
            return date
        },
        _determineDate: function (name, defaultDate) {
            var offsetNumeric = function (offset) {
                var date = new Date();
                date.setDate(date.getDate() + offset);
                return date
            };
            var offsetString = function (offset, getDaysInMonth) {
                var date = new Date();
                var matches = /^([+-]?[0-9]+)\s*(d|D|w|W|m|M|y|Y)?$/.exec(offset);
                if (matches) {
                    var year = date.getFullYear();
                    var month = date.getMonth();
                    var day = date.getDate();
                    switch (matches[2] || "d") {
                        case "d":
                        case "D":
                            day += (matches[1] - 0);
                            break;
                        case "w":
                        case "W":
                            day += (matches[1] * 7);
                            break;
                        case "m":
                        case "M":
                            month += (matches[1] - 0);
                            day = Math.min(day, getDaysInMonth(year, month));
                            break;
                        case "y":
                        case "Y":
                            year += (matches[1] - 0);
                            day = Math.min(day, getDaysInMonth(year, month));
                            break
                    }
                    date = new Date(year, month, day)
                }
                return date
            };
            var date = this._get(name);
            return (date == null ? defaultDate : (typeof date == "string" ? offsetString(date, this._getDaysInMonth) : (typeof date == "number" ? offsetNumeric(date) : date)))
        },
        _setDate: function (date, endDate) {
            this._selectedDay = this._currentDay = date.getDate();
            this._drawMonth = this._selectedMonth = this._currentMonth = date.getMonth();
            this._drawYear = this._selectedYear = this._currentYear = date.getFullYear();
            this._drawHour = this._selectedHour = this._currentHour = date.getHours();
            this._drawMinute = this._selectedMinute = this._currentMinute = date.getMinutes();
            this._drawSecond = this._selectedSecond = this._currentSecond = date.getSeconds();
            if (this._get("rangeSelect")) {
                if (endDate) {
                    this._endDay = endDate.getDate();
                    this._endMonth = endDate.getMonth();
                    this._endYear = endDate.getFullYear()
                } else {
                    this._endDay = this._currentDay;
                    this._endMonth = this._currentMonth;
                    this._endYear = this._currentYear
                }
            }
            this._adjustDate()
        },
        _getDate: function () {
            var startDate = (!this._currentYear || (this._input && this._input.val() == "") ? null : new Date(this._currentYear, this._currentMonth, this._currentDay));
            if (this._get("rangeSelect")) {
                return [startDate, (!this._endYear ? null : new Date(this._endYear, this._endMonth, this._endDay))]
            } else {
                return startDate
            }
        },
        _generateDatepicker: function () {
            var today = new Date();
            today = new Date(today.getFullYear(), today.getMonth(), today.getDate());
            var showStatus = this._get("showStatus");
            var isRTL = this._get("isRTL");
            var clear = (this._get("mandatory") ? "" : '<div class="nepaliDatepicker_clear"><a onclick="jQuery.nepaliDatepicker._clearDate(' + this._id + ');"' + (showStatus ? this._addStatus(this._get("clearStatus") || "&#xa0;") : "") + ">" + this._get("clearText") + "</a></div>");
            var controls = '<div class="nepaliDatepicker_control">' + (isRTL ? "" : clear) + '<div class="nepaliDatepicker_close"><a onclick="jQuery.nepaliDatepicker._hideDatepicker();"' + (showStatus ? this._addStatus(this._get("closeStatus") || "&#xa0;") : "") + ">" + this._get("closeText") + "</a></div>" + (isRTL ? clear : "") + "</div>";
            var prompt = this._get("prompt");
            var closeAtTop = this._get("closeAtTop");
            var closeHide = this._get("closeHide");
            var hideIfNoPrevNext = this._get("hideIfNoPrevNext");
            var numMonths = this._getNumberOfMonths();
            var stepMonths = this._get("stepMonths");
            var isMultiMonth = (numMonths[0] != 1 || numMonths[1] != 1);
            var minDate = this._getMinMaxDate("min", true);
            var maxDate = this._getMinMaxDate("max");
            var locale = this._get("locale")
            var drawDay = this._selectedDay;
            var drawMonth = this._drawMonth;
            var drawYear = this._drawYear;
            var drawHour = this._drawHour;
            var drawMinute = this._drawMinute;
            var drawSecond = this._drawSecond;
            var showYear = drawYear;
            var showMonth = drawMonth;
            var showDay = drawDay;
            if (maxDate) {
                var maxDraw = new Date(maxDate.getFullYear(), maxDate.getMonth() - numMonths[1] + 1, maxDate.getDate());
                maxDraw = (minDate && maxDraw < minDate ? minDate : maxDraw);
                while (new Date(drawYear, drawMonth, 1) > maxDraw) {
                    drawMonth--;
                    if (drawMonth < 0) {
                        drawMonth = 11;
                        drawYear--
                    }
                }
            }
            var prev = '<div class="nepaliDatepicker_prev">' + (this._canAdjustMonth(-12, drawYear, drawMonth) ? '<span class="nepaliDatepicker_prev_year"><a onclick="jQuery.nepaliDatepicker._adjustDate(' + this._id + ", -" + 12 + ", 'M');\"" + (showStatus ? this._addStatus(this._get("prevStatus") || "&#xa0;") : "") + 'title="' + this._get("prevYearText") + '"></a></span>' : (hideIfNoPrevNext ? "" : '<span class="nepaliDatepicker_prev_year"><a class="prev_disabled"></a></span>')) + (this._canAdjustMonth(-1, drawYear, drawMonth) ? '<a onclick="jQuery.nepaliDatepicker._adjustDate(' + this._id + ", -" + stepMonths + ", 'M');\"" + (showStatus ? this._addStatus(this._get("prevStatus") || "&#xa0;") : "") + 'title="' + this._get("prevText") + '"></a>' : (hideIfNoPrevNext ? "" : '<a class="prev_disabled"></a>')) + "</div>";
            var next = '<div class="nepaliDatepicker_next">' + (this._canAdjustMonth(+1, drawYear, drawMonth) ? '<a onclick="jQuery.nepaliDatepicker._adjustDate(' + this._id + ", +" + stepMonths + ", 'M');\"" + (showStatus ? this._addStatus(this._get("nextStatus") || "&#xa0;") : "") + 'title="' + this._get("nextText") + '"></a>' : (hideIfNoPrevNext ? "" : '<a class="next_disabled"></a>')) + (this._canAdjustMonth(+12, drawYear, drawMonth) ? '<span class="nepaliDatepicker_next_year"><a onclick="jQuery.nepaliDatepicker._adjustDate(' + this._id + ", +" + 12 + ", 'M');\"" + (showStatus ? this._addStatus(this._get("nextStatus") || "&#xa0;") : "") + 'title="' + this._get("nextYearText") + '"></a></span>' : (hideIfNoPrevNext ? "" : '<span class="nepaliDatepicker_next_year"><a class="next_disabled"></a></span>')) + "</div>";
            var html = (prompt ? '<div class="nepaliDatepicker_prompt">' + prompt + "</div>" : "") + (closeAtTop && !this._inline && !closeHide ? controls : "") + '<div class="nepaliDatepicker_links">' + (isRTL ? next : prev) + '<div class="nepaliDatepicker_current">' + this._generateMonthYearHeader(drawSecond, drawMinute, drawHour, drawMonth, drawYear, minDate, maxDate, selectedDate, row > 0 || col > 0) + "</div>" + (isRTL ? prev : next) + "</div>";
            var showWeeks = this._get("showWeeks");
            for (var row = 0; row < numMonths[0]; row++) {
                for (var col = 0; col < numMonths[1]; col++) {
                    var selectedDate = new Date(drawYear, drawMonth, this._selectedDay, drawHour, drawMinute, drawSecond);
                    var selectedDateLocalCache = {};
                    html += '<div class="nepaliDatepicker_oneMonth' + (col == 0 ? " nepaliDatepicker_newRow" : "") + '"><table class="nepaliDatepicker" cellpadding="0" cellspacing="0"><thead><tr class="nepaliDatepicker_titleRow">' + (showWeeks ? "<td>" + this._get("weekHeader") + "</td>" : "");
                    var firstDay = this._get("firstDay");
                    var changeFirstDay = this._get("changeFirstDay");
                    var dayNames = this._get("dayNames");
                    var dayNamesShort = this._get("dayNamesShort");
                    var dayNamesMin = this._get("dayNamesMin");
                    for (var dow = 0; dow < 7; dow++) {
                        var day = (dow + firstDay) % 7;
                        var status = this._get("dayStatus") || "&#xa0;";
                        status = (status.indexOf("DD") > -1 ? status.replace(/DD/, dayNames[day]) : status.replace(/D/, dayNamesShort[day]));
                        html += "<td" + ((dow + firstDay + 6) % 7 >= 5 ? ' class="nepaliDatepicker_weekEndCell"' : "") + ">" + (!changeFirstDay ? "<span" : '<a onclick="jQuery.nepaliDatepicker._changeFirstDay(' + this._id + ", " + day + ');"') + (showStatus ? this._addStatus(status) : "") + ' title="' + dayNames[day] + '">' + dayNamesMin[day] + (changeFirstDay ? "</a>" : "</span>") + "</td>"
                    }


                    if (locale === 'en') {
                        html += "</tr></thead><tbody>";
                        var daysInMonth = this._getDaysInMonth(drawYear, drawMonth);
                        if (drawYear == this._selectedYear && drawMonth == this._selectedMonth) {
                            drawDay = this._selectedDay = Math.min(this._selectedDay, daysInMonth)
                        }
                        var leadDays = (this._getFirstDayOfMonth(drawYear, drawMonth) - firstDay + 7) % 7;
                        var currentDate = (!this._currentDay ? new Date(9999, 9, 9) : new Date(this._currentYear, this._currentMonth, this._currentDay));
                        var endDate = this._endDay ? new Date(this._endYear, this._endMonth, this._endDay) : currentDate;
                        var printDate = new Date(drawYear, drawMonth, 1 - leadDays);
                        var numRows = (isMultiMonth ? 6 : Math.ceil((leadDays + daysInMonth) / 7));
                        var isLocal = false;
                        var local_printDate;
                        var localDateCache;
                        if (drawYear > 1893 && drawYear < 2044 && this._get("calendric")) {
                            isLocal = true;
                            var calendric = parseInt(this._get("calendric"));
                            var localDate = gregorianToLocal(calendric, this._selectedYear || drawYear, (this._selectedYear ? this._selectedMonth : drawMonth) + 1, drawDay);
                            selectedDateLocalCache = {
                                year: localDate.year,
                                month: localDate.month,
                                day: localDate.day
                            };
                            var gDateOfFirst = localToGregorian(calendric, localDate.year, localDate.month, 1);
                            var gYearOfFirst = gDateOfFirst.year;
                            var gMonthOfFirst = gDateOfFirst.month;
                            var gDayOfFirst = gDateOfFirst.day;
                            var local_daysInMonth = getMonthDays(calendric, localDate.year, localDate.month);
                            var local_leadDays = (new Date(gYearOfFirst, gMonthOfFirst - 1, gDayOfFirst).getDay() - firstDay + 7) % 7;
                            local_printDate = new Date(gYearOfFirst, gMonthOfFirst - 1, gDayOfFirst - local_leadDays)
                        }
                        var beforeShowDay = this._get("beforeShowDay");
                        var showOtherMonths = this._get("showOtherMonths");
                        var calculateWeek = this._get("calculateWeek") || $.nepaliDatepicker.iso8601Week;
                        var dateStatus = this._get("statusForDate") || $.nepaliDatepicker.dateStatus;
                        for (var dRow = 0; dRow < numRows; dRow++) {
                            html += '<tr class="nepaliDatepicker_daysRow">' + (showWeeks ? '<td class="nepaliDatepicker_weekCol">' + calculateWeek(printDate) + "</td>" : "");
                            for (var dow = 0; dow < 7; dow++) {
                                var daySettings = (beforeShowDay ? beforeShowDay.apply((this._input ? this._input[0] : null), [printDate]) : [true, ""]);
                                var otherMonth = (printDate.getMonth() != drawMonth);
                                var unselectable = !daySettings[0] || (minDate && printDate < minDate) || (maxDate && printDate > maxDate);
                                var localDay, printDay, localMonth, printMonth, localYear, printYear;
                                localDay = printDay = printDate.getDate();
                                localMonth = printMonth = drawMonth;
                                localYear = printYear = drawYear;
                                if (isLocal) {
                                    var printLocalDate = gregorianToLocal(calendric, printDate.getFullYear(), (printDate.getMonth() + 1), printDate.getDate());
                                    localDay = printLocalDate.day;
                                    localMonth = printLocalDate.month;
                                    localYear = printLocalDate.year
                                }
                                var titleStr = $.nepaliDatepicker.formatDate(this._get("dateFormat").split(" ")[0], new Date(printDate.getFullYear(), printDate.getMonth(), printDay), this._getFormatConfig());
                                var localdatestr = "";
                                if (this._get("displayLocal") && isLocal) {
                                    localdatestr = $.nepaliDatepicker.formatDate((this._get("localFormat") || this._get("dateFormat")).split(" ")[0], new Date(localYear, localMonth - 1, localDay), this._getFormatConfig(), true);
                                    // localdatestr = "<br>" + this._get("pickertitle") + ": " + localdatestr
                                    localdatestr = "<br>" + "local" + ": " + localdatestr
                                }
                                titleStr += localdatestr;
                                html += '<td class="nepaliDatepicker_daysCell' + ((dow + firstDay + 6) % 7 >= 5 ? " nepaliDatepicker_weekEndCell" : "") + (otherMonth ? " nepaliDatepicker_otherMonth" : "") + (printDate.getYear() == selectedDate.getYear() && printDate.getMonth() == selectedDate.getMonth() && printDate.getDate() == selectedDate.getDate() && drawMonth == this._selectedMonth ? " nepaliDatepicker_currentDay" : "") + (unselectable ? " nepaliDatepicker_unselectable" : "") + (otherMonth && !showOtherMonths ? "" : " " + daySettings[1] + (new Date(9999, 9, 9).getTime() == currentDate.getTime() && printDate.getTime() == today.getTime() ? " nepaliDatepicker_today" : "")) + '"' + (unselectable ? "" : " onmouseover=\"jQuery(this).addClass('nepaliDatepicker_daysCellOver');" + (!showStatus || (otherMonth && !showOtherMonths) ? "" : "jQuery('#nepaliDatepicker_status_" + this._id + "').html('" + (dateStatus.apply((this._input ? this._input[0] : null), [printDate, this]) || "&#xa0;") + "');") + "\" onmouseout=\"jQuery(this).removeClass('nepaliDatepicker_daysCellOver');" + (!showStatus || (otherMonth && !showOtherMonths) ? "" : "jQuery('#nepaliDatepicker_status_" + this._id + "').html('&#xa0;');") + '" onclick="jQuery.nepaliDatepicker._selectDay(' + this._id + "," + (printDate.getMonth()) + "," + printDate.getFullYear() + ", " + drawHour + ", " + drawMinute + ", " + drawSecond + ', this);"') + ' title="' + titleStr + '"><a value="' + printDate.getDate() + '">' + printDay + ((isLocal && this._get("displayLocal")) ? '<div class="secondary">' + localDay + "</div>" : "") + "</a>";
                                html += "</td>";
                                printDate.setDate(printDate.getDate() + 1)
                            }
                            html += "</tr>"
                        }
                        drawMonth++;
                        if (drawMonth > 11) {
                            drawMonth = 0;
                            drawYear++
                        }
                        html += "</tbody></table>";
                    }
                    else {
                        html += "</tr></thead><tbody>";
                        var daysInMonth = this._getDaysInMonth(drawYear, drawMonth);
                        if (drawYear == this._selectedYear && drawMonth == this._selectedMonth) {
                            drawDay = this._selectedDay = Math.min(this._selectedDay, daysInMonth)
                        }
                        var leadDays = (this._getFirstDayOfMonth(drawYear, drawMonth) - firstDay + 7) % 7;
                        var currentDate = (!this._currentDay ? new Date(9999, 9, 9) : new Date(this._currentYear, this._currentMonth, this._currentDay));
                        var endDate = this._endDay ? new Date(this._endYear, this._endMonth, this._endDay) : currentDate;
                        var printDate = new Date(drawYear, drawMonth, 1 - leadDays);
                        var numRows = (isMultiMonth ? 6 : Math.ceil((leadDays + daysInMonth) / 7));
                        var isLocal = false;
                        var local_printDate;
                        var localDateCache;
                        if (drawYear > 1893 && drawYear < 2044 && this._get("calendric")) {
                            isLocal = true;
                            var calendric = parseInt(this._get("calendric"));
                            var localDate = gregorianToLocal(calendric, this._selectedYear || drawYear, (this._selectedYear ? this._selectedMonth : drawMonth) + 1, drawDay);
                            selectedDateLocalCache = {
                                year: localDate.year,
                                month: localDate.month,
                                day: localDate.day
                            };
                            var gDateOfFirst = localToGregorian(calendric, localDate.year, localDate.month, 1);
                            var gYearOfFirst = gDateOfFirst.year;
                            var gMonthOfFirst = gDateOfFirst.month;
                            var gDayOfFirst = gDateOfFirst.day;
                            var local_daysInMonth = getMonthDays(calendric, localDate.year, localDate.month);
                            var local_leadDays = (new Date(gYearOfFirst, gMonthOfFirst - 1, gDayOfFirst).getDay() - firstDay + 7) % 7;
                            numRows = (isMultiMonth ? 6 : Math.ceil((local_leadDays + local_daysInMonth) / 7));
                            local_printDate = new Date(gYearOfFirst, gMonthOfFirst - 1, gDayOfFirst - local_leadDays)
                        }
                        printDate = local_printDate;
                        var beforeShowDay = this._get("beforeShowDay");
                        var showOtherMonths = this._get("showOtherMonths");
                        var calculateWeek = this._get("calculateWeek") || $.nepaliDatepicker.iso8601Week;
                        var dateStatus = this._get("statusForDate") || $.nepaliDatepicker.dateStatus;
                        for (var dRow = 0; dRow < numRows; dRow++) {
                            html += '<tr class="nepaliDatepicker_daysRow">' + (showWeeks ? '<td class="nepaliDatepicker_weekCol">' + calculateWeek(printDate) + "</td>" : "");
                            for (var dow = 0; dow < 7; dow++) {
                                var daySettings = (beforeShowDay ? beforeShowDay.apply((this._input ? this._input[0] : null), [printDate]) : [true, ""]);
                                // var otherMonth = (printDate.getMonth() != drawMonth);
                                var otherMonth;
                                var printDateLocalMonth = selectedDateLocalCache.month;

                                var unselectable = !daySettings[0] || (minDate && printDate < minDate) || (maxDate && printDate > maxDate);
                                var localDay, printDay, localMonth, printMonth, localYear, printYear;
                                localDay = printDay = printDate.getDate();
                                localMonth = printMonth = drawMonth;
                                localYear = printYear = drawYear;
                                if (isLocal) {
                                    var printLocalDate = gregorianToLocal(calendric, printDate.getFullYear(), (printDate.getMonth() + 1), printDate.getDate());
                                    localDay = printLocalDate.day;
                                    localMonth = printLocalDate.month;
                                    localYear = printLocalDate.year
                                    otherMonth = (localMonth != printDateLocalMonth);
                                }

                                var titleStr = $.nepaliDatepicker.formatDate(this._get("dateFormat").split(" ")[0], new Date(printDate.getFullYear(), printDate.getMonth(), printDay), this._getFormatConfig());
                                var localdatestr = "";
                                if (this._get("displayLocal") && isLocal) {
                                    localdatestr = $.nepaliDatepicker.formatDate((this._get("localFormat") || this._get("dateFormat")).split(" ")[0], new Date(localYear, localMonth - 1, localDay), this._getFormatConfig(), true);
                                    localdatestr = "<br>" + this._get("pickertitle") + ": " + localdatestr
                                }
                                titleStr += localdatestr;
                                html += '<td class="nepaliDatepicker_daysCell' + ((dow + firstDay + 6) % 7 >= 5 ? " nepaliDatepicker_weekEndCell" : "") + (otherMonth ? " nepaliDatepicker_otherMonth" : "") + (printDate.getYear() == selectedDate.getYear() && printDate.getMonth() == selectedDate.getMonth() && printDate.getDate() == selectedDate.getDate() && drawMonth == this._selectedMonth ? " nepaliDatepicker_currentDay" : "") + (unselectable ? " nepaliDatepicker_unselectable" : "") + (otherMonth && !showOtherMonths ? "" : " " + daySettings[1] + (new Date(9999, 9, 9).getTime() == currentDate.getTime() && printDate.getTime() == today.getTime() ? " nepaliDatepicker_today" : "")) + '"' + (unselectable ? "" : " onmouseover=\"jQuery(this).addClass('nepaliDatepicker_daysCellOver');" + (!showStatus || (otherMonth && !showOtherMonths) ? "" : "jQuery('#nepaliDatepicker_status_" + this._id + "').html('" + (dateStatus.apply((this._input ? this._input[0] : null), [printDate, this]) || "&#xa0;") + "');") + "\" onmouseout=\"jQuery(this).removeClass('nepaliDatepicker_daysCellOver');" + (!showStatus || (otherMonth && !showOtherMonths) ? "" : "jQuery('#nepaliDatepicker_status_" + this._id + "').html('&#xa0;');") + '" onclick="jQuery.nepaliDatepicker._selectDay(' + this._id + "," + (printDate.getMonth()) + "," + printDate.getFullYear() + ", " + drawHour + ", " + drawMinute + ", " + drawSecond + ', this);"') + ' title="' + titleStr + '"><a value="' + printDate.getDate() + '">' + printDay + ((isLocal && this._get("displayLocal")) ? '<div class="secondary">' + localDay + "</div>" : "") + "</a>";
                                html += "</td>";
                                printDate.setDate(printDate.getDate() + 1)
                            }
                            html += "</tr>"
                        }
                        drawMonth++;
                        if (drawMonth > 11) {
                            drawMonth = 0;
                            drawYear++
                        }
                        html += "</tbody></table>";
                    }

                    tglText = this._get('locale')=='ne'? 'Switch En':'Switch Ne';
                    if (this._get("useInFish")) {
                        html += '<div class="nepaliDatepicker_button"><span class="bc_btn bc" onclick="jQuery.nepaliDatepicker._selectNow(' + this._id + ');">' + 'Now' + "</span>";
                        html += '<span class="bc_btn bc" onclick="$.nepaliDatepicker._toggleLocale(' + this._id + ');">' + "<div><div>" + tglText + "</div></div></span></div>";
                    }

                    if (this._get("displaytime")) {
                        var drawHourStr = drawHour < 10 ? "0" + drawHour : drawHour;
                        var drawMinuteStr = drawMinute < 10 ? "0" + drawMinute : drawMinute;
                        var drawSecondStr = drawSecond < 10 ? "0" + drawSecond : drawSecond;
                        html += '<div class="nofloat"></div>';
                        html += '<div class="nepaliDatepicker_time">';
                        html += '<div class="nepaliDatepicker_selecteddate">' + $.nepaliDatepicker.formatDate(this._get("dateFormat").split(" ")[0], new Date(this._currentYear == 0 ? showYear : this._currentYear, this._currentYear == 0 ? showMonth : this._currentMonth, this._currentDay == 0 ? showDay : this._currentDay), this._getFormatConfig());
                        if (this._get("displayLocal") && isLocal) {
                            var calendric = parseInt(this._get("calendric"));
                            var localDate = gregorianToLocal(calendric, this._selectedYear || drawYear, (this._selectedYear ? this._selectedMonth : drawMonth) + 1, drawDay);
                            localDate = {
                                year: localDate.year,
                                month: localDate.month,
                                day: localDate.day
                            };
                            var tempstr = $.nepaliDatepicker.formatDate((this._get("localFormat") || this._get("dateFormat")).split(" ")[0], new Date(selectedDateLocalCache.year, selectedDateLocalCache.month - 1, selectedDateLocalCache.day), this._getFormatConfig(), true);
                            html += "<div>" + tempstr + "</div>"
                        }
                        html += "</div>";
                        if (this._get("enableDsl")) { }
                        html += '<div class="nepaliDatepicker_timepicker"><input type="hidden" value="' + drawHourStr + ":" + drawMinuteStr + ":" + drawSecondStr + '" /></div>';
                        html += '<div class="nofloat"></div>';
                        html += "</div>";
                        html += '<div class="nofloat"></div>';
                        html += '<div class="nepaliDatepicker_button">';
                        html += '<span class="bc_btn bc" onclick="jQuery.nepaliDatepicker._selectDateByButton(' + this._id + ", " + this._selectedDay + ", " + this._selectedMonth + ", " + this._selectedYear + ');">' + this._get("okLabel") + "</span>";
                        html += '<span class="bc_btn bc" onclick="$.nepaliDatepicker._hideDatepicker();"><div><div>' + this._get("cancelLabel") + "</div></div></span>";
                        html += "</div>";
                        html += '<div class="nofloat"></div>'
                    }
                    html += '<div class="footerspace">&nbsp;</div></div>'
                }
            }
            html += (showStatus ? '<div style="clear: both;"></div><div id="nepaliDatepicker_status_' + this._id + '" class="nepaliDatepicker_status">' + (this._get("initStatus") || "&#xa0;") + "</div>" : "") + (!closeAtTop && !this._inline && !closeHide ? controls : "") + '<div style="clear: both;"></div>' + (fish.browser.msie && parseInt($.browser.version) < 7 && !this._inline ? '<iframe src="javascript:false;" class="nepaliDatepicker_cover"></iframe>' : "");
            return html
        },
        _generateMonthYearHeader: function (drawSecond, drawMinute, drawHour, drawMonth, drawYear, minDate, maxDate, selectedDate, secondary) {
            minDate = (this._rangeStart && minDate && selectedDate < minDate ? selectedDate : minDate);
            var showStatus = this._get("showStatus");
            var html = '<div class="nepaliDatepicker_header">';
            var monthNames = this._get("monthNames");
            var printYear = drawYear;
            var printMonth = drawMonth;
            var localYear = printYear;
            var localMonth = printMonth;
            if (drawYear > 1893 && drawYear < 2044 && this._get("calendric")) {
                var calendric = parseInt(this._get("calendric"));
                var localDate = gregorianToLocal(calendric, drawYear, drawMonth, this._selectedDay);
                localMonth = localDate.month - 1;
                localYear = localDate.year
            }
            if (secondary || !this._get("changeMonth")) {
                html += monthNames[printMonth] + "&#xa0;"
            } else {
                // 月份

                var inMinYear = (minDate && minDate.getFullYear() == drawYear);
                var inMaxYear = (maxDate && maxDate.getFullYear() == drawYear);
                html += '<select class="nepaliDatepicker_newMonth" onchange="jQuery.nepaliDatepicker._selectMonthYear(' + this._id + ", this, 'M');\" onclick=\"jQuery.nepaliDatepicker._clickMonthYear(" + this._id + ');"' + (showStatus ? this._addStatus(this._get("monthStatus") || "&#xa0;") : "") + ">";
                if (this._get('locale') !== 'ne') {
                    for (var month = 0; month < 12; month++) {
                        if ((!inMinYear || month >= minDate.getMonth()) && (!inMaxYear || month <= maxDate.getMonth())) {
                            html += '<option  value="' + month + '"' + (month == printMonth ? ' selected="selected"' : "") + ">" + (month + 1) + "</option>"
                        }
                    }
                }
                if (this._get('locale') == 'ne') {
                    var calendric = parseInt(this._get("calendric"));
                    var localDate = gregorianToLocal(calendric, drawYear, drawMonth + 1, this._selectedDay);

                    for (var month = 0; month < 12; month++) {
                        if ((!inMinYear || month >= minDate.getMonth()) && (!inMaxYear || month <= maxDate.getMonth())) {
                            html += '<option  value="' + month + '"' + (month == localDate.month - 1 ? ' selected="selected"' : "") + ">" + monthNames[month] + "</option>"
                        }
                    }
                }
                html += "</select>&nbsp;"
            }
            if (secondary || !this._get("changeYear")) {
                html += printYear
            } else {
                if (this._get('locale') !== 'ne') {
                    var years = this._get("yearRange").split(":");
                    var year = 0;
                    var endYear = 0;
                    if (years.length != 2) {
                        year = printYear - 10;
                        endYear = printYear + 10
                    } else {
                        if (years[0].charAt(0) == "+" || years[0].charAt(0) == "-") {
                            year = printYear + parseInt(years[0], 10);
                            endYear = printYear + parseInt(years[1], 10)
                        } else {
                            year = parseInt(years[0], 10);
                            endYear = parseInt(years[1], 10)
                        }
                    }
                    year = (minDate ? Math.max(year, minDate.getFullYear()) : year);
                    endYear = (maxDate ? Math.min(endYear, maxDate.getFullYear()) : endYear);
                    html += '<select class="nepaliDatepicker_newYear" onchange="jQuery.nepaliDatepicker._selectMonthYear(' + this._id + ", this, 'Y');\" onclick=\"jQuery.nepaliDatepicker._clickMonthYear(" + this._id + ');"' + (showStatus ? this._addStatus(this._get("yearStatus") || "&#xa0;") : "") + ">";
                    for (; year <= endYear; year++) {
                        html += '<option value="' + year + '"' + (year == printYear ? ' selected="selected"' : "") + ">" + year + "</option>"
                    }
                    html += "</select>"
                }
                else {
                    var calendric = parseInt(this._get("calendric"));
                    var localDate = gregorianToLocal(calendric, drawYear, drawMonth + 1, this._selectedDay);

                    var years = this._get("yearRange").split(":");
                    var year = 0;
                    var endYear = 0;
                    if (years.length != 2) {
                        year = localDate.year - 10;
                        endYear = localDate.year + 10
                    } else {
                        if (years[0].charAt(0) == "+" || years[0].charAt(0) == "-") {
                            year = localDate.year + parseInt(years[0], 10);
                            endYear = localDate.year + parseInt(years[1], 10)
                        } else {
                            year = parseInt(years[0], 10);
                            endYear = parseInt(years[1], 10)
                        }
                    }
                    year = (minDate ? Math.max(year, minDate.getFullYear()) : year);
                    endYear = (maxDate ? Math.min(endYear, maxDate.getFullYear()) : endYear);
                    html += '<select class="nepaliDatepicker_newYear" onchange="jQuery.nepaliDatepicker._selectMonthYear(' + this._id + ", this, 'Y');\" onclick=\"jQuery.nepaliDatepicker._clickMonthYear(" + this._id + ');"' + (showStatus ? this._addStatus(this._get("yearStatus") || "&#xa0;") : "") + ">";
                    for (; year <= endYear; year++) {
                        html += '<option value="' + year + '"' + (year == localDate.year ? ' selected="selected"' : "") + ">" + year + "</option>"
                    }
                    html += "</select>"
                }
            }

            html += "</div>";
            return html
        },
        _addStatus: function (text) {
            return " onmouseover=\"jQuery('#nepaliDatepicker_status_" + this._id + "').html('" + text + "');\" onmouseout=\"jQuery('#nepaliDatepicker_status_" + this._id + "').html('&#xa0;');\""
        },
        _adjustDate: function (offset, period) {
            var year = this._drawYear + (period == "Y" ? offset : 0);
            var month = this._drawMonth + (period == "M" ? offset : 0);
            var day = Math.min(this._selectedDay, this._getDaysInMonth(year, month)) + (period == "D" ? offset : 0);
            var hour = this._drawHour + (period == "H" ? offset : 0);
            var minute = this._drawMinute + (period == "I" ? offset : 0);
            var second = this._drawSecond + (period == "S" ? offset : 0);
            var date = new Date(year, month, day, hour, minute, second);
            var minDate = this._getMinMaxDate("min", true);
            var maxDate = this._getMinMaxDate("max");
            date = (minDate && date < minDate ? minDate : date);
            date = (maxDate && date > maxDate ? maxDate : date);
            this._selectedDay = date.getDate();
            this._drawMonth = this._selectedMonth = date.getMonth();
            this._drawYear = this._selectedYear = date.getFullYear();
            this._drawHour = this._selectedHour = date.getHours();
            this._drawMinute = this._selectedMinute = date.getMinutes();
            this._drawSecond = this._selectedSecond = date.getSeconds()
        },
        _getNumberOfMonths: function () {
            var numMonths = this._get("numberOfMonths");
            return (numMonths == null ? [1, 1] : (typeof numMonths == "number" ? [1, numMonths] : numMonths))
        },
        _getMinMaxDate: function (minMax, checkRange) {
            var date = this._determineDate(minMax + "Date", null);
            if (date) {
                date.setHours(0);
                date.setMinutes(0);
                date.setSeconds(0);
                date.setMilliseconds(0)
            }
            return date || (checkRange ? this._rangeStart : null)
        },
        _getDaysInMonth: function (year, month) {
            return 32 - new Date(year, month, 32).getDate()
        },
        _getFirstDayOfMonth: function (year, month) {
            return new Date(year, month, 1).getDay()
        },
        _canAdjustMonth: function (offset, curYear, curMonth) {
            var numMonths = this._getNumberOfMonths();
            var date = new Date(curYear, curMonth + offset, 1);
            if (offset < 0) {
                date.setDate(this._getDaysInMonth(date.getFullYear(), date.getMonth()))
            }
            return this._isInRange(date)
        },
        _isInRange: function (date) {
            var newMinDate = (!this._rangeStart ? null : new Date(this._selectedYear, this._selectedMonth, this._selectedDay));
            newMinDate = (newMinDate && this._rangeStart < newMinDate ? this._rangeStart : newMinDate);
            var minDate = newMinDate || this._getMinMaxDate("min");
            var maxDate = this._getMinMaxDate("max");
            return ((!minDate || date >= minDate) && (!maxDate || date <= maxDate))
        },
        _getFormatConfig: function () {
            var shortYearCutoff = this._get("shortYearCutoff");
            shortYearCutoff = (typeof shortYearCutoff != "string" ? shortYearCutoff : new Date().getFullYear() % 100 + parseInt(shortYearCutoff, 10));
            return {
                shortYearCutoff: shortYearCutoff,
                dayNamesShort: this._get("dayNamesShort"),
                dayNames: this._get("dayNames"),
                monthNamesShort: this._get("monthNamesShort"),
                monthNames: this._get("monthNames")
            }
        },
        _formatDateTime: function (day, month, year, hour, minute, second) {
            hour = hour || 0;
            minute = minute || 0;
            second = second || 0;
            if (!day) {
                this._currentDay = this._selectedDay;
                this._currentMonth = this._selectedMonth;
                this._currentYear = this._selectedYear;
                this._currentHour = this._selectedHour;
                this._currentMinute = this._selectedMinute;
                this._currentSecond = this._selectedSecond
            }
            var date = (day ? (typeof day == "object" ? day : new Date(year, month, day, hour, minute, second)) : new Date(this._currentYear, this._currentMonth, this._currentDay, this._currentHour, this._currentMinute, this._currentSecond));
            return $.nepaliDatepicker.formatDate(this._get("dateFormat"), date, this._getFormatConfig())
        }
    });
    function extendRemove(target, props) {
        $.extend(target, props);
        for (var name in props) {
            if (props[name] == null) {
                target[name] = null
            }
        }
        return target
    }
    $.fn.nepaliDatepicker = function (options) {
        var otherArgs = Array.prototype.slice.call(arguments, 1);
        if (typeof options == "string" && (options == "isDisabled" || options == "getDate")) {
            return $.nepaliDatepicker["_" + options + "Datepicker"].apply($.nepaliDatepicker, [this[0]].concat(otherArgs))
        }
        return this.each(function () {
            typeof options == "string" ? $.nepaliDatepicker["_" + options + "Datepicker"].apply($.nepaliDatepicker, [this].concat(otherArgs)) : $.nepaliDatepicker._attachDatepicker(this, options)
        })
    }
        ;
    $.nepaliDatepicker = new NepaliDatepicker()
}
)(jQuery);
(function (a) {
    a.timePicker = function (m) {
        var p = {
            timeFormat: "hh:ii:ss",
            label: "hh:mm:ss",
            hourOptions: ["00", "01", "02", "03", "04", "05", "06", "07", "08", "09", "10", "11", "12", "13", "14", "15", "16", "17", "18", "19", "20", "21", "22", "23"],
            minuteOptions: ["00", "01", "02", "03", "04", "05", "06", "07", "08", "09", "10", "11", "12", "13", "14", "15", "16", "17", "18", "19", "20", "21", "22", "23", "24", "25", "26", "27", "28", "29", "30", "31", "32", "33", "34", "35", "36", "37", "38", "39", "40", "41", "42", "43", "44", "45", "46", "47", "48", "49", "50", "51", "52", "53", "54", "55", "56", "57", "58", "59"],
            secondOptions: ["00", "01", "02", "03", "04", "05", "06", "07", "08", "09", "10", "11", "12", "13", "14", "15", "16", "17", "18", "19", "20", "21", "22", "23", "24", "25", "26", "27", "28", "29", "30", "31", "32", "33", "34", "35", "36", "37", "38", "39", "40", "41", "42", "43", "44", "45", "46", "47", "48", "49", "50", "51", "52", "53", "54", "55", "56", "57", "58", "59"]
        };
        var k;
        var v = null;
        var i;
        var c;
        var q;
        var o;
        var d;
        var r;
        var h;
        var g;
        var n;
        var f;
        var w;
        var t;
        if (m.timeFormat) {
            m.timeFormat = m.timeFormat.replace("mm", "ii")
        }
        var j = a.extend({}, p, m);
        var b = j.target;
        u();
        return {
            setDefaults: x
        };
        function x(s) {
            j = a.extend({}, p, s)
        }
        function u() {
            var C = j.label.split(":");
            var y = b.val() == "" ? j.label : b.val();
            var s = y.split(":");
            var R = j.timeFormat.split(":");
            var O = {};
            var H = {};
            for (var N = 0; N < R.length; N++) {
                O[R[N]] = C[N];
                H[R[N]] = s[N]
            }
            var J = new Array();
            var L = new Array();
            if (O.hh) {
                J.push(O.hh);
                L.push(H.hh)
            } else {
                if (O.HH) {
                    J.push(O.HH);
                    L.push(H.HH)
                } else {
                    J.push("hh");
                    L.push("hh")
                }
            }
            if (O.ii) {
                J.push(O.ii);
                L.push(H.ii)
            } else {
                J.push("ii");
                L.push("ii")
            }
            if (O.ss) {
                J.push(O.ss);
                L.push(H.ss)
            } else {
                J.push("ss");
                L.push("ss")
            }
            j.label = J.join(":");
            C = J;
            s = L;
            var A = b.attr("id");
            var D = j.hourOptions;
            var P = j.minuteOptions;
            var Q = j.secondOptions;
            var I = false;
            var z = "";
            if (b.is(":disabled")) {
                I = true
            }
            var G = '<ul class="timepicker" id="' + A + '_ul"';
            if (I) {
                G += ' disabled="disabled" '
            }
            G += " >";
            G += '	<li class="timepicker_hour">';
            G += '		<div id="hourSel" class="timepicker_selectlist">';
            var K = false;
            if (j.timeFormat.indexOf("hh") != -1) {
                K = true
            }
            for (var N = 0; N < D.length; N++) {
                if (K && parseInt(D[N]) > 11) {
                    break
                } else {
                    G += "			<a>" + D[N] + "</a>"
                }
            }
            var F = s[0];
            if (K) {
                if (!isNaN(F)) {
                    if (parseInt(F) > 11) {
                        F -= 12;
                        if (F < 10) {
                            F = "0" + F
                        }
                        b.val(F + ":" + s[1] + ":" + s[2]);
                        j.onchange.call(this, b.val())
                    }
                }
            }
            G += "		</div>";
            G += '		<input id="' + A + 'HourInp" type="text" value="' + F + '" maxlength="2" ';
            if (I) {
                G += ' disabled="disabled" '
            }
            G += " />";
            G += "		<ins></ins>";
            G += "	</li>";
            G += '	<li class="timepicker_split">:</li>';
            G += '	<li class="timepicker_minute">';
            G += '		<div id="minuteSel" class="timepicker_selectlist">';
            for (var N = 0; N < P.length; N++) {
                G += "			<a>" + P[N] + "</a>"
            }
            G += "		</div>";
            G += '		<span><input id="' + A + 'MinuteInp" type="text" value="' + s[1] + '" maxlength="2" ';
            if (I) {
                G += ' disabled="disabled" '
            }
            G += " /></span>";
            G += "		<ins></ins>";
            G += "	</li>";
            G += '	<li class="timepicker_split">:</li>';
            G += '	<li class="timepicker_second">';
            G += '		<div id="secondSel" class="timepicker_selectlist">';
            for (var N = 0; N < Q.length; N++) {
                G += "			<a>" + Q[N] + "</a>"
            }
            G += "		</div>";
            G += '		<input id="' + A + 'SecondInp" type="text" value="' + s[2] + '" maxlength="2" ';
            if (I) {
                G += ' disabled="disabled" '
            }
            G += " />";
            G += "		<ins></ins>";
            G += "	</li>";
            G += "</ul>";
            k = a(G).insertAfter(b);
            i = k.find("li.timepicker_hour");
            c = i.find("input:eq(0)");
            q = i.find("ins:eq(0)");
            o = i.find("div.timepicker_selectlist:eq(0)");
            var M = new jBME.Poper(o);
            d = k.find("li.timepicker_minute");
            r = d.find("input:eq(0)");
            h = d.find("ins:eq(0)");
            g = d.find("div.timepicker_selectlist:eq(0)");
            var E = new jBME.Poper(g);
            n = k.find("li.timepicker_second");
            f = n.find("input:eq(0)");
            w = n.find("ins:eq(0)");
            t = n.find("div.timepicker_selectlist:eq(0)");
            var B = new jBME.Poper(t);
            c.bind("paste", function () {
                return false
            });
            r.bind("paste", function () {
                return false
            });
            f.bind("paste", function () {
                return false
            });
            if (-1 == j.timeFormat.indexOf("hh") && -1 == j.timeFormat.indexOf("HH")) {
                i.next("li.timepicker_split").hide();
                i.hide()
            }
            if (-1 == j.timeFormat.indexOf("ii")) {
                if (-1 == j.timeFormat.indexOf("ss")) {
                    d.prev("li.timepicker_split").hide()
                }
                d.next("li.timepicker_split").hide();
                d.hide()
            }
            if (-1 == j.timeFormat.indexOf("ss")) {
                n.prev("li.timepicker_split").hide();
                n.hide()
            }
            if (C[0] == c.val()) {
                c.removeClass("_fill")
            } else {
                c.addClass("_fill")
            }
            if (C[1] == r.val()) {
                r.removeClass("_fill")
            } else {
                r.addClass("_fill")
            }
            if (C[2] == f.val()) {
                f.removeClass("_fill")
            } else {
                f.addClass("_fill")
            }
            a(document).bind("click", function (S) {
                if (!v) {
                    M.hide();
                    E.hide();
                    B.hide()
                }
            });
            k.bind("mouseover", function () {
                v = true
            });
            k.bind("mouseout", function () {
                v = false
            });
            o.bind("mouseover", function () {
                v = true
            });
            o.bind("mouseout", function () {
                v = false
            });
            g.bind("mouseover", function () {
                v = true
            });
            g.bind("mouseout", function () {
                v = false
            });
            t.bind("mouseover", function () {
                v = true
            });
            t.bind("mouseout", function () {
                v = false
            });
            if (!I) {
                i.bind("click", function () {
                    if (C[0] == c.val()) {
                        c.val("")
                    }
                });
                c.bind("blur", function () {
                    e(c);
                    if ("" == c.val()) {
                        c.val(C[0])
                    }
                    if (C[0] == c.val() || "" == c.val()) {
                        c.removeClass("_fill")
                    } else {
                        c.addClass("_fill")
                    }
                });
                c.bind("focus", function () {
                    E.hide();
                    B.hide();
                    M.hide();
                    c.select();
                    if (C[0] == c.val()) {
                        c.removeClass("_fill")
                    } else {
                        c.addClass("_fill")
                    }
                });
                q.bind("mouseover", function () {
                    a(this).addClass("_over")
                });
                q.bind("mouseout", function () {
                    a(this).removeClass("_over")
                });
                q.bind("click", function (S) {
                    M.show(i);
                    E.hide();
                    B.hide()
                });
                o.find("a").each(function () {
                    var S = a(this);
                    S.click(function () {
                        c.val(S.text());
                        c.select();
                        M.hide();
                        c.addClass("_fill");
                        l()
                    })
                });
                d.bind("click", function () {
                    if (C[1] == r.val()) {
                        r.val("")
                    }
                });
                r.bind("blur", function () {
                    e(r);
                    if ("" == r.val()) {
                        r.val(C[1])
                    }
                    if (C[1] == r.val() || "" == r.val()) {
                        r.removeClass("_fill")
                    } else {
                        r.addClass("_fill")
                    }
                });
                r.bind("focus", function () {
                    M.hide();
                    E.hide();
                    B.hide();
                    r.select();
                    if (C[1] == r.val()) {
                        r.removeClass("_fill")
                    } else {
                        r.addClass("_fill")
                    }
                });
                h.bind("mouseover", function () {
                    a(this).addClass("_over")
                });
                h.bind("mouseout", function () {
                    a(this).removeClass("_over")
                });
                h.bind("click", function (S) {
                    M.hide();
                    E.show(d);
                    B.hide()
                });
                g.find("a").each(function () {
                    var S = a(this);
                    S.click(function () {
                        r.val(S.text());
                        r.select();
                        E.hide();
                        r.addClass("_fill");
                        l()
                    })
                });
                n.bind("click", function () {
                    if (C[2] == f.val()) {
                        f.val("")
                    }
                });
                f.bind("blur", function () {
                    e(f);
                    if ("" == f.val()) {
                        f.val(C[2])
                    }
                    if (C[2] == f.val() || "" == f.val()) {
                        f.removeClass("_fill")
                    } else {
                        f.addClass("_fill")
                    }
                });
                f.bind("focus", function () {
                    M.hide();
                    E.hide();
                    B.hide();
                    f.select();
                    if (C[2] == f.val()) {
                        f.removeClass("_fill")
                    } else {
                        f.addClass("_fill")
                    }
                });
                w.bind("mouseover", function () {
                    a(this).addClass("_over")
                });
                w.bind("mouseout", function () {
                    a(this).removeClass("_over")
                });
                w.bind("click", function (S) {
                    M.hide();
                    E.hide();
                    B.show(n)
                });
                t.find("a").each(function () {
                    var S = a(this);
                    S.click(function () {
                        f.val(S.text());
                        f.select();
                        B.hide();
                        f.addClass("_fill");
                        l()
                    })
                });
                c.keypress(function (T) {
                    var S = fish.browser.mozilla ? T.which : T.keyCode;
                    if ((S < 48 || S > 57) && S != 8 && S != 0) {
                        return false
                    }
                    if (c.val() > 23) {
                        return false
                    }
                });
                c.keyup(function (V) {
                    var T = c.val();
                    var S = fish.browser.mozilla ? V.which : V.keyCode;
                    if (T > 23) {
                        c.val(parseInt(T / 10));
                        return false
                    }
                    if (((S >= 48 && S <= 57) || (S >= 96 && S <= 105)) && c.val().length >= 2 && c.val() != C[0]) {
                        c.blur();
                        r.focus();
                        r.select()
                    }
                    if (S == 9) {
                        c.focus();
                        c.select();
                        l();
                        return
                    }
                    var U = c.val().replace(/[^\d]/gim, "");
                    c.val(U);
                    l()
                });
                r.keypress(function (T) {
                    var S = fish.browser.mozilla ? T.which : T.keyCode;
                    if ((S < 48 || S > 57) && S != 8 && S != 0) {
                        return false
                    }
                    if (r.val() > 59) {
                        return false
                    }
                });
                r.keyup(function (V) {
                    var T = r.val();
                    var S = fish.browser.mozilla ? V.which : V.keyCode;
                    if (T > 59) {
                        r.val(parseInt(T / 10));
                        return false
                    }
                    if (j.timeFormat.indexOf("ss") == -1) {
                        return
                    }
                    if (((S >= 48 && S <= 57) || (S >= 96 && S <= 105)) && r.val().length >= 2 && r.val() != C[1]) {
                        r.blur();
                        f.focus();
                        f.select()
                    }
                    if (S == 9) {
                        r.focus();
                        r.select();
                        l();
                        return
                    }
                    var U = r.val().replace(/[^\d]/gim, "");
                    r.val(U);
                    l()
                });
                f.keypress(function (T) {
                    var S = fish.browser.mozilla ? T.which : T.keyCode;
                    if ((S < 48 || S > 57) && S != 8 && S != 0) {
                        return false
                    }
                    if (f.val() > 59) {
                        return false
                    }
                });
                f.keyup(function (V) {
                    var T = f.val();
                    if (T > 59) {
                        f.val(parseInt(T / 10));
                        return false
                    }
                    var S = fish.browser.mozilla ? V.which : V.keyCode;
                    if (S == 9) {
                        f.focus();
                        f.select();
                        l();
                        return
                    }
                    var U = f.val().replace(/[^\d]/gim, "");
                    f.val(U);
                    l()
                })
            }
        }
        function l() {
            var C = new Array();
            var B = j.label.split(":");
            var s = c.val();
            var A = r.val();
            var y = f.val();
            s = s.length != 2 ? "0" + s : s;
            A = A.length != 2 ? "0" + A : A;
            y = y.length != 2 ? "0" + y : y;
            var z = "";
            if (("" == s || s == B[0]) && "" == (A || A == B[1]) && ("" == y || y == B[2])) {
                z = ""
            } else {
                s = (s == "" || s == B[0]) ? "00" : s;
                A = (A == "" || A == B[1]) ? "00" : A;
                y = (y == "" || y == B[2]) ? "00" : y;
                if (-1 != j.timeFormat.indexOf("hh") || -1 != j.timeFormat.indexOf("HH")) {
                    C.push(s)
                }
                if (-1 != j.timeFormat.indexOf("ii")) {
                    C.push(A)
                }
                if (-1 != j.timeFormat.indexOf("ss")) {
                    C.push(y)
                }
                z = C.join(":")
            }
            b.val(z);
            if (j.onchange) {
                j.onchange.call(this, b.val())
            }
        }
        function e(s) {
            if (s.val().length != 2) {
                s.val("0" + s.val())
            }
            l()
        }
    }
        ;
    a.fn.timePicker = function (f) {
        var g = this.parent("div");
        var b = g.find(":input");
        var d = a.extend({
            target: b,
            onchange: function () {
                b.valid()
            }
        }, f);
        var c = a.timePicker(d);
        var e = g.find(":input").not(b[0]);
        e.attr("bmeTipsId", g.attr("id")).addClass(b.attr("errorBorder")).attr("validaterules", b.attr("validaterules"));
        e.attr("bmeTips", b.attr("bmeTips"));
        return c
    }
}
)(jQuery);
