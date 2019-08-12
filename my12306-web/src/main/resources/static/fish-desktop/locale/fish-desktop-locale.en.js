/**
 * Title: fish-zh.js
 * Description: fish-zh.js
 * Author: huang.xinghui
 * Created Date: 14-8-21 下午2:55
 * Copyright: Copyright 2014 ZTESOFT, Inc.
 */
!function ($) {
  fish.locale['en'] = $.extend(fish.locale['en'], {
    alert: {
      ok: 'OK',
      cancel: 'Cancel',
      confirm: 'Confirm',
      information: 'Information',
      success: 'Success',
      warn: 'Warning',
      error: 'Error',
      prompt: 'Prompt'
    }
  });
}(jQuery);
/**
 * Title: blockui.en.js
 * Description: blockui.en.js
 * Author: huang.xinghui
 * Created Date: 14-8-29 上午11:10
 * Copyright: Copyright 2014 ZTESOFT, Inc.
 */
!function () {
    fish.locale['en'] = $.extend(fish.locale['en'], {
        blockUI: {
            loading: 'Loading...'
        }
    });
}();
/**
 * Title: common.en.js
 * Description: common.en.js
 * Author: miaocunzhi
 */
!function ($) {
  fish.locale['en'] = $.extend(fish.locale['en'], {
    common: {
      PLZ_SELECT: '---Please select---',
      emptyrecords: "No record to view",
      loading: "Loading...",
      ignoreCase: "Now ignore case",
      nIgnoreCase: "Now case sensitive"
    }
  });
}(jQuery);
/**
 * Title: fish-zh.js
 * Description: fish-zh.js
 * Author: huang.xinghui
 * Created Date: 14-8-21 下午2:55
 * Copyright: Copyright 2014 ZTESOFT, Inc.
 */
!function () {
  fish.locale['en'] = $.extend(fish.locale['en'], {
    datetimepicker: {
      'days': ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"],
      'daysShort': ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
      'daysMin': ["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa", "Su"],
      'months': ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"],
      'monthsShort': ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"],
      'meridiem': ["am", "pm"],
      'suffix': ["st", "nd", "rd", "th"],
      'today': "Today",
      'now': "Now",
      'ok': "OK",
      'chooseHour': "Choose Hour",
      'chooseMinute': "Choose Minute",
      'chooseSecond': "Choose Second",
      'selectItem': ["Current time", "Begining of day", "End of day", "Begining of the next day", "End of the next day", "Begining of month", "End of month", "Begining of the next month", "End of the next month", "Begining of year", "End of year", "Begining of the next year", "End of the next year"]
    }
  });
}();
/**
 * Created by shi.pengyan on 2015-11-05.
 */
!function () {
  fish.locale['en'] = $.extend(fish.locale['en'], {
    endlessScroll: {
      loading: 'Loading...'
    }
  });
}();
/**
 * Created by wxh on 2015-11-17.
 */
!function () {
    fish.locale['en'] = $.extend(fish.locale['en'], {
        fileupload: {
            maxNumberOfFiles: 'Maximum number of files exceeded',
            acceptFileTypes: 'File type not allowed',
            maxFileSize: 'File is too large',
            minFileSize: 'File is too small'
        }
    });
}();

