/**
 * Title: fish-zh.js
 * Description: fish-zh.js
 * Author: huang.xinghui
 * Created Date: 14-8-21 下午2:55
 * Copyright: Copyright 2014 ZTESOFT, Inc.
 */
!function () {
  fish.locale['zh'] = $.extend(fish.locale['zh'], {
    alert: {
      ok: '确定',
      cancel: '取消',
      confirm: '确认',
      information: '提示信息',
      success: '成功',
      warn: '警告',
      error: '错误',
      prompt: '提示'
    }
  });
}();
/**
 * Title: blockui.en.js
 * Description: blockui.en.js
 * Author: huang.xinghui
 * Created Date: 14-8-29 上午11:10
 * Copyright: Copyright 2014 ZTESOFT, Inc.
 */
!function () {
    fish.locale['zh'] = $.extend(fish.locale['zh'], {
        blockUI: {
            loading: '加载中...'
        }
    });
}();
/**
 * Title: common.zh.js
 * Description: common.zh.js
 * Author: miaocunzhi
 */
!function ($) {
  fish.locale['zh'] = $.extend(fish.locale['zh'], {
    common: {
      PLZ_SELECT: '---请选择---',
      emptyrecords: "无数据显示",
      loading: "加载中...",
      ignoreCase: "现在忽略大小写",
      nIgnoreCase: "现在大小写敏感"
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
  fish.locale['zh'] = $.extend(fish.locale['zh'], {
    datetimepicker: {
      'days': ["星期日", "星期一", "星期二", "星期三", "星期四", "星期五", "星期六", "星期日"],
      'daysShort': ["周日", "周一", "周二", "周三", "周四", "周五", "周六", "周日"],
      'daysMin': ["日", "一", "二", "三", "四", "五", "六", "日"],
      'months': ["一月", "二月", "三月", "四月", "五月", "六月", "七月", "八月", "九月", "十月", "十一月", "十二月"],
      'monthsShort': ["一月", "二月", "三月", "四月", "五月", "六月", "七月", "八月", "九月", "十月", "十一月", "十二月"],
      'today': "今日",
      'suffix': [],
      'meridiem': ["上午", "下午"],
      'now': "现在",
      'ok': "确认",
      'chooseHour': "选择小时",
      'chooseMinute': "选择分钟",
      'chooseSecond': "选择秒钟",
      'selectItem': ["当前时间", "今日开始时间", "今日结束时间", "明日开始时间", "明日结束时间", "当月开始时间", "当月结束时间", "下个月开始时间", "下个月结束时间", "今年开始时间", "今年结束时间", "明年开始时间", "明年结束时间"]
    }
  });
}();
/**
 * Created by shi.pengyan on 2015-11-05.
 */
!function () {
  fish.locale['zh'] = $.extend(fish.locale['zh'], {
    endlessScroll: {
      loading: '加载中...'
    }
  });
}();
/**
 * Created by wxh on 2015-11-17.
 */
!function () {
    fish.locale['zh'] = $.extend(fish.locale['zh'], {
        fileupload: {
            maxNumberOfFiles: '上传文件个数超过限制',
            acceptFileTypes: '文件类型错误',
            maxFileSize: '图片大小超过最大值限制',
            minFileSize: '图片大小超过最小值限制'
        }
    });
}();

! function($) {
  fish.locale['zh'] = $.extend(fish.locale['zh'], {
    grid: {
      defaults: {
        recordtext: "{0} - {1}\u3000共 {2} 条", // 共字前是全角空格
        pgtext: " {0} 共 {1} 页"
      },
      search: {
        caption: "搜索...",
        Find: "查找",
        Reset: "重置",
        odata: [{
          oper: 'eq',
          text: '等于\u3000\u3000'
        }, {
          oper: 'ne',
          text: '不等\u3000\u3000'
        }, {
          oper: 'lt',
          text: '小于\u3000\u3000'
        }, {
          oper: 'le',
          text: '小于等于'
        }, {
          oper: 'gt',
          text: '大于\u3000\u3000'
        }, {
          oper: 'ge',
          text: '大于等于'
        }, {
          oper: 'bw',
          text: '开始于'
        }, {
          oper: 'bn',
          text: '不开始于'
        }, {
          oper: 'in',
          text: '属于\u3000\u3000'
        }, {
          oper: 'ni',
          text: '不属于'
        }, {
          oper: 'ew',
          text: '结束于'
        }, {
          oper: 'en',
          text: '不结束于'
        }, {
          oper: 'cn',
          text: '包含\u3000\u3000'
        }, {
          oper: 'nc',
          text: '不包含'
        }, {
          oper: 'nu',
          text: '空值于\u3000\u3000'
        }, {
          oper: 'nn',
          text: '非空值'
        }, {
          oper: 'oc',
          text: '多包含'
        }],
        groupOps: [{
          op: "AND",
          text: "所有"
        }, {
          op: "OR",
          text: "任一"
        }],
		operandTitle : "选择搜索条件",
		resetTitle : "清除搜索值"
      },
      edit: {
        addCaption: "添加记录",
        editCaption: "编辑记录",
        bSubmit: "提交",
        bCancel: "取消",
        bClose: "关闭",
        saveData: "数据已改变，是否保存？",
        bYes: "是",
        bNo: "否",
        bExit: "取消",
        msg: {
          required: "此字段必需",
          number: "请输入有效数字",
          minValue: "输值必须大于等于 ",
          maxValue: "输值必须小于等于 ",
          email: "这不是有效的e-mail地址",
          integer: "请输入有效整数",
          date: "请输入有效时间",
          url: "无效网址。前缀必须为 ('http://' 或 'https://')",
          nodefined: " 未定义！",
          novalue: " 需要返回值！",
          customarray: "自定义函数需要返回数组！",
          customfcheck: "Custom function should be present in case of custom checking!"
        }
      },
      view: {
        caption: "查看记录",
        bClose: "关闭"
      },
      del: {
        caption: "删除",
        msg: "删除所选记录？",
        bSubmit: "删除",
        bCancel: "取消"
      },
      nav: {
        edittext: "",
        edittitle: "编辑所选记录",
        addtext: "",
        addtitle: "添加新记录",
        deltext: "",
        deltitle: "删除所选记录",
        searchtext: "",
        searchtitle: "查找",
        refreshtext: "",
        refreshtitle: "刷新表格",
        alertcap: "注意",
        alerttext: "请选择记录",
        viewtext: "",
        viewtitle: "查看所选记录"
      },
      col: {
        caption: "选择列",
        bSubmit: "确定",
        bCancel: "取消"
      },
      errors: {
        errcap: "错误",
        nourl: "没有设置url",
        norecords: "没有要处理的记录",
        model: "colNames 和 colModel 长度不等！"
      },
      formatter: {
        integer: {
          thousandsSeparator: " ",
          defaultValue: '0'
        },
        number: {
          decimalSeparator: ".",
          thousandsSeparator: " ",
          decimalPlaces: 2,
          defaultValue: '0.00'
        },
        currency: {
          decimalSeparator: ".",
          thousandsSeparator: " ",
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
        //    return j < 11 || j > 13 ? ['st', 'nd', 'rd', 'th'][Math.min((j - 1) % 10, 3)] : 'th'
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
        title: '列属性',
        columnName: '列名',
        columnWidth: '列宽',
        invisibleColumns: '隐藏列',
        visibleColumns: '可见列',
        checkOneVisible: '表格至少有一列可见，请重新选择'
      },
      exportFeature: {
        title: '导出'
      },
      columnMenu: {
        ascsort: '升序',
        descsort: '降序',
        columns: '列选择',
        filter: '筛选'
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
 !function () {
 	fish.locale['zh'] = $.extend(fish.locale['zh'], {
 		pagination: {
 			pgtext:'{0}/{1}页  ',
 			recordtext:'{0}-{1}/{2}',
 			rowtext:'每页{0}条',
 			gotext:'跳转至第{0}页'
 		}
 	});
 }();
//validator message & validator rule
!function ($) {
    fish.locale['zh'] = $.extend(fish.locale['zh'], {
        validator: {
            'msg': {
                defaultMsg: "格式不正确",
                loadingMsg: "正在验证...",
                digits: "请输入数字",
                required: "{0}不能为空",
                integer: {
                    '*': "请输入整数",
                    '+': "请输入正整数",
                    '+0': "请输入正整数或0",
                    '-': "请输入负整数",
                    '-0': "请输入负整数或0"
                },
                'float': {
                    '*': '请输入浮点数',
                    '+': '请输入正浮点数',
                    '+0': '请输入正浮点数或0',
                    '-': '请输入负浮点数',
                    '-0': '请输入父浮点数或0'
                },
                match: {
                    eq: "{0}与{1}不一致",
                    neq: "{0}与{1}不能相同",
                    lt: "{0}必须小于{1}",
                    datelt: "{0}必须早于{1}.",
                    datelte: "{0}不能晚于{1}.",
                    gt: "{0}必须大于{1}",
                    dategt: "{0}必须晚于{1}.",
                    dategte: "{0}不能早于{1}.",
                    lte: "{0}必须小于或等于{1}",
                    gte: "{0}必须大于或等于{1}"
                },
                range: {
                    rg: "请输入{1}到{2}的数",
                    gte: "请输入大于或等于{1}的数",
                    lte: "请输入小于或等于{1}的数"
                },
                checked: {
                    eq: "请选择{1}项",
                    rg: "请选择{1}到{2}项",
                    gte: "请至少选择{1}项",
                    lte: "请最多选择{1}项"
                },
                length: {
                    eq: "请输入{1}个字符",
                    rg: "请输入{1}到{2}个字符",
                    gte: "请至少输入{1}个字符",
                    lte: "请最多输入{1}个字符"
                }
            },
            'rules': {
                letters: [/^[a-z]+$/i, "{0}只能输入字母"], //纯字母
                tel: [/^(?:(?:0\d{2,3}[\- ]?[1-9]\d{6,7})|(?:[48]00[\- ]?[1-9]\d{6}))$/, "电话格式不正确"], //办公或家庭电话
                mobile: [/^1[3-9]\d{9}$/, "手机号格式不正确"], //移动电话
                email: [/^[\w\+\-]+(\.[\w\+\-]+)*@[a-z\d\-]+(\.[a-z\d\-]+)*\.([a-z]{2,4})$/i, '邮箱格式不正确'],
                qq: [/^[1-9]\d{4,}$/, "QQ号格式不正确"],
                date: [/^\d{4}-\d{1,2}-\d{1,2}$/, "请输入正确的日期[yyyy-mm-dd]"],
                time: [/^([01]\d|2[0-3])(:[0-5]\d){1,2}$/, "请输入正确的时间[hh:ii(:ss)]"],
                datetime: [/^\d{4}-\d{1,2}-\d{1,2} ([01]\d|2[0-3])(:[0-5]\d){1,2}$/, "请输入正确的日期时间[yyyy-mm-dd hh:ii(:ss)]"],
                ID_card: [/^[1-9]\d{5}[1-9]\d{3}((0\d)|(1[0-2]))(([0|1|2]\d)|3[0-1])((\d{4})|\d{3}[A-Z])$/, "请输入正确的身份证号码"],
                url: [/^(https?|ftp):\/\/[^\s]+$/i, "网址格式不正确"],
                postcode: [/^[1-9]\d{5}$/, "邮政编码格式不正确"],
                chinese: [/^[\u0391-\uFFE5]+$/, "请输入中文"],
                username: [/^\w{3,12}$/, "请输入3-12位数字、字母、下划线"], //用户名
                password: [/^[0-9a-zA-Z]{6,16}$/, "密码由6-16位数字、字母组成"], //密码
                ip: [/^((25[0-5]|2[0-4][0-9]|1?[0-9]?[0-9])\.){3}(25[0-5]|2[0-4][0-9]|1?[0-9]?[0-9])$/, 'IP格式不正确'],

                //可接受的后缀名
                accept: function (element, params) {
                    if (!params) return true;
                    var ext = params[0];
                    return (ext === '*') ||
                        (new RegExp(".(?:" + (ext || "png|jpg|jpeg|gif") + ")$", "i")).test(element.value) ||
                        this.renderMsg("只接受{1}后缀", ext.replace('|', ','));
                }
            }
        }
    })
    ;
}(jQuery);