! function($) {

  fish.locale['en'] = $.extend(fish.locale['en'], {
    grid: {
      defaults: {
        recordtext: "View {0} - {1} of {2}",
        pgtext: "Page {0} of {1}"
      },
      search: {
        caption: "Search...",
        Find: "Find",
        Reset: "Reset",
        odata: [{
          oper: 'eq',
          text: 'equal'
        }, {
          oper: 'ne',
          text: 'not equal'
        }, {
          oper: 'lt',
          text: 'less'
        }, {
          oper: 'le',
          text: 'less or equal'
        }, {
          oper: 'gt',
          text: 'greater'
        }, {
          oper: 'ge',
          text: 'greater or equal'
        }, {
          oper: 'bw',
          text: 'begins with'
        }, {
          oper: 'bn',
          text: 'does not begin with'
        }, {
          oper: 'in',
          text: 'is in'
        }, {
          oper: 'ni',
          text: 'is not in'
        }, {
          oper: 'ew',
          text: 'ends with'
        }, {
          oper: 'en',
          text: 'does not end with'
        }, {
          oper: 'cn',
          text: 'contains'
        }, {
          oper: 'nc',
          text: 'does not contain'
        }, {
          oper: 'oc',
          text: 'multiple contain'
        }],
        groupOps: [{
          op: "AND",
          text: "all"
        }, {
          op: "OR",
          text: "any"
        }],
        operandTitle : "Click to select search operation.",
		resetTitle : "Reset Search Value"
      },
      edit: {
        addCaption: "Add Record",
        editCaption: "Edit Record",
        bSubmit: "Submit",
        bCancel: "Cancel",
        bClose: "Close",
        saveData: "Data has been changed! Save changes?",
        bYes: "Yes",
        bNo: "No",
        bExit: "Cancel",
        msg: {
          required: "Field is required",
          number: "Please, enter valid number",
          minValue: "value must be greater than or equal to ",
          maxValue: "value must be less than or equal to",
          email: "is not a valid e-mail",
          integer: "Please, enter valid integer value",
          date: "Please, enter valid date value",
          url: "is not a valid URL. Prefix required ('http://' or 'https://')",
          nodefined: " is not defined!",
          novalue: " return value is required!",
          customarray: "Custom function should return array!",
          customfcheck: "Custom function should be present in case of custom checking!"
        }
      },
      view: {
        caption: "View Record",
        bClose: "Close"
      },
      del: {
        caption: "Delete",
        msg: "Delete selected record(s)?",
        bSubmit: "Delete",
        bCancel: "Cancel"
      },
      nav: {
        edittext: "",
        edittitle: "Edit selected row",
        addtext: "",
        addtitle: "Add new row",
        deltext: "",
        deltitle: "Delete selected row",
        searchtext: "",
        searchtitle: "Find records",
        refreshtext: "",
        refreshtitle: "Reload Grid",
        alertcap: "Warning",
        alerttext: "Please, select row",
        viewtext: "",
        viewtitle: "View selected row"
      },
      col: {
        caption: "Select columns",
        bSubmit: "Ok",
        bCancel: "Cancel"
      },
      errors: {
        errcap: "Error",
        nourl: "No url is set",
        norecords: "No records to process",
        model: "Length of colNames <> colModel!"
      },
      formatter: {
        integer: {
          thousandsSeparator: ",",
          defaultValue: '0'
        },
        number: {
          decimalSeparator: ".",
          thousandsSeparator: ",",
          decimalPlaces: 2,
          defaultValue: '0.00'
        },
        currency: {
          decimalSeparator: ".",
          thousandsSeparator: ",",
          decimalPlaces: 2,
          prefix: "",
          suffix: "",
          defaultValue: '0.00'
        },
        //date: {
        //  dayNames: [
        //    "Sun", "Mon", "Tue", "Wed", "Thr", "Fri", "Sat",
        //    "Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"
        //  ],
        //  monthNames: [
        //    "Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec",
        //    "January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"
        //  ],
        //  AmPm: ["am", "pm", "AM", "PM"],
        //  S: function(j) {
        //    return j < 11 || j > 13 ? ['st', 'nd', 'rd', 'th'][Math.min((j - 1) % 10, 3)] : 'th';
        //  },
        //  parseRe: /[Tt\\\/:_;.,\t\s-]/,
        //  reformatAfterEdit: true
        //},
        baseLinkUrl: '',
        showAction: '',
        target: '',
        checkbox: {
          disabled: true
        },
        idName: 'id'
      },
      columnsFeature: {
        title: 'Columns Feature',
        columnName: 'Column Name',
        columnWidth: 'Column Width',
        invisibleColumns: 'Invisible Columns',
        visibleColumns: 'Visible Columns',
        checkOneVisible: 'At least one column must be visible. Please choose again.'
      },
      exportFeature: {
        title: 'Export'
      },
      columnMenu: {
        ascsort: 'Sort Ascending',
        descsort: 'Sort Descending',
        columns: 'Columns',
        filter: 'Filter'
      }
    }
  });
}(jQuery);
/**
 * Title: fish-zh.js
 * Description: fish-zh.js
 * Author: huang.xinghui
 * Created Date: 14-8-21 下午2:55
 * Copyright: Copyright 2014 ZTESOFT, Inc.
 */
!function ($) {
  fish.locale['en'] = $.extend(fish.locale['en'], {
      pagination: {
        pgtext:'Page {0} of {1}',
        recordtext:'View {0}-{1}/{2}',
        rowtext:'{0}/ Page',
        gotext:'Go {0}'
    }
  });
}(jQuery);
//validator message & validator rule
!function ($) {
    fish.locale['en'] = $.extend(fish.locale['en'], {
        validator: {
            'msg': {
                defaultMsg: "This field is not valid.",
                loadingMsg: "Validating...",
                digits: "Please enter only digits.",
                required: "This field is required.",
                integer: {
                    '*': "Please enter an integer.",
                    '+': "Please enter a positive integer.",
                    '+0': "Please enter a positive integer or 0.",
                    '-': "Please enter a negative integer.",
                    '-0': "Please enter a negative integer or 0."
                },
                'float': {
                    '*': 'Please enter a float number.',
                    '+': 'Please enter a positive float number.',
                    '+0': 'Please enter a positive float number or 0.',
                    '-': 'Please enter a negative float number.',
                    '-0': 'Please enter a negative float number or 0.'
                },
                match: {
                    eq: "{0} must be equal to {1}.",
                    neq: "{0} must be not equal to {1}.",
                    lt: "{0} must be less than {1}.",
                    datelt: "{0} must be earlier than {1}.",
                    datelte: "{0} can not be later than the {1}",
                    gt: "{0} must be greater than {1}.",
                    dategt: "{0} must be later than {1}.",
                    dategte: "{0} can not be earlier than the {1}",
                    lte: "{0} must be less than or equal to {1}.",
                    gte: "{0} must be greater than or equal to {1}."
                },
                range: {
                    rg: "Please enter a number between {1} and {2}.",
                    gte: "Please enter a number greater than or equal to {1}.",
                    lte: "Please enter a number less than or equal to {1}."
                },
                checked: {
                    eq: "Please check {1} items.",
                    rg: "Please check between {1} and {2} items.",
                    gte: "Please check at least {1} items.",
                    lte: "Please check no more than {1} items."
                },
                length: {
                    eq: "Please enter {1} characters.",
                    rg: "Please enter a value between {1} and {2} characters long.",
                    gte: "Please enter at least {1} characters.",
                    lte: "Please enter no more than {1} characters."
                }
            },
            'rules': {
                letters: [/^[a-z]+$/i, "{0} can only enter letters"], //纯字母
                tel: [/^(?:(?:0\d{2,3}[\- ]?[1-9]\d{6,7})|(?:[48]00[\- ]?[1-9]\d{6}))$/, "Telephone format is incorrect"], //办公或家庭电话
                mobile: [/^1[3-9]\d{9}$/, "Phone number format is incorrect"], //移动电话
                email: [/^[\w\+\-]+(\.[\w\+\-]+)*@[a-z\d\-]+(\.[a-z\d\-]+)*\.([a-z]{2,4})$/i, 'E-mail format is incorrect'],
                qq: [/^[1-9]\d{4,}$/, "QQ number format is incorrect"],
                date: [/^\d{4}-\d{1,2}-\d{1,2}$/, "Please enter the correct date[yyyy-mm-dd]"],
                time: [/^([01]\d|2[0-3])(:[0-5]\d){1,2}$/, "Enter the correct time[hh:ii(:ss)]"],
                datetime: [/^\d{4}-\d{1,2}-\d{1,2} ([01]\d|2[0-3])(:[0-5]\d){1,2}$/, "Please enter the correct datetime[yyyy-mm-dd hh:ii(:ss)]"],
                ID_card: [/^[1-9]\d{5}[1-9]\d{3}((0\d)|(1[0-2]))(([0|1|2]\d)|3[0-1])((\d{4})|\d{3}[A-Z])$/, "Please enter the correct ID number"],
                url: [/^(https?|ftp):\/\/[^\s]+$/i, "URL format is incorrect"],
                postcode: [/^[1-9]\d{5}$/, "ZIP format is incorrect"],
                chinese: [/^[\u0391-\uFFE5]+$/, "Please enter the Chinese"],
                username: [/^\w{3,12}$/, "Please enter 3-12 digits, letters, underscores"], //用户名
                password: [/^[0-9a-zA-Z]{6,16}$/, "Password from 6-16 digits, letters"], //密码
                ip: [/^((25[0-5]|2[0-4][0-9]|1?[0-9]?[0-9])\.){3}(25[0-5]|2[0-4][0-9]|1?[0-9]?[0-9])$/, 'IP format is incorrect.'],

                //可接受的后缀名
                accept: function (element, params) {
                    if (!params) return true;
                    var ext = params[0];
                    return (ext === '*') ||
                        (new RegExp(".(?:" + (ext || "png|jpg|jpeg|gif") + ")$", "i")).test(element.value) ||
                        this.renderMsg("{1} suffix only accept", ext.replace('|', ','));
                }
            }
        }
    })
}(jQuery